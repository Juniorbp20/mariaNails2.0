import { supabase } from '../lib/supabase';
import type { Appointment, BookingFormData } from '../types';

type SupabaseErrorLike = {
  code?: string;
  message?: string;
  details?: string | null;
  hint?: string | null;
};

type CalendarSyncAction = 'upsert' | 'cancel';

type FunctionErrorLike = {
  message?: string;
  context?: {
    clone?: () => {
      json?: () => Promise<unknown>;
      text?: () => Promise<string>;
    };
    json?: () => Promise<unknown>;
    text?: () => Promise<string>;
  };
};

const normalizeSupabaseError = (error: SupabaseErrorLike): Error => {
  if (
    typeof error.message === 'string' &&
    error.message.includes('Could not find the function public.next_appointment_id')
  ) {
    return new Error('Falta crear la funcion SQL next_appointment_id en Supabase.');
  }

  if (
    typeof error.message === 'string' &&
    error.message.includes('Could not find the function public.get_booked_times')
  ) {
    return new Error('Falta crear la funcion SQL get_booked_times en Supabase.');
  }

  if (
    typeof error.message === 'string' &&
    error.message.includes('Failed to send a request to the Edge Function')
  ) {
    return new Error('No se pudo conectar con la funcion de sincronizacion de Google Calendar.');
  }

  if (error.code === '23505') {
    return new Error('Ese horario ya fue reservado. Elige otro horario disponible.');
  }

  const details = [error.message, error.details, error.hint]
    .filter(Boolean)
    .join(' ')
    .trim();

  return new Error(details || 'Error en la base de datos.');
};

const normalizeFunctionInvokeError = async (error: FunctionErrorLike): Promise<Error> => {
  const defaultError = normalizeSupabaseError({
    message: error.message || 'Error al invocar la funcion.'
  });

  const readResponsePayload = async (context: NonNullable<FunctionErrorLike['context']>) => {
    if (typeof context.clone === 'function') {
      const cloned = context.clone();
      if (cloned && typeof cloned.json === 'function') {
        return await cloned.json();
      }
      if (cloned && typeof cloned.text === 'function') {
        return await cloned.text();
      }
    }

    if (typeof context.json === 'function') {
      return await context.json();
    }
    if (typeof context.text === 'function') {
      return await context.text();
    }
    return null;
  };

  try {
    const payload = error.context ? await readResponsePayload(error.context) : null;

    if (payload && typeof payload === 'object') {
      const record = payload as Record<string, unknown>;
      const message =
        (typeof record.error === 'string' && record.error) ||
        (typeof record.message === 'string' && record.message) ||
        '';
      if (message) return new Error(message);
    }

    if (typeof payload === 'string' && payload.trim()) {
      return new Error(payload.trim());
    }
  } catch {
    // If context payload parsing fails, we keep the default normalized error.
  }

  return defaultError;
};

export const appointmentService = {
  async createAppointment(data: BookingFormData): Promise<Appointment> {
    const { data: nextAppointmentId, error: nextIdError } = await supabase.rpc('next_appointment_id');
    if (nextIdError) throw normalizeSupabaseError(nextIdError);
    if (typeof nextAppointmentId !== 'number' || !Number.isInteger(nextAppointmentId)) {
      throw new Error('No se pudo generar el numero de cita.');
    }

    const nowIso = new Date().toISOString();
    const localAppointment: Appointment = {
      id: nextAppointmentId,
      service_id: data.service_id,
      client_name: data.client_name,
      client_email: data.client_email,
      client_phone: data.client_phone,
      appointment_date: data.appointment_date,
      appointment_time: data.appointment_time,
      status: 'pending',
      notes: null,
      created_at: nowIso,
      updated_at: nowIso,
    };

    const { error } = await supabase
      .from('appointments')
      .insert([{
        id: localAppointment.id,
        service_id: localAppointment.service_id,
        client_name: localAppointment.client_name,
        client_email: localAppointment.client_email,
        client_phone: localAppointment.client_phone,
        appointment_date: localAppointment.appointment_date,
        appointment_time: localAppointment.appointment_time,
        status: localAppointment.status
      }]);

    if (error) throw normalizeSupabaseError(error);
    return localAppointment;
  },

  async getAppointments(): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('appointment_date', { ascending: true });

    if (error) throw normalizeSupabaseError(error);
    return data || [];
  },

  async getAppointmentsByDate(date: string): Promise<Appointment[]> {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('appointment_date', date)
      .eq('status', 'confirmed')
      .order('appointment_time', { ascending: true });

    if (error) throw normalizeSupabaseError(error);
    return data || [];
  },

  async getBookedTimesByDate(date: string): Promise<string[]> {
    const { data, error } = await supabase.rpc('get_booked_times', { input_date: date });

    if (error) throw normalizeSupabaseError(error);

    return (data || [])
      .map((row: { appointment_time: string }) => row.appointment_time)
      .filter(Boolean)
      .map((time: string) => time.slice(0, 5));
  },

  async checkTimeSlotAvailable(date: string, time: string): Promise<boolean> {
    const bookedTimes = await this.getBookedTimesByDate(date);
    return !bookedTimes.includes(time.slice(0, 5));
  },

  async syncAppointmentWithGoogleCalendar(action: CalendarSyncAction, appointmentId: number): Promise<void> {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw normalizeSupabaseError(sessionError);

    const accessToken = sessionData.session?.access_token;
    if (!accessToken) {
      throw new Error('Sesion admin expirada. Inicia sesion nuevamente.');
    }

    const { error } = await supabase.functions.invoke('google-calendar-sync', {
      body: {
        action,
        appointmentId,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (error) throw await normalizeFunctionInvokeError(error);
  },

  async updateAppointmentStatus(id: number, status: string): Promise<Appointment> {
    const { data, error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw normalizeSupabaseError(error);
    return data;
  },

  async deleteAppointment(id: number): Promise<void> {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw normalizeSupabaseError(error);
  }
};
