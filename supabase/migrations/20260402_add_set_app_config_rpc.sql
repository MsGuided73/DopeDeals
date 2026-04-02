-- Creates a parameterized RPC function for setting PostgreSQL GUC variables.
-- Used by the cart API to set session-based RLS context safely,
-- replacing direct SQL string interpolation (SQL injection fix).

CREATE OR REPLACE FUNCTION set_app_config(config_name TEXT, config_value TEXT)
RETURNS VOID AS $$
BEGIN
  PERFORM set_config(config_name, config_value, true); -- true = LOCAL (transaction-scoped)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
