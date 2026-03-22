/*
  # Business profile settings and branding storage

  1. Create `business_profile` singleton table for editable business information.
  2. Add RLS policies:
     - Public read.
     - Admin management.
  3. Ensure `branding` storage bucket exists for logo/profile assets.
  4. Add storage policies for public read and admin write.
*/

CREATE TABLE IF NOT EXISTS public.business_profile (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  singleton boolean NOT NULL DEFAULT true UNIQUE,
  business_name text NOT NULL DEFAULT 'Maria Nails',
  tagline text NOT NULL DEFAULT 'Belleza en tus manos',
  hero_title text NOT NULL DEFAULT 'Bienvenida a Maria Nails',
  hero_subtitle text NOT NULL DEFAULT 'Especialista en manicura, pedicura y unas acrilicas.',
  about_title text NOT NULL DEFAULT 'Sobre Maria',
  about_description text NOT NULL DEFAULT 'Tecnica en unas con experiencia y atencion personalizada.',
  footer_description text NOT NULL DEFAULT 'Manicura, pedicura y unas acrilicas con atencion profesional.',
  contact_phone text,
  contact_whatsapp text,
  contact_email text,
  address_line_1 text,
  address_line_2 text,
  maps_url text,
  instagram_url text,
  logo_url text,
  logo_storage_path text,
  profile_image_url text,
  profile_image_storage_path text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.business_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Business profile readable by everyone" ON public.business_profile;
CREATE POLICY "Business profile readable by everyone"
  ON public.business_profile
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Business profile managed by admin" ON public.business_profile;
CREATE POLICY "Business profile managed by admin"
  ON public.business_profile
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users))
  WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users));

INSERT INTO public.business_profile (singleton)
VALUES (true)
ON CONFLICT (singleton) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('branding', 'branding', true)
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name,
    public = EXCLUDED.public;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Branding objects public read'
  ) THEN
    CREATE POLICY "Branding objects public read"
      ON storage.objects
      FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'branding');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Branding objects insert by admin'
  ) THEN
    CREATE POLICY "Branding objects insert by admin"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'branding'
        AND auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Branding objects update by admin'
  ) THEN
    CREATE POLICY "Branding objects update by admin"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'branding'
        AND auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
      )
      WITH CHECK (
        bucket_id = 'branding'
        AND auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
      );
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Branding objects delete by admin'
  ) THEN
    CREATE POLICY "Branding objects delete by admin"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'branding'
        AND auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
      );
  END IF;
END $$;
