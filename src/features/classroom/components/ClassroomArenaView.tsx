import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  Users, 
  ArrowRight, 
  Play, 
  Sparkles, 
  ShieldCheck, 
  Copy, 
  Check, 
  Flame, 
  Share2, 
  Target, 
  RotateCcw,
  Zap,
  Award,
  Crown
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { 
  getActiveSession, 
  joinSessionWithCode, 
  updateSessionStatus, 
  subscribeToClassroomEvents 
} from '../services/classroomService';
import { ClassroomSession, TeamId } from '../types';
import { toast } from 'sonner';

interface ClassroomArenaViewProps {
  onSelectModule: (moduleId: string) => void;
  onNavigateTeacherDashboard: () => void;
  onBackToHub: () => void;
}

export const ClassroomArenaView: React.FC<ClassroomArenaViewProps> = ({
  onSelectModule,
  onNavigateTeacherDashboard,
  onBackToHub,
}) => {
  const { user } = useAuth();
  const [session, setSession] = useState<ClassroomSession | null>(getActiveSession());
  const [inputCode, setInputCode] = useState('ZIRNA-4821');
  const [nickname, setNickname] = useState(user?.displayName || '');
  const [selectedTeam, setSelectedTeam] = useState<TeamId>('alpha');
  const [isJoined, setIsJoined] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeToClassroomEvents((updated) => {
      setSession(updated);
    });
    return unsubscribe;
  }, []);

  const handleJoinSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      toast.error('Please enter a classroom session code.');
      return;
    }
    try {
      const updated = joinSessionWithCode(inputCode, {
        displayName: nickname.trim() || user?.displayName || 'Student',
        avatar: user?.avatar || '🚀',
        teamId: selectedTeam,
      });
      setSession(updated);
      setIsJoined(true);
      toast.success(`Joined Session: ${updated.title} on Team ${selectedTeam.toUpperCase()}!`);
    } catch (err: any) {
      toast.error(err.message || 'Unable to join session.');
    }
  };

  const handleLaunchChallenge = () => {
    if (!session) return;
    toast.success(`Launching Collaborative ${session.moduleName}!`);
    onSelectModule(session.moduleId);
  };

  const handleCopyCode = () => {
    if (session?.code) {
      navigator.clipboard.writeText(session.code);
      setCopiedCode(true);
      toast.success(`Copied code: ${session.code}`);
      setTimeout(() => setCopiedCode(false), 2000);
    }
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
            <span className="text-xs font-mono font-bold text-black bg-[#FFD166] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_#000]">
              CLASSROOM ARENA
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateTeacherDashboard}
              className="retro-btn px-3 py-1 rounded-md bg-[#C4B5FD] hover:bg-[#b8a4fc] border-2 border-black font-mono font-bold text-xs text-black shadow-[2px_2px_0px_#000] cursor-pointer"
            >
              Teacher Control Panel →
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-10">
        {/* ============================================================
            1. HERO ARENA BANNER
            ============================================================ */}
        <div className="bg-white border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute inset-0 retro-paper-grid opacity-50 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFD166] border-2 border-black text-black font-mono font-bold text-xs uppercase tracking-wider mb-3 shadow-[2px_2px_0px_#000]">
                <Trophy className="w-3.5 h-3.5 text-black" />
                <span>MULTI-DEVICE CLASSROOM MULTIPLAYER</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-black font-sans uppercase tracking-tight">
                Classroom STEM Arena & Team Battles
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 font-medium font-sans mt-1 max-w-2xl">
                Collaborate with classmates in real time. Solve fraction puzzles, guide ray-tracing beams, and battle in teams across Alpha, Beta, Gamma, and Delta!
              </p>
            </div>

            {/* Quick Session Join Form if not yet in a session */}
            {!isJoined && (
              <form
                onSubmit={handleJoinSession}
                className="w-full lg:w-96 p-4 bg-[#FFFDF5] border-3 border-black rounded-xl brutal-shadow-sm font-mono text-xs space-y-3"
              >
                <div className="font-black text-xs uppercase tracking-wider text-black">
                  Enter Classroom Session:
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    placeholder="e.g. ZIRNA-4821"
                    className="w-full px-3 py-2 bg-white border-2 border-black rounded-lg font-mono font-black text-base text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[#FFD166]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder="Nickname (e.g. Alex)"
                    className="w-full px-2.5 py-1.5 bg-white border-2 border-black rounded-md font-mono text-xs"
                  />
                  <select
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value as TeamId)}
                    className="w-full px-2 py-1.5 bg-white border-2 border-black rounded-md font-mono text-xs font-bold cursor-pointer"
                  >
                    <option value="alpha">Team Alpha 🔴</option>
                    <option value="beta">Team Beta 🔵</option>
                    <option value="gamma">Team Gamma 🟢</option>
                    <option value="delta">Team Delta 🟡</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="retro-btn w-full py-2 bg-[#06D6A0] hover:bg-[#05b888] text-black border-2 border-black rounded-lg font-bold text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Join Live Arena</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}

            {isJoined && session && (
              <div className="p-4 bg-white border-3 border-black rounded-xl brutal-shadow-sm flex items-center gap-4">
                <div>
                  <div className="text-[10px] font-mono uppercase font-bold text-slate-500">
                    YOUR CLASSROOM SESSION
                  </div>
                  <div className="font-mono font-black text-2xl tracking-wider text-black">
                    {session.code}
                  </div>
                  <div className="text-[11px] font-mono font-bold text-emerald-700">
                    Connected as: {nickname || user?.displayName || 'Player'}
                  </div>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="retro-btn p-2 rounded-lg border-2 border-black bg-[#FFD166] text-black shadow-[2px_2px_0px_#000] cursor-pointer"
                  title="Share session code"
                >
                  {copiedCode ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            2. THE 4 TEAM BATTLE CARDS (Alpha, Beta, Gamma, Delta)
            ============================================================ */}
        {session && (
          <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-black font-sans uppercase tracking-tight">
                  Live Team Battle Standings
                </h2>
                <p className="text-xs text-slate-600 font-mono mt-0.5">
                  Teams compete based on accuracy, challenge completion, and peer collaboration bonuses.
                </p>
              </div>

              {/* Collaborative Goal Progress */}
              <div className="p-3 bg-white border-2 border-black rounded-xl brutal-shadow-xs font-mono text-xs flex items-center gap-3">
                <Target className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <div className="flex justify-between gap-4 font-bold">
                    <span>Classroom Target:</span>
                    <span>{session.challengeGoalProgress} / {session.challengeGoalTarget} Labs</span>
                  </div>
                  <div className="w-48 h-2 bg-slate-100 border border-black rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full bg-[#06D6A0]"
                      style={{
                        width: `${Math.min(100, Math.round((session.challengeGoalProgress / session.challengeGoalTarget) * 100))}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 font-mono">
              {(Object.keys(session.teams) as TeamId[]).map((teamKey) => {
                const team = session.teams[teamKey];
                const members = session.participants.filter((p) => p.teamId === teamKey);
                return (
                  <div
                    key={teamKey}
                    className="bg-white border-3 border-black brutal-shadow rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      {/* Team Header */}
                      <div 
                        className="p-3 rounded-xl border-2 border-black mb-4 flex items-center justify-between shadow-[2px_2px_0px_#000]"
                        style={{ backgroundColor: team.color }}
                      >
                        <span className="font-black text-sm text-black uppercase">
                          {team.name}
                        </span>
                        <span className="text-xs font-black bg-black text-white px-2 py-0.5 rounded">
                          {team.score} PTS
                        </span>
                      </div>

                      <div className="space-y-2 text-xs mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Accuracy:</span>
                          <strong className="text-black">{team.accuracy}%</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Solved Labs:</span>
                          <strong className="text-black">{team.completedChallenges} Challenges</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Active Members:</span>
                          <strong className="text-black">{members.length} Players</strong>
                        </div>
                      </div>

                      {/* Member Avatars */}
                      <div className="pt-3 border-t border-black/10">
                        <div className="text-[10px] uppercase font-bold text-slate-500 mb-2">
                          Team Members:
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {members.map((m) => (
                            <span
                              key={m.id}
                              className="px-2 py-1 rounded bg-[#FFFDF5] border border-black text-xs font-bold shadow-[1px_1px_0px_#000] flex items-center gap-1"
                              title={`${m.displayName} (${m.individualScore} pts)`}
                            >
                              <span>{m.avatar}</span>
                              <span className="truncate max-w-[70px]">{m.displayName}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-3 border-t border-black/10">
                      <button
                        onClick={handleLaunchChallenge}
                        className="retro-btn w-full py-2 rounded-lg border-2 border-black font-bold text-xs text-black shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer"
                        style={{ backgroundColor: team.color }}
                      >
                        <Play className="w-3.5 h-3.5 fill-black" />
                        <span>Play for {team.name}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ============================================================
            3. LIVE ARENA STAGE (Active Collaborative Mission)
            ============================================================ */}
        {session && (
          <section className="bg-white border-3 border-black brutal-shadow rounded-2xl p-6 sm:p-8">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-6 border-b-2 border-black/10">
              <div>
                <span className="text-xs font-mono font-black uppercase text-black bg-[#FFD166] px-2.5 py-1 rounded border border-black shadow-[1px_1px_0px_#000]">
                  ACTIVE LAB STAGE
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-black font-sans uppercase mt-2">
                  {session.moduleName}: Team Challenge Mode
                </h3>
                <p className="text-xs text-slate-600 font-mono mt-1">
                  Students on all devices contribute answers. Results dynamically feed into classroom scoreboards.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleLaunchChallenge}
                  className="retro-btn px-6 py-3 rounded-lg bg-[#06D6A0] hover:bg-[#05b888] text-black border-2 border-black font-mono font-black text-sm shadow-[3px_3px_0px_#000] flex items-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Enter Collaborative Game Mission</span>
                </button>
              </div>
            </div>

            {/* Live Synchronized Challenge Preview */}
            <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
              <div className="p-4 bg-[#FFF9E6] border-2 border-black rounded-xl space-y-2">
                <div className="font-black text-xs uppercase text-slate-700">Team Bonus Rule:</div>
                <p className="text-slate-800 leading-relaxed">
                  Every correct explanation submitted by a teammate awards <strong>+50 collaboration bonus points</strong> to all team members!
                </p>
              </div>

              <div className="p-4 bg-[#E0F2FE] border-2 border-black rounded-xl space-y-2">
                <div className="font-black text-xs uppercase text-slate-700">Live Synchronization:</div>
                <p className="text-slate-800 leading-relaxed">
                  Real-time broadcast synchronizes pizza cuts, coordinate radar sweeps, and optics ray angles across all open student browsers.
                </p>
              </div>

              <div className="p-4 bg-[#EDE9FE] border-2 border-black rounded-xl space-y-2">
                <div className="font-black text-xs uppercase text-slate-700">Teacher Supervisory Mode:</div>
                <p className="text-slate-800 leading-relaxed">
                  The host educator can pause, adjust difficulty, reveal mathematical proofs on the smart board, or end the session.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
