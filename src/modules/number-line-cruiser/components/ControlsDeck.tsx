import React from 'react';
import { FacingDirection, MotionType } from '../types';
import { Play, RotateCcw, Volume2, VolumeX, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';

interface ControlsDeckProps {
  currentPos: number;
  facing: FacingDirection;
  motion: MotionType;
  stepCount: number;
  isDriving: boolean;
  stepByStep: boolean;
  soundMuted: boolean;
  onFacingChange: (dir: FacingDirection) => void;
  onMotionChange: (mot: MotionType) => void;
  onStepCountChange: (count: number) => void;
  onToggleStepByStep: () => void;
  onToggleSound: () => void;
  onDrive: () => void;
  onHonk: () => void;
  onReset: () => void;
}

export const ControlsDeck: React.FC<ControlsDeckProps> = ({
  currentPos,
  facing,
  motion,
  stepCount,
  isDriving,
  stepByStep,
  soundMuted,
  onFacingChange,
  onMotionChange,
  onStepCountChange,
  onToggleStepByStep,
  onToggleSound,
  onDrive,
  onHonk,
  onReset,
}) => {
  const motionSign = motion === 'forward' ? 1 : -1;
  const netDelta = facing * motionSign * stepCount;
  const projectedPos = currentPos + netDelta;

  let equationString = '';
  let ruleBadge = '';

  if (facing === 1) {
    if (motion === 'forward') {
      equationString = `${currentPos} + (+${stepCount}) = ${projectedPos}`;
      ruleBadge = 'Moving forward in (+) direction: Addition (+)';
    } else {
      equationString = `${currentPos} - (+${stepCount}) = ${projectedPos}`;
      ruleBadge = 'Moving backward in (+) direction: Subtraction (−)';
    }
  } else {
    if (motion === 'forward') {
      equationString = `${currentPos} + (-${stepCount}) = ${projectedPos}`;
      ruleBadge = 'Moving forward in (−) direction: Adding a Negative (−)';
    } else {
      equationString = `${currentPos} - (-${stepCount}) = ${currentPos} + ${stepCount} = ${projectedPos}`;
      ruleBadge = '✨ Double Negative: Subtracting a Negative moves Right (+)';
    }
  }

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 shadow-sm">
      {/* Top Status & Display Gauge */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
        {/* Field 1: Current Coordinate Value Display */}
        <div className="bg-slate-50 border-2 border-indigo-200 rounded-xl p-2 sm:p-2.5 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
            <span>CURRENT COORDINATE</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-700 font-mono font-bold">
              X-AXIS
            </span>
          </div>
          <div className="flex items-baseline space-x-2 my-0.5">
            <span
              className={`text-3xl md:text-4xl font-extrabold tracking-tight font-mono tabular-nums ${
                currentPos === 0
                  ? 'text-amber-600'
                  : currentPos > 0
                  ? 'text-emerald-600'
                  : 'text-rose-600'
              }`}
            >
              {currentPos > 0 ? `+${currentPos}` : currentPos}
            </span>
            <span className="text-xs font-bold text-slate-700">
              {currentPos === 0
                ? '⭐ Origin (0)'
                : currentPos > 0
                ? '🟢 Positive Zone'
                : '🔴 Negative Zone'}
            </span>
          </div>
          <p className="text-[10px] text-slate-500 font-medium">
            {currentPos === 0
              ? 'Starting center mark'
              : `${Math.abs(currentPos)} unit${Math.abs(currentPos) === 1 ? '' : 's'} ${
                  currentPos > 0 ? 'right of 0' : 'left of 0'
                }`}
          </p>
        </div>

        {/* Field 2: Next Projection & Equation */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between md:col-span-2">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              LIVE INTEGER EQUATION
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded border border-emerald-200">
              Destination: {projectedPos > 0 ? `+${projectedPos}` : projectedPos}
            </span>
          </div>

          {/* Equation Formula */}
          <div className="my-1 bg-white py-1.5 px-2.5 rounded-lg border border-slate-200 font-mono text-center shadow-xs">
            <span className="text-base sm:text-lg font-extrabold tracking-wide text-indigo-700">
              {equationString}
            </span>
          </div>

          <div className="text-[11px] text-slate-600 font-semibold flex items-center justify-between">
            <span className="truncate mr-2 text-indigo-900">{ruleBadge}</span>
            <span className="text-slate-500 text-[10px] shrink-0 font-mono font-bold">
              Net: {netDelta > 0 ? `+${netDelta}` : netDelta} steps
            </span>
          </div>
        </div>
      </div>

      {/* Control Fields Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2">
        {/* Field 1: Car Direction Selection (Forward for +ve, Rear for -ve) */}
        <div className="md:col-span-4 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="mb-1.5">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              1. Direction (Facing)
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onFacingChange(1)}
              className={`py-2 px-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                facing === 1
                  ? 'bg-sky-600 text-white border-sky-600 shadow-md ring-2 ring-sky-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-xs">
                <span>Forward</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <span className={`text-[11px] font-extrabold ${facing === 1 ? 'text-sky-100' : 'text-sky-700'}`}>
                +ve (+)
              </span>
            </button>

            <button
              type="button"
              onClick={() => onFacingChange(-1)}
              className={`py-2 px-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                facing === -1
                  ? 'bg-rose-600 text-white border-rose-600 shadow-md ring-2 ring-rose-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center gap-1 font-bold text-xs">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Rear</span>
              </div>
              <span className={`text-[11px] font-extrabold ${facing === -1 ? 'text-rose-100' : 'text-rose-700'}`}>
                −ve (−)
              </span>
            </button>
          </div>
        </div>

        {/* Field 2: Motion Operation (Forward for Addition +, Backward for Subtraction -) */}
        <div className="md:col-span-4 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="mb-1.5">
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              2. Movement (Gear)
            </label>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onMotionChange('forward')}
              className={`py-2 px-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                motion === 'forward'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-md ring-2 ring-emerald-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <span className="font-bold text-xs">Drive Forward</span>
              <span className={`text-[11px] font-extrabold ${motion === 'forward' ? 'text-emerald-100' : 'text-emerald-700'}`}>
                Addition (+)
              </span>
            </button>

            <button
              type="button"
              onClick={() => onMotionChange('backward')}
              className={`py-2 px-2 rounded-xl border-2 flex flex-col items-center justify-center transition-all cursor-pointer ${
                motion === 'backward'
                  ? 'bg-amber-600 text-white border-amber-600 shadow-md ring-2 ring-amber-200'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
              }`}
            >
              <span className="font-bold text-xs">Drive Backward</span>
              <span className={`text-[11px] font-extrabold ${motion === 'backward' ? 'text-amber-100' : 'text-amber-700'}`}>
                Subtraction (−)
              </span>
            </button>
          </div>
        </div>

        {/* Field 3: Number of Steps (Chunky Quick Step Buttons, Light Themed) */}
        <div className="md:col-span-4 bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              3. Step Distance
            </label>
            <span className="text-xs font-mono font-black text-amber-800 px-2 py-0.2 rounded bg-amber-100 border border-amber-300">
              {stepCount} {stepCount === 1 ? 'Step' : 'Steps'}
            </span>
          </div>

          <div className="flex items-center justify-between gap-1">
            <button
              type="button"
              onClick={() => onStepCountChange(Math.max(1, stepCount - 1))}
              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-extrabold flex items-center justify-center border border-slate-300 shadow-xs cursor-pointer text-sm"
              title="Minus 1 step"
            >
              −
            </button>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => onStepCountChange(num)}
                className={`flex-1 py-1 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                  stepCount === num
                    ? 'bg-amber-500 text-amber-950 font-black shadow-sm ring-1 ring-amber-400 scale-105'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => onStepCountChange(Math.min(10, stepCount + 1))}
              className="w-7 h-7 rounded-lg bg-white hover:bg-slate-100 text-slate-800 font-extrabold flex items-center justify-center border border-slate-300 shadow-xs cursor-pointer text-sm"
              title="Plus 1 step"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Action Bar (Drive Button, Honk, Reset, Step Toggle, Audio) */}
      <div className="mt-2 pt-2 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={onToggleStepByStep}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border flex items-center gap-1 transition-colors cursor-pointer ${
              stepByStep
                ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-bold'
                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <span>{stepByStep ? '✓ Counting' : '⚡ Direct'}</span>
          </button>

          <button
            type="button"
            onClick={onHonk}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300 hover:bg-amber-200 transition-colors cursor-pointer"
            title="Honk the car horn!"
          >
            <span>📢 Beep!</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="px-2.5 py-1.5 rounded-lg text-[11px] font-semibold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-1 cursor-pointer"
            title="Reset position to 0 (Origin)"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Reset (0)</span>
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            className="p-1.5 rounded-lg bg-white text-slate-600 hover:text-slate-900 border border-slate-300 hover:bg-slate-50 cursor-pointer shadow-xs"
            title={soundMuted ? 'Unmute' : 'Mute'}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>
        </div>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={onDrive}
          disabled={isDriving}
          className={`px-5 py-2 rounded-xl font-black text-sm sm:text-base shadow-md flex items-center gap-2 transition-all cursor-pointer ${
            isDriving
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30 active:scale-95'
          }`}
        >
          <Play className={`w-4 h-4 fill-current ${isDriving ? 'animate-spin' : ''}`} />
          <span>{isDriving ? 'Cruising...' : `DRIVE! (${netDelta > 0 ? `+${netDelta}` : netDelta})`}</span>
        </button>
      </div>
    </div>
  );
};
