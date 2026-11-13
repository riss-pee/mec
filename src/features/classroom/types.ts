export type TeamId = 'alpha' | 'beta' | 'gamma' | 'delta';

export interface TeamInfo {
  id: TeamId;
  name: string;
  color: string;
  score: number;
  accuracy: number;
  completedChallenges: number;
  membersCount: number;
}

export interface SessionParticipant {
  id: string;
  displayName: string;
  avatar: string;
  teamId: TeamId;
  isReady: boolean;
  individualScore: number;
  answersSubmitted: number;
  accuracyPct: number;
  joinedAt: string;
}

export type SessionGameMode = 'collaborative' | 'team-battle' | 'teacher-demo';
export type SessionDifficulty = 'standard' | 'advanced' | 'olympiad';
export type SessionStatus = 'lobby' | 'active' | 'completed';

export interface ClassroomSession {
  id: string;
  code: string;
  title: string;
  hostId: string;
  hostName: string;
  moduleId: string;
  moduleName: string;
  mode: SessionGameMode;
  difficulty: SessionDifficulty;
  status: SessionStatus;
  durationMinutes: number;
  participants: SessionParticipant[];
  teams: Record<TeamId, TeamInfo>;
  createdAt: string;
  challengeGoalTarget: number;
  challengeGoalProgress: number;
}

export interface ClassroomInfo {
  id: string;
  name: string;
  grade: string;
  schoolName: string;
  studentCount: number;
  activeSessionCode?: string;
}
