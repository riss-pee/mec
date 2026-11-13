import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  School, 
  Play, 
  Plus, 
  Copy, 
  Check, 
  Flame, 
  Award, 
  BarChart3, 
  Trophy, 
  Clock, 
  Sparkles, 
  Settings, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  FileDown
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { 
  getActiveSession, 
  createLiveSession, 
  updateSessionStatus, 
  INITIAL_CLASSROOMS, 
  subscribeToClassroomEvents 
} from '../../classroom/services/classroomService';
import { ClassroomSession, SessionGameMode, SessionDifficulty } from '../../classroom/types';
import { MODULES_REGISTRY } from '../../../data/modulesRegistry';
import { TeacherStudentsTab } from './teacher/TeacherStudentsTab';
import { TeacherTeamsTab } from './teacher/TeacherTeamsTab';
import { toast } from 'sonner';

interface TeacherDashboardProps {
  onSelectModule: (moduleId: string) => void;
  onNavigateClassroom: () => void;
  onBackToHub: () => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  onSelectModule,
  onNavigateClassroom,
  onBackToHub,
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'sessions' | 'students' | 'teams' | 'classrooms' | 'reports'>('sessions');
  const [session, setSession] = useState<ClassroomSession | null>(getActiveSession());
  const [copiedCode, setCopiedCode] = useState(false);

  // New Session Form State
  const [sessionTitle, setSessionTitle] = useState('Fraction Challenge — Class 6');
  const [selectedModuleId, setSelectedModuleId] = useState('fraction-zirna');
  const [selectedMode, setSelectedMode] = useState<SessionGameMode>('team-battle');
  const [selectedDifficulty, setSelectedDifficulty] = useState<SessionDifficulty>('standard');
  const [durationMinutes, setDurationMinutes] = useState(15);

  useEffect(() => {
    const unsubscribe = subscribeToClassroomEvents((updated) => {
      setSession(updated);
    });
    return unsubscribe;
  }, []);

  const handleCopyCode = () => {
    if (session?.code) {
      navigator.clipboard.writeText(session.code);
      setCopiedCode(true);
      toast.success(`Copied join code: ${session.code}`);
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  const handleCreateSession = (e: React.FormEvent) => {
    e.preventDefault();
    const mod = MODULES_REGISTRY.find((m) => m.id === selectedModuleId);
    const newSession = createLiveSession({
      title: sessionTitle,
      moduleId: selectedModuleId,
      moduleName: mod?.title || 'STEM Lab',
      hostId: user?.id || 'teacher-01',
      hostName: user?.displayName || 'Educator',
      mode: selectedMode,
      difficulty: selectedDifficulty,
      durationMinutes,
    });
    setSession(newSession);
    toast.success(`Live session created! Join Code: ${newSession.code}`);
  };

  const handleStartSession = () => {
    if (!session) return;
    const updated = updateSessionStatus('active');
    setSession(updated);
    toast.success('Live challenge started across all connected student devices!');
    onSelectModule(session.moduleId);
  };

  const handleEndSession = () => {
    if (!session) return;
    const updated = updateSessionStatus('completed');
    setSession(updated);
    toast.info('Session ended. Results tallied for all teams.');
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-900 font-sans pb-28">
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
            <span className="text-xs font-mono font-bold text-black bg-[#C4B5FD] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
              TEACHER COMMAND CENTER
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateClassroom}
              className="retro-btn px-3 py-1 rounded-md bg-[#FFD166] hover:bg-[#ffc63a] border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Open Classroom Arena</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* ============================================================
            1. TEACHER WELCOME BANNER
            ============================================================ */}
        <div className="bg-white border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 retro-paper-grid opacity-50 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border-3 border-black bg-[#C4B5FD] flex items-center justify-center text-4xl sm:text-5xl brutal-shadow-sm shrink-0">
                {user?.avatar || '🦉'}
              </div>

              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-[#EDE9FE] border border-black text-[11px] font-mono font-bold text-purple-950 mb-2 shadow-[1px_1px_0px_#000]">
                  <span>Mizoram State Educator</span>
                  {user?.schoolName && <span>• {user.schoolName}</span>}
                </div>

                <h1 className="text-2xl sm:text-4xl font-black text-black font-sans uppercase tracking-tight">
                  Welcome, {user?.displayName || 'Educator'}!
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 font-medium font-sans mt-1">
                  Manage interactive STEM lessons, organize collaborative team challenges, and track class mastery.
                </p>
              </div>
            </div>

            {/* Teacher Overview Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:w-auto font-mono">
              <div className="p-3 bg-[#FFFDF5] border-2 border-black rounded-xl brutal-shadow-xs text-center">
                <div className="text-base sm:text-lg font-black text-black">76</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Students</div>
              </div>

              <div className="p-3 bg-[#FFFDF5] border-2 border-black rounded-xl brutal-shadow-xs text-center">
                <div className="text-base sm:text-lg font-black text-black">3</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Classes</div>
              </div>

              <div className="p-3 bg-[#FFFDF5] border-2 border-black rounded-xl brutal-shadow-xs text-center">
                <div className="text-base sm:text-lg font-black text-emerald-600">91%</div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Avg Accuracy</div>
              </div>

              <div className="p-3 bg-[#FFFDF5] border-2 border-black rounded-xl brutal-shadow-xs text-center">
                <div className="text-base sm:text-lg font-black text-purple-600">
                  {session?.participants.length || 5} Live
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-500 mt-0.5">Active Roster</div>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================================
            2. TEACHER NAVIGATION TABS
            ============================================================ */}
        <div className="flex items-center gap-2 border-b-2 border-black pb-2 font-mono text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`px-4 py-2 rounded-t-lg border-2 border-b-0 border-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'sessions'
                ? 'bg-[#FFD166] text-black shadow-[2px_-2px_0px_#000] -translate-y-1'
                : 'bg-white text-slate-600 hover:text-black'
            }`}
          >
            Live Classroom Sessions
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-4 py-2 rounded-t-lg border-2 border-b-0 border-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-[#06D6A0] text-black shadow-[2px_-2px_0px_#000] -translate-y-1'
                : 'bg-white text-slate-600 hover:text-black'
            }`}
          >
            My Students (Zero Email)
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`px-4 py-2 rounded-t-lg border-2 border-b-0 border-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'teams'
                ? 'bg-[#C4B5FD] text-black shadow-[2px_-2px_0px_#000] -translate-y-1'
                : 'bg-white text-slate-600 hover:text-black'
            }`}
          >
            Manage Teams
          </button>
          <button
            onClick={() => setActiveTab('classrooms')}
            className={`px-4 py-2 rounded-t-lg border-2 border-b-0 border-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'classrooms'
                ? 'bg-[#FFD166] text-black shadow-[2px_-2px_0px_#000] -translate-y-1'
                : 'bg-white text-slate-600 hover:text-black'
            }`}
          >
            My Classrooms (3)
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-t-lg border-2 border-b-0 border-black transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'reports'
                ? 'bg-[#38BDF8] text-black shadow-[2px_-2px_0px_#000] -translate-y-1'
                : 'bg-white text-slate-600 hover:text-black'
            }`}
          >
            Learning Reports & Outcomes
          </button>
        </div>

        {/* ============================================================
            TAB 1: LIVE CLASSROOM SESSIONS & CONTROL PANEL
            ============================================================ */}
        {activeTab === 'sessions' && (
          <div className="space-y-8">
            {/* Live Active Session Box (Kahoot style join banner) */}
            {session && (
              <div className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b-2 border-black/10">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-mono text-xs font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                        STATUS: {session.status.toUpperCase()}
                      </span>
                      <span className="font-mono text-xs text-slate-500">
                        {session.mode === 'team-battle' ? 'Team Battle' : 'Collaborative Quest'}
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-black text-black font-sans uppercase">
                      {session.title}
                    </h2>
                    <p className="text-xs text-slate-600 font-mono mt-0.5">
                      Target Module: <strong>{session.moduleName}</strong> • Difficulty: <strong>{session.difficulty}</strong>
                    </p>
                  </div>

                  {/* Gigantic Projector-Friendly Join Code */}
                  <div className="p-4 bg-white border-3 border-black rounded-xl brutal-shadow-sm flex items-center gap-4">
                    <div>
                      <div className="text-[10px] font-mono uppercase font-bold text-slate-500">
                        STUDENT JOIN CODE
                      </div>
                      <div className="font-mono font-black text-3xl sm:text-4xl tracking-widest text-black">
                        {session.code}
                      </div>
                    </div>
                    <button
                      onClick={handleCopyCode}
                      className="retro-btn p-2.5 rounded-lg border-2 border-black bg-[#FFD166] text-black shadow-[2px_2px_0px_#000] cursor-pointer"
                      title="Copy join code"
                    >
                      {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Live Connected Students Roster */}
                <div className="pt-6">
                  <div className="flex items-center justify-between mb-4 font-mono text-xs">
                    <span className="font-bold text-slate-700 uppercase">
                      Connected Students ({session.participants.length}):
                    </span>
                    <span className="text-slate-500">
                      Students join at zirnastem.org with code {session.code}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 font-mono text-xs">
                    {session.participants.map((p) => {
                      const team = session.teams[p.teamId];
                      return (
                        <div
                          key={p.id}
                          className="p-3 bg-white border-2 border-black rounded-lg brutal-shadow-xs flex items-center gap-2.5"
                        >
                          <span className="text-xl">{p.avatar}</span>
                          <div className="min-w-0">
                            <div className="font-bold text-black truncate text-xs">{p.displayName}</div>
                            <div 
                              className="text-[10px] font-black truncate"
                              style={{ color: team?.color || '#000' }}
                            >
                              {team?.name || p.teamId}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Teacher Action Controls */}
                  <div className="mt-8 pt-6 border-t-2 border-black/10 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      {session.status === 'lobby' ? (
                        <button
                          onClick={handleStartSession}
                          className="retro-btn px-6 py-3 rounded-lg bg-[#06D6A0] hover:bg-[#05b888] border-2 border-black font-mono font-black text-sm text-black shadow-[3px_3px_0px_#000] flex items-center gap-2 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-black" />
                          <span>Start Classroom Challenge Now</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => onSelectModule(session.moduleId)}
                          className="retro-btn px-6 py-3 rounded-lg bg-[#FFD166] hover:bg-[#ffc63a] border-2 border-black font-mono font-black text-sm text-black shadow-[3px_3px_0px_#000] flex items-center gap-2 cursor-pointer"
                        >
                          <Play className="w-4 h-4 fill-black" />
                          <span>View Live Game Stage</span>
                        </button>
                      )}

                      <button
                        onClick={handleEndSession}
                        className="retro-btn px-4 py-3 rounded-lg bg-white hover:bg-rose-50 border-2 border-black font-mono font-bold text-sm text-rose-700 shadow-[3px_3px_0px_#000] cursor-pointer"
                      >
                        End Session & Review
                      </button>
                    </div>

                    <div className="text-xs font-mono text-slate-500">
                      Auto-synchronizes scores at 60 FPS
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Create New Live Session Form */}
            <div className="bg-white border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8">
              <h3 className="text-xl font-black text-black font-sans uppercase tracking-tight mb-1">
                Configure New Classroom Session
              </h3>
              <p className="text-xs text-slate-600 font-mono mb-6">
                Set up a new STEM session, select difficulty, and broadcast to student devices.
              </p>

              <form onSubmit={handleCreateSession} className="space-y-6 font-mono text-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Session Title</label>
                    <input
                      type="text"
                      required
                      value={sessionTitle}
                      onChange={(e) => setSessionTitle(e.target.value)}
                      placeholder="e.g. Optics Ray Tracing — Period 3"
                      className="w-full px-3 py-2.5 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] font-mono text-xs"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Target STEM Module</label>
                    <select
                      value={selectedModuleId}
                      onChange={(e) => setSelectedModuleId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFD166] font-mono text-xs cursor-pointer"
                    >
                      {MODULES_REGISTRY.map((m) => (
                        <option key={m.id} value={m.id}>
                          [{m.number}] {m.title} ({m.grade})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Gameplay Mode</label>
                    <div className="space-y-2">
                      {[
                        { id: 'team-battle', name: 'Team Battle (4 Teams)', desc: 'Alpha, Beta, Gamma, Delta compete on accuracy & teamwork.' },
                        { id: 'collaborative', name: 'Whole Class Collaborative', desc: 'All students pool answers to reach a target class score.' },
                        { id: 'teacher-demo', name: 'Teacher Interactive Demo', desc: 'Projector presentation with live student predictions.' },
                      ].map((item) => (
                        <label
                          key={item.id}
                          className={`p-2.5 rounded-lg border-2 border-black flex items-start gap-2.5 cursor-pointer transition-all ${
                            selectedMode === item.id ? 'bg-[#FFD166] shadow-[2px_2px_0px_#000]' : 'bg-white hover:bg-[#FFFDF5]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="session-mode"
                            checked={selectedMode === item.id}
                            onChange={() => setSelectedMode(item.id as SessionGameMode)}
                            className="mt-0.5"
                          />
                          <div>
                            <div className="font-bold text-black">{item.name}</div>
                            <div className="text-[10px] text-slate-600 mt-0.5">{item.desc}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Difficulty Tier</label>
                    <div className="space-y-2">
                      {[
                        { id: 'standard', name: 'Standard Syllabus (MBSE / NCERT)' },
                        { id: 'advanced', name: 'Advanced Mastery' },
                        { id: 'olympiad', name: 'STEM Olympiad Speed Challenge' },
                      ].map((diff) => (
                        <label
                          key={diff.id}
                          className={`p-2.5 rounded-lg border-2 border-black flex items-center gap-2.5 cursor-pointer transition-all ${
                            selectedDifficulty === diff.id ? 'bg-[#06D6A0] shadow-[2px_2px_0px_#000]' : 'bg-white hover:bg-[#FFFDF5]'
                          }`}
                        >
                          <input
                            type="radio"
                            name="session-difficulty"
                            checked={selectedDifficulty === diff.id}
                            onChange={() => setSelectedDifficulty(diff.id as SessionDifficulty)}
                          />
                          <span className="font-bold text-black">{diff.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1.5">Duration</label>
                    <div className="p-4 bg-white border-2 border-black rounded-lg space-y-3">
                      <div className="flex items-center justify-between font-bold">
                        <span>Timer:</span>
                        <span className="bg-black text-white px-2 py-0.5 rounded">{durationMinutes} Minutes</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={45}
                        step={5}
                        value={durationMinutes}
                        onChange={(e) => setDurationMinutes(Number(e.target.value))}
                        className="w-full cursor-pointer"
                      />
                      <div className="text-[10px] text-slate-500 leading-relaxed">
                        Recommended: 15 minutes for class warmups; 30 minutes for deep lab investigations.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-black/10 flex justify-end">
                  <button
                    type="submit"
                    className="retro-btn px-6 py-3 bg-[#FFD166] hover:bg-[#ffc63a] text-black border-2 border-black rounded-lg font-black text-xs shadow-[3px_3px_0px_#000] flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                    <span>Generate New Live Session Code</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 2: MY STUDENTS (ZERO EMAIL)
            ============================================================ */}
        {activeTab === 'students' && <TeacherStudentsTab />}

        {/* ============================================================
            TAB 3: MANAGE TEAMS & SQUADS
            ============================================================ */}
        {activeTab === 'teams' && <TeacherTeamsTab />}

        {/* ============================================================
            TAB 4: MY CLASSROOMS
            ============================================================ */}
        {activeTab === 'classrooms' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono">
              {INITIAL_CLASSROOMS.map((cls) => (
                <div
                  key={cls.id}
                  className="bg-white border-3 border-black brutal-shadow rounded-2xl p-6 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black bg-[#FFD166] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
                        {cls.grade}
                      </span>
                      <span className="text-xs text-slate-500 font-bold">
                        {cls.studentCount} Students
                      </span>
                    </div>

                    <h3 className="text-lg font-black text-black font-sans mb-1">
                      {cls.name}
                    </h3>
                    <p className="text-xs text-slate-600 mb-4">{cls.schoolName}</p>

                    {cls.activeSessionCode ? (
                      <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center justify-between">
                        <span>Active Session:</span>
                        <span className="bg-emerald-600 text-white px-2 py-0.5 rounded">
                          {cls.activeSessionCode}
                        </span>
                      </div>
                    ) : (
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-xs">
                        No active session currently running
                      </div>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t border-black/10 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setActiveTab('sessions');
                        toast.info(`Configuring session for ${cls.name}`);
                      }}
                      className="retro-btn flex-1 py-2 bg-[#06D6A0] text-black border-2 border-black rounded-lg font-bold text-xs shadow-[2px_2px_0px_#000] cursor-pointer text-center"
                    >
                      Start Session
                    </button>
                    <button
                      onClick={() => toast.info('Roster view exported to clipboard')}
                      className="p-2 bg-white border-2 border-black rounded-lg hover:bg-slate-100 cursor-pointer"
                      title="Export Roster"
                    >
                      <FileDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================================
            TAB 3: REPORTS & LEARNING OUTCOMES
            ============================================================ */}
        {activeTab === 'reports' && (
          <div className="bg-white border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8 space-y-6">
            <div>
              <h3 className="text-xl font-black text-black font-sans uppercase tracking-tight">
                Classroom Learning Outcomes & Diagnostic Summary
              </h3>
              <p className="text-xs text-slate-600 font-mono mt-0.5">
                Aggregated performance metrics from recent classroom sessions.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="p-5 rounded-xl border-2 border-black bg-[#FFFDF5] space-y-4">
                <div className="font-black text-sm uppercase text-black border-b border-black/10 pb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <span>Strongest Concept Areas</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Symmetry Reflections across Y-Axis:</span>
                    <strong className="text-emerald-700">96% Mastery</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Soroban Tens & Hundreds Addition:</span>
                    <strong className="text-emerald-700">94% Mastery</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Equivalent Fraction Pizza Slicing:</span>
                    <strong className="text-emerald-700">91% Mastery</strong>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-xl border-2 border-black bg-rose-50 border-rose-300 text-rose-950 space-y-4">
                <div className="font-black text-sm uppercase text-rose-900 border-b border-rose-200 pb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                  <span>Concepts Needing Reinforcement</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Negative Coordinate Quadrant III Vectors:</span>
                    <strong className="text-rose-700">71% Accuracy</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Concave Lens Diverging Ray Projections:</span>
                    <strong className="text-rose-700">68% Accuracy</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Decimal to Percentage Fraction Conversion:</span>
                    <strong className="text-rose-700">74% Accuracy</strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">
                Summary generated according to Mizoram Board of School Education (MBSE) Grade 6-8 Math Syllabus
              </span>
              <button
                onClick={() => toast.success('Downloaded Class Summary PDF report')}
                className="retro-btn px-4 py-2 bg-[#FFD166] text-black border-2 border-black rounded-lg font-bold shadow-[2px_2px_0px_#000] flex items-center gap-2 cursor-pointer"
              >
                <FileDown className="w-4 h-4" />
                <span>Export Official Class Report</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
