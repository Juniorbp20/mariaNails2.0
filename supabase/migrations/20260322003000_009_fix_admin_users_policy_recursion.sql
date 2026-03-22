/*
  # Fix recursion in admin_users RLS policy

  The original SELECT policy queried admin_users from inside admin_users policy,
  which causes infinite recursion. This migration replaces it with a non-recursive
  self-check policy: authenticated users can read only their own record.
*/

DROP POLICY IF EXISTS "Admin users readable by admin only" ON public.admin_users;
DROP POLICY IF EXISTS "Admin users can read own record" ON public.admin_users;

CREATE POLICY "Admin users can read own record"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (email = auth.jwt() ->> 'email');
