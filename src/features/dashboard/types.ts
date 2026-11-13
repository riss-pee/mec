export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  badgeColor: string;
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  category: 'starter' | 'fractions' | 'geometry' | 'physics' | 'arithmetic' | 'streaks' | 'collaborative';
}

export interface ActivityItem {
  id: string;
  moduleId: string;
  moduleTitle: string;
  activityName: string;
  score: number;
  maxScore: number;
  pointsEarned: number;
  timestamp: string;
  category: 'fractions' | 'geometry' | 'arithmetic' | 'physics' | 'classroom';
}

export interface CoursePathway {
  id: string;
  title: string;
  tagline: string;
  color: string;
  moduleIds: string[];
  totalModules: number;
  completedCount: number;
}

export interface DayStreakStatus {
  dayName: string;
  dateStr: string;
  hasActivity: boolean;
  challengesCount: number;
  isToday: boolean;
}

export interface StudentAnalytics {
  subjectAccuracy: {
    fractions: number;
    geometry: number;
    arithmetic: number;
    physics: number;
  };
  weeklyMinutes: number[];
  totalChallengesCompleted: number;
  totalPoints: number;
}
