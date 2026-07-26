REVOKE EXECUTE ON FUNCTION public.get_total_users_count() FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.get_total_users_count() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_total_users_count() FROM authenticated;