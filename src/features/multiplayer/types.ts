import { TeamId } from '../classroom/types';

export interface CollaborativeChallengeState {
  sessionId: string;
  sessionCode: string;
  moduleId: string;
  teamId: TeamId;
  teamName: string;
  teamColor: string;
  teamScore: number;
  currentRound: number;
  totalRounds: number;
  collaborativeTarget: string;
  isCompleted: boolean;
}

export type ModulePlayMode = 'solo' | 'team-challenge';
