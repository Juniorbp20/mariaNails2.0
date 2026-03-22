/*
  # Services Table

  1. New Tables
    - `services` - Available nail services with descriptions, duration, and pricing
    
  2. Security
    - Enable RLS with public read access
*/

CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  price decimal(10, 2) NOT NULL,
  category text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Services are readable by everyone" ON services;

CREATE POLICY "Services are readable by everyone"
  ON services FOR SELECT
  TO anon, authenticated
  USING (active = true);

DROP POLICY IF EXISTS "Services can be managed by admin" ON services;

CREATE POLICY "Services can be managed by admin"
  ON services FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
  WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));
