/*
  # Allow appointment contact by email OR phone

  1. Make `client_email` and `client_phone` nullable.
  2. Enforce at least one contact method is present.
*/

ALTER TABLE public.appointments
  ALTER COLUMN client_email DROP NOT NULL,
  ALTER COLUMN client_phone DROP NOT NULL;

UPDATE public.appointments
SET
  client_email = NULLIF(BTRIM(client_email), ''),
  client_phone = NULLIF(BTRIM(client_phone), '');

ALTER TABLE public.appointments
  DROP CONSTRAINT IF EXISTS appointments_contact_required;

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_contact_required
  CHECK (
    NULLIF(BTRIM(client_email), '') IS NOT NULL
    OR NULLIF(BTRIM(client_phone), '') IS NOT NULL
  );
