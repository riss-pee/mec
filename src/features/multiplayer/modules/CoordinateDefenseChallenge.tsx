import React, { useState } from 'react';
import { Check, Crosshair, Target, ShieldCheck } from 'lucide-react';
import { submitTeamAnswer } from '../../classroom/services/classroomService';
import { recordCompletedActivity } from '../../dashboard/services/progressService';
import { toast } from 'sonner';

export const CoordinateDefenseChallenge: React.FC = () => {
  const [targetX, setTargetX] = useState(-4);
  const [targetY, setTargetY] = useState(6);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFireDefense = () => {
    submitTeamAnswer('alpha', true, 150);

    recordCompletedActivity({
      moduleId: 'coordinate-defense',
      moduleTitle: 'Coordinate Cannon Defense',
      activityName: 'Quadrant II Artillery Defense Target (-4, +6)',
      score: 100,
      maxScore: 100,
      pointsEarned: 150,
      category: 'classroom',
    });

    setIsSubmitted(true);
    toast.success('Coordinate target locked & neutralized! Team Alpha +150 XP');
  };

  return (
    <div className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 font-mono text-xs select-none">
      <div className="flex items-center justify-between pb-4 border-b-2 border-black/10 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#F87171] text-black font-black text-[11px] border border-black shadow-[1px_1px_0px_#000]">
            TEAM CHALLENGE #5
          </span>
          <span className="font-bold text-slate-700">TEAM CARTESIAN DEFENSE</span>
        </div>
        <span className="text-[10px] text-red-950 font-black bg-red-100 px-2 py-0.5 rounded border border-red-300">
          QUADRANT II RADAR
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-lg font-black text-black font-sans uppercase mb-2">
            "Hostile projectile detected in Quadrant II. Set firing vector to (-4, +6)."
          </h3>
          <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed mb-4">
            Teammates must identify the negative X-axis offset and positive Y-axis elevation to calibrate the classroom defense turret.
          </p>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between p-2.5 bg-white border-2 border-black rounded-lg">
              <span className="font-bold">Horizontal X-Coord:</span>
              <div className="flex items-center gap-1.5">
                {[-6, -4, -2, 0, 2].map((x) => (
                  <button
                    key={x}
                    onClick={() => setTargetX(x)}
                    className={`px-2 py-1 rounded border border-black font-bold cursor-pointer ${
                      targetX === x ? 'bg-[#F87171] text-black font-black' : 'bg-slate-50'
                    }`}
                  >
                    {x}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-white border-2 border-black rounded-lg">
              <span className="font-bold">Vertical Y-Coord:</span>
              <div className="flex items-center gap-1.5">
                {[2, 4, 6, 8].map((y) => (
                  <button
                    key={y}
                    onClick={() => setTargetY(y)}
                    className={`px-2 py-1 rounded border border-black font-bold cursor-pointer ${
                      targetY === y ? 'bg-[#06D6A0] text-black font-black' : 'bg-slate-50'
                    }`}
                  >
                    +{y}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* The Cartesian Radar Grid */}
        <div className="p-4 bg-slate-900 border-2 border-black rounded-xl text-center text-white font-mono">
          <div className="w-48 h-48 mx-auto border-2 border-emerald-500/60 rounded-xl relative overflow-hidden bg-slate-950 p-2 mb-3">
            {/* Axis */}
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-emerald-500/40" />
            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-emerald-500/40" />
            
            {/* Target Dot at (-4, +6) */}
            <div 
              className="absolute w-4 h-4 rounded-full bg-rose-500 border border-white animate-ping"
              style={{ left: '25%', top: '25%' }}
            />
            <div 
              className="absolute w-4 h-4 rounded-full bg-rose-500 border border-white"
              style={{ left: '25%', top: '25%' }}
            />

            <span className="absolute left-2 top-2 text-[10px] text-emerald-400 font-bold">Q II (-X, +Y)</span>
            <span className="absolute right-2 top-2 text-[10px] text-slate-500">Q I (+X, +Y)</span>
            <span className="absolute left-2 bottom-2 text-[10px] text-slate-500">Q III (-X, -Y)</span>
            <span className="absolute right-2 bottom-2 text-[10px] text-slate-500">Q IV (+X, -Y)</span>
          </div>

          <div className="text-xs font-bold text-emerald-400 mb-3">
            Locked Vector: ({targetX}, +{targetY})
          </div>

          <button
            onClick={handleFireDefense}
            disabled={isSubmitted}
            className="retro-btn w-full py-2 bg-[#F87171] text-black border-2 border-black rounded-lg font-black text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>{isSubmitted ? 'Defense Artillery Discharged' : 'Fire Defense Strike (+150 XP)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
