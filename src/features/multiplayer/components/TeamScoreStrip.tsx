import React from 'react';
import { Trophy, Users, ShieldCheck, Flame, ArrowRight, RotateCcw } from 'lucide-react';
import { getActiveSession } from '../../classroom/services/classroomService';
import { TeamId } from '../../classroom/types';

interface TeamScoreStripProps {
  moduleId: string;
  moduleTitle: string;
  challengeTitle: string;
  targetGoal: string;
  isSolo: boolean;
  onToggleMode: () => void;
  onCompleteChallenge?: () => void;
}

export const TeamScoreStrip: React.FC<TeamScoreStripProps> = ({
  moduleId,
  moduleTitle,
  challengeTitle,
  targetGoal,
  isSolo,
  onToggleMode,
  onCompleteChallenge,
}) => {
  const session = getActiveSession();
  const team = session?.teams.alpha; // Default active team Alpha

  if (isSolo) {
    return (
      <div className="bg-[#FFFDF5] border-b-2 border-black px-4 sm:px-6 py-2 select-none font-mono text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-slate-400" />
          <span className="text-slate-600 font-bold">SOLO PRACTICE MODE</span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500 hidden sm:inline">{moduleTitle}</span>
        </div>

        <button
          onClick={onToggleMode}
          className="retro-btn px-2.5 py-1 bg-[#FFD166] text-black border border-black rounded text-[11px] font-bold shadow-[1px_1px_0px_#000] flex items-center gap-1.5 cursor-pointer"
        >
          <Users className="w-3.5 h-3.5" />
          <span>Switch to Classroom Team Mode</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#0b1a30] text-white border-b-3 border-black px-4 sm:px-8 py-2.5 select-none font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Left: Session Code & Team Badge */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-black border border-slate-700 px-2 py-0.5 rounded text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">SESSION:</span>
            <strong className="text-white">{session?.code || 'ZIRNA-4821'}</strong>
          </div>

          <div className="px-2.5 py-0.5 rounded bg-[#F87171] text-black font-black text-[11px] border border-black flex items-center gap-1 shadow-[1px_1px_0px_#000]">
            <span>TEAM ALPHA</span>
            <span>•</span>
            <span>{team?.score || 420} PTS</span>
          </div>

          <span className="text-slate-400 hidden lg:inline">
            Accuracy: <strong className="text-emerald-400">{team?.accuracy || 94}%</strong>
          </span>
        </div>

        {/* Center: Mission Goal */}
        <div className="text-center">
          <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">
            {challengeTitle}
          </span>
          <span className="text-xs font-bold text-white">
            {targetGoal}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {onCompleteChallenge && (
            <button
              onClick={onCompleteChallenge}
              className="retro-btn px-3 py-1 bg-[#06D6A0] hover:bg-[#05b888] text-black border border-black rounded font-black text-xs shadow-[1px_1px_0px_#000] flex items-center gap-1 cursor-pointer"
            >
              <span>Submit Answer</span>
              <ArrowRight className="w-3 h-3 stroke-[3]" />
            </button>
          )}

          <button
            onClick={onToggleMode}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-bold border border-slate-600 cursor-pointer"
          >
            Solo Mode
          </button>
        </div>
      </div>
    </div>
  );
};
