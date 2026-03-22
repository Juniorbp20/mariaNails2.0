/*
  # Availability Slots Table

  1. New Tables
    - `availability_slots` - Working hours for each day of week
    - `blocked_dates` - Special dates when Maria is not available
    
  2. Security
    - Enable RLS with public read access for availability
    - Admin-only write access for managing hours
*/

CREATE TABLE IF NOT EXISTS availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  break_start time,
  break_end time,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(day_of_week)
);

ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Availability slots readable by everyone" ON availability_slots;

CREATE POLICY "Availability slots readable by everyone"
  ON availability_slots FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS "Availability slots can be updated by admin" ON availability_slots;

CREATE POLICY "Availability slots can be updated by admin"
  ON availability_slots FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
  WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

DROP POLICY IF EXISTS "Availability slots can be created by admin" ON availability_slots;

CREATE POLICY "Availability slots can be created by admin"
  ON availability_slots FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE INDEX IF NOT EXISTS idx_availability_slots_day ON availability_slots(day_of_week);

-- Create blocked dates table
CREATE TABLE IF NOT EXISTS blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  blocked_date date NOT NULL UNIQUE,
  reason text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Blocked dates readable by everyone" ON blocked_dates;

CREATE POLICY "Blocked dates readable by everyone"
  ON blocked_dates FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Blocked dates can be managed by admin" ON blocked_dates;

CREATE POLICY "Blocked dates can be managed by admin"
  ON blocked_dates FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users))
  WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM admin_users));

CREATE INDEX IF NOT EXISTS idx_blocked_dates_date ON blocked_dates(blocked_date);
