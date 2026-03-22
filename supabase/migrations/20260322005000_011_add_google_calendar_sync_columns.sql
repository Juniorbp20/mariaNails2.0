/*
  # Add Google Calendar sync metadata to appointments
*/

ALTER TABLE public.appointments
  ADD COLUMN IF NOT EXISTS google_event_id text,
  ADD COLUMN IF NOT EXISTS google_last_synced_at timestamptz,
  ADD COLUMN IF NOT EXISTS google_sync_error text;

CREATE INDEX IF NOT EXISTS idx_appointments_google_event_id
  ON public.appointments (google_event_id);
