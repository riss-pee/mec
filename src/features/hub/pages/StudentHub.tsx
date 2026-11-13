import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Flame,
  Sparkles,
  Trophy,
  Play,
  ArrowRight,
  School,
  Clock,
  CheckCircle2,
  BookOpen,
  Compass,
  Award,
  Zap,
  Target,
  Users,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Check,
  Star,
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { MODULES_REGISTRY, ModuleInfo } from '../../../data/modulesRegistry';
import { getActiveSession } from '../../classroom/services/classroomService';
import { getAvatarById } from '../../../data/avatarLibrary';
import { toast } from 'sonner';

interface StudentHubProps {
  onSelectModule: (id: string) => void;
  onNavigateClassroom: () => void;
  onNavigateAchievements?: () => void;
  onOpenStoragePreferences: () => void;
}

export const StudentHub: React.FC<StudentHubProps> = ({
  onSelectModule,
  onNavigateClassroom,
  onNavigateAchievements,
  onOpenStoragePreferences,
}) => {
  const { user, setIsProfileModalOpen } = useAuth();
  const [dailyCompleted, setDailyCompleted] = useState(false);
  const activeSession = getActiveSession();
  const avatarObj = getAvatarById(user?.avatarId);

  const studentName = user?.displayName || 'Learner';
  const firstName = studentName.split(' ')[0];

  const handleToggleDailyChallenge = () => {
    setDailyCompleted(!dailyCompleted);
    if (!dailyCompleted) {
      toast.success('Daily STEM challenge completed! +50 Mastery XP earned 🎉');
    }
  };

  return (
    <div className="space-y-10 py-6 sm:py-8 font-sans">
      {/* ============================================================
          1. PERSONALIZED WELCOME & HERO STATUS BANNER
          ============================================================ */}
      <section className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b-2 border-black/10">
          <div className="flex items-start sm:items-center gap-4">
            {/* Clickable Avatar Card */}
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#FFD166] border-3 border-black shadow-[3px_3px_0px_#000] flex items-center justify-center text-3xl sm:text-4xl cursor-pointer hover:scale-105 active:scale-95 transition-transform shrink-0"
              title="Click to personalize your pixel avatar"
            >
              <span>{user?.avatar || '🦉'}</span>
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white border border-black shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              </span>
            </button>

            <div>
              <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                <span className="font-mono text-xs font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                  STUDENT PASSPORT
                </span>
                <span className="font-mono text-xs text-slate-500 font-bold">
                  @{user?.username || 'alex.class06'}
                </span>
                {user?.schoolName && (
                  <span className="font-mono text-xs text-slate-500 hidden sm:inline">
                    • {user.schoolName}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight leading-tight uppercase">
                Hey, {firstName}! 👋
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1 max-w-xl">
                Ready for another day of interactive discovery? Your classroom squad and fraction puzzles are waiting.
              </p>
            </div>
          </div>

          {/* Quick Streak & Level Pill */}
          <div className="flex items-center gap-3 font-mono shrink-0">
            <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] text-center min-w-[90px]">
              <div className="text-xl font-black text-amber-600 flex items-center justify-center gap-1">
                <Flame className="w-5 h-5 fill-amber-500 text-amber-500" />
                <span>{user?.streakDays || 5}</span>
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Day Streak</div>
            </div>

            <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] text-center min-w-[90px]">
              <div className="text-xl font-black text-purple-700">
                {user?.points || 1240}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Mastery XP</div>
            </div>
          </div>
        </div>

        {/* Motivational Quick Tip Bar */}
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono text-slate-600">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#06D6A0] inline-block" />
            <span>
              <strong>Today's Discovery Tip:</strong> When simplifying fractions, look for the greatest common divisor!
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProfileModalOpen(true)}
              className="text-[11px] font-bold text-purple-700 hover:text-purple-900 underline cursor-pointer"
            >
              Customize Avatar
            </button>
            <span>•</span>
            <button
              onClick={onNavigateClassroom}
              className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
            >
              Classroom Battle
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          2. LIVE CLASSROOM BATTLE ALERT (IF ACTIVE)
          ============================================================ */}
      {activeSession && (
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 sm:p-6 bg-gradient-to-r from-[#FFD166] to-[#06D6A0] border-3 border-black brutal-shadow rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 font-mono"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white border-2 border-black flex items-center justify-center text-2xl shadow-[2px_2px_0px_#000] shrink-0 animate-bounce">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 animate-ping" />
                <span className="text-[10px] font-black uppercase text-black bg-white px-2 py-0.5 rounded border border-black">
                  LIVE CLASSROOM BATTLE ACTIVE
                </span>
                <span className="text-xs font-black text-black">Room: {activeSession.code}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-black font-sans uppercase">
                {activeSession.title}
              </h3>
              <p className="text-xs text-slate-800">
                Squad challenge in progress: <strong>Team Alpha</strong> vs <strong>Team Beta</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateClassroom}
            className="retro-btn px-6 py-3 bg-black hover:bg-slate-900 text-white font-mono font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#fff] cursor-pointer flex items-center gap-2 transition-all whitespace-nowrap"
          >
            <span>Join Live Battle</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.section>
      )}

      {/* ============================================================
          3. LEARNING OVERVIEW STATS (4 TACTILE CARDS)
          ============================================================ */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
        <div className="p-4 bg-white border-3 border-black rounded-xl brutal-shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase">Learning Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-black text-black">{user?.streakDays || 5} Days</div>
          <div className="text-[10px] text-emerald-700 font-bold mt-1">Non-punitive habit</div>
        </div>

        <div className="p-4 bg-white border-3 border-black rounded-xl brutal-shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase">Challenges Solved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-black">14 Puzzles</div>
          <div className="text-[10px] text-purple-700 font-bold mt-1">87% accuracy rate</div>
        </div>

        <div className="p-4 bg-white border-3 border-black rounded-xl brutal-shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase">Labs Explored</span>
            <Compass className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="text-2xl font-black text-black">5 of 7</div>
          <div className="text-[10px] text-slate-600 font-bold mt-1">Math & Optics</div>
        </div>

        <div className="p-4 bg-white border-3 border-black rounded-xl brutal-shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-bold uppercase">Badges Unlocked</span>
            <Trophy className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-black text-black">4 of 8</div>
          <div className="text-[10px] text-amber-700 font-bold mt-1">Next: Geometry Ace</div>
        </div>
      </section>

      {/* ============================================================
          4. CONTINUE YOUR LEARNING (ACTIVE MODULES)
          ============================================================ */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-black font-sans uppercase tracking-tight">
              Continue Your Learning
            </h2>
            <p className="text-xs text-slate-600 font-mono mt-0.5">
              Pick up where you left off with your interactive STEM workshops.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 font-mono">
          {/* Card 1: Fraction Zirna Playground */}
          <div className="p-5 bg-[#FFFDF5] border-3 border-black rounded-2xl brutal-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 rounded-lg bg-[#FFD166] border-2 border-black flex items-center justify-center text-lg shadow-[1px_1px_0px_#000]">
                  🍕
                </span>
                <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                  75% MASTERED
                </span>
              </div>
              <h3 className="font-sans font-black text-lg text-black uppercase mb-1">
                Fraction Zirna Playground
              </h3>
              <p className="text-xs text-slate-600 mb-4 font-sans leading-relaxed">
                Last activity: Slicing 4 equivalent pieces from 1 whole unit for pizza party challenges.
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-black/10">
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-black/30">
                <div className="bg-[#FFD166] h-full w-3/4 border-r border-black" />
              </div>

              <button
                onClick={() => onSelectModule('fraction-zirna')}
                className="w-full py-2.5 px-3 bg-[#FFD166] hover:bg-[#ffc947] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Continue Lab</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Ray Tracing Optics Lab */}
          <div className="p-5 bg-[#FFFDF5] border-3 border-black rounded-2xl brutal-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 rounded-lg bg-[#38BDF8] border-2 border-black flex items-center justify-center text-lg shadow-[1px_1px_0px_#000]">
                  🔬
                </span>
                <span className="text-[10px] font-black uppercase text-cyan-800 bg-cyan-100 border border-cyan-300 px-2 py-0.5 rounded">
                  40% MASTERED
                </span>
              </div>
              <h3 className="font-sans font-black text-lg text-black uppercase mb-1">
                Ray Tracing Optics Lab
              </h3>
              <p className="text-xs text-slate-600 mb-4 font-sans leading-relaxed">
                Last activity: Convex lens focal length calculation and photon path prediction.
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-black/10">
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-black/30">
                <div className="bg-[#38BDF8] h-full w-2/5 border-r border-black" />
              </div>

              <button
                onClick={() => onSelectModule('optics-lab')}
                className="w-full py-2.5 px-3 bg-[#38BDF8] hover:bg-[#2bb0eb] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Resume Physics</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 3: Soroban Mental Math */}
          <div className="p-5 bg-[#FFFDF5] border-3 border-black rounded-2xl brutal-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 rounded-lg bg-[#06D6A0] border-2 border-black flex items-center justify-center text-lg shadow-[1px_1px_0px_#000]">
                  🧮
                </span>
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                  60% MASTERED
                </span>
              </div>
              <h3 className="font-sans font-black text-lg text-black uppercase mb-1">
                Soroban Mental Math
              </h3>
              <p className="text-xs text-slate-600 mb-4 font-sans leading-relaxed">
                Last activity: Rapid bead addition and tens complement calculations in Soroban frame.
              </p>
            </div>

            <div className="space-y-3 pt-3 border-t border-black/10">
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden border border-black/30">
                <div className="bg-[#06D6A0] h-full w-3/5 border-r border-black" />
              </div>

              <button
                onClick={() => onSelectModule('abacus-math')}
                className="w-full py-2.5 px-3 bg-[#06D6A0] hover:bg-[#05b88a] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center justify-center gap-1.5 transition-all"
              >
                <span>Practice Speed</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          5. DAILY STEM CHALLENGE (NON-PUNITIVE ENGAGEMENT)
          ============================================================ */}
      <section className="bg-white border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8 font-mono">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFD166]" />
              <span className="text-xs font-black uppercase text-amber-800 bg-amber-100 border border-amber-300 px-2 py-0.5 rounded">
                TODAY'S STEM MISSION • GRADE 6
              </span>
              <span className="text-xs text-slate-500 font-bold">• Non-punitive exploration</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-black font-sans uppercase">
              The Equal Slices Conundrum
            </h3>
            <p className="text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
              Find 3 equivalent fractions that equal <strong>2/4</strong> using the interactive pizza cutter in the Fraction Zirna Playground.
            </p>

            <div className="flex items-center gap-3 text-xs pt-2">
              <span className="flex items-center gap-1 text-purple-700 font-bold">
                <Star className="w-3.5 h-3.5 fill-purple-600 text-purple-600" />
                <span>+50 Mastery XP</span>
              </span>
              <span>•</span>
              <span className="text-slate-500">Difficulty: Standard</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => onSelectModule('fraction-zirna')}
              className="py-3 px-6 bg-[#FFD166] hover:bg-[#ffc947] text-black font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black shadow-[3px_3px_0px_#000] cursor-pointer flex items-center justify-center gap-2 transition-all"
            >
              <Play className="w-4 h-4 fill-black text-black" />
              <span>Start Challenge</span>
            </button>

            <button
              onClick={handleToggleDailyChallenge}
              className={`py-2 px-4 rounded-xl border-2 border-black text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                dailyCompleted
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-500'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
              }`}
            >
              {dailyCompleted ? <Check className="w-3.5 h-3.5 text-emerald-700 stroke-[3]" /> : null}
              <span>{dailyCompleted ? 'Mission Solved Today!' : 'Mark as Practiced'}</span>
            </button>
          </div>
        </div>
      </section>

      {/* ============================================================
          6. MY CLASSROOM & SQUAD ACTIVITY
          ============================================================ */}
      <section className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8 font-mono">
        <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-6">
          <div>
            <h2 className="text-xl font-black text-black font-sans uppercase tracking-tight flex items-center gap-2">
              <School className="w-5 h-5 text-emerald-700" />
              <span>My Classroom & Squad Roster</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Class 6-A • Miss Lalrintluangi • Govt. Mizo High School
            </p>
          </div>

          <button
            onClick={onNavigateClassroom}
            className="text-xs font-black text-emerald-800 hover:text-emerald-950 underline cursor-pointer flex items-center gap-1"
          >
            <span>Classroom Arena</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Squad Roster */}
          <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] space-y-3">
            <div className="flex items-center justify-between border-b border-black/10 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#FFD166] border border-black" />
                <strong className="text-sm text-black uppercase">Team Alpha (Squad #1)</strong>
              </div>
              <span className="text-xs font-black text-purple-700">850 Pts</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-center gap-2">
                  <span className="text-base">{user?.avatar || '🦉'}</span>
                  <div>
                    <strong className="text-black">{user?.displayName} (You)</strong>
                    <div className="text-[10px] text-slate-500">Lead Fraction Slicer</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-200 px-1.5 py-0.5 rounded">Active</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-base">🔬</span>
                  <div>
                    <strong className="text-black">Lalthanpuia Sailo</strong>
                    <div className="text-[10px] text-slate-500">@puia.class06</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-slate-500">Teammate</span>
              </div>
            </div>
          </div>

          {/* Active Assignment */}
          <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-purple-800 mb-2">
                <Target className="w-3.5 h-3.5" />
                <span>ACTIVE CLASSROOM HOMEWORK</span>
              </div>
              <h4 className="font-sans font-black text-base text-black uppercase mb-1">
                Symmetry Reflection Across Y-Axis
              </h4>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Assigned by Miss Lalrintluangi for Class 6-A. Solve Stage 2 reflection patterns before Friday.
              </p>
            </div>

            <div className="pt-3 border-t border-black/10 flex items-center justify-between text-xs">
              <span className="text-slate-500 text-[11px] font-bold">Due in 2 days</span>
              <button
                onClick={() => onSelectModule('symmetry-match')}
                className="py-1.5 px-3 bg-[#06D6A0] hover:bg-[#05b88a] text-black font-black text-[11px] uppercase rounded-lg border border-black shadow-[1px_1px_0px_#000] cursor-pointer"
              >
                Launch Assignment
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          7. MY LEARNING PATHWAYS (SCHOOL MATH, PHYSICS, MENTAL ARITHMETIC)
          ============================================================ */}
      <section className="space-y-4 font-mono">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-black font-sans uppercase tracking-tight">
            Curriculum Learning Pathways
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Syllabus-aligned progression pathways matching Mizoram Board standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Pathway 1: School Mathematics */}
          <div className="p-5 bg-white border-3 border-black rounded-2xl brutal-shadow flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-amber-800 bg-[#FFD166]/40 border border-amber-300 px-2 py-0.5 rounded inline-block">
                PATHWAY 01 • GRADE 6-7
              </div>
              <h3 className="font-sans font-black text-lg text-black uppercase">
                School Mathematics
              </h3>
              <p className="text-xs text-slate-600 font-sans">
                Master visual fraction slicing, coordinate vectors, and number line navigation.
              </p>

              <div className="pt-2 space-y-1.5 text-xs text-slate-700">
                <button
                  onClick={() => onSelectModule('fraction-zirna')}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-[#FFD166]/30 border border-black/10 flex items-center justify-between cursor-pointer"
                >
                  <span>1. Fraction Zirna Playground</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button
                  onClick={() => onSelectModule('fraction-grid')}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-[#FFD166]/30 border border-black/10 flex items-center justify-between cursor-pointer"
                >
                  <span>2. Fraction Grid Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button
                  onClick={() => onSelectModule('number-line-cruiser')}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-[#FFD166]/30 border border-black/10 flex items-center justify-between cursor-pointer"
                >
                  <span>3. Number Line Cruiser</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Pathway 2: Physics & Ray Tracing */}
          <div className="p-5 bg-white border-3 border-black rounded-2xl brutal-shadow flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-cyan-800 bg-[#38BDF8]/40 border border-cyan-300 px-2 py-0.5 rounded inline-block">
                PATHWAY 02 • GRADE 7-8
              </div>
              <h3 className="font-sans font-black text-lg text-black uppercase">
                Physics & Ray Optics
              </h3>
              <p className="text-xs text-slate-600 font-sans">
                Simulate light reflection, concave/convex refraction, and bilateral geometric symmetry.
              </p>

              <div className="pt-2 space-y-1.5 text-xs text-slate-700">
                <button
                  onClick={() => onSelectModule('optics-lab')}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-[#38BDF8]/30 border border-black/10 flex items-center justify-between cursor-pointer"
                >
                  <span>1. Ray Tracing Optics Lab</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button
                  onClick={() => onSelectModule('symmetry-match')}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-[#38BDF8]/30 border border-black/10 flex items-center justify-between cursor-pointer"
                >
                  <span>2. Symmetry Mirror Match</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>
          </div>

          {/* Pathway 3: Mental Math & Geometry */}
          <div className="p-5 bg-white border-3 border-black rounded-2xl brutal-shadow flex flex-col justify-between">
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase text-emerald-800 bg-[#06D6A0]/40 border border-emerald-300 px-2 py-0.5 rounded inline-block">
                PATHWAY 03 • SPEED & DEFENSE
              </div>
              <h3 className="font-sans font-black text-lg text-black uppercase">
                Speed Math & Coordinates
              </h3>
              <p className="text-xs text-slate-600 font-sans">
                Tactile Soroban abacus mental calculations and coordinate cannon geometry defense.
              </p>

              <div className="pt-2 space-y-1.5 text-xs text-slate-700">
                <button
                  onClick={() => onSelectModule('abacus-math')}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-[#06D6A0]/30 border border-black/10 flex items-center justify-between cursor-pointer"
                >
                  <span>1. Soroban Mental Math</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
                <button
                  onClick={() => onSelectModule('coordinate-defense')}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-[#06D6A0]/30 border border-black/10 flex items-center justify-between cursor-pointer"
                >
                  <span>2. Coordinate Cannon Defense</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          8. ACHIEVEMENTS & MILESTONE BADGES
          ============================================================ */}
      <section className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8 font-mono">
        <div className="flex items-center justify-between pb-4 border-b border-black/10 mb-6">
          <div>
            <h2 className="text-xl font-black text-black font-sans uppercase tracking-tight flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-700" />
              <span>Earned Achievements & STEM Badges</span>
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Meaningful milestones unlocked through actual puzzle problem solving.
            </p>
          </div>
          <span className="text-xs font-black text-purple-700 bg-purple-100 border border-purple-300 px-2.5 py-1 rounded">
            4 / 8 Unlocked
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
            <div className="text-2xl mb-1">🍕</div>
            <strong className="block text-black text-xs">First Slicer</strong>
            <span className="text-[10px] text-emerald-600 font-bold">Unlocked ✓</span>
          </div>

          <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
            <div className="text-2xl mb-1">🧮</div>
            <strong className="block text-black text-xs">Soroban Pro</strong>
            <span className="text-[10px] text-emerald-600 font-bold">Unlocked ✓</span>
          </div>

          <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
            <div className="text-2xl mb-1">🔬</div>
            <strong className="block text-black text-xs">Photon Reflector</strong>
            <span className="text-[10px] text-emerald-600 font-bold">Unlocked ✓</span>
          </div>

          <div className="p-3 bg-white border-2 border-black rounded-xl shadow-[2px_2px_0px_#000]">
            <div className="text-2xl mb-1">📐</div>
            <strong className="block text-black text-xs">Symmetry Ace</strong>
            <span className="text-[10px] text-emerald-600 font-bold">Unlocked ✓</span>
          </div>

          <div className="p-3 bg-slate-50 border-2 border-dashed border-black/30 rounded-xl opacity-80">
            <div className="text-2xl mb-1">🔥</div>
            <strong className="block text-black text-xs">7-Day Habit</strong>
            <span className="text-[10px] text-amber-600 font-bold">5 / 7 Days</span>
          </div>

          <div className="p-3 bg-slate-50 border-2 border-dashed border-black/30 rounded-xl opacity-80">
            <div className="text-2xl mb-1">🎯</div>
            <strong className="block text-black text-xs">Cannon Sniper</strong>
            <span className="text-[10px] text-slate-500 font-bold">Locked</span>
          </div>
        </div>
      </section>
    </div>
  );
};
