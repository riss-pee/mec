import React, { useState } from 'react';
import { Check, Atom, Sparkles, Sun } from 'lucide-react';
import { submitTeamAnswer } from '../../classroom/services/classroomService';
import { recordCompletedActivity } from '../../dashboard/services/progressService';
import { toast } from 'sonner';

export const OpticsPredictionChallenge: React.FC = () => {
  const [prediction, setPrediction] = useState<'30' | '15' | 'infinity'>('30');
  const [scientificReasoning, setScientificReasoning] = useState('By 1/f = 1/v - 1/u, when object is at 2f (30cm), real image forms at 2f (30cm).');
  const [isRevealed, setIsRevealed] = useState(false);

  const handleRevealSimulation = () => {
    const isCorrect = prediction === '30';
    submitTeamAnswer('alpha', isCorrect, 180);

    recordCompletedActivity({
      moduleId: 'optics-lab',
      moduleTitle: 'Ray Tracing Optics Lab',
      activityName: 'Scientific Ray Prediction: Lens Formula 1/f = 1/v - 1/u',
      score: isCorrect ? 100 : 70,
      maxScore: 100,
      pointsEarned: isCorrect ? 180 : 60,
      category: 'physics',
    });

    setIsRevealed(true);
    toast.success('Simulation verified! Scientific reasoning points awarded to Team Alpha.');
  };

  return (
    <div className="bg-[#FFFDF5] border-3 border-black brutal-shadow rounded-2xl p-6 font-mono text-xs select-none">
      <div className="flex items-center justify-between pb-4 border-b-2 border-black/10 mb-4">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-[#38BDF8] text-black font-black text-[11px] border border-black shadow-[1px_1px_0px_#000]">
            TEAM CHALLENGE #6
          </span>
          <span className="font-bold text-slate-700">COLLABORATIVE OPTICS PREDICTION</span>
        </div>
        <span className="text-[10px] text-sky-950 font-black bg-[#BAE6FD] px-2 py-0.5 rounded border border-black">
          SCIENTIFIC REASONING
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div>
          <h3 className="text-lg font-black text-black font-sans uppercase mb-2">
            "Biconvex Lens (f = +15 cm). Object placed at u = -30 cm (2f). Predict image distance v."
          </h3>
          <p className="text-xs text-slate-600 font-medium font-sans leading-relaxed mb-4">
            In collaborative science labs, reasoning matters more than pure speed. Formulate your team hypothesis before firing the laser.
          </p>

          <div className="space-y-2 mb-4 font-mono text-xs">
            {[
              { val: '30', label: 'v = +30 cm (Real, Inverted, Same Size at 2f)' },
              { val: '15', label: 'v = +15 cm (At Principal Focus F)' },
              { val: 'infinity', label: 'v = ∞ (Parallel Beams to Infinity)' },
            ].map((opt) => (
              <label
                key={opt.val}
                className={`p-2.5 rounded-lg border-2 border-black flex items-center gap-2 cursor-pointer transition-all ${
                  prediction === opt.val ? 'bg-[#38BDF8] font-black shadow-[1px_1px_0px_#000]' : 'bg-white'
                }`}
              >
                <input
                  type="radio"
                  name="optics-pred"
                  checked={prediction === opt.val}
                  onChange={() => setPrediction(opt.val as any)}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase text-slate-500 mb-1">
              Scientific Hypothesis & Reasoning:
            </label>
            <input
              type="text"
              value={scientificReasoning}
              onChange={(e) => setScientificReasoning(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-black rounded text-xs font-mono"
            />
          </div>
        </div>

        {/* Optical Bench Simulation Display */}
        <div className="p-4 bg-white border-2 border-black rounded-xl brutal-shadow-xs text-center font-mono">
          <div className="h-36 rounded-lg border-2 border-black bg-slate-900 relative overflow-hidden flex items-center justify-center p-2 mb-3">
            {/* Optical Axis */}
            <div className="absolute inset-x-0 h-0.5 bg-slate-600" />
            
            {/* Center Lens */}
            <div className="w-4 h-24 rounded-full bg-cyan-400 border border-white z-10 opacity-80" />

            {/* Object Torch at -30 */}
            <div className="absolute left-6 flex flex-col items-center">
              <Sun className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-[9px] text-amber-300">u = 2f</span>
            </div>

            {/* If Revealed: Show Laser Rays */}
            {isRevealed && (
              <>
                {/* Incoming parallel ray */}
                <div className="absolute left-6 right-1/2 top-12 h-0.5 bg-red-500" />
                {/* Focal ray */}
                <div className="absolute left-1/2 right-6 bottom-12 h-0.5 bg-red-500" />
                {/* Image Target */}
                <div className="absolute right-6 flex flex-col items-center">
                  <div className="w-2 h-8 bg-amber-400 rounded-sm" />
                  <span className="text-[9px] text-emerald-400 font-bold">v = +30cm</span>
                </div>
              </>
            )}
          </div>

          <div className="text-[11px] font-bold text-slate-700 mb-3">
            {isRevealed ? (
              <span className="text-emerald-700 font-black">
                ✓ Hypothesis Confirmed! Real inverted image verified at v = +30 cm.
              </span>
            ) : (
              'Laser Torches Idle • Awaiting Hypothesis Verification'
            )}
          </div>

          <button
            onClick={handleRevealSimulation}
            disabled={isRevealed}
            className="retro-btn w-full py-2 bg-[#06D6A0] text-black border-2 border-black rounded-lg font-black text-xs shadow-[2px_2px_0px_#000] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" />
            <span>{isRevealed ? 'Simulation Verified (+180 XP)' : 'Fire Simulation & Verify Hypothesis'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
