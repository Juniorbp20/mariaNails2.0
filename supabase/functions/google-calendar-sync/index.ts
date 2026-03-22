import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

type SyncAction = 'upsert' | 'cancel';

type SyncRequest = {
  action: SyncAction;
  appointmentId: number;
};

type AppointmentRow = {
  id: number;
  client_name: string;
  client_email: string;
  client_phone: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes: string | null;
  google_event_id: string | null;
  service: {
    name: string;
    duration_minutes: number;
  } | null;
};

type GoogleTokenResponse = {
  access_token: string;
};

type GoogleEventResponse = {
  id: string;
};

class GoogleApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const textEncoder = new TextEncoder();

const jsonResponse = (status: number, body: Record<string, unknown>) => {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json',
    },
  });
};

const normalizeTime = (timeValue: string): string => {
  const [hour = '00', minute = '00', second = '00'] = timeValue.split(':');
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}`;
};

const formatDateUTC = (date: Date): string => {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addMinutesToDateTime = (dateValue: string, timeValue: string, minutes: number) => {
  const [yearText, monthText, dayText] = dateValue.split('-');
  const [hourText, minuteText] = normalizeTime(timeValue).split(':');

  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);

  const totalMinutes = hour * 60 + minute + minutes;
  const dayOffset = Math.floor(totalMinutes / (24 * 60));
  const minutesInDay = totalMinutes % (24 * 60);

  const endHour = Math.floor(minutesInDay / 60);
  const endMinute = minutesInDay % 60;

  const endDate = new Date(Date.UTC(year, month - 1, day));
  endDate.setUTCDate(endDate.getUTCDate() + dayOffset);

  const endDateText = formatDateUTC(endDate);
  const startTimeText = normalizeTime(timeValue);
  const endTimeText = `${String(endHour).padStart(2, '0')}:${String(endMinute).padStart(2, '0')}:00`;

  return {
    start: `${dateValue}T${startTimeText}`,
    end: `${endDateText}T${endTimeText}`,
  };
};

const base64UrlEncodeBytes = (bytes: Uint8Array): string => {
  let binary = '';
  for (const value of bytes) {
    binary += String.fromCharCode(value);
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const base64UrlEncodeJson = (value: Record<string, unknown>): string => {
  return base64UrlEncodeBytes(textEncoder.encode(JSON.stringify(value)));
};

const pemToArrayBuffer = (pem: string): ArrayBuffer => {
  const normalized = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '');

  const binary = atob(normalized);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes.buffer;
};

const createSignedJwt = async (
  clientEmail: string,
  privateKey: string,
  scope: string,
): Promise<string> => {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: clientEmail,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    iat: now,
    exp: now + 3600,
  };

  const encodedHeader = base64UrlEncodeJson(header);
  const encodedPayload = base64UrlEncodeJson(payload);
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    pemToArrayBuffer(privateKey),
    {
      name: 'RSASSA-PKCS1-v1_5',
      hash: 'SHA-256',
    },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    textEncoder.encode(unsignedToken),
  );

  const encodedSignature = base64UrlEncodeBytes(new Uint8Array(signature));
  return `${unsignedToken}.${encodedSignature}`;
};

const getGoogleAccessToken = async (
  clientEmail: string,
  privateKey: string,
): Promise<string> => {
  const assertion = await createSignedJwt(
    clientEmail,
    privateKey,
    'https://www.googleapis.com/auth/calendar',
  );

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`No se pudo obtener token de Google: ${errorText}`);
  }

  const data = (await response.json()) as GoogleTokenResponse;
  return data.access_token;
};

const googleRequest = async <T>(
  accessToken: string,
  endpoint: string,
  init: RequestInit,
): Promise<T> => {
  const response = await fetch(endpoint, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new GoogleApiError(response.status, errorText);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

const ensureAdminCaller = async (
  supabase: ReturnType<typeof createClient>,
  jwt: string,
): Promise<string> => {
  const { data: userData, error: userError } = await supabase.auth.getUser(jwt);
  if (userError || !userData.user?.email) {
    throw new Error('No se pudo validar el usuario de la sesion.');
  }

  const email = userData.user.email;

  const { data: adminData, error: adminError } = await supabase
    .from('admin_users')
    .select('email')
    .eq('email', email)
    .maybeSingle();

  if (adminError) {
    throw adminError;
  }

  if (!adminData) {
    throw new Error('Usuario sin permisos de administrador.');
  }

  return email;
};

const getRequiredEnv = (name: string): string => {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Falta la variable de entorno ${name}.`);
  return value;
};

const sanitizePrivateKey = (rawKey: string): string => rawKey.replace(/\\n/g, '\n');

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (request.method !== 'POST') {
    return jsonResponse(405, { error: 'Metodo no permitido.' });
  }

  let appointmentIdForError: number | null = null;

  const supabaseUrl = getRequiredEnv('SUPABASE_URL');
  const serviceRoleKey = getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  try {
    const authHeader = request.headers.get('Authorization') || '';
    const jwt = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';
    if (!jwt) {
      return jsonResponse(401, { error: 'Token de autorizacion requerido.' });
    }

    await ensureAdminCaller(supabase, jwt);

    const payload = (await request.json()) as SyncRequest;
    if (!payload?.appointmentId || !payload?.action) {
      return jsonResponse(400, { error: 'Payload invalido.' });
    }

    appointmentIdForError = payload.appointmentId;

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
        notes,
        google_event_id,
        service:services(name, duration_minutes)
      `,
      )
      .eq('id', payload.appointmentId)
      .maybeSingle();

    if (appointmentError) {
      throw appointmentError;
    }

    if (!appointmentData) {
      return jsonResponse(404, { error: 'Cita no encontrada.' });
    }

    const appointment = appointmentData as AppointmentRow;

    const googleClientEmail = getRequiredEnv('GOOGLE_CLIENT_EMAIL');
    const googlePrivateKey = sanitizePrivateKey(getRequiredEnv('GOOGLE_PRIVATE_KEY'));
    const googleCalendarId = getRequiredEnv('GOOGLE_CALENDAR_ID');
    const calendarTimezone = Deno.env.get('GOOGLE_CALENDAR_TIMEZONE') || 'America/Santo_Domingo';

    const accessToken = await getGoogleAccessToken(googleClientEmail, googlePrivateKey);

    const calendarBaseUrl = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(googleCalendarId)}/events`;

    if (payload.action === 'upsert') {
      if (appointment.status !== 'confirmed') {
        return jsonResponse(400, {
          error: 'Solo se pueden sincronizar citas con estado confirmado.',
        });
      }

      const durationMinutes = appointment.service?.duration_minutes || 60;
      const dateTimes = addMinutesToDateTime(
        appointment.appointment_date,
        appointment.appointment_time,
        durationMinutes,
      );

      const eventPayload = {
        summary: `Cita Maria Nails - ${appointment.service?.name || 'Servicio'}`,
        description: [
          `Cliente: ${appointment.client_name}`,
          `Email: ${appointment.client_email}`,
          `Telefono: ${appointment.client_phone}`,
          appointment.notes ? `Notas: ${appointment.notes}` : '',
          `ID cita: ${appointment.id}`,
        ]
          .filter(Boolean)
          .join('\n'),
        start: {
          dateTime: dateTimes.start,
          timeZone: calendarTimezone,
        },
        end: {
          dateTime: dateTimes.end,
          timeZone: calendarTimezone,
        },
        extendedProperties: {
          private: {
            appointment_id: String(appointment.id),
          },
        },
      };

      let eventId = appointment.google_event_id;

      if (eventId) {
        try {
          await googleRequest<GoogleEventResponse>(
            accessToken,
            `${calendarBaseUrl}/${encodeURIComponent(eventId)}`,
            {
              method: 'PATCH',
              body: JSON.stringify(eventPayload),
            },
          );
        } catch (error) {
          if (error instanceof GoogleApiError && error.status === 404) {
            eventId = null;
          } else {
            throw error;
          }
        }
      }

      if (!eventId) {
        const createdEvent = await googleRequest<GoogleEventResponse>(
          accessToken,
          calendarBaseUrl,
          {
            method: 'POST',
            body: JSON.stringify(eventPayload),
          },
        );
        eventId = createdEvent.id;
      }

      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          google_event_id: eventId,
          google_last_synced_at: new Date().toISOString(),
          google_sync_error: null,
        })
        .eq('id', appointment.id);

      if (updateError) {
        throw updateError;
      }

      return jsonResponse(200, {
        success: true,
        action: payload.action,
        appointmentId: appointment.id,
        googleEventId: eventId,
      });
    }

    if (payload.action === 'cancel') {
      if (appointment.google_event_id) {
        try {
          await googleRequest<void>(
            accessToken,
            `${calendarBaseUrl}/${encodeURIComponent(appointment.google_event_id)}`,
            { method: 'DELETE' },
          );
        } catch (error) {
          if (!(error instanceof GoogleApiError && error.status === 404)) {
            throw error;
          }
        }
      }

      const { error: updateError } = await supabase
        .from('appointments')
        .update({
          google_event_id: null,
          google_last_synced_at: new Date().toISOString(),
          google_sync_error: null,
        })
        .eq('id', appointment.id);

      if (updateError) {
        throw updateError;
      }

      return jsonResponse(200, {
        success: true,
        action: payload.action,
        appointmentId: appointment.id,
      });
    }

    return jsonResponse(400, { error: 'Accion no valida.' });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado.';

    if (appointmentIdForError !== null) {
      await supabase
        .from('appointments')
        .update({ google_sync_error: message })
        .eq('id', appointmentIdForError);
    }

    return jsonResponse(500, {
      error: message,
    });
  }
});
