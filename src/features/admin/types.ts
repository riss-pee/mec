import { UserRole } from '../auth/types';

export type AdminDashboardTab =
  | 'overview'
  | 'users'
  | 'teacher-applications'
  | 'modules'
  | 'classrooms'
  | 'sessions'
  | 'pathways'
  | 'analytics'
  | 'content'
  | 'privacy'
  | 'audit'
  | 'settings';

export interface PlatformOverviewStats {
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  registeredClassrooms: number;
  activeClassroomSessions: number;
  totalCompletedChallenges: number;
  topModules: Array<{
    id: string;
    title: string;
    count: number;
    category: string;
  }>;
  weeklyActivity: Array<{
    day: string;
    challenges: number;
    activeUsers: number;
  }>;
}

export type UserAccountStatus = 'active' | 'suspended';

export interface AdminUserItem {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  status: UserAccountStatus;
  schoolName?: string;
  grade?: string;
  points: number;
  streakDays: number;
  createdAt: string;
  lastActiveAt: string;
}

export interface AdminModuleConfig {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  category: string;
  grade: string;
  isActive: boolean;
  isFeatured: boolean;
  totalRuns: number;
  completionRate: number;
  description: string;
}

export interface AdminClassroomItem {
  id: string;
  name: string;
  grade: string;
  schoolName: string;
  teacherName: string;
  teacherEmail: string;
  studentCount: number;
  activeSessionCode?: string;
  status: 'active' | 'archived' | 'flagged';
  createdAt: string;
}

export interface AdminLiveSession {
  id: string;
  code: string;
  title: string;
  moduleId: string;
  moduleTitle: string;
  hostName: string;
  hostEmail: string;
  classroomName: string;
  participantsCount: number;
  status: 'lobby' | 'active' | 'completed' | 'terminated';
  startedAt: string;
  durationMinutes: number;
}

export interface AdminCoursePathway {
  id: string;
  title: string;
  tagline: string;
  moduleIds: string[];
  displayOrder: number;
  isFeatured: boolean;
  color: string;
}

export type PrivacyRequestType =
  | 'data-deletion'
  | 'data-export'
  | 'rectification'
  | 'parental-revocation';

export type PrivacyRequestStatus =
  | 'pending'
  | 'reviewing'
  | 'completed'
  | 'rejected';

export interface AdminPrivacyRequest {
  id: string;
  type: PrivacyRequestType;
  userEmail: string;
  requesterName: string;
  studentIdentifier?: string;
  status: PrivacyRequestStatus;
  submittedAt: string;
  legalDeadline: string;
  details: string;
  adminNotes?: string;
}

export interface AdminAuditLog {
  id: string;
  timestamp: string;
  adminEmail: string;
  adminName: string;
  action: string;
  targetResource: string;
  details: string;
  ipAddress: string;
  status: 'success' | 'flagged' | 'denied';
}

export interface PlatformSettings {
  maintenanceMode: boolean;
  publicRegistrationOpen: boolean;
  guestAccessEnabled: boolean;
  defaultSessionTimeoutMinutes: number;
  strictChildPrivacy: boolean;
  systemNoticeText: string;
  systemNoticeActive: boolean;
  organizationName: string;
  supportEmail: string;
  version: string;
}
