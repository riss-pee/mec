-- ==============================================================================
-- ZIRNA STEM STUDIO: COLLABORATIVE LEARNING, MULTIPLAYER & AUTHENTICATION SCHEMA
-- Migration: 20261113000000_classroom_multiplayer_auth.sql
-- Database: PostgreSQL 15+ (Supabase compatible)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
DO $$ BEGIN
  CREATE TYPE user_role_type AS ENUM ('student', 'teacher');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE session_game_mode AS ENUM ('collaborative', 'team-battle', 'teacher-demo');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE session_difficulty_tier AS ENUM ('standard', 'advanced', 'olympiad');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE session_lifecycle_status AS ENUM ('lobby', 'active', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE team_code AS ENUM ('alpha', 'beta', 'gamma', 'delta');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 3. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  nickname TEXT,
  role user_role_type NOT NULL DEFAULT 'student',
  avatar TEXT DEFAULT '🚀',
  school_name TEXT,
  grade TEXT,
  streak_days INTEGER NOT NULL DEFAULT 1,
  longest_streak INTEGER NOT NULL DEFAULT 1,
  points INTEGER NOT NULL DEFAULT 50,
  total_learning_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. CLASSROOMS TABLE
CREATE TABLE IF NOT EXISTS public.classrooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  school_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. CLASSROOM MEMBERS TABLE (Student enrollment)
CREATE TABLE IF NOT EXISTS public.classroom_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(classroom_id, student_id)
);

-- 6. CLASSROOM SESSIONS (Multiplayer Live Arenas)
CREATE TABLE IF NOT EXISTS public.classroom_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE SET NULL,
  host_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  module_id TEXT NOT NULL,
  module_name TEXT NOT NULL,
  mode session_game_mode NOT NULL DEFAULT 'team-battle',
  difficulty session_difficulty_tier NOT NULL DEFAULT 'standard',
  status session_lifecycle_status NOT NULL DEFAULT 'lobby',
  duration_minutes INTEGER NOT NULL DEFAULT 15,
  target_score INTEGER NOT NULL DEFAULT 500,
  challenge_goal_target INTEGER NOT NULL DEFAULT 20,
  challenge_goal_progress INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  ended_at TIMESTAMPTZ
);

-- 7. SESSION TEAMS
CREATE TABLE IF NOT EXISTS public.teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  team_id team_code NOT NULL,
  name TEXT NOT NULL,
  color TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  accuracy INTEGER NOT NULL DEFAULT 100,
  completed_challenges INTEGER NOT NULL DEFAULT 0,
  UNIQUE(session_id, team_id)
);

-- 8. SESSION PARTICIPANTS
CREATE TABLE IF NOT EXISTS public.session_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES public.classroom_sessions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  display_name TEXT NOT NULL,
  avatar TEXT NOT NULL DEFAULT '🚀',
  team_id team_code NOT NULL,
  is_ready BOOLEAN NOT NULL DEFAULT true,
  individual_score INTEGER NOT NULL DEFAULT 0,
  answers_submitted INTEGER NOT NULL DEFAULT 0,
  accuracy_pct INTEGER NOT NULL DEFAULT 100,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. LEARNING PATHWAYS / COURSES
CREATE TABLE IF NOT EXISTS public.courses (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tagline TEXT,
  color TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. COURSE ENROLLMENTS
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id TEXT NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_pct INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  enrolled_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, course_id)
);

-- 11. LEARNING ACTIVITY LOG
CREATE TABLE IF NOT EXISTS public.learning_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  module_title TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 100,
  max_score INTEGER NOT NULL DEFAULT 100,
  points_earned INTEGER NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. ACHIEVEMENTS CATALOG
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  badge_color TEXT NOT NULL,
  category TEXT NOT NULL,
  max_progress INTEGER NOT NULL DEFAULT 1
);

-- 13. USER ACHIEVEMENTS
CREATE TABLE IF NOT EXISTS public.user_achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress INTEGER NOT NULL DEFAULT 0,
  is_unlocked BOOLEAN NOT NULL DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  UNIQUE(user_id, achievement_id)
);

-- 14. DAILY LEARNING ACTIVITY (Streak engine)
CREATE TABLE IF NOT EXISTS public.daily_activity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  challenges_count INTEGER NOT NULL DEFAULT 0,
  minutes_spent INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, activity_date)
);

-- 15. ASSIGNMENTS TABLE
CREATE TABLE IF NOT EXISTS public.assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  module_id TEXT NOT NULL,
  title TEXT NOT NULL,
  instructions TEXT,
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. ASSIGNMENT SUBMISSIONS
CREATE TABLE IF NOT EXISTS public.assignment_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  score INTEGER,
  status TEXT NOT NULL DEFAULT 'submitted',
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE(assignment_id, student_id)
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE MULTIPLAYER QUERIES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_sessions_code ON public.classroom_sessions(code);
CREATE INDEX IF NOT EXISTS idx_sessions_host ON public.classroom_sessions(host_id);
CREATE INDEX IF NOT EXISTS idx_session_participants_session ON public.session_participants(session_id);
CREATE INDEX IF NOT EXISTS idx_session_teams_session ON public.teams(session_id);
CREATE INDEX IF NOT EXISTS idx_activity_user_created ON public.learning_activity(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_daily_activity_user_date ON public.daily_activity(user_id, activity_date DESC);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classroom_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_submissions ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public read profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- 2. Classrooms Policies
CREATE POLICY "Teachers can manage own classrooms" ON public.classrooms
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "Students can view enrolled classrooms" ON public.classrooms
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.classroom_members
      WHERE classroom_members.classroom_id = classrooms.id
      AND classroom_members.student_id = auth.uid()
    )
  );

-- 3. Classroom Sessions Policies
CREATE POLICY "Public read sessions by code" ON public.classroom_sessions
  FOR SELECT USING (true);

CREATE POLICY "Hosts can create and manage sessions" ON public.classroom_sessions
  FOR ALL USING (auth.uid() = host_id);

-- 4. Session Participants Policies
CREATE POLICY "Anyone can view session participants" ON public.session_participants
  FOR SELECT USING (true);

CREATE POLICY "Authenticated or guest can join session" ON public.session_participants
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Participants can update own answers" ON public.session_participants
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- 5. Teams Policies
CREATE POLICY "Anyone can view session teams" ON public.teams
  FOR SELECT USING (true);

CREATE POLICY "Hosts or service can update team scores" ON public.teams
  FOR ALL USING (true);

-- 6. Learning Activity & Achievements Policies
CREATE POLICY "Users view own activity" ON public.learning_activity
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users insert own activity" ON public.learning_activity
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public read achievements" ON public.achievements
  FOR SELECT USING (true);

CREATE POLICY "Users view own unlocked achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);

-- 7. Daily Activity Policies
CREATE POLICY "Users view and log daily activity" ON public.daily_activity
  FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- DATABASE FUNCTIONS & TRIGGERS
-- ==============================================================================

-- Function to handle new user registration profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name, nickname, role, school_name, grade)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::user_role_type, 'student'),
    new.raw_user_meta_data->>'school_name',
    new.raw_user_meta_data->>'grade'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Pre-seed Core Achievements Catalog
INSERT INTO public.achievements (id, title, description, icon, badge_color, category, max_progress)
VALUES
  ('first-steps', 'First Steps', 'Complete your first interactive STEM challenge.', '🌱', '#06D6A0', 'starter', 1),
  ('fraction-master', 'Fraction Master', 'Solve 5 visual fraction slice puzzles with perfect cuts.', '🍕', '#FFD166', 'fractions', 5),
  ('geometry-explorer', 'Geometry Explorer', 'Complete 5 coordinate reflection symmetry puzzles.', '💎', '#C4B5FD', 'geometry', 5),
  ('physics-investigator', 'Physics Investigator', 'Predict and verify 5 focal ray-tracing optics experiments.', '🔬', '#38BDF8', 'physics', 5),
  ('mental-math-champion', 'Mental Math Champion', 'Count 5 bead configurations on the Soroban Japanese Abacus.', '🧮', '#FB923C', 'arithmetic', 5),
  ('seven-day-streak', 'Seven-Day Streak', 'Complete at least one learning activity on 7 consecutive days.', '🔥', '#F87171', 'streaks', 7),
  ('team-player', 'Team Player', 'Participate in a live classroom collaborative session.', '🤝', '#06D6A0', 'collaborative', 1),
  ('classroom-champion', 'Classroom Champion', 'Help your team achieve victory in a classroom team battle.', '🏆', '#FFD166', 'collaborative', 1)
ON CONFLICT (id) DO NOTHING;
