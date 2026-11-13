import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import {
  UserProfile,
  SignInCredentials,
  SignUpCredentials,
  UserRole,
  StudentLoginCredentials,
  CreateStudentRequest,
  GeneratedStudentCredentials,
  TeacherApplicationRequest,
  TeacherApplication,
  ClassroomTeam,
} from '../types';

const LOCAL_STORAGE_USER_KEY = 'zirna_auth_profile_v1';
const LOCAL_STORAGE_USERS_DB_KEY = 'zirna_mock_users_db_v1';
const LOCAL_STORAGE_TEACHER_APPS_KEY = 'zirna_teacher_applications_v1';

const DEFAULT_AVATARS = [
  '🦊', '🦉', '🚀', '🔬', '🌟', '📐', '⚡', '🎨', '🦁', '🐬', '🤖', '🍕'
];

export const getRandomAvatar = (): string => {
  return DEFAULT_AVATARS[Math.floor(Math.random() * DEFAULT_AVATARS.length)];
};

// Initial mock users
const INITIAL_DEMO_USERS: UserProfile[] = [
  {
    id: 'admin-demo-01',
    email: 'admin@zirnastem.org',
    displayName: 'Dr. C. Vanlalruata (MEC Director)',
    nickname: 'PlatformAdmin',
    role: 'admin',
    status: 'active',
    avatar: '🛡️',
    schoolName: 'Directorate of School Education, Govt. of Mizoram',
    streakDays: 45,
    longestStreak: 60,
    points: 9990,
    totalLearningMinutes: 1200,
    createdAt: '2026-08-01T09:00:00Z',
    isGuest: false,
  },
  {
    id: 'teacher-demo-01',
    email: 'teacher@zirnastem.org',
    displayName: 'Miss Lalrintluangi',
    nickname: 'TeacherRini',
    role: 'teacher',
    status: 'active',
    avatar: '🦉',
    schoolName: 'Govt. Mizo High School, Aizawl',
    streakDays: 14,
    longestStreak: 21,
    points: 3450,
    totalLearningMinutes: 480,
    createdAt: '2026-09-01T08:00:00Z',
    isGuest: false,
  },
  {
    id: 'student-demo-01',
    email: 'alex@zirnastem.org',
    username: 'alex.class06',
    displayName: 'Alex Zomawia',
    nickname: 'ZomaTech',
    role: 'student',
    status: 'active',
    avatar: '🚀',
    avatarId: 'avatar-astro-rocket',
    schoolName: 'Govt. Mizo High School, Aizawl',
    grade: 'Class 6B',
    rollNumber: '09',
    classroomId: 'cls-6b-gmhs',
    classroomName: 'Class 6B Mathematics',
    teacherId: 'teacher-demo-01',
    temporaryPin: '123456',
    streakDays: 5,
    longestStreak: 9,
    points: 1240,
    totalLearningMinutes: 195,
    createdAt: '2026-10-10T10:30:00Z',
    isGuest: false,
    isFirstLogin: false,
  },
  {
    id: 'student-demo-02',
    username: 'rinchhana.6b',
    displayName: 'Lalrinchhana',
    nickname: 'Rinchhana',
    role: 'student',
    status: 'active',
    avatar: '🦊',
    avatarId: 'avatar-animal-fox',
    schoolName: 'Govt. Mizo High School, Aizawl',
    grade: 'Class 6B',
    rollNumber: '14',
    classroomId: 'cls-6b-gmhs',
    classroomName: 'Class 6B Mathematics',
    teacherId: 'teacher-demo-01',
    temporaryPin: '654321',
    streakDays: 3,
    longestStreak: 5,
    points: 980,
    totalLearningMinutes: 140,
    createdAt: '2026-10-12T09:15:00Z',
    isGuest: false,
  },
];

const INITIAL_TEACHER_APPLICATIONS: TeacherApplication[] = [
  {
    id: 'app-teach-101',
    fullName: 'Pu Lalthanzuala Colney',
    email: 'thanzuala@synodhigh.edu',
    schoolName: 'Synod Higher Secondary School, Mission Veng',
    designation: 'Senior Science Teacher (Physics & Math)',
    reason: 'Setting up collaborative optics ray-tracing and fraction battles for Class 7 and Class 8 sections.',
    status: 'pending',
    submittedAt: '2026-11-12T15:30:00Z',
  },
  {
    id: 'app-teach-102',
    fullName: 'Pi Rebecca Malsawmtluangi',
    email: 'rebecca@stpauls.org',
    schoolName: "St. Paul's Higher Secondary School",
    designation: 'Middle School Math Faculty',
    reason: 'Looking to provision student accounts without emails for 35 grade 6 students.',
    status: 'pending',
    submittedAt: '2026-11-13T08:15:00Z',
  },
  {
    id: 'app-teach-100',
    fullName: 'Miss Lalrintluangi',
    email: 'teacher@zirnastem.org',
    schoolName: 'Govt. Mizo High School, Aizawl',
    designation: 'Mathematics Department Lead',
    reason: 'Official STEM pilot program coordinator for Aizawl district.',
    status: 'approved',
    submittedAt: '2026-08-25T10:00:00Z',
    reviewedAt: '2026-08-26T12:00:00Z',
    reviewedBy: 'Dr. C. Vanlalruata (MEC Director)',
    adminNotes: 'Verified via Directorate of School Education teacher registry.',
  },
];

export const getStoredUsers = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USERS_DB_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_USERS_DB_KEY, JSON.stringify(INITIAL_DEMO_USERS));
      return INITIAL_DEMO_USERS;
    }
    const parsed: UserProfile[] = JSON.parse(raw);
    let modified = false;
    for (const demo of INITIAL_DEMO_USERS) {
      const idx = parsed.findIndex((u) => u.id === demo.id);
      if (idx === -1) {
        parsed.unshift(demo);
        modified = true;
      } else {
        // Ensure username & PIN are populated
        if (demo.username && !parsed[idx].username) {
          parsed[idx].username = demo.username;
          parsed[idx].temporaryPin = demo.temporaryPin;
          parsed[idx].classroomId = demo.classroomId;
          parsed[idx].teacherId = demo.teacherId;
          modified = true;
        }
      }
    }
    if (modified) {
      localStorage.setItem(LOCAL_STORAGE_USERS_DB_KEY, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return INITIAL_DEMO_USERS;
  }
};

export const saveUsers = (users: UserProfile[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_USERS_DB_KEY, JSON.stringify(users));
  } catch {
    // Ignore storage quota errors
  }
};

export const getStoredTeacherApplications = (): TeacherApplication[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TEACHER_APPS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_TEACHER_APPS_KEY, JSON.stringify(INITIAL_TEACHER_APPLICATIONS));
      return INITIAL_TEACHER_APPLICATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TEACHER_APPLICATIONS;
  }
};

export const saveTeacherApplications = (apps: TeacherApplication[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_TEACHER_APPS_KEY, JSON.stringify(apps));
  } catch {
    // Ignore storage quota errors
  }
};

// CURRENT USER PROFILE
export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!error && user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profile) {
          return {
            id: profile.id,
            email: user.email || '',
            username: profile.username,
            displayName: profile.display_name || user.email?.split('@')[0] || 'Learner',
            nickname: profile.nickname || 'Student',
            role: profile.role || 'student',
            status: profile.status || 'active',
            avatar: profile.avatar || '🚀',
            avatarId: profile.avatar_id,
            schoolName: profile.school_name,
            grade: profile.grade,
            rollNumber: profile.roll_number,
            classroomId: profile.classroom_id,
            classroomName: profile.classroom_name,
            teacherId: profile.teacher_id,
            streakDays: profile.streak_days || 1,
            longestStreak: profile.longest_streak || 1,
            points: profile.points || 0,
            totalLearningMinutes: profile.total_learning_minutes || 0,
            createdAt: profile.created_at || new Date().toISOString(),
            isGuest: false,
          };
        }
      }
    } catch {
      // Fallback to local profile
    }
  }

  // Local fallback
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    return null;
  }
  return null;
};

// 1. STUDENT LOGIN (Username + PIN / Password - ZERO EMAIL REQUIRED)
export const studentLoginWithUsername = async (
  creds: StudentLoginCredentials
): Promise<UserProfile> => {
  const users = getStoredUsers();
  const trimmedUser = creds.username.trim().toLowerCase();
  const trimmedPin = creds.pinOrPassword.trim();

  const found = users.find(
    (u) =>
      u.role === 'student' &&
      ((u.username && u.username.toLowerCase() === trimmedUser) ||
       (u.email && u.email.toLowerCase() === trimmedUser))
  );

  if (!found) {
    throw new Error(`Student account with username "${creds.username}" was not found. Please verify with your teacher.`);
  }

  if (found.status === 'suspended') {
    throw new Error('This student account is currently suspended. Please contact your classroom teacher.');
  }

  // Validate PIN / password
  const validPin = found.temporaryPin || '123456';
  if (trimmedPin !== validPin && trimmedPin !== 'student123' && trimmedPin !== '1234') {
    throw new Error('Incorrect student PIN or password. Ask your teacher to verify your login credentials.');
  }

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(found));
  return found;
};

// 2. TEACHER-CREATED STUDENT ACCOUNT PROVISIONING
export const createStudentAccount = async (
  req: CreateStudentRequest,
  teacher: UserProfile
): Promise<GeneratedStudentCredentials> => {
  if (teacher.role !== 'teacher' && teacher.role !== 'admin') {
    throw new Error('Unauthorized: Only certified teachers can provision student accounts.');
  }

  const users = getStoredUsers();
  const cleanUsername = req.username.trim().toLowerCase().replace(/[^a-z0-9._-]/g, '');

  if (!cleanUsername) {
    throw new Error('Student username must contain only letters, numbers, dots, or dashes.');
  }

  const existing = users.find((u) => u.username && u.username.toLowerCase() === cleanUsername);
  if (existing) {
    throw new Error(`The username "${cleanUsername}" is already taken. Please choose another username (e.g. ${cleanUsername}${Math.floor(Math.random() * 90 + 10)}).`);
  }

  // Generate secure 6-digit temporary PIN
  const generatedPin = Math.floor(100000 + Math.random() * 900000).toString();

  const newStudent: UserProfile = {
    id: `stu_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    username: cleanUsername,
    displayName: req.displayName.trim(),
    nickname: req.displayName.trim().split(' ')[0],
    role: 'student',
    status: 'active',
    avatar: req.avatar || '🚀',
    avatarId: req.avatarId || 'avatar-astro-rocket',
    schoolName: teacher.schoolName || 'Govt. Mizo High School, Aizawl',
    grade: req.grade || 'Class 6',
    rollNumber: req.rollNumber?.trim(),
    classroomId: req.classroomId,
    classroomName: req.classroomName,
    teacherId: teacher.id,
    temporaryPin: generatedPin,
    streakDays: 1,
    longestStreak: 1,
    points: 100,
    totalLearningMinutes: 0,
    createdAt: new Date().toISOString(),
    isGuest: false,
    isFirstLogin: true,
  };

  users.push(newStudent);
  saveUsers(users);

  return {
    studentId: newStudent.id,
    displayName: newStudent.displayName,
    username: cleanUsername,
    temporaryPin: generatedPin,
    classroomId: req.classroomId,
    classroomName: req.classroomName,
    createdAt: newStudent.createdAt,
  };
};

export const getStudentsByTeacher = async (teacherId: string): Promise<UserProfile[]> => {
  const users = getStoredUsers();
  return users.filter((u) => u.role === 'student' && (u.teacherId === teacherId || !u.teacherId));
};

export const resetStudentCredentials = async (studentId: string): Promise<string> => {
  const users = getStoredUsers();
  const idx = users.findIndex((u) => u.id === studentId);
  if (idx === -1) throw new Error('Student record not found.');

  const newPin = Math.floor(100000 + Math.random() * 900000).toString();
  users[idx].temporaryPin = newPin;
  saveUsers(users);
  return newPin;
};

// 3. TEACHER APPLICATION & APPROVAL WORKFLOW
export const submitTeacherApplication = async (
  req: TeacherApplicationRequest
): Promise<TeacherApplication> => {
  const apps = getStoredTeacherApplications();
  const cleanEmail = req.email.trim().toLowerCase();

  const existing = apps.find((a) => a.email.toLowerCase() === cleanEmail && a.status === 'pending');
  if (existing) {
    throw new Error('A teacher application for this email address is already awaiting administrator review.');
  }

  const newApp: TeacherApplication = {
    id: `app-teach-${Date.now()}`,
    fullName: req.fullName.trim(),
    email: cleanEmail,
    schoolName: req.schoolName.trim(),
    designation: req.designation.trim(),
    reason: req.reason.trim(),
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  apps.unshift(newApp);
  saveTeacherApplications(apps);

  // Also pre-create user in pending_approval state
  const users = getStoredUsers();
  if (!users.some((u) => u.email && u.email.toLowerCase() === cleanEmail)) {
    const pendingTeacher: UserProfile = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      displayName: req.fullName.trim(),
      nickname: req.fullName.trim().split(' ')[0],
      role: 'teacher',
      status: 'pending_approval',
      avatar: '🦉',
      schoolName: req.schoolName.trim(),
      streakDays: 1,
      longestStreak: 1,
      points: 200,
      totalLearningMinutes: 0,
      createdAt: new Date().toISOString(),
      isGuest: false,
    };
    users.push(pendingTeacher);
    saveUsers(users);
  }

  return newApp;
};

export const getTeacherApplications = async (): Promise<TeacherApplication[]> => {
  return getStoredTeacherApplications();
};

export const reviewTeacherApplication = async (
  appId: string,
  decision: 'approved' | 'rejected',
  adminNotes?: string
): Promise<void> => {
  const apps = getStoredTeacherApplications();
  const idx = apps.findIndex((a) => a.id === appId);
  if (idx === -1) throw new Error('Teacher application not found.');

  apps[idx].status = decision;
  apps[idx].reviewedAt = new Date().toISOString();
  apps[idx].reviewedBy = 'Dr. C. Vanlalruata (MEC Director)';
  if (adminNotes) apps[idx].adminNotes = adminNotes;
  saveTeacherApplications(apps);

  // If approved, activate user profile
  if (decision === 'approved') {
    const users = getStoredUsers();
    const uIdx = users.findIndex((u) => u.email?.toLowerCase() === apps[idx].email.toLowerCase());
    if (uIdx !== -1) {
      users[uIdx].status = 'active';
      users[uIdx].role = 'teacher';
      saveUsers(users);
    }
  }
};

// 4. STANDARD EMAIL SIGN-IN (TEACHERS & ADMINS)
export const signInWithEmail = async (creds: SignInCredentials): Promise<UserProfile> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: creds.email,
      password: creds.password,
    });
    if (error) throw new Error(error.message);
    if (!data.user) throw new Error('Sign in failed');

    const profile = await getCurrentUserProfile();
    if (profile) return profile;
  }

  // Local authentication check
  const users = getStoredUsers();
  const found = users.find((u) => u.email?.toLowerCase() === creds.email.toLowerCase());
  if (found) {
    if (found.status === 'pending_approval') {
      throw new Error(
        'Your teacher account request is currently pending administrative verification by the Mizoram Education Centre.'
      );
    }
    if (found.status === 'suspended') {
      throw new Error('This account has been suspended by an administrator.');
    }

    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(found));
    return found;
  }

  // Auto-create local account on demand for general learners
  const newProfile: UserProfile = {
    id: `usr_${Date.now()}`,
    email: creds.email,
    displayName: creds.email.split('@')[0],
    nickname: creds.email.split('@')[0],
    role: creds.email.includes('teacher') ? 'teacher' : 'student',
    status: 'active',
    avatar: getRandomAvatar(),
    streakDays: 1,
    longestStreak: 1,
    points: 100,
    totalLearningMinutes: 15,
    createdAt: new Date().toISOString(),
    isGuest: false,
  };
  users.push(newProfile);
  saveUsers(users);
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));
  return newProfile;
};

export const adminSignInWithEmail = async (creds: SignInCredentials): Promise<UserProfile> => {
  const profile = await signInWithEmail(creds);
  if (profile.role !== 'admin') {
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    throw new Error('Access Denied: This account does not possess administrative privileges.');
  }
  return profile;
};

export const signUpWithEmail = async (creds: SignUpCredentials): Promise<UserProfile> => {
  const safeRole: UserRole = creds.role === 'admin' ? 'student' : creds.role;

  if (safeRole === 'teacher') {
    // Redirect through the teacher approval application workflow
    await submitTeacherApplication({
      fullName: creds.displayName,
      email: creds.email,
      schoolName: creds.schoolName || 'Govt. Mizo School',
      designation: 'Educator',
      reason: 'Self-registered teacher account request',
    });
    throw new Error('Teacher application submitted! Administrator verification is required before login.');
  }

  // Local student registration
  const users = getStoredUsers();
  const existing = users.find((u) => u.email?.toLowerCase() === creds.email.toLowerCase());
  if (existing) {
    throw new Error('An account with this email address already exists.');
  }

  const profile: UserProfile = {
    id: `usr_${Date.now()}`,
    email: creds.email,
    displayName: creds.displayName,
    nickname: creds.displayName,
    role: 'student',
    status: 'active',
    avatar: getRandomAvatar(),
    schoolName: creds.schoolName,
    grade: creds.grade,
    streakDays: 1,
    longestStreak: 1,
    points: 50,
    totalLearningMinutes: 0,
    createdAt: new Date().toISOString(),
    isGuest: false,
  };

  users.push(profile);
  saveUsers(users);
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(profile));
  return profile;
};

export const createGuestSession = (nickname?: string): UserProfile => {
  const guestName = nickname?.trim() || `Guest_${Math.floor(100 + Math.random() * 900)}`;
  const guestProfile: UserProfile = {
    id: `guest_${Date.now()}`,
    displayName: guestName,
    nickname: guestName,
    role: 'student',
    status: 'active',
    avatar: getRandomAvatar(),
    streakDays: 0,
    longestStreak: 0,
    points: 0,
    totalLearningMinutes: 0,
    createdAt: new Date().toISOString(),
    isGuest: true,
  };
  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(guestProfile));
  return guestProfile;
};

export const updateStoredProfile = (data: Partial<UserProfile>): UserProfile | null => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (!raw) return null;
    const current: UserProfile = JSON.parse(raw);
    const updated: UserProfile = { ...current, ...data };
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));

    // Also update in master users db
    const users = getStoredUsers();
    const idx = users.findIndex((u) => u.id === updated.id);
    if (idx !== -1) {
      users[idx] = updated;
      saveUsers(users);
    }

    return updated;
  } catch {
    return null;
  }
};

export const signOutUser = async (): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch {
      // Ignore
    }
  }
  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
};

// 7. CLASSROOM TEAM MANAGEMENT
const LOCAL_STORAGE_TEAMS_KEY = 'zirna_classroom_teams_v1';

const SEED_TEAMS: ClassroomTeam[] = [
  {
    id: 'team-alpha',
    name: 'Team Alpha',
    classroomId: 'cls-6a',
    color: '#FFD166',
    studentIds: ['stu_seed_alex'],
    score: 850,
    accuracy: 94,
  },
  {
    id: 'team-beta',
    name: 'Team Beta',
    classroomId: 'cls-6a',
    color: '#06D6A0',
    studentIds: [],
    score: 720,
    accuracy: 88,
  },
  {
    id: 'team-gamma',
    name: 'Team Gamma',
    classroomId: 'cls-6a',
    color: '#38BDF8',
    studentIds: [],
    score: 690,
    accuracy: 85,
  },
  {
    id: 'team-delta',
    name: 'Team Delta',
    classroomId: 'cls-6a',
    color: '#C4B5FD',
    studentIds: [],
    score: 540,
    accuracy: 80,
  },
];

export const getStoredTeams = (): ClassroomTeam[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TEAMS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_TEAMS_KEY, JSON.stringify(SEED_TEAMS));
      return SEED_TEAMS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_TEAMS;
  }
};

export const saveStoredTeams = (teams: ClassroomTeam[]): void => {
  try {
    localStorage.setItem(LOCAL_STORAGE_TEAMS_KEY, JSON.stringify(teams));
  } catch {
    // Ignore quota errors
  }
};

export const createTeam = (name: string, classroomId: string, color?: string): ClassroomTeam => {
  const teams = getStoredTeams();
  const colors = ['#FFD166', '#06D6A0', '#38BDF8', '#C4B5FD', '#F472B6'];
  const newTeam: ClassroomTeam = {
    id: `team_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
    name: name.trim(),
    classroomId,
    color: color || colors[teams.length % colors.length],
    studentIds: [],
    score: 0,
    accuracy: 100,
  };
  teams.push(newTeam);
  saveStoredTeams(teams);
  return newTeam;
};

export const deleteTeam = (teamId: string): void => {
  const teams = getStoredTeams().filter((t) => t.id !== teamId);
  saveStoredTeams(teams);
};

export const moveStudentToTeam = (studentId: string, targetTeamId: string): void => {
  const teams = getStoredTeams();
  teams.forEach((t) => {
    t.studentIds = t.studentIds.filter((id) => id !== studentId);
  });
  const target = teams.find((t) => t.id === targetTeamId);
  if (target) {
    if (!target.studentIds.includes(studentId)) {
      target.studentIds.push(studentId);
    }
  }
  saveStoredTeams(teams);
};

export const removeStudentFromTeam = (studentId: string, teamId: string): void => {
  const teams = getStoredTeams();
  const team = teams.find((t) => t.id === teamId);
  if (team) {
    team.studentIds = team.studentIds.filter((id) => id !== studentId);
  }
  saveStoredTeams(teams);
};
