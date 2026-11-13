import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Flame, 
  Award, 
  Clock, 
  Sparkles, 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  Calendar, 
  BarChart3, 
  BookOpen, 
  Trophy, 
  Target,
  ArrowUpRight,
  TrendingUp,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { 
  getAchievements, 
  getActivityLog, 
  getPast7DaysStreak, 
  getStudentAnalytics, 
  COURSE_PATHWAYS 
} from '../services/progressService';
import { MODULES_REGISTRY } from '../../../data/modulesRegistry';
import { toast } from 'sonner';

interface StudentDashboardProps {
  onSelectModule: (moduleId: string) => void;
  onNavigateClassroom: () => void;
  onBackToHub: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  onSelectModule,
  onNavigateClassroom,
  onBackToHub,
}) => {
  const { user } = useAuth();
  const [activityFilter, setActivityFilter] = useState<'today' | 'week' | 'month' | 'all'>('week');

  const achievements = getAchievements();
  const activityLogs = getActivityLog();
  const streakDays = getPast7DaysStreak();
  const analytics = getStudentAnalytics();

  const unlockedCount = achievements.filter((a) => a.isUnlocked).length;

  const filteredLogs = activityLogs.filter((log) => {
    if (activityFilter === 'all') return true;
    const logDate = new Date(log.timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - logDate.getTime()) / (1000 * 3600);
    if (activityFilter === 'today') return diffHours <= 24;
    if (activityFilter === 'week') return diffHours <= 168;
    if (activityFilter === 'month') return diffHours <= 720;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-900 font-sans pb-24">
      {/* Top Header / Breadcrumb */}
      <div className="bg-[#FFFDF5] border-b-2 border-black px-4 sm:px-8 py-3 select-none">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToHub}
              className="text-xs font-mono font-bold text-slate-600 hover:text-black transition-colors cursor-pointer"
            >
              ← Back to Overview
            </button>
            <span className="text-slate-400 font-mono text-xs">•</span>
            <span className="text-xs font-mono font-bold text-black bg-[#FFD166] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
              STUDENT DASHBOARD
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateClassroom}
              className="retro-btn px-3 py-1 rounded-md bg-[#06D6A0] hover:bg-[#05b888] border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Classroom Arena</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* ============================================================
            1. WELCOME BANNER & LEARNER PASSPORT
            ============================================================ */}
        <div className="bg-white border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 retro-paper-grid opacity-50 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-3 border-black bg-[#FFD166] flex items-center justify-center text-4xl sm:text-5xl brutal-shadow-sm shrink-0">
                {user?.avatar || '🚀'}
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#FFF9E6] border border-black text-[11px] font-mono font-bold text-black mb-2 shadow-[1px_1px_0px_#000]">
                  <span>{user?.grade || 'Class 6 STEM'}</span>
                  {user?.schoolName && <span>• {user.schoolName}</span>}
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-black font-sans uppercase tracking-tight">
                  Welcome back, {user?.displayName || 'Learner'}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium font-sans mt-1">
                  Ready to continue your interactive STEM journey? You have an active {user?.streakDays || 5}-day learning streak!
                </p>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto font-mono">
              <div className="p-3 bg-[#FFFDF5] border-2 border-black rounded-xl brutal-shadow-xs text-center">
                <div className="flex items-center justify-center gap-1 text-amber-500 font-black text-base sm:text-lg">
                  <Flame className="w-4 h-4 fill-amber-500" />
                  <span>{user?.streakDays || 5}</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Day Streak</div>
              </div>

              <div className="p-3 bg-[#FFFDF5] border-2 border-black rounded-xl brutal-shadow-xs text-center">
                <div className="flex items-center justify-center gap-1 text-emerald-600 font-black text-base sm:text-lg">
                  <Trophy className="w-4 h-4" />
                  <span>{user?.points || 1240}</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Total XP</div>
              </div>

              <div className="p-3 bg-[#FFFDF5] border-2 border-black rounded-xl brutal-shadow-xs text-center">
                <div className="flex items-center justify-center gap-1 text-blue-600 font-black text-base sm:text-lg">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round((user?.totalLearningMinutes || 195) / 60)}h</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">STEM Time</div>
              </div>

              <div className="p-3 bg-[#FFFDF5] border-2 border-black rounded-xl brutal-shadow-xs text-center">
                <div className="flex items-center justify-center gap-1 text-purple-600 font-black text-base sm:text-lg">
                  <Award className="w-4 h-4" />
                  <span>{unlockedCount}/8</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Badges</div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            2. DAILY LEARNING STREAK & WEEKLY CALENDAR
            ============================================================ */}
        <section className="bg-white border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-slate-600 bg-[#FFD166] px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000] mb-2">
                <span>Non-Punitive Habit Building</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-black font-sans uppercase tracking-tight flex items-center gap-2">
                <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
                <span>Learning Streak: {user?.streakDays || 5} Consecutive Days</span>
              </h2>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                Streaks count when you solve at least one hands-on challenge. No penalties for offline breaks.
              </p>
            </div>

            <div className="font-mono text-xs font-bold text-right">
              <span className="text-slate-500">Longest Streak: </span>
              <span className="text-black bg-[#E0F2FE] px-2 py-1 rounded border border-black">
                {user?.longestStreak || 9} Days
              </span>
            </div>
          </div>

          {/* 7-Day Weekly Progress Strip */}
          <div className="grid grid-cols-7 gap-2 sm:gap-4 font-mono text-center">
            {streakDays.map((day, idx) => (
              <div
                key={idx}
                className={`p-3 sm:p-4 rounded-xl border-2 border-black transition-all ${
                  day.hasActivity
                    ? 'bg-[#06D6A0] text-black brutal-shadow-xs -translate-y-0.5'
                    : 'bg-[#F5F5F0] text-slate-400'
                } ${day.isToday ? 'ring-3 ring-black' : ''}`}
              >
                <div className="text-xs sm:text-sm font-black">{day.dayName}</div>
                <div className="my-2 flex items-center justify-center">
                  {day.hasActivity ? (
                    <div className="w-7 h-7 rounded-full bg-white border border-black flex items-center justify-center text-black">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-200 border border-slate-300" />
                  )}
                </div>
                <div className="text-[10px] font-bold">
                  {day.hasActivity ? `${day.challengesCount} labs` : 'Rest'}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            3. MY COURSES & LEARNING PATHWAYS
            ============================================================ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-black font-sans uppercase tracking-tight">
                My Courses & Learning Pathways
              </h2>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                Structured sequences connecting all seven interactive STEM workshops.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COURSE_PATHWAYS.map((pathway) => {
              const progressPct = Math.round((pathway.completedCount / pathway.totalModules) * 100);
              return (
                <div
                  key={pathway.id}
                  className="bg-white border-3 border-black brutal-shadow rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div 
                      className="inline-block px-2.5 py-1 rounded text-xs font-mono font-black border border-black shadow-[1px_1px_0px_#000] mb-3"
                      style={{ backgroundColor: pathway.color }}
                    >
                      {progressPct === 100 ? 'COMPLETED' : `${progressPct}% IN PROGRESS`}
                    </div>

                    <h3 className="text-lg font-black text-black font-sans leading-snug mb-1">
                      {pathway.title}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium font-sans mb-4 leading-relaxed">
                      {pathway.tagline}
                    </p>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-slate-100 border-2 border-black rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full transition-all duration-500"
                        style={{ width: `${progressPct}%`, backgroundColor: pathway.color }}
                      />
                    </div>

                    {/* Module Pill List */}
                    <div className="space-y-1.5 mb-6">
                      {pathway.moduleIds.map((modId) => {
                        const mod = MODULES_REGISTRY.find((m) => m.id === modId);
                        if (!mod) return null;
                        return (
                          <button
                            key={modId}
                            onClick={() => onSelectModule(modId)}
                            className="w-full flex items-center justify-between p-2 rounded-lg bg-[#FFFDF5] hover:bg-[#FFF9E6] border border-black text-left font-mono text-xs font-bold transition-colors cursor-pointer group"
                          >
                            <span className="truncate group-hover:underline">
                              [{mod.number}] {mod.title}
                            </span>
                            <ArrowRight className="w-3.5 h-3.5 text-black shrink-0 transition-transform group-hover:translate-x-1" />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => onSelectModule(pathway.moduleIds[0])}
                    className="retro-btn w-full py-2.5 rounded-lg border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 cursor-pointer"
                    style={{ backgroundColor: pathway.color }}
                  >
                    <span>Resume Pathway</span>
                    <Play className="w-3.5 h-3.5 fill-black" />
                  </button>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================
            4. ACHIEVEMENTS & BADGES SYSTEM
            ============================================================ */}
        <section className="bg-white border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase text-slate-600 bg-[#C4B5FD] px-2.5 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000] mb-2">
                <span>Meaningful Milestone Badges</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-black font-sans uppercase tracking-tight">
                Achievements Unlocked ({unlockedCount} / {achievements.length})
              </h2>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                Earn badges by completing challenges and collaborating in classroom battles.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border-2 border-black transition-all flex flex-col justify-between ${
                  ach.isUnlocked
                    ? 'bg-[#FFFDF5] brutal-shadow-xs'
                    : 'bg-slate-50 border-dashed opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl">{ach.icon}</span>
                    <span
                      className={`text-[10px] font-mono font-black px-2 py-0.5 rounded border border-black ${
                        ach.isUnlocked ? 'bg-[#06D6A0] text-black' : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {ach.isUnlocked ? 'UNLOCKED' : `${ach.progress}/${ach.maxProgress}`}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-black font-sans mb-1">{ach.title}</h4>
                  <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed">
                    {ach.description}
                  </p>
                </div>

                {ach.isUnlocked && ach.unlockedAt && (
                  <div className="text-[10px] font-mono text-slate-500 mt-3 pt-2 border-t border-black/10">
                    Earned: {new Date(ach.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ============================================================
            5. MY ACTIVITY FEED & LEARNING ANALYTICS
            ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Activity Feed (2 Cols) */}
          <div className="lg:col-span-2 bg-white border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-black text-black font-sans uppercase tracking-tight">
                  Recent Learning Activity
                </h3>
                <p className="text-xs text-slate-600 font-mono">
                  Chronological history of completed labs and challenges.
                </p>
              </div>

              {/* Time Filter Pills */}
              <div className="flex items-center gap-1 p-1 bg-[#F5F5F0] border-2 border-black rounded-lg text-xs font-mono font-bold">
                {(['today', 'week', 'month', 'all'] as const).map((filterKey) => (
                  <button
                    key={filterKey}
                    onClick={() => setActivityFilter(filterKey)}
                    className={`px-2.5 py-1 rounded transition-colors uppercase text-[10px] cursor-pointer ${
                      activityFilter === filterKey
                        ? 'bg-black text-white'
                        : 'text-slate-600 hover:text-black'
                    }`}
                  >
                    {filterKey}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3 font-mono">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs border-2 border-dashed border-slate-300 rounded-xl">
                  No activity recorded for this period yet. Complete a challenge to start your log!
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl border-2 border-black bg-[#FFFDF5] hover:bg-[#FFF9E6] transition-colors flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase bg-[#FFD166] px-1.5 py-0.2 rounded border border-black">
                          {log.moduleTitle}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="font-bold text-xs text-black truncate">
                        {log.activityName}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-black text-emerald-700">
                        +{log.pointsEarned} XP
                      </div>
                      <div className="text-[10px] text-slate-500">
                        Score: {log.score}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Learning Analytics (1 Col) */}
          <div className="bg-white border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black text-black font-sans uppercase tracking-tight mb-1">
                Learning Analytics
              </h3>
              <p className="text-xs text-slate-600 font-mono mb-6">
                Subject mastery & challenge accuracy breakdown.
              </p>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between mb-1 font-bold">
                    <span>Fractions & Parts</span>
                    <span>{analytics.subjectAccuracy.fractions}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 border border-black rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#FFD166]"
                      style={{ width: `${analytics.subjectAccuracy.fractions}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-bold">
                    <span>Geometry & Symmetry</span>
                    <span>{analytics.subjectAccuracy.geometry}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 border border-black rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C4B5FD]"
                      style={{ width: `${analytics.subjectAccuracy.geometry}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-bold">
                    <span>Mental Arithmetic</span>
                    <span>{analytics.subjectAccuracy.arithmetic}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 border border-black rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#06D6A0]"
                      style={{ width: `${analytics.subjectAccuracy.arithmetic}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1 font-bold">
                    <span>Physics & Ray Optics</span>
                    <span>{analytics.subjectAccuracy.physics}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 border border-black rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#38BDF8]"
                      style={{ width: `${analytics.subjectAccuracy.physics}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t-2 border-black/10 text-center">
              <button
                onClick={() => onSelectModule('fraction-zirna')}
                className="retro-btn w-full py-2.5 bg-[#FFD166] text-black border-2 border-black rounded-lg font-mono font-bold text-xs shadow-[2px_2px_0px_#000] cursor-pointer"
              >
                Start Practice Session →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
