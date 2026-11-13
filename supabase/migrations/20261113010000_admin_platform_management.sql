-- ==============================================================================
-- ZIRNA STEM STUDIO — Migration 20261113010000_admin_platform_management.sql
-- Administrator Security, Platform Governance, Privacy Requests & Audit Logging
-- ==============================================================================

-- 1. Extend user roles on profiles table to include 'admin'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'teacher', 'admin'));

-- 2. Create Security Definer helper to check if caller is an Administrator
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- 3. Security Trigger: Prevent privilege escalation during public self-registration
CREATE OR REPLACE FUNCTION public.prevent_self_admin_registration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- If a non-admin attempts to insert or update their role to 'admin', force to 'student'
  IF NEW.role = 'admin' AND NOT public.is_admin() THEN
    NEW.role := 'student';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_self_admin ON public.profiles;
CREATE TRIGGER trg_prevent_self_admin
  BEFORE INSERT OR UPDATE OF role ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_self_admin_registration();

-- ==============================================================================
-- 4. TABLE: admin_audit_logs (Immutable security audit ledger)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  admin_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  admin_email TEXT NOT NULL,
  admin_name TEXT NOT NULL,
  action TEXT NOT NULL,
  target_resource TEXT NOT NULL,
  details TEXT NOT NULL,
  ip_address TEXT DEFAULT '127.0.0.1',
  status TEXT NOT NULL DEFAULT 'success' CHECK (status IN ('success', 'flagged', 'denied'))
);

CREATE INDEX IF NOT EXISTS idx_admin_audit_created_at ON public.admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_action ON public.admin_audit_logs(action);

ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view audit logs"
  ON public.admin_audit_logs
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admins can insert audit entries"
  ON public.admin_audit_logs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- Immutable: Disallow UPDATE or DELETE on audit logs
CREATE POLICY "Disallow modifying audit logs"
  ON public.admin_audit_logs
  FOR UPDATE
  TO authenticated
  USING (false);

CREATE POLICY "Disallow deleting audit logs"
  ON public.admin_audit_logs
  FOR DELETE
  TO authenticated
  USING (false);

-- ==============================================================================
-- 5. TABLE: privacy_requests (GDPR & DPDP Act 2023 Subject Rights Requests)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.privacy_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  type TEXT NOT NULL CHECK (type IN ('data-deletion', 'data-export', 'rectification', 'parental-revocation')),
  user_email TEXT NOT NULL,
  requester_name TEXT NOT NULL,
  student_identifier TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'completed', 'rejected')),
  legal_deadline TIMESTAMPTZ NOT NULL,
  details TEXT NOT NULL,
  admin_notes TEXT,
  resolved_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_privacy_requests_status ON public.privacy_requests(status);
CREATE INDEX IF NOT EXISTS idx_privacy_requests_deadline ON public.privacy_requests(legal_deadline ASC);

ALTER TABLE public.privacy_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins have full access to privacy requests"
  ON public.privacy_requests
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

CREATE POLICY "Public users can submit privacy requests"
  ON public.privacy_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- ==============================================================================
-- 6. TABLE: platform_settings (Global System Configuration)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.platform_settings (
  id TEXT PRIMARY KEY DEFAULT 'global_config',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  maintenance_mode BOOLEAN NOT NULL DEFAULT false,
  public_registration_open BOOLEAN NOT NULL DEFAULT true,
  guest_access_enabled BOOLEAN NOT NULL DEFAULT true,
  strict_child_privacy BOOLEAN NOT NULL DEFAULT true,
  default_session_timeout_minutes INT NOT NULL DEFAULT 60,
  system_notice_text TEXT NOT NULL DEFAULT 'Mizoram Statewide STEM Challenge Week begins November 20! All classes are invited.',
  system_notice_active BOOLEAN NOT NULL DEFAULT true,
  organization_name TEXT NOT NULL DEFAULT 'Mizoram Education Centre (MEC)',
  support_email TEXT NOT NULL DEFAULT 'directorate@zirnastem.org',
  version TEXT NOT NULL DEFAULT 'v1.4.0-admin'
);

ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view platform settings"
  ON public.platform_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can modify platform settings"
  ON public.platform_settings
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Seed default global configuration
INSERT INTO public.platform_settings (id, organization_name, support_email)
VALUES ('global_config', 'Mizoram Education Centre (MEC)', 'directorate@zirnastem.org')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 7. TABLE: module_configs (Administrative STEM Workshop Overrides)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.module_configs (
  id TEXT PRIMARY KEY,
  number TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT NOT NULL,
  category TEXT NOT NULL,
  grade TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  total_runs INT NOT NULL DEFAULT 0,
  completion_rate INT NOT NULL DEFAULT 90,
  description TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.module_configs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view module configurations"
  ON public.module_configs
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can modify module configurations"
  ON public.module_configs
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
