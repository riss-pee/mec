import { supabase, isSupabaseConfigured } from '../../../lib/supabase';
import { MODULES_REGISTRY } from '../../../data/modulesRegistry';
import {
  PlatformOverviewStats,
  AdminUserItem,
  AdminModuleConfig,
  AdminClassroomItem,
  AdminLiveSession,
  AdminCoursePathway,
  AdminPrivacyRequest,
  AdminAuditLog,
  PlatformSettings,
  UserAccountStatus,
  PrivacyRequestStatus,
} from '../types';
import { UserRole } from '../../auth/types';

// Storage Keys
const ADMIN_USERS_KEY = 'zirna_admin_users_v1';
const ADMIN_MODULES_KEY = 'zirna_admin_modules_v1';
const ADMIN_CLASSROOMS_KEY = 'zirna_admin_classrooms_v1';
const ADMIN_SESSIONS_KEY = 'zirna_admin_sessions_v1';
const ADMIN_PATHWAYS_KEY = 'zirna_admin_pathways_v1';
const ADMIN_PRIVACY_KEY = 'zirna_admin_privacy_requests_v1';
const ADMIN_AUDIT_KEY = 'zirna_admin_audit_logs_v1';
const ADMIN_SETTINGS_KEY = 'zirna_admin_settings_v1';

// Initial Data Fixtures
const INITIAL_USERS: AdminUserItem[] = [
  {
    id: 'admin-demo-01',
    displayName: 'Dr. C. Vanlalruata (MEC Director)',
    email: 'admin@zirnastem.org',
    role: 'admin',
    status: 'active',
    schoolName: 'Directorate of School Education, Govt. of Mizoram',
    grade: 'System Admin',
    points: 9990,
    streakDays: 45,
    createdAt: '2026-08-01T09:00:00Z',
    lastActiveAt: 'Just now',
  },
  {
    id: 'teacher-demo-01',
    displayName: 'Miss Lalrintluangi',
    email: 'teacher@zirnastem.org',
    role: 'teacher',
    status: 'active',
    schoolName: 'Govt. Mizo High School, Aizawl',
    grade: 'Math Lead (Grades 6-8)',
    points: 3450,
    streakDays: 14,
    createdAt: '2026-09-01T08:00:00Z',
    lastActiveAt: '12 mins ago',
  },
  {
    id: 'teacher-demo-02',
    displayName: 'Pu R. Zothansanga',
    email: 'zothana@synodhigh.edu',
    role: 'teacher',
    status: 'active',
    schoolName: 'Synod Higher Secondary School',
    grade: 'Physics HOD',
    points: 2890,
    streakDays: 9,
    createdAt: '2026-09-15T11:00:00Z',
    lastActiveAt: '2 hours ago',
  },
  {
    id: 'student-demo-01',
    displayName: 'Alex Zomawia',
    email: 'alex@zirnastem.org',
    role: 'student',
    status: 'active',
    schoolName: 'Govt. Mizo High School, Aizawl',
    grade: 'Class 6B',
    points: 1240,
    streakDays: 5,
    createdAt: '2026-10-10T10:30:00Z',
    lastActiveAt: '5 mins ago',
  },
  {
    id: 'student-demo-02',
    displayName: 'Lalrinchhana',
    email: 'rinchhana@mizostem.in',
    role: 'student',
    status: 'active',
    schoolName: 'Govt. Mizo High School, Aizawl',
    grade: 'Class 6B',
    points: 980,
    streakDays: 3,
    createdAt: '2026-10-12T09:15:00Z',
    lastActiveAt: '14 mins ago',
  },
  {
    id: 'student-demo-03',
    displayName: 'Vanlalruati Sailo',
    email: 'vanlalruati@synodhigh.edu',
    role: 'student',
    status: 'active',
    schoolName: 'Synod Higher Secondary School',
    grade: 'Class 8A',
    points: 1560,
    streakDays: 8,
    createdAt: '2026-09-20T14:00:00Z',
    lastActiveAt: '45 mins ago',
  },
  {
    id: 'student-demo-04',
    displayName: 'David Malsawmdawngzuala',
    email: 'david.m@stpauls.org',
    role: 'student',
    status: 'active',
    schoolName: "St. Paul's Higher Secondary School",
    grade: 'Class 7',
    points: 840,
    streakDays: 2,
    createdAt: '2026-10-25T16:20:00Z',
    lastActiveAt: 'Yesterday',
  },
  {
    id: 'student-demo-05',
    displayName: 'Lalthanpuii Chhakchhuak',
    email: 'thanpuii@mizostem.in',
    role: 'student',
    status: 'suspended',
    schoolName: 'Khatla Govt. Middle School',
    grade: 'Class 5',
    points: 310,
    streakDays: 0,
    createdAt: '2026-10-01T12:00:00Z',
    lastActiveAt: '7 days ago',
  },
];

const INITIAL_MODULES: AdminModuleConfig[] = MODULES_REGISTRY.map((m, idx) => ({
  id: m.id,
  number: m.number,
  title: m.title,
  subtitle: m.subtitle,
  category: m.categoryLabel,
  grade: m.grade,
  isActive: true,
  isFeatured: idx < 3,
  totalRuns: 1400 - idx * 160,
  completionRate: 88 + (idx % 8),
  description: m.description,
}));

const INITIAL_CLASSROOMS: AdminClassroomItem[] = [
  {
    id: 'cls-6b-gmhs',
    name: 'Class 6B Mathematics',
    grade: 'Grade 6',
    schoolName: 'Govt. Mizo High School, Aizawl',
    teacherName: 'Miss Lalrintluangi',
    teacherEmail: 'teacher@zirnastem.org',
    studentCount: 32,
    activeSessionCode: 'ZIRNA-4821',
    status: 'active',
    createdAt: '2026-09-02T08:00:00Z',
  },
  {
    id: 'cls-8a-gmhs',
    name: 'Class 8A Science & Optics',
    grade: 'Grade 8',
    schoolName: 'Govt. Mizo High School, Aizawl',
    teacherName: 'Pu Zonunsanga',
    teacherEmail: 'zonunsanga@gmhs.edu',
    studentCount: 28,
    status: 'active',
    createdAt: '2026-09-03T09:30:00Z',
  },
  {
    id: 'cls-olympiad-mizo',
    name: 'Mizoram STEM Olympiad Squad',
    grade: 'Classes 7-9',
    schoolName: 'State Science Center, Berawtlang',
    teacherName: 'Dr. H. Lalrinsanga',
    teacherEmail: 'rinsanga@dstmizoram.gov.in',
    studentCount: 16,
    status: 'active',
    createdAt: '2026-09-10T11:00:00Z',
  },
  {
    id: 'cls-synod-7',
    name: 'Synod Grade 7 Mental Math Relay',
    grade: 'Grade 7',
    schoolName: 'Synod Higher Secondary School',
    teacherName: 'Pu R. Zothansanga',
    teacherEmail: 'zothana@synodhigh.edu',
    studentCount: 35,
    status: 'active',
    createdAt: '2026-09-22T10:15:00Z',
  },
];

const INITIAL_SESSIONS: AdminLiveSession[] = [
  {
    id: 'sess-live-01',
    code: 'ZIRNA-4821',
    title: 'Fraction Challenge — Class 6B',
    moduleId: 'fraction-zirna',
    moduleTitle: 'Fraction Zirna Playground',
    hostName: 'Miss Lalrintluangi',
    hostEmail: 'teacher@zirnastem.org',
    classroomName: 'Class 6B Mathematics',
    participantsCount: 5,
    status: 'active',
    startedAt: '18 mins ago',
    durationMinutes: 45,
  },
  {
    id: 'sess-live-02',
    code: 'OPTIC-9920',
    title: 'Ray Optics & Focal Refraction Lab',
    moduleId: 'optics-lab',
    moduleTitle: 'Ray Tracing Optics Lab',
    hostName: 'Pu R. Zothansanga',
    hostEmail: 'zothana@synodhigh.edu',
    classroomName: 'Synod Grade 7 Mental Math Relay',
    participantsCount: 8,
    status: 'lobby',
    startedAt: '4 mins ago',
    durationMinutes: 40,
  },
];

const INITIAL_PATHWAYS: AdminCoursePathway[] = [
  {
    id: 'school-math',
    title: 'School Mathematics Pathway',
    tagline: 'Visual fractions, spatial grids, and coordinate symmetry reflection',
    moduleIds: ['fraction-zirna', 'fraction-grid', 'symmetry-match'],
    displayOrder: 1,
    isFeatured: true,
    color: '#FFD166',
  },
  {
    id: 'physics-optics',
    title: 'Physics & Optics Pathway',
    tagline: 'Refraction ray tracing, curved mirrors, and Cartesian defense vectors',
    moduleIds: ['optics-lab', 'coordinate-defense'],
    displayOrder: 2,
    isFeatured: true,
    color: '#38BDF8',
  },
  {
    id: 'mental-arithmetic',
    title: 'Mental Arithmetic & Number Sense',
    tagline: 'Tactile Soroban beads, integer number lines, and Olympiad speed counting',
    moduleIds: ['abacus-math', 'number-line-cruiser'],
    displayOrder: 3,
    isFeatured: true,
    color: '#06D6A0',
  },
];

const INITIAL_PRIVACY_REQUESTS: AdminPrivacyRequest[] = [
  {
    id: 'prv-req-101',
    type: 'data-deletion',
    userEmail: 'parent.chhakchhuak@mizomail.com',
    requesterName: 'Pi Lalmuanpuii (Parent/Guardian)',
    studentIdentifier: 'STU-MIZO-4412 (Class 5)',
    status: 'pending',
    submittedAt: '2026-11-10T14:22:00Z',
    legalDeadline: '2026-12-10T23:59:59Z',
    details: 'Student graduated from middle school; parent requests complete erasure of student progress history under DPDP Act 2023.',
  },
  {
    id: 'prv-req-102',
    type: 'data-export',
    userEmail: 'alex@zirnastem.org',
    requesterName: 'Alex Zomawia',
    studentIdentifier: 'STU-GMHS-6B-09',
    status: 'completed',
    submittedAt: '2026-11-08T09:10:00Z',
    legalDeadline: '2026-12-08T23:59:59Z',
    details: 'Student requested a downloadable archive of all completed STEM certificates and challenge records.',
    adminNotes: 'Export archive JSON generated and dispatched securely to registered student email.',
  },
  {
    id: 'prv-req-103',
    type: 'parental-revocation',
    userEmail: 'guardians.sailo@gmail.com',
    requesterName: 'Dr. K. Sailo',
    studentIdentifier: 'STU-SYNOD-8A-18',
    status: 'reviewing',
    submittedAt: '2026-11-12T11:05:00Z',
    legalDeadline: '2026-12-12T23:59:59Z',
    details: 'Parental consent updated; requested to switch from cloud profile storage to local device-only anonymous mode.',
  },
];

const INITIAL_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'aud-2001',
    timestamp: '2026-11-13T12:45:10Z',
    adminEmail: 'admin@zirnastem.org',
    adminName: 'Dr. C. Vanlalruata',
    action: 'ADMIN_SIGN_IN',
    targetResource: 'AUTH_SUBSYSTEM',
    details: 'Successful administrator credential verification from authenticated IP.',
    ipAddress: '103.228.154.12 (Aizawl, IN)',
    status: 'success',
  },
  {
    id: 'aud-2002',
    timestamp: '2026-11-13T11:15:32Z',
    adminEmail: 'admin@zirnastem.org',
    adminName: 'Dr. C. Vanlalruata',
    action: 'PRIVACY_EXPORT_DISPATCHED',
    targetResource: 'prv-req-102 (alex@zirnastem.org)',
    details: 'Dispatched encrypted student learning history data archive upon verified subject request.',
    ipAddress: '103.228.154.12 (Aizawl, IN)',
    status: 'success',
  },
  {
    id: 'aud-2003',
    timestamp: '2026-11-12T16:02:44Z',
    adminEmail: 'admin@zirnastem.org',
    adminName: 'Dr. C. Vanlalruata',
    action: 'MODULE_CONFIG_UPDATED',
    targetResource: 'fraction-zirna',
    details: 'Updated module curriculum alignment tags for MBSE Grade 2-6 Syllabus.',
    ipAddress: '103.228.154.12 (Aizawl, IN)',
    status: 'success',
  },
  {
    id: 'aud-2004',
    timestamp: '2026-11-11T09:20:15Z',
    adminEmail: 'admin@zirnastem.org',
    adminName: 'Dr. C. Vanlalruata',
    action: 'USER_ACCOUNT_SUSPENDED',
    targetResource: 'student-demo-05 (thanpuii@mizostem.in)',
    details: 'Account temporarily suspended pending parental verification of school registration.',
    ipAddress: '103.228.154.12 (Aizawl, IN)',
    status: 'flagged',
  },
];

const INITIAL_SETTINGS: PlatformSettings = {
  maintenanceMode: false,
  publicRegistrationOpen: true,
  guestAccessEnabled: true,
  defaultSessionTimeoutMinutes: 60,
  strictChildPrivacy: true,
  systemNoticeText: 'Mizoram Statewide STEM Challenge Week begins November 20! All classes are invited.',
  systemNoticeActive: true,
  organizationName: 'Mizoram Education Centre (MEC)',
  supportEmail: 'directorate@zirnastem.org',
  version: 'v1.4.0-admin',
};

// Helper: Local Storage getter & setter
const getStored = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // ignore storage quota errors
  }
};

// SERVICE IMPLEMENTATION

export const getPlatformOverviewStats = async (): Promise<PlatformOverviewStats> => {
  const users = await getUsers();
  const classrooms = await getClassrooms();
  const sessions = await getLiveSessions();
  const modules = await getModules();

  const totalStudents = users.filter((u) => u.role === 'student').length;
  const totalTeachers = users.filter((u) => u.role === 'teacher').length;
  const totalAdmins = users.filter((u) => u.role === 'admin').length;
  const registeredClassrooms = classrooms.length;
  const activeClassroomSessions = sessions.filter((s) => s.status === 'active' || s.status === 'lobby').length;

  const topModules = modules.slice(0, 4).map((m) => ({
    id: m.id,
    title: m.title,
    count: m.totalRuns,
    category: m.category,
  }));

  const weeklyActivity = [
    { day: 'Mon', challenges: 142, activeUsers: 88 },
    { day: 'Tue', challenges: 198, activeUsers: 112 },
    { day: 'Wed', challenges: 260, activeUsers: 145 },
    { day: 'Thu', challenges: 235, activeUsers: 130 },
    { day: 'Fri', challenges: 310, activeUsers: 168 },
    { day: 'Sat', challenges: 115, activeUsers: 64 },
    { day: 'Sun', challenges: 85, activeUsers: 48 },
  ];

  return {
    totalStudents,
    totalTeachers,
    totalAdmins,
    registeredClassrooms,
    activeClassroomSessions,
    totalCompletedChallenges: 1845,
    topModules,
    weeklyActivity,
  };
};

export const getUsers = async (filter?: {
  role?: string;
  status?: string;
  search?: string;
}): Promise<AdminUserItem[]> => {
  let list = getStored<AdminUserItem[]>(ADMIN_USERS_KEY, INITIAL_USERS);

  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (u) =>
        u.displayName.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.schoolName && u.schoolName.toLowerCase().includes(q))
    );
  }

  if (filter?.role && filter.role !== 'all') {
    list = list.filter((u) => u.role === filter.role);
  }

  if (filter?.status && filter.status !== 'all') {
    list = list.filter((u) => u.status === filter.status);
  }

  return list;
};

export const updateUserStatus = async (
  userId: string,
  status: UserAccountStatus,
  reason: string
): Promise<void> => {
  const users = getStored<AdminUserItem[]>(ADMIN_USERS_KEY, INITIAL_USERS);
  const idx = users.findIndex((u) => u.id === userId);
  if (idx !== -1) {
    users[idx].status = status;
    setStored(ADMIN_USERS_KEY, users);
    await recordAuditLog({
      adminEmail: 'admin@zirnastem.org',
      adminName: 'Dr. C. Vanlalruata',
      action: status === 'suspended' ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
      targetResource: `User: ${users[idx].displayName} (${users[idx].email})`,
      details: reason || `Admin updated user status to ${status}`,
      ipAddress: '103.228.154.12',
      status: status === 'suspended' ? 'flagged' : 'success',
    });
  }
};

export const updateUserRole = async (
  userId: string,
  newRole: UserRole,
  reason: string
): Promise<void> => {
  const users = getStored<AdminUserItem[]>(ADMIN_USERS_KEY, INITIAL_USERS);
  const idx = users.findIndex((u) => u.id === userId);
  if (idx !== -1) {
    const oldRole = users[idx].role;
    users[idx].role = newRole;
    setStored(ADMIN_USERS_KEY, users);
    await recordAuditLog({
      adminEmail: 'admin@zirnastem.org',
      adminName: 'Dr. C. Vanlalruata',
      action: 'USER_ROLE_CHANGED',
      targetResource: `User: ${users[idx].displayName} (${users[idx].email})`,
      details: `Changed role from ${oldRole} to ${newRole}. Reason: ${reason}`,
      ipAddress: '103.228.154.12',
      status: 'success',
    });
  }
};

export const deleteUserAccount = async (userId: string): Promise<void> => {
  const users = getStored<AdminUserItem[]>(ADMIN_USERS_KEY, INITIAL_USERS);
  const target = users.find((u) => u.id === userId);
  const filtered = users.filter((u) => u.id !== userId);
  setStored(ADMIN_USERS_KEY, filtered);

  if (target) {
    await recordAuditLog({
      adminEmail: 'admin@zirnastem.org',
      adminName: 'Dr. C. Vanlalruata',
      action: 'USER_DELETED_PERMANENTLY',
      targetResource: `User: ${target.displayName} (${target.email})`,
      details: 'Account and associated learning identifiers scrubbed per administrator order.',
      ipAddress: '103.228.154.12',
      status: 'flagged',
    });
  }
};

export const getModules = async (): Promise<AdminModuleConfig[]> => {
  return getStored<AdminModuleConfig[]>(ADMIN_MODULES_KEY, INITIAL_MODULES);
};

export const updateModuleConfig = async (
  moduleId: string,
  updates: Partial<AdminModuleConfig>
): Promise<void> => {
  const modules = getStored<AdminModuleConfig[]>(ADMIN_MODULES_KEY, INITIAL_MODULES);
  const idx = modules.findIndex((m) => m.id === moduleId);
  if (idx !== -1) {
    modules[idx] = { ...modules[idx], ...updates };
    setStored(ADMIN_MODULES_KEY, modules);
    await recordAuditLog({
      adminEmail: 'admin@zirnastem.org',
      adminName: 'Dr. C. Vanlalruata',
      action: 'MODULE_CONFIG_UPDATED',
      targetResource: `Module: ${modules[idx].title} (${moduleId})`,
      details: `Admin modified module properties: ${Object.keys(updates).join(', ')}`,
      ipAddress: '103.228.154.12',
      status: 'success',
    });
  }
};

export const getClassrooms = async (): Promise<AdminClassroomItem[]> => {
  return getStored<AdminClassroomItem[]>(ADMIN_CLASSROOMS_KEY, INITIAL_CLASSROOMS);
};

export const updateClassroomStatus = async (
  classroomId: string,
  status: 'active' | 'archived' | 'flagged'
): Promise<void> => {
  const classrooms = getStored<AdminClassroomItem[]>(ADMIN_CLASSROOMS_KEY, INITIAL_CLASSROOMS);
  const idx = classrooms.findIndex((c) => c.id === classroomId);
  if (idx !== -1) {
    classrooms[idx].status = status;
    setStored(ADMIN_CLASSROOMS_KEY, classrooms);
    await recordAuditLog({
      adminEmail: 'admin@zirnastem.org',
      adminName: 'Dr. C. Vanlalruata',
      action: 'CLASSROOM_STATUS_UPDATED',
      targetResource: `Classroom: ${classrooms[idx].name} (${classroomId})`,
      details: `Status set to ${status}`,
      ipAddress: '103.228.154.12',
      status: status === 'flagged' ? 'flagged' : 'success',
    });
  }
};

export const getLiveSessions = async (): Promise<AdminLiveSession[]> => {
  return getStored<AdminLiveSession[]>(ADMIN_SESSIONS_KEY, INITIAL_SESSIONS);
};

export const terminateLiveSession = async (
  sessionId: string,
  reason: string
): Promise<void> => {
  const sessions = getStored<AdminLiveSession[]>(ADMIN_SESSIONS_KEY, INITIAL_SESSIONS);
  const idx = sessions.findIndex((s) => s.id === sessionId);
  if (idx !== -1) {
    sessions[idx].status = 'terminated';
    setStored(ADMIN_SESSIONS_KEY, sessions);
    await recordAuditLog({
      adminEmail: 'admin@zirnastem.org',
      adminName: 'Dr. C. Vanlalruata',
      action: 'SESSION_TERMINATED_BY_ADMIN',
      targetResource: `Session: ${sessions[idx].code} - ${sessions[idx].title}`,
      details: `Administrator emergency termination. Reason: ${reason}`,
      ipAddress: '103.228.154.12',
      status: 'flagged',
    });
  }
};

export const getPathways = async (): Promise<AdminCoursePathway[]> => {
  return getStored<AdminCoursePathway[]>(ADMIN_PATHWAYS_KEY, INITIAL_PATHWAYS);
};

export const updatePathway = async (
  pathwayId: string,
  updates: Partial<AdminCoursePathway>
): Promise<void> => {
  const pathways = getStored<AdminCoursePathway[]>(ADMIN_PATHWAYS_KEY, INITIAL_PATHWAYS);
  const idx = pathways.findIndex((p) => p.id === pathwayId);
  if (idx !== -1) {
    pathways[idx] = { ...pathways[idx], ...updates };
    setStored(ADMIN_PATHWAYS_KEY, pathways);
    await recordAuditLog({
      adminEmail: 'admin@zirnastem.org',
      adminName: 'Dr. C. Vanlalruata',
      action: 'PATHWAY_CONFIG_UPDATED',
      targetResource: `Pathway: ${pathways[idx].title}`,
      details: `Updated pathway: ${Object.keys(updates).join(', ')}`,
      ipAddress: '103.228.154.12',
      status: 'success',
    });
  }
};

export const getPrivacyRequests = async (): Promise<AdminPrivacyRequest[]> => {
  return getStored<AdminPrivacyRequest[]>(ADMIN_PRIVACY_KEY, INITIAL_PRIVACY_REQUESTS);
};

export const updatePrivacyRequestStatus = async (
  requestId: string,
  status: PrivacyRequestStatus,
  adminNotes?: string
): Promise<void> => {
  const requests = getStored<AdminPrivacyRequest[]>(ADMIN_PRIVACY_KEY, INITIAL_PRIVACY_REQUESTS);
  const idx = requests.findIndex((r) => r.id === requestId);
  if (idx !== -1) {
    requests[idx].status = status;
    if (adminNotes) requests[idx].adminNotes = adminNotes;
    setStored(ADMIN_PRIVACY_KEY, requests);
    await recordAuditLog({
      adminEmail: 'admin@zirnastem.org',
      adminName: 'Dr. C. Vanlalruata',
      action: `PRIVACY_REQUEST_${status.toUpperCase()}`,
      targetResource: `Request: ${requestId} (${requests[idx].userEmail})`,
      details: adminNotes || `Administrator updated status to ${status}`,
      ipAddress: '103.228.154.12',
      status: 'success',
    });
  }
};

export const getAuditLogs = async (): Promise<AdminAuditLog[]> => {
  return getStored<AdminAuditLog[]>(ADMIN_AUDIT_KEY, INITIAL_AUDIT_LOGS);
};

export const recordAuditLog = async (
  entry: Omit<AdminAuditLog, 'id' | 'timestamp'>
): Promise<void> => {
  const logs = getStored<AdminAuditLog[]>(ADMIN_AUDIT_KEY, INITIAL_AUDIT_LOGS);
  const newLog: AdminAuditLog = {
    ...entry,
    id: `aud-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  logs.unshift(newLog);
  setStored(ADMIN_AUDIT_KEY, logs.slice(0, 100)); // Keep latest 100 entries
};

export const getPlatformSettings = async (): Promise<PlatformSettings> => {
  return getStored<PlatformSettings>(ADMIN_SETTINGS_KEY, INITIAL_SETTINGS);
};

export const updatePlatformSettings = async (
  settings: Partial<PlatformSettings>
): Promise<PlatformSettings> => {
  const current = getStored<PlatformSettings>(ADMIN_SETTINGS_KEY, INITIAL_SETTINGS);
  const updated = { ...current, ...settings };
  setStored(ADMIN_SETTINGS_KEY, updated);
  await recordAuditLog({
    adminEmail: 'admin@zirnastem.org',
    adminName: 'Dr. C. Vanlalruata',
    action: 'PLATFORM_SETTINGS_UPDATED',
    targetResource: 'GLOBAL_CONFIG',
    details: `Updated platform settings: ${Object.keys(settings).join(', ')}`,
    ipAddress: '103.228.154.12',
    status: 'success',
  });
  return updated;
};
