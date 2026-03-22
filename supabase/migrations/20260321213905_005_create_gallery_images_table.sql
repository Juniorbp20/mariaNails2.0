/*
  # Gallery Images Table

  1. New Tables
    - `gallery_images` - Portfolio images with service associations
    
  2. Security
    - Enable RLS with public read access
    - Admin-only write access for managing gallery
*/

CREATE TABLE IF NOT EXISTS gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  storage_path text,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  display_order integer,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Gallery images readable by everyone" ON gallery_images;

CREATE POLICY "Gallery images readable by everyone"
  ON gallery_images FOR SELECT
  TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "Gallery images can be managed by admin" ON gallery_images;

CREATE POLICY "Gallery images can be managed by admin"
  ON gallery_images FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
  WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE INDEX IF NOT EXISTS idx_gallery_images_service_id ON gallery_images(service_id);
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_active ON gallery_images(active);
