import React, { useState } from 'react';
import { Check, Trophy, Sparkles } from 'lucide-react';
import { submitTeamAnswer } from '../../classroom/services/classroomService';
import { recordCompletedActivity } from '../../dashboard/services/progressService';
import { toast } from 'sonner';

export const TeamSymmetryChallenge: React.FC = () => {
  // 4x4 matrix on left and right across mirror axis
  const LEFT_PATTERN = [0, 2, 5, 7, 10]; // Pre-placed by teammate
  const CORRECT_RIGHT_REFLECTION = [1, 3, 4, 6, 11]; // Horizontal mirror reflection indices

  const [rightPlaced, setRightPlaced] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleRightCell = (idx: number) => {
    if (rightPlaced.includes(idx)) {
      setRightPlaced(rightPlaced.filter((i) => i !== idx));
    } else {
      setRightPlaced([...rightPlaced, idx]);
    }
  };

  const handleVerify = () => {
    const isCorrect =
      rightPlaced.length === CORRECT_RIGHT_REFLECTION.length &&
      CORRECT_RIGHT_REFLECTION.every((val) => rightPlaced.includes(val));

    submitTeamAnswer('alpha', isCorrect, 150);

    recordCompletedActivity({
      moduleId: 'symmetry-match',
      moduleTitle: 'Symmetry Mirror Match',
      activityName: 'Team Symmetry Reflection: Level 14',
      score: isCorrect ? 100 : 75,
      maxScore: 100,
      pointsEarned: isCorrect ? 150 : 50,
      category: 'classroom',
    });

    setIsSubmitted(true);
    toast.success('Team Alpha symmetry puzzle completed! +150 XP');
  };

  return (
    <div className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 font-mono text-xs select-none">
      <div className="flex items-center justify-between pb-4 border-b-2 border-black/10 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#C4B5FD] text-black font-black text-[11px] border border-black shadow-[1px_1px_0px_#000]">
            TEAM CHALLENGE #3
          </span>
          <span className="font-bold text-slate-700">TEAM SYMMETRY REFLECTION</span>
        </div>
        <span className="text-[10px] text-purple-950 font-black bg-[#C4B5FD] px-2 py-0.5 rounded border border-black">
          AXIS OF SYMMETRY
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-lg font-black text-black font-sans uppercase mb-2">
            "Your partner placed the left pattern. Complete the mirror reflection."
          </h3>
          <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed mb-4">
            Click blocks on the right grid to mirror your partner's arrangement across the central vertical mirror axis.
          </p>

          <div className="p-3 bg-white border-2 border-black rounded-xl text-[11px] space-y-1">
            <div><strong>Teammate:</strong> Alex Zomawia (Team Alpha)</div>
            <div><strong>Symmetry Rule:</strong> Points placed at (x, y) must reflect to (-x, y)</div>
          </div>
        </div>

        {/* The Dual Mirror Matrix */}
        <div className="p-4 bg-white border-2 border-black rounded-xl brutal-shadow-xs">
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* Left Grid (Partner) */}
            <div className="grid grid-cols-4 gap-1 p-2 bg-[#FFF9E6] border-2 border-black rounded-lg">
              {Array.from({ length: 16 }).map((_, idx) => (
                <div
                  key={`left-${idx}`}
                  className={`w-7 h-7 rounded border border-black flex items-center justify-center text-[9px] font-bold ${
                    LEFT_PATTERN.includes(idx) ? 'bg-[#FFD166] text-black' : 'bg-white'
                  }`}
                >
                  {LEFT_PATTERN.includes(idx) ? '●' : ''}
                </div>
              ))}
            </div>

            {/* Mirror Line */}
            <div className="w-1.5 h-36 bg-purple-600 rounded-full border border-black flex flex-col justify-around py-2">
              <div className="w-2 h-2 rounded-full bg-white border border-black -ml-0.5" />
              <div className="w-2 h-2 rounded-full bg-white border border-black -ml-0.5" />
            </div>

            {/* Right Grid (Your Reflection) */}
            <div className="grid grid-cols-4 gap-1 p-2 bg-[#FAF5FF] border-2 border-black rounded-lg">
              {Array.from({ length: 16 }).map((_, idx) => (
                <button
                  key={`right-${idx}`}
                  type="button"
                  onClick={() => toggleRightCell(idx)}
                  className={`w-7 h-7 rounded border border-black flex items-center justify-center text-[9px] font-bold transition-all cursor-pointer ${
                    rightPlaced.includes(idx)
                      ? 'bg-[#06D6A0] text-black shadow-xs'
                      : 'bg-white hover:bg-slate-100'
                  }`}
                >
                  {rightPlaced.includes(idx) ? '●' : ''}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleVerify}
            disabled={isSubmitted}
            className="retro-btn w-full py-2 bg-[#06D6A0] text-black border-2 border-black rounded-lg font-black text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isSubmitted ? 'Reflection Verified & Submitted' : 'Verify Symmetry Reflection (+150 XP)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
