/*
  # Public-safe booked times RPC

  Exposes only occupied times for a given date so public booking UI can disable
  reserved slots without exposing personal appointment data.
*/

CREATE OR REPLACE FUNCTION public.get_booked_times(input_date date)
RETURNS TABLE (appointment_time time)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT a.appointment_time
  FROM public.appointments a
  WHERE a.appointment_date = input_date
    AND a.status IN ('pending', 'confirmed')
  ORDER BY a.appointment_time ASC;
$$;

REVOKE ALL ON FUNCTION public.get_booked_times(date) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_booked_times(date) TO anon, authenticated;
