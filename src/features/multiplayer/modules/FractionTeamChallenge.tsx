import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Users, Check, ArrowRight, Sparkles, MessageSquare } from 'lucide-react';
import { submitTeamAnswer } from '../../classroom/services/classroomService';
import { recordCompletedActivity } from '../../dashboard/services/progressService';
import { toast } from 'sonner';

interface FractionTeamChallengeProps {
  onClose?: () => void;
}

export const FractionTeamChallenge: React.FC<FractionTeamChallengeProps> = ({ onClose }) => {
  const [slices, setSlices] = useState(4);
  const [selectedSlices, setSelectedSlices] = useState(1);
  const [explanation, setExplanation] = useState('1 out of 4 equal slices = 1/4 (25%) per student');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCorrect = slices === 4 && selectedSlices === 1;
    submitTeamAnswer('alpha', isCorrect, 150);

    recordCompletedActivity({
      moduleId: 'fraction-zirna',
      moduleTitle: 'Fraction Zirna Playground',
      activityName: 'Classroom Pizza Relay: 1/4 Equal Division',
      score: isCorrect ? 100 : 70,
      maxScore: 100,
      pointsEarned: isCorrect ? 150 : 50,
      category: 'classroom',
    });

    setIsSubmitted(true);
    toast.success('Team Alpha solution submitted! +150 Points awarded to classroom scoreboard.');
  };

  return (
    <div className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 font-mono text-xs select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-black/10 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#F87171] text-black font-black text-[11px] border border-black shadow-[1px_1px_0px_#000]">
            TEAM CHALLENGE #1
          </span>
          <span className="font-bold text-slate-700">COLLABORATIVE FRACTION DIVISION</span>
        </div>
        <span className="text-[10px] text-emerald-700 font-black bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
          +50 COLLABORATION BONUS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        {/* Left: Quest Scenario */}
        <div className="space-y-3 font-sans">
          <h3 className="text-lg font-black text-black font-sans uppercase">
            "Your team has 1 whole pizza. Divide it equally among 4 students. What fraction does each student receive?"
          </h3>
          <p className="text-xs text-slate-600 font-medium">
            Cut the pizza into 4 equal slices and select 1 slice to represent each classmate's share.
          </p>

          <div className="space-y-2 pt-2 font-mono text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold">Total Slices:</span>
              {[2, 3, 4, 6, 8].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSlices(s)}
                  className={`w-8 h-8 rounded border-2 border-black font-black transition-all cursor-pointer ${
                    slices === s ? 'bg-[#FFD166] shadow-[1px_1px_0px_#000]' : 'bg-white hover:bg-slate-100'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="font-bold">Each Student Takes:</span>
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setSelectedSlices(num)}
                  className={`w-8 h-8 rounded border-2 border-black font-black transition-all cursor-pointer ${
                    selectedSlices === num ? 'bg-[#06D6A0] shadow-[1px_1px_0px_#000]' : 'bg-white hover:bg-slate-100'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Visual Pizza & Form */}
        <div className="p-4 bg-white border-2 border-black rounded-xl brutal-shadow-xs text-center">
          {/* Pizza Visualizer */}
          <div className="w-32 h-32 mx-auto rounded-full border-3 border-black bg-amber-100 relative overflow-hidden mb-3 shadow-inner">
            {Array.from({ length: slices }).map((_, idx) => {
              const rotation = (360 / slices) * idx;
              return (
                <div
                  key={idx}
                  className="absolute inset-0 border-r-2 border-amber-900/60"
                  style={{ transform: `rotate(${rotation}deg)`, transformOrigin: 'center center' }}
                />
              );
            })}
            <div className="absolute inset-0 flex items-center justify-center font-black text-base z-10 bg-white/80 w-16 h-8 mx-auto my-auto rounded border border-black shadow-xs">
              {selectedSlices}/{slices}
            </div>
          </div>

          <div className="text-[11px] font-bold text-slate-700 mb-3">
            Selected Fraction: <strong className="text-black">{selectedSlices} / {slices}</strong> ({Math.round((selectedSlices / slices) * 100)}%)
          </div>

          <form onSubmit={handleSubmit} className="space-y-2 text-left">
            <label className="block text-[10px] font-bold uppercase text-slate-500">
              Team Explanation (Peer Discussion):
            </label>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-[#FFFDF5] border border-black rounded text-xs font-mono"
            />

            <button
              type="submit"
              disabled={isSubmitted}
              className="retro-btn w-full py-2 bg-[#06D6A0] text-black border-2 border-black rounded-lg font-black text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer mt-2"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>{isSubmitted ? 'Solution Submitted to Team Alpha' : 'Submit Team Solution (+150 XP)'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
