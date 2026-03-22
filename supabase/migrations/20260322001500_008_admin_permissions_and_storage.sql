/*
  # Admin permissions and gallery storage policies

  1. Availability slots:
     - Allow admin users to SELECT all rows (including inactive slots).
  2. Storage:
     - Ensure `gallery` bucket exists and is public for reads.
     - Allow admin users to insert/update/delete gallery objects.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'availability_slots'
      AND policyname = 'Availability slots readable by admin'
  ) THEN
    CREATE POLICY "Availability slots readable by admin"
      ON public.availability_slots
      FOR SELECT
      TO authenticated
      USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users));
  END IF;
END $$;

INSERT INTO storage.buckets (id, name, public)
VALUES ('gallery', 'gallery', true)
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
      AND policyname = 'Gallery objects public read'
  ) THEN
    CREATE POLICY "Gallery objects public read"
      ON storage.objects
      FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'gallery');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Gallery objects insert by admin'
  ) THEN
    CREATE POLICY "Gallery objects insert by admin"
      ON storage.objects
      FOR INSERT
      TO authenticated
      WITH CHECK (
        bucket_id = 'gallery'
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
      AND policyname = 'Gallery objects update by admin'
  ) THEN
    CREATE POLICY "Gallery objects update by admin"
      ON storage.objects
      FOR UPDATE
      TO authenticated
      USING (
        bucket_id = 'gallery'
        AND auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
      )
      WITH CHECK (
        bucket_id = 'gallery'
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
      AND policyname = 'Gallery objects delete by admin'
  ) THEN
    CREATE POLICY "Gallery objects delete by admin"
      ON storage.objects
      FOR DELETE
      TO authenticated
      USING (
        bucket_id = 'gallery'
        AND auth.jwt() ->> 'email' IN (SELECT email FROM public.admin_users)
      );
  END IF;
END $$;
