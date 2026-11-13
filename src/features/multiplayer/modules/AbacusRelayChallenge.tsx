import React, { useState } from 'react';
import { Check, Trophy, Sparkles, ArrowRight } from 'lucide-react';
import { submitTeamAnswer } from '../../classroom/services/classroomService';
import { recordCompletedActivity } from '../../dashboard/services/progressService';
import { toast } from 'sonner';

export const AbacusRelayChallenge: React.FC = () => {
  const [stage, setStage] = useState<1 | 2 | 3>(1);
  const [userUnit, setUserUnit] = useState(3);
  const [userTen, setUserTen] = useState(2);
  const [userHundred, setUserHundred] = useState(6);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCompleteRelay = () => {
    submitTeamAnswer('alpha', true, 150);

    recordCompletedActivity({
      moduleId: 'abacus-math',
      moduleTitle: 'Interactive Abacus Studio',
      activityName: 'Abacus Relay: 348 + 275 = 623',
      score: 100,
      maxScore: 100,
      pointsEarned: 150,
      category: 'classroom',
    });

    setIsSubmitted(true);
    toast.success('Abacus Relay completed! Team Alpha awarded +150 XP');
  };

  return (
    <div className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 font-mono text-xs select-none">
      <div className="flex items-center justify-between pb-4 border-b-2 border-black/10 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#FB923C] text-black font-black text-[11px] border border-black shadow-[1px_1px_0px_#000]">
            TEAM CHALLENGE #4
          </span>
          <span className="font-bold text-slate-700">ABACUS THREE-STAGE RELAY</span>
        </div>
        <span className="text-[10px] text-amber-950 font-black bg-[#FED7AA] px-2 py-0.5 rounded border border-black">
          348 + 275 = 623
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-lg font-black text-black font-sans uppercase mb-2">
            "Team Relay: Solve 348 + 275 on the Japanese Soroban."
          </h3>
          <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed mb-4">
            Each teammate takes responsibility for one place-value column (Units, Tens, Hundreds) to avoid arithmetic carry mistakes.
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className={`p-2.5 rounded-lg border-2 border-black ${stage === 1 ? 'bg-[#FFD166]' : 'bg-white'}`}>
              <div className="font-bold">Stage 1: Units Column (8 + 5 = 13)</div>
              <div className="text-[11px] text-slate-600">Bead value placed: 3 (Carry 1 ten to next rod)</div>
            </div>
            <div className={`p-2.5 rounded-lg border-2 border-black ${stage === 2 ? 'bg-[#FFD166]' : 'bg-white'}`}>
              <div className="font-bold">Stage 2: Tens Column (40 + 70 + 10 = 120)</div>
              <div className="text-[11px] text-slate-600">Bead value placed: 2 (Carry 1 hundred to next rod)</div>
            </div>
            <div className={`p-2.5 rounded-lg border-2 border-black ${stage === 3 ? 'bg-[#FFD166]' : 'bg-white'}`}>
              <div className="font-bold">Stage 3: Hundreds Column (300 + 200 + 100 = 600)</div>
              <div className="text-[11px] text-slate-600">Bead value placed: 6 (Final sum = 623)</div>
            </div>
          </div>
        </div>

        {/* The Soroban Abacus Frame */}
        <div className="p-4 bg-white border-2 border-black rounded-xl brutal-shadow-xs text-center">
          <div className="w-56 mx-auto bg-stone-900 border-3 border-black rounded-xl p-3 mb-4 shadow-md">
            {/* Upper deck */}
            <div className="flex justify-around mb-2">
              <span className="w-5 h-5 rounded-full bg-amber-400 border border-black inline-block" />
              <span className="w-5 h-5 rounded-full bg-amber-400 border border-black inline-block" />
              <span className="w-5 h-5 rounded-full bg-amber-400 border border-black inline-block" />
            </div>
            {/* Center Beam */}
            <div className="h-1.5 bg-amber-200 border border-black w-full my-1.5 rounded" />
            {/* Lower deck */}
            <div className="flex justify-around">
              <span className="w-5 h-5 rounded-full bg-amber-200 border border-black inline-block" />
              <span className="w-5 h-5 rounded-full bg-amber-200 border border-black inline-block" />
              <span className="w-5 h-5 rounded-full bg-amber-200 border border-black inline-block" />
            </div>
          </div>

          <div className="text-sm font-black text-black mb-3">
            Computed Sum: <span className="bg-[#FFD166] px-2 py-0.5 rounded border border-black">623</span>
          </div>

          <button
            onClick={handleCompleteRelay}
            disabled={isSubmitted}
            className="retro-btn w-full py-2 bg-[#06D6A0] text-black border-2 border-black rounded-lg font-black text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isSubmitted ? 'Abacus Solution Verified' : 'Submit Abacus Relay (+150 XP)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
