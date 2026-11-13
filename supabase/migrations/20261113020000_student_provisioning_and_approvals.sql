-- ==============================================================================
-- ZIRNA STEM STUDIO — Migration 20261113020000_student_provisioning_and_approvals.sql
-- Zero-Email Student Provisioning, Teacher Accreditation & Squad Management
-- ==============================================================================

-- 1. Extend profiles with student username, temporary PIN, status, and teacher reference
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS username TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS temporary_pin TEXT,
  ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending_approval')),
  ADD COLUMN IF NOT EXISTS avatar_id TEXT DEFAULT 'avatar-astro-rocket',
  ADD COLUMN IF NOT EXISTS roll_number TEXT,
  ADD COLUMN IF NOT EXISTS teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS is_first_login BOOLEAN NOT NULL DEFAULT false;

-- Create index for fast username logins
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles (lower(username));
CREATE INDEX IF NOT EXISTS idx_profiles_teacher_id ON public.profiles (teacher_id);

-- ==============================================================================
-- 2. TABLE: teacher_applications (Institutional Verification Ledger)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.teacher_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  school_name TEXT NOT NULL,
  designation TEXT NOT NULL,
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  admin_notes TEXT
);

CREATE INDEX IF NOT EXISTS idx_teacher_applications_status ON public.teacher_applications (status);
CREATE INDEX IF NOT EXISTS idx_teacher_applications_email ON public.teacher_applications (lower(email));

-- ==============================================================================
-- 3. TABLE: classroom_teams (Collaborative Multiplayer Squads)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.classroom_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#FFD166',
  score INTEGER NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,2) NOT NULL DEFAULT 100.00
);

CREATE INDEX IF NOT EXISTS idx_classroom_teams_classroom ON public.classroom_teams (classroom_id);

-- ==============================================================================
-- 4. TABLE: team_members (Squad Roster Mapping)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.classroom_teams(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT uq_team_student UNIQUE (team_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_team_members_team ON public.team_members (team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_student ON public.team_members (student_id);

-- ==============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- 5A. Teacher Applications Security
-- Public visitors can submit teacher requests
DROP POLICY IF EXISTS "Public can submit teacher applications" ON public.teacher_applications;
CREATE POLICY "Public can submit teacher applications"
  ON public.teacher_applications
  FOR INSERT
  WITH CHECK (true);

-- Only platform administrators can view and review teacher applications
DROP POLICY IF EXISTS "Only admins can view and review teacher applications" ON public.teacher_applications;
CREATE POLICY "Only admins can view and review teacher applications"
  ON public.teacher_applications
  FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- 5B. Classroom Teams Security
-- Teachers can manage teams in classrooms they own; students can read teams
DROP POLICY IF EXISTS "Teachers and students can read classroom teams" ON public.classroom_teams;
CREATE POLICY "Teachers and students can read classroom teams"
  ON public.classroom_teams
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.classrooms c
      WHERE c.id = classroom_teams.classroom_id AND (c.teacher_id = auth.uid() OR public.is_teacher())
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.classroom_id = classroom_teams.classroom_id
    )
  );

DROP POLICY IF EXISTS "Teachers can manage classroom teams" ON public.classroom_teams;
CREATE POLICY "Teachers can manage classroom teams"
  ON public.classroom_teams
  FOR ALL
  TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.classrooms c
      WHERE c.id = classroom_teams.classroom_id AND c.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.classrooms c
      WHERE c.id = classroom_teams.classroom_id AND c.teacher_id = auth.uid()
    )
  );

-- 5C. Team Members Security
DROP POLICY IF EXISTS "Anyone in classroom can read squad members" ON public.team_members;
CREATE POLICY "Anyone in classroom can read squad members"
  ON public.team_members
  FOR SELECT
  TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.classroom_teams ct
      JOIN public.classrooms c ON c.id = ct.classroom_id
      WHERE ct.id = team_members.team_id AND (
        c.teacher_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.classroom_id = c.id)
      )
    )
  );

DROP POLICY IF EXISTS "Teachers can manage squad members" ON public.team_members;
CREATE POLICY "Teachers can manage squad members"
  ON public.team_members
  FOR ALL
  TO authenticated
  USING (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.classroom_teams ct
      JOIN public.classrooms c ON c.id = ct.classroom_id
      WHERE ct.id = team_members.team_id AND c.teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.classroom_teams ct
      JOIN public.classrooms c ON c.id = ct.classroom_id
      WHERE ct.id = team_members.team_id AND c.teacher_id = auth.uid()
    )
  );

-- 5D. Student Account Provisioning Policy
-- Teachers can insert student accounts for their own school and classrooms
DROP POLICY IF EXISTS "Teachers can insert student profiles" ON public.profiles;
CREATE POLICY "Teachers can insert student profiles"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    public.is_admin() OR (
      public.is_teacher() AND
      role = 'student' AND
      teacher_id = auth.uid()
    )
  );

-- Teachers can update their provisioned students (e.g. reset PIN, update status)
DROP POLICY IF EXISTS "Teachers can update their provisioned students" ON public.profiles;
CREATE POLICY "Teachers can update their provisioned students"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (
    public.is_admin() OR
    id = auth.uid() OR (
      public.is_teacher() AND
      role = 'student' AND
      teacher_id = auth.uid()
    )
  )
  WITH CHECK (
    public.is_admin() OR
    id = auth.uid() OR (
      public.is_teacher() AND
      role = 'student' AND
      teacher_id = auth.uid()
    )
  );
