import React, { useState } from 'react';
import { Check, Trophy, Target, ArrowRight } from 'lucide-react';
import { submitTeamAnswer } from '../../classroom/services/classroomService';
import { recordCompletedActivity } from '../../dashboard/services/progressService';
import { toast } from 'sonner';

export const CollaborativeGridChallenge: React.FC = () => {
  const TOTAL_CELLS = 20; // 4x5 grid, 1 cell = 5%
  const TARGET_PCT = 75; // Needs 15 cells
  const TARGET_CELLS = 15;

  const [shadedCells, setShadedCells] = useState<number[]>([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]); // 10 pre-shaded by teammates
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleCell = (index: number) => {
    if (shadedCells.includes(index)) {
      setShadedCells(shadedCells.filter((i) => i !== index));
    } else {
      setShadedCells([...shadedCells, index]);
    }
  };

  const currentPct = Math.round((shadedCells.length / TOTAL_CELLS) * 100);
  const isTargetReached = shadedCells.length === TARGET_CELLS;

  const handleSubmit = () => {
    submitTeamAnswer('alpha', isTargetReached, 150);

    recordCompletedActivity({
      moduleId: 'fraction-grid',
      moduleTitle: 'Fraction Grid Game MIZO',
      activityName: 'Collaborative Grid Challenge: 75% Target',
      score: isTargetReached ? 100 : 70,
      maxScore: 100,
      pointsEarned: isTargetReached ? 150 : 50,
      category: 'classroom',
    });

    setIsSubmitted(true);
    toast.success('Team Alpha grid submitted! +150 XP');
  };

  return (
    <div className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 font-mono text-xs select-none">
      <div className="flex items-center justify-between pb-4 border-b-2 border-black/10 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#38BDF8] text-black font-black text-[11px] border border-black shadow-[1px_1px_0px_#000]">
            TEAM CHALLENGE #2
          </span>
          <span className="font-bold text-slate-700">COLLABORATIVE GRID SHADING</span>
        </div>
        <span className="text-[10px] text-black font-black bg-[#FFD166] px-2 py-0.5 rounded border border-black">
          TARGET: {TARGET_PCT}% (3/4)
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-lg font-black text-black font-sans uppercase mb-2">
            "Collaborate to shade exactly 75% of the 20-block grid."
          </h3>
          <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed mb-4">
            Teammates have already shaded 10 cells (50%). Click remaining cells to hit the 15-cell target (75%).
          </p>

          <div className="p-3 bg-white border-2 border-black rounded-xl space-y-2">
            <div className="flex justify-between font-bold">
              <span>Shaded Cells: {shadedCells.length} / {TOTAL_CELLS}</span>
              <strong className={isTargetReached ? 'text-emerald-700' : 'text-amber-700'}>
                {currentPct}%
              </strong>
            </div>
            <div className="w-full h-3 bg-slate-100 border border-black rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${isTargetReached ? 'bg-[#06D6A0]' : 'bg-[#38BDF8]'}`}
                style={{ width: `${currentPct}%` }}
              />
            </div>
          </div>
        </div>

        {/* The 4x5 Interactive Cell Grid */}
        <div className="p-4 bg-white border-2 border-black rounded-xl brutal-shadow-xs text-center">
          <div className="grid grid-cols-5 gap-1.5 max-w-[260px] mx-auto mb-4">
            {Array.from({ length: TOTAL_CELLS }).map((_, idx) => {
              const isShaded = shadedCells.includes(idx);
              const isTeammatePreShaded = idx < 10;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => toggleCell(idx)}
                  className={`h-11 rounded border-2 border-black font-bold text-[10px] transition-all cursor-pointer ${
                    isShaded
                      ? isTeammatePreShaded
                        ? 'bg-[#38BDF8] text-black'
                        : 'bg-[#FFD166] text-black shadow-[1px_1px_0px_#000]'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-300'
                  }`}
                >
                  {isShaded ? (isTeammatePreShaded ? 'Peer' : 'You') : ''}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitted}
            className="retro-btn w-full py-2 bg-[#06D6A0] text-black border-2 border-black rounded-lg font-black text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isSubmitted ? 'Grid Submitted to Team Alpha' : 'Lock In Team Grid (+150 XP)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
