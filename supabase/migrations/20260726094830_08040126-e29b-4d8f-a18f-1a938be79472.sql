CREATE OR REPLACE FUNCTION public.get_total_users_count()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)::int FROM auth.users;
$$;

GRANT EXECUTE ON FUNCTION public.get_total_users_count() TO anon, authenticated;