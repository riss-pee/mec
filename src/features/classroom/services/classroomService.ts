import { ClassroomSession, SessionParticipant, TeamId, ClassroomInfo } from '../types';

const STORAGE_ACTIVE_SESSION_KEY = 'zirna_active_classroom_session_v1';
const BROADCAST_CHANNEL_NAME = 'zirna_classroom_sync_channel';

// Cross-tab / cross-window real-time event bus
let broadcastChannel: BroadcastChannel | null = null;
try {
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  }
} catch {
  // Ignore
}

export const subscribeToClassroomEvents = (onUpdate: (session: ClassroomSession) => void) => {
  if (!broadcastChannel) return () => {};
  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'SESSION_UPDATE' && event.data.session) {
      onUpdate(event.data.session);
    }
  };
  broadcastChannel.addEventListener('message', handler);
  return () => {
    broadcastChannel?.removeEventListener('message', handler);
  };
};

export const broadcastSessionUpdate = (session: ClassroomSession) => {
  try {
    localStorage.setItem(STORAGE_ACTIVE_SESSION_KEY, JSON.stringify(session));
    broadcastChannel?.postMessage({ type: 'SESSION_UPDATE', session });
  } catch {
    // Ignore storage errors
  }
};

export const generateSessionCode = (): string => {
  const digits = Math.floor(1000 + Math.random() * 9000);
  return `ZIRNA-${digits}`;
};

export const INITIAL_CLASSROOMS: ClassroomInfo[] = [
  {
    id: 'cls-6b',
    name: 'Class 6B Mathematics',
    grade: 'Class 6',
    schoolName: 'Govt. Mizo High School, Aizawl',
    studentCount: 32,
    activeSessionCode: 'ZIRNA-4821',
  },
  {
    id: 'cls-8a',
    name: 'Class 8A Science & Optics',
    grade: 'Class 8',
    schoolName: 'Govt. Mizo High School, Aizawl',
    studentCount: 28,
  },
  {
    id: 'cls-olympiad',
    name: 'Mizoram STEM Olympiad Squad',
    grade: 'Classes 7-9',
    schoolName: 'State Resource Center',
    studentCount: 16,
  },
];

const DEFAULT_TEAMS = {
  alpha: { id: 'alpha' as TeamId, name: 'Team Alpha', color: '#F87171', score: 420, accuracy: 94, completedChallenges: 4, membersCount: 1 },
  beta: { id: 'beta' as TeamId, name: 'Team Beta', color: '#38BDF8', score: 380, accuracy: 89, completedChallenges: 3, membersCount: 1 },
  gamma: { id: 'gamma' as TeamId, name: 'Team Gamma', color: '#06D6A0', score: 460, accuracy: 96, completedChallenges: 5, membersCount: 1 },
  delta: { id: 'delta' as TeamId, name: 'Team Delta', color: '#FFD166', score: 350, accuracy: 85, completedChallenges: 3, membersCount: 1 },
};

export const createLiveSession = (params: {
  title: string;
  moduleId: string;
  moduleName: string;
  hostId: string;
  hostName: string;
  mode: 'collaborative' | 'team-battle' | 'teacher-demo';
  difficulty: 'standard' | 'advanced' | 'olympiad';
  durationMinutes: number;
}): ClassroomSession => {
  const code = generateSessionCode();
  const session: ClassroomSession = {
    id: `sess_${Date.now()}`,
    code,
    title: params.title,
    hostId: params.hostId,
    hostName: params.hostName,
    moduleId: params.moduleId,
    moduleName: params.moduleName,
    mode: params.mode,
    difficulty: params.difficulty,
    status: 'lobby',
    durationMinutes: params.durationMinutes,
    challengeGoalTarget: 20,
    challengeGoalProgress: 4,
    teams: JSON.parse(JSON.stringify(DEFAULT_TEAMS)),
    participants: [
      {
        id: params.hostId,
        displayName: `${params.hostName} (Host)`,
        avatar: '🦉',
        teamId: 'alpha',
        isReady: true,
        individualScore: 0,
        answersSubmitted: 0,
        accuracyPct: 100,
        joinedAt: new Date().toISOString(),
      },
      {
        id: 'p-01',
        displayName: 'Alex Zomawia',
        avatar: '🚀',
        teamId: 'alpha',
        isReady: true,
        individualScore: 210,
        answersSubmitted: 3,
        accuracyPct: 100,
        joinedAt: new Date().toISOString(),
      },
      {
        id: 'p-02',
        displayName: 'Lalrinchhana',
        avatar: '🦊',
        teamId: 'beta',
        isReady: true,
        individualScore: 180,
        answersSubmitted: 3,
        accuracyPct: 92,
        joinedAt: new Date().toISOString(),
      },
      {
        id: 'p-03',
        displayName: 'Vanlalruati',
        avatar: '🌟',
        teamId: 'gamma',
        isReady: true,
        individualScore: 230,
        answersSubmitted: 4,
        accuracyPct: 98,
        joinedAt: new Date().toISOString(),
      },
      {
        id: 'p-04',
        displayName: 'David Malsawma',
        avatar: '📐',
        teamId: 'delta',
        isReady: true,
        individualScore: 160,
        answersSubmitted: 3,
        accuracyPct: 88,
        joinedAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  };

  broadcastSessionUpdate(session);
  return session;
};

export const getActiveSession = (): ClassroomSession | null => {
  try {
    const raw = localStorage.getItem(STORAGE_ACTIVE_SESSION_KEY);
    if (!raw) {
      // Create a default session (ZIRNA-4821) ready for exploration
      const sample = createLiveSession({
        title: 'Fraction Challenge — Class 6',
        moduleId: 'fraction-zirna',
        moduleName: 'Fraction Zirna Playground',
        hostId: 'teacher-demo-01',
        hostName: 'Miss Lalrintluangi',
        mode: 'team-battle',
        difficulty: 'standard',
        durationMinutes: 15,
      });
      sample.code = 'ZIRNA-4821';
      broadcastSessionUpdate(sample);
      return sample;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const joinSessionWithCode = (
  code: string,
  participant: Omit<SessionParticipant, 'id' | 'isReady' | 'individualScore' | 'answersSubmitted' | 'accuracyPct' | 'joinedAt'>
): ClassroomSession => {
  const normalized = code.trim().toUpperCase();
  const current = getActiveSession();

  if (!current) {
    throw new Error('No active classroom session found. Ask your teacher to create one!');
  }

  if (current.code.toUpperCase() !== normalized && normalized !== 'ZIRNA-4821') {
    throw new Error(`Session code "${code}" not found. Verify the code with your teacher.`);
  }

  const teamKeys: TeamId[] = ['alpha', 'beta', 'gamma', 'delta'];
  const assignedTeam = participant.teamId || teamKeys[Math.floor(Math.random() * teamKeys.length)];

  const newParticipant: SessionParticipant = {
    ...participant,
    id: `part_${Date.now()}`,
    teamId: assignedTeam,
    isReady: true,
    individualScore: 0,
    answersSubmitted: 0,
    accuracyPct: 100,
    joinedAt: new Date().toISOString(),
  };

  // Avoid duplicates
  const filtered = current.participants.filter(
    (p) => p.displayName.toLowerCase() !== participant.displayName.toLowerCase()
  );
  filtered.push(newParticipant);
  current.participants = filtered;

  // Update team count
  current.teams[assignedTeam].membersCount += 1;

  broadcastSessionUpdate(current);
  return current;
};

export const submitTeamAnswer = (
  teamId: TeamId,
  isCorrect: boolean,
  points: number,
  participantId?: string
): ClassroomSession => {
  const current = getActiveSession();
  if (!current) throw new Error('No active session');

  const team = current.teams[teamId];
  if (team) {
    if (isCorrect) {
      team.score += points;
      team.completedChallenges += 1;
      current.challengeGoalProgress += 1;
    }
    // Update accuracy
    const total = team.completedChallenges + (isCorrect ? 0 : 1);
    team.accuracy = Math.round((team.completedChallenges / Math.max(1, total)) * 100);
  }

  if (participantId) {
    const part = current.participants.find((p) => p.id === participantId);
    if (part) {
      if (isCorrect) part.individualScore += points;
      part.answersSubmitted += 1;
      part.accuracyPct = Math.round((part.individualScore / Math.max(1, part.answersSubmitted * points)) * 100);
    }
  }

  broadcastSessionUpdate(current);
  return current;
};

export const updateSessionStatus = (status: 'lobby' | 'active' | 'completed'): ClassroomSession => {
  const current = getActiveSession();
  if (!current) throw new Error('No active session');
  current.status = status;
  broadcastSessionUpdate(current);
  return current;
};
