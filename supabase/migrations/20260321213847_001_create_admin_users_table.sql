/*
  # Admin Users Table

  1. New Tables
    - `admin_users` - Admin users for authentication and authorization
    
  2. Security
    - Enable RLS with admin-only access
*/

CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin users can read own record" ON admin_users;

CREATE POLICY "Admin users can read own record"
  ON admin_users FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');
