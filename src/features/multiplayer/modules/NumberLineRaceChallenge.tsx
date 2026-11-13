import React, { useState } from 'react';
import { Check, Car, Flag, ArrowRight } from 'lucide-react';
import { submitTeamAnswer } from '../../classroom/services/classroomService';
import { recordCompletedActivity } from '../../dashboard/services/progressService';
import { toast } from 'sonner';

export const NumberLineRaceChallenge: React.FC = () => {
  const [currentPosition, setCurrentPosition] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFinishRace = () => {
    submitTeamAnswer('alpha', true, 150);

    recordCompletedActivity({
      moduleId: 'number-line-cruiser',
      moduleTitle: 'Number Line Cruiser',
      activityName: 'Signed Integer Team Race: -3 + 8 - 4 = +1',
      score: 100,
      maxScore: 100,
      pointsEarned: 150,
      category: 'classroom',
    });

    setIsSubmitted(true);
    toast.success('Team Alpha Cruiser reached the milestone! +150 XP');
  };

  return (
    <div className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 font-mono text-xs select-none">
      <div className="flex items-center justify-between pb-4 border-b-2 border-black/10 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#06D6A0] text-black font-black text-[11px] border border-black shadow-[1px_1px_0px_#000]">
            TEAM CHALLENGE #7
          </span>
          <span className="font-bold text-slate-700">NUMBER LINE TEAM RACE</span>
        </div>
        <span className="text-[10px] text-emerald-950 font-black bg-[#A7F3D0] px-2 py-0.5 rounded border border-black">
          SIGNED INTEGERS
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-lg font-black text-black font-sans uppercase mb-2">
            "Team Cruiser Mission: Calculate -3 + 8 - 4."
          </h3>
          <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed mb-4">
            Navigate your team vehicle through negative integer valleys and positive milestone climbs.
          </p>

          <div className="space-y-2 font-mono text-xs">
            <div className="p-2.5 rounded-lg border-2 border-black bg-white flex items-center justify-between">
              <span>Stage 1: Start at negative 3</span>
              <strong className="text-rose-700">-3</strong>
            </div>
            <div className="p-2.5 rounded-lg border-2 border-black bg-white flex items-center justify-between">
              <span>Stage 2: Drive forward +8 units (-3 + 8)</span>
              <strong className="text-emerald-700">+5</strong>
            </div>
            <div className="p-2.5 rounded-lg border-2 border-black bg-[#FFD166] flex items-center justify-between font-bold">
              <span>Stage 3: Reverse -4 units (+5 - 4)</span>
              <strong className="text-black">+1 (Target)</strong>
            </div>
          </div>
        </div>

        {/* The Visual Number Line */}
        <div className="p-4 bg-white border-2 border-black rounded-xl brutal-shadow-xs text-center font-mono">
          <div className="py-6 px-2 relative mb-4">
            {/* The Horizontal Line */}
            <div className="h-1 bg-black w-full relative" />

            {/* Integer Milestones: -3 to +3 */}
            <div className="flex justify-between -mt-2">
              {[-3, -2, -1, 0, 1, 2, 3].map((val) => (
                <div key={val} className="flex flex-col items-center">
                  <div className={`w-0.5 h-3 ${val === 0 ? 'bg-black w-1' : 'bg-slate-400'}`} />
                  <span className={`text-[10px] mt-1 ${val === currentPosition ? 'font-black text-emerald-700' : 'text-slate-500'}`}>
                    {val > 0 ? `+${val}` : val}
                  </span>
                </div>
              ))}
            </div>

            {/* Team Cruiser Marker at +1 */}
            <div 
              className="absolute top-2 transition-all duration-500 flex flex-col items-center -ml-3"
              style={{ left: `${((currentPosition + 3) / 6) * 100}%` }}
            >
              <span className="text-xl">🚗</span>
              <span className="text-[9px] bg-[#F87171] text-black font-black px-1 rounded border border-black shadow-xs">
                ALPHA
              </span>
            </div>
          </div>

          <button
            onClick={handleFinishRace}
            disabled={isSubmitted}
            className="retro-btn w-full py-2 bg-[#06D6A0] text-black border-2 border-black rounded-lg font-black text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isSubmitted ? 'Cruiser Crossed Finish Line' : 'Confirm Team Cruiser Position (+150 XP)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
