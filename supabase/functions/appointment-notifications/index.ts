import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

type NotificationEventType = 'booking_created' | 'status_changed';

type NotificationRequest = {
  eventType: NotificationEventType;
  appointmentId: number;
  status?: string;
};

type AppointmentRow = {
  id: number;
  client_name: string;
  client_email: string | null;
  client_phone: string | null;
  appointment_date: string;
  appointment_time: string;
  status: string;
  service: {
    name: string;
  } | null;
};

type BusinessProfileRow = {
  business_name: string | null;
  contact_email: string | null;
};

const DEFAULT_ADMIN_NOTIFICATION_EMAIL = 'marianails1795@gmail.com';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const jsonResponse = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });

const getRequiredEnv = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Falta la variable de entorno ${name}.`);
  return value;
};

const normalizeTime = (timeValue: string): string => {
  const [hour = '00', minute = '00'] = timeValue.split(':');
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}`;
};

const safeValue = (value: string | null | undefined, fallback = 'No registrado'): string => {
  if (!value) return fallback;
  const trimmed = value.trim();
  return trimmed || fallback;
};

const statusLabel = (status: string): string => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'confirmed':
      return 'Confirmada';
    case 'completed':
      return 'Completada';
    case 'cancelled':
      return 'Cancelada';
    default:
      return status;
  }
};

const sendEmail = async (
  apiKey: string,
  from: string,
  to: string,
  subject: string,
  html: string,
): Promise<void> => {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject,
      html,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error enviando correo a ${to}: ${errorText}`);
  }
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Metodo no permitido.' });
  }

  try {
    const payload = (await request.json()) as NotificationRequest;
    if (!payload?.appointmentId || !payload?.eventType) {
      return jsonResponse(400, { error: 'Payload invalido.' });
    }

    const supabaseUrl = getRequiredEnv('SUPABASE_URL');
    const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    const resendApiKey = getRequiredEnv('RESEND_API_KEY');
    const resendFromEmail = getRequiredEnv('RESEND_FROM_EMAIL');

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false },
    });

    const { data: appointmentData, error: appointmentError } = await supabase
      .from('appointments')
      .select(
        `
        id,
        client_name,
        client_email,
        client_phone,
        appointment_date,
        appointment_time,
        status,
        service:services(name)
      `,
      )
      .eq('id', payload.appointmentId)
      .maybeSingle();

    if (appointmentError) throw appointmentError;
    if (!appointmentData) {
      return jsonResponse(404, { error: 'Cita no encontrada.' });
    }

    const appointment = appointmentData as AppointmentRow;

    const { data: businessProfileData } = await supabase
      .from('business_profile')
      .select('business_name, contact_email')
      .eq('singleton', true)
      .maybeSingle();

    const businessProfile = (businessProfileData || {}) as BusinessProfileRow;
    const businessName = safeValue(businessProfile.business_name, 'Maria Nails');
    const configuredAdminEmail = Deno.env.get('BOOKING_NOTIFICATION_EMAIL')?.trim() || '';
    const profileAdminEmail = businessProfile.contact_email?.trim() || '';
    const businessEmail =
      configuredAdminEmail || profileAdminEmail || DEFAULT_ADMIN_NOTIFICATION_EMAIL;

    const serviceName = safeValue(appointment.service?.name, 'Servicio');
    const dateText = appointment.appointment_date;
    const timeText = normalizeTime(appointment.appointment_time);
    const currentStatus = payload.status || appointment.status;

    const adminSubject =
      payload.eventType === 'booking_created'
        ? `Nueva reserva #${appointment.id} - ${serviceName}`
        : `Cambio de estado cita #${appointment.id} - ${statusLabel(currentStatus)}`;

    const adminHtml = `
      <h2>${businessName}</h2>
      <p>Tienes una actualizacion de cita:</p>
      <ul>
        <li><strong>ID:</strong> ${appointment.id}</li>
        <li><strong>Cliente:</strong> ${safeValue(appointment.client_name)}</li>
        <li><strong>Servicio:</strong> ${serviceName}</li>
        <li><strong>Fecha:</strong> ${dateText}</li>
        <li><strong>Hora:</strong> ${timeText}</li>
        <li><strong>Estado:</strong> ${statusLabel(currentStatus)}</li>
        <li><strong>Correo cliente:</strong> ${safeValue(appointment.client_email)}</li>
        <li><strong>Telefono cliente:</strong> ${safeValue(appointment.client_phone)}</li>
      </ul>
    `;

    const clientSubject =
      payload.eventType === 'booking_created'
        ? `Recibimos tu reserva #${appointment.id} - ${businessName}`
        : `Actualizacion de tu cita #${appointment.id} - ${statusLabel(currentStatus)}`;

    const clientHtml = `
      <h2>${businessName}</h2>
      <p>Hola ${safeValue(appointment.client_name, 'cliente')},</p>
      <p>
        ${
          payload.eventType === 'booking_created'
            ? 'Hemos recibido tu reserva y pronto validaremos la disponibilidad.'
            : `Tu cita ha sido actualizada a estado: <strong>${statusLabel(currentStatus)}</strong>.`
        }
      </p>
      <ul>
        <li><strong>Confirmacion:</strong> ${appointment.id}</li>
        <li><strong>Servicio:</strong> ${serviceName}</li>
        <li><strong>Fecha:</strong> ${dateText}</li>
        <li><strong>Hora:</strong> ${timeText}</li>
      </ul>
      <p>Si necesitas ayuda, puedes responder a este correo o escribir por WhatsApp.</p>
    `;

    const deliveries: string[] = [];
    const failures: string[] = [];

    if (businessEmail) {
      try {
        await sendEmail(resendApiKey, resendFromEmail, businessEmail, adminSubject, adminHtml);
        deliveries.push(`admin:${businessEmail}`);
      } catch (error) {
        failures.push(error instanceof Error ? error.message : 'Error enviando correo a admin.');
      }
    }

    if (appointment.client_email) {
      try {
        await sendEmail(
          resendApiKey,
          resendFromEmail,
          appointment.client_email,
          clientSubject,
          clientHtml,
        );
        deliveries.push(`client:${appointment.client_email}`);
      } catch (error) {
        failures.push(error instanceof Error ? error.message : 'Error enviando correo al cliente.');
      }
    }

    if (deliveries.length === 0) {
      return jsonResponse(200, {
        success: true,
        message: 'No habia destinatarios de correo disponibles.',
        eventType: payload.eventType,
      });
    }

    if (failures.length > 0) {
      return jsonResponse(500, {
        error: 'Algunos correos no se pudieron enviar.',
        deliveries,
        failures,
      });
    }

    return jsonResponse(200, {
      success: true,
      eventType: payload.eventType,
      deliveries,
    });
  } catch (error) {
    return jsonResponse(500, {
      error: error instanceof Error ? error.message : 'Error inesperado.',
    });
  }
});
