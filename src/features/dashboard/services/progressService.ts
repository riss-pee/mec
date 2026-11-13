import { Achievement, ActivityItem, CoursePathway, DayStreakStatus, StudentAnalytics } from '../types';
import { MODULES_REGISTRY } from '../../../data/modulesRegistry';

const LOCAL_ACHIEVEMENTS_KEY = 'zirna_user_achievements_v1';
const LOCAL_ACTIVITY_LOG_KEY = 'zirna_user_activity_log_v1';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first interactive STEM challenge.',
    icon: '🌱',
    badgeColor: '#06D6A0',
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
    unlockedAt: '2026-10-10T11:00:00Z',
    category: 'starter',
  },
  {
    id: 'fraction-master',
    title: 'Fraction Master',
    description: 'Solve 5 visual fraction slice puzzles with perfect cuts.',
    icon: '🍕',
    badgeColor: '#FFD166',
    progress: 4,
    maxProgress: 5,
    isUnlocked: false,
    category: 'fractions',
  },
  {
    id: 'geometry-explorer',
    title: 'Geometry Explorer',
    description: 'Complete 5 coordinate reflection symmetry puzzles.',
    icon: '💎',
    badgeColor: '#C4B5FD',
    progress: 5,
    maxProgress: 5,
    isUnlocked: true,
    unlockedAt: '2026-10-12T14:30:00Z',
    category: 'geometry',
  },
  {
    id: 'physics-investigator',
    title: 'Physics Investigator',
    description: 'Predict and verify 5 focal ray-tracing optics experiments.',
    icon: '🔬',
    badgeColor: '#38BDF8',
    progress: 3,
    maxProgress: 5,
    isUnlocked: false,
    category: 'physics',
  },
  {
    id: 'mental-math-champion',
    title: 'Mental Math Champion',
    description: 'Count 5 bead configurations on the Soroban Japanese Abacus.',
    icon: '🧮',
    badgeColor: '#FB923C',
    progress: 5,
    maxProgress: 5,
    isUnlocked: true,
    unlockedAt: '2026-10-14T09:15:00Z',
    category: 'arithmetic',
  },
  {
    id: 'seven-day-streak',
    title: 'Seven-Day Streak',
    description: 'Complete at least one learning activity on 7 consecutive days.',
    icon: '🔥',
    badgeColor: '#F87171',
    progress: 5,
    maxProgress: 7,
    isUnlocked: false,
    category: 'streaks',
  },
  {
    id: 'team-player',
    title: 'Team Player',
    description: 'Participate in a live classroom collaborative session.',
    icon: '🤝',
    badgeColor: '#06D6A0',
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
    unlockedAt: '2026-11-01T10:00:00Z',
    category: 'collaborative',
  },
  {
    id: 'classroom-champion',
    title: 'Classroom Champion',
    description: 'Help your team achieve victory in a classroom team battle.',
    icon: '🏆',
    badgeColor: '#FFD166',
    progress: 1,
    maxProgress: 1,
    isUnlocked: true,
    unlockedAt: '2026-11-02T11:45:00Z',
    category: 'collaborative',
  },
];

export const INITIAL_ACTIVITY_LOG: ActivityItem[] = [
  {
    id: 'act-01',
    moduleId: 'fraction-zirna',
    moduleTitle: 'Fraction Zirna Playground',
    activityName: 'Equal Pizza Slice Division (3/4 & 6/8)',
    score: 95,
    maxScore: 100,
    pointsEarned: 150,
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    category: 'fractions',
  },
  {
    id: 'act-02',
    moduleId: 'symmetry-match',
    moduleTitle: 'Symmetry Mirror Match',
    activityName: 'Level 12 Vertical Coordinate Reflection',
    score: 100,
    maxScore: 100,
    pointsEarned: 200,
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    category: 'geometry',
  },
  {
    id: 'act-03',
    moduleId: 'abacus-math',
    moduleTitle: 'Interactive Abacus Studio',
    activityName: 'Speed Place Value Counting: Thousands Rod',
    score: 90,
    maxScore: 100,
    pointsEarned: 120,
    timestamp: new Date(Date.now() - 3600000 * 48).toISOString(),
    category: 'arithmetic',
  },
  {
    id: 'act-04',
    moduleId: 'optics-lab',
    moduleTitle: 'Ray Tracing Optics Lab',
    activityName: 'Biconvex Lens Focal Distance Prediction',
    score: 100,
    maxScore: 100,
    pointsEarned: 180,
    timestamp: new Date(Date.now() - 3600000 * 72).toISOString(),
    category: 'physics',
  },
  {
    id: 'act-05',
    moduleId: 'coordinate-defense',
    moduleTitle: 'Coordinate Cannon Defense',
    activityName: 'Quadrant II Artillery Trajectory Mission',
    score: 85,
    maxScore: 100,
    pointsEarned: 140,
    timestamp: new Date(Date.now() - 3600000 * 120).toISOString(),
    category: 'classroom',
  },
];

export const COURSE_PATHWAYS: CoursePathway[] = [
  {
    id: 'school-math',
    title: 'School Mathematics Pathway',
    tagline: 'Visual fractions, spatial grids, and coordinate symmetry reflection',
    color: '#FFD166',
    moduleIds: ['fraction-zirna', 'fraction-grid', 'symmetry-match'],
    totalModules: 3,
    completedCount: 2,
  },
  {
    id: 'physics-optics',
    title: 'Physics & Optics Pathway',
    tagline: 'Refraction ray tracing, curved mirrors, and Cartesian defense vectors',
    color: '#38BDF8',
    moduleIds: ['optics-lab', 'coordinate-defense'],
    totalModules: 2,
    completedCount: 1,
  },
  {
    id: 'mental-arithmetic',
    title: 'Mental Arithmetic & Number Sense',
    tagline: 'Tactile Soroban beads, integer number lines, and Olympiad speed counting',
    color: '#06D6A0',
    moduleIds: ['abacus-math', 'number-line-cruiser'],
    totalModules: 2,
    completedCount: 2,
  },
];

export const getAchievements = (): Achievement[] => {
  try {
    const raw = localStorage.getItem(LOCAL_ACHIEVEMENTS_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_ACHIEVEMENTS_KEY, JSON.stringify(INITIAL_ACHIEVEMENTS));
      return INITIAL_ACHIEVEMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACHIEVEMENTS;
  }
};

export const getActivityLog = (): ActivityItem[] => {
  try {
    const raw = localStorage.getItem(LOCAL_ACTIVITY_LOG_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_ACTIVITY_LOG_KEY, JSON.stringify(INITIAL_ACTIVITY_LOG));
      return INITIAL_ACTIVITY_LOG;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_ACTIVITY_LOG;
  }
};

export const recordCompletedActivity = (item: Omit<ActivityItem, 'id' | 'timestamp'>): ActivityItem => {
  const fullItem: ActivityItem = {
    ...item,
    id: `act_${Date.now()}`,
    timestamp: new Date().toISOString(),
  };

  const logs = getActivityLog();
  logs.unshift(fullItem);
  try {
    localStorage.setItem(LOCAL_ACTIVITY_LOG_KEY, JSON.stringify(logs.slice(0, 50)));
  } catch {
    // Ignore storage issues
  }
  return fullItem;
};

export const getPast7DaysStreak = (): DayStreakStatus[] => {
  const days: DayStreakStatus[] = [];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dayName = dayNames[d.getDay()];
    const dateStr = d.toISOString().split('T')[0];
    
    // Simulate active days: past 5 days have activity, today has activity
    const hasActivity = i <= 4;
    days.push({
      dayName,
      dateStr,
      hasActivity,
      challengesCount: hasActivity ? Math.floor(2 + (i % 3)) : 0,
      isToday: i === 0,
    });
  }

  return days;
};

export const getStudentAnalytics = (): StudentAnalytics => {
  return {
    subjectAccuracy: {
      fractions: 92,
      geometry: 88,
      arithmetic: 95,
      physics: 84,
    },
    weeklyMinutes: [25, 30, 45, 20, 50, 60, 35],
    totalChallengesCompleted: 38,
    totalPoints: 1240,
  };
};
