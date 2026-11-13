export type UserRole = 'student' | 'teacher' | 'admin';

export type UserStatus = 'active' | 'suspended' | 'pending_approval';

export interface UserProfile {
  id: string;
  email?: string;
  username?: string;
  displayName: string;
  nickname: string;
  role: UserRole;
  status?: UserStatus;
  avatar: string;
  avatarId?: string;
  schoolName?: string;
  grade?: string;
  rollNumber?: string;
  classroomId?: string;
  classroomName?: string;
  teacherId?: string;
  streakDays: number;
  longestStreak: number;
  points: number;
  totalLearningMinutes: number;
  createdAt: string;
  isGuest: boolean;
  isFirstLogin?: boolean;
  temporaryPin?: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface StudentLoginCredentials {
  username: string;
  pinOrPassword: string;
}

export interface TeacherApplicationRequest {
  fullName: string;
  email: string;
  password?: string;
  schoolName: string;
  designation: string;
  reason: string;
}

export interface TeacherApplication {
  id: string;
  fullName: string;
  email: string;
  schoolName: string;
  designation: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  adminNotes?: string;
}

export interface SignUpCredentials {
  displayName: string;
  email: string;
  password: string;
  role: UserRole;
  schoolName?: string;
  grade?: string;
}

export interface CreateStudentRequest {
  displayName: string;
  username: string;
  classroomId: string;
  classroomName: string;
  grade?: string;
  rollNumber?: string;
  avatar?: string;
  avatarId?: string;
}

export interface GeneratedStudentCredentials {
  studentId: string;
  displayName: string;
  username: string;
  temporaryPin: string;
  classroomId: string;
  classroomName: string;
  createdAt: string;
}

export interface ClassroomTeam {
  id: string;
  name: string;
  classroomId: string;
  color: string;
  studentIds: string[];
  score: number;
  accuracy: number;
}

export type AuthModalView =
  | 'sign-in'
  | 'sign-up'
  | 'student-login'
  | 'teacher-request'
  | 'forgot-password'
  | 'guest-picker';

export type AuthPageViewMode =
  | 'student-login'
  | 'teacher-login'
  | 'teacher-request'
  | 'guest';
