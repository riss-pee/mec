import React, { useState, useRef, useEffect } from 'react';
import { Target, ThemeMode, CannonType, ShotResult } from '../types/game';
import { formatSlopeFraction, getLineEquation, getLineRoots, getQuadraticCoefficients } from '../utils/mathUtils';
import { Crosshair, Plus, Minus, RotateCcw, Delete, Zap, Keyboard, ShieldAlert, Move, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';
import { soundManager } from '../audio/soundManager';

interface ControlDeckProps {
  inputX: number;
  inputY: number;
  setInputX: (val: number | ((prev: number) => number)) => void;
  setInputY: (val: number | ((prev: number) => number)) => void;
  onFire: (weaponType: CannonType) => void;
  isFiring: boolean;
  theme: ThemeMode;
  level: string;
  targets: Target[];
  showNumpad: boolean;
  setShowNumpad: (val: boolean) => void;
  cannonType?: CannonType;
  setCannonType?: (val: CannonType) => void;
  hasWalls?: boolean;
  cannonX?: number;
  cannonY?: number;
  setCannonX?: (val: number | ((prev: number) => number)) => void;
  setCannonY?: (val: number | ((prev: number) => number)) => void;
  allowRepositionCannon?: boolean;
  lastShotResult?: ShotResult | null;
  calculatedAim?: boolean;
  setCalculatedAim?: (val: boolean | ((prev: boolean) => boolean)) => void;
}

export const ControlDeck: React.FC<ControlDeckProps> = ({
  inputX,
  inputY,
  setInputX,
  setInputY,
  onFire,
  isFiring,
  theme,
  level,
  targets,
  showNumpad,
  setShowNumpad,
  cannonType,
  setCannonType,
  hasWalls = false,
  cannonX = 0,
  cannonY = 0,
  setCannonX,
  setCannonY,
  allowRepositionCannon = false,
  lastShotResult,
  calculatedAim = false,
  setCalculatedAim,
}) => {
  const [activeField, setActiveField] = useState<'X' | 'Y'>('X');
  const [rawX, setRawX] = useState<string>(inputX.toString());
  const [rawY, setRawY] = useState<string>(inputY.toString());

  const inputXRef = useRef<HTMLInputElement | null>(null);
  const inputYRef = useRef<HTMLInputElement | null>(null);

  const isDark = theme === 'tactical';
  const isLevel1 = level === 'level1_q1' || level === 'q1_mode';

  // Math diagnostics for current aim relative to cannon battery
  const dx = inputX - cannonX;
  const dy = inputY - cannonY;
  const slope = formatSlopeFraction(dx, dy);
  const equation = getLineEquation(inputX, inputY, cannonX, cannonY);
  const lineRoots = getLineRoots(inputX, inputY, cannonX, cannonY);
  const quadCoeffs = getQuadraticCoefficients(inputX, inputY, cannonX, cannonY);
  const distance = Math.hypot(dx, dy).toFixed(2);

  const minLimit = isLevel1 ? 0 : -10;
  const maxLimit = isLevel1 ? 8 : 10;

  const clampValue = (val: number) => Math.max(minLimit, Math.min(maxLimit, val));

  // Sync internal string representations when props change externally
  useEffect(() => {
    setRawX(inputX.toString());
  }, [inputX]);

  useEffect(() => {
    setRawY(inputY.toString());
  }, [inputY]);

  // Handle typing directly into X field
  const handleXInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || (val === '-' && !isLevel1)) {
      setRawX(val);
      if (val === '') setInputX(0);
      return;
    }

    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      const clamped = clampValue(num);
      setRawX(clamped.toString());
      setInputX(clamped);
    }
  };

  // Handle typing directly into Y field
  const handleYInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || (val === '-' && !isLevel1)) {
      setRawY(val);
      if (val === '') setInputY(0);
      return;
    }

    const num = parseInt(val, 10);
    if (!isNaN(num)) {
      const clamped = clampValue(num);
      setRawY(clamped.toString());
      setInputY(clamped);
    }
  };

  const handleXBlur = () => {
    if (rawX === '' || rawX === '-') {
      setRawX('0');
      setInputX(0);
    } else {
      setRawX(inputX.toString());
    }
  };

  const handleYBlur = () => {
    if (rawY === '' || rawY === '-') {
      setRawY('0');
      setInputY(0);
    } else {
      setRawY(inputY.toString());
    }
  };

  // Step increments
  const handleStep = (field: 'X' | 'Y', delta: number) => {
    soundManager.playClick();
    if (field === 'X') {
      const next = clampValue(inputX + delta);
      setInputX(next);
      setRawX(next.toString());
    } else {
      const next = clampValue(inputY + delta);
      setInputY(next);
      setRawY(next.toString());
    }
  };

  // Toggle +/- Sign
  const toggleSign = (field: 'X' | 'Y') => {
    if (isLevel1) return;
    soundManager.playClick();
    if (field === 'X') {
      const next = clampValue(-inputX);
      setInputX(next);
      setRawX(next.toString());
    } else {
      const next = clampValue(-inputY);
      setInputY(next);
      setRawY(next.toString());
    }
  };

  // Tactile Numpad Button Handler
  const handleKeypadPress = (key: string) => {
    soundManager.playClick();
    const currentVal = activeField === 'X' ? inputX : inputY;
    const setVal = activeField === 'X' ? setInputX : setInputY;
    const setRaw = activeField === 'X' ? setRawX : setRawY;

    if (key === 'CLEAR') {
      setVal(0);
      setRaw('0');
      return;
    }

    if (key === 'BACKSPACE') {
      const str = Math.abs(currentVal).toString();
      if (str.length <= 1) {
        setVal(0);
        setRaw('0');
      } else {
        const nextVal = parseInt(str.slice(0, -1), 10) * (currentVal < 0 ? -1 : 1);
        const clamped = clampValue(nextVal);
        setVal(clamped);
        setRaw(clamped.toString());
      }
      return;
    }

    if (key === '+/-') {
      if (isLevel1) return;
      const nextVal = clampValue(-currentVal);
      setVal(nextVal);
      setRaw(nextVal.toString());
      return;
    }

    if (key === 'SWITCH') {
      const nextField = activeField === 'X' ? 'Y' : 'X';
      setActiveField(nextField);
      if (nextField === 'X') {
        inputXRef.current?.focus();
        inputXRef.current?.select();
      } else {
        inputYRef.current?.focus();
        inputYRef.current?.select();
      }
      return;
    }

    // Digit 0-9
    const digit = parseInt(key, 10);
    if (!isNaN(digit)) {
      const isNeg = currentVal < 0;
      const absVal = Math.abs(currentVal);
      let newNum: number;
      if (absVal === 0) {
        newNum = digit;
      } else {
        newNum = absVal * 10 + digit;
      }
      if (isNeg) newNum = -newNum;
      const clamped = clampValue(newNum);
      setVal(clamped);
      setRaw(clamped.toString());
    }
  };

  return (
    <div
      className={`border rounded-xl p-3 sm:p-4 flex flex-col gap-3 transition-all ${
        isDark
          ? 'bg-slate-900/95 border-slate-800 text-slate-100 shadow-lg'
          : 'bg-white border-slate-200 text-slate-900 shadow-xs'
      }`}
    >
      {/* 1. Trajectory & Telemetry Overview */}
      <div
        className={`p-3 rounded-xl border text-sm flex flex-col gap-2 ${
          isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span className="tracking-wide uppercase text-[11px] font-extrabold text-slate-600">Dual Weapon Telemetry</span>
          {hasWalls && (
            <span className="text-amber-600 flex items-center gap-1 font-mono text-xs font-bold">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              Barriers Active (Use Cannon)
            </span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className={`p-2 rounded-lg border ${isDark ? 'bg-sky-950/30 border-sky-900/60' : 'bg-sky-50 border-sky-200'}`}>
            <span className="text-sky-600 font-bold block text-[10px] uppercase font-sans">Laser (Linear):</span>
            <span className="font-bold truncate block">{equation}</span>
          </div>
          <div className={`p-2 rounded-lg border ${isDark ? 'bg-amber-950/30 border-amber-900/60' : 'bg-amber-50 border-amber-200'}`}>
            <span className="text-amber-600 font-bold block text-[10px] uppercase font-sans">Cannon (Quadratic):</span>
            <span className="font-bold truncate block">{quadCoeffs.equationStr}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs font-mono pt-1.5 border-t border-slate-200/60 dark:border-slate-800/60">
          <span>Slope m: <strong className={isDark ? 'text-sky-300' : 'text-sky-700'}>{slope.fractionStr}</strong></span>
          <span>Zero (y=0): <strong className={isDark ? 'text-amber-300' : 'text-amber-700'}>{lineRoots.rootStr}</strong></span>
        </div>
      </div>

      {/* 2. Trajectory & Slope / Parabola / Roots Telemetry Card */}
      <div
        className={`p-3.5 rounded-xl border text-sm flex flex-col gap-2.5 ${
          isDark ? 'bg-slate-950/60 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-2 font-mono text-sm sm:text-base truncate">
            <span className="text-slate-400 font-sans text-xs font-semibold uppercase">Eq:</span>
            <strong className={isDark ? 'text-sky-300' : 'text-sky-700 font-bold'}>
              {cannonType === 'linear' ? equation : quadCoeffs.equationStr}
            </strong>
          </div>

          <div className="font-mono text-sm shrink-0 text-slate-600">
            <span className="text-slate-400 font-sans text-xs font-semibold">Slope m: </span>
            <strong className={isDark ? 'text-amber-300' : 'text-amber-700 font-bold text-base'}>
              {slope.fractionStr}
            </strong>
          </div>
        </div>

        {/* Roots & Zeroes (y = 0) Row */}
        <div className={`flex items-center justify-between gap-2 pt-2 border-t font-mono text-sm ${
          isDark ? 'border-slate-800/80' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-1.5 truncate">
            <span className={isDark ? 'text-amber-400 font-sans text-xs font-semibold shrink-0' : 'text-amber-700 font-sans text-xs font-semibold shrink-0'}>Zero (y=0):</span>
            <strong className={isDark ? 'text-amber-300 font-bold' : 'text-slate-900 font-bold'} title={lineRoots.explanation}>
              {cannonType === 'linear' ? lineRoots.rootStr : quadCoeffs.roots.rootStr}
            </strong>
          </div>

          <div className="text-xs text-slate-500 shrink-0 font-sans">
            Distance: <span className="font-mono font-bold text-slate-800 text-sm">{distance}</span>
          </div>
        </div>

        {(cannonX !== 0 || cannonY !== 0) && (
          <div className={`flex items-center justify-between text-xs font-mono pt-2 border-t ${
            isDark ? 'border-slate-800/60 text-emerald-400' : 'border-slate-200 text-emerald-700 font-semibold'
          }`}>
            <span>Origin: ({cannonX}, {cannonY})</span>
            <span>Δx = {dx}, Δy = {dy}</span>
          </div>
        )}
      </div>

      {/* Wall Hint Callout if using Linear with Walls */}
      {hasWalls && cannonType === 'linear' && (
        <div className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
          isDark ? 'bg-amber-950/40 border-amber-800/60 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-900'
        }`}>
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
          <span className="leading-tight">Linear shot is blocked by walls. Switch to <strong>Quadratic</strong> to lob over barriers!</span>
        </div>
      )}

      {/* Mobile Battery Repositioning Controls (Enabled in Level 5, Custom Mission, Sandbox) */}
      {allowRepositionCannon && setCannonX && setCannonY && (
        <div className={`p-2.5 rounded-lg border flex flex-col gap-2 ${
          isDark ? 'border-emerald-800/80 bg-emerald-950/20' : 'border-emerald-200 bg-emerald-50/50'
        }`}>
          <div className="flex items-center justify-between text-xs font-bold text-emerald-700">
            <span className="flex items-center gap-1.5">
              <Move className="w-3.5 h-3.5 text-emerald-600" />
              Artillery Battery Base (X₀, Y₀)
            </span>
            <span className={`font-mono text-xs px-2 py-0.5 rounded border ${
              isDark ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300' : 'bg-white border-emerald-300 text-emerald-800 font-bold'
            }`}>
              ({cannonX}, {cannonY})
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {/* Battery X0 */}
            <div className={`flex items-center justify-between p-1.5 rounded border ${
              isDark ? 'bg-slate-900/80 border-slate-700/80' : 'bg-white border-slate-200'
            }`}>
              <span className="text-slate-500 font-medium">X₀ Base:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCannonX((x) => Math.max(-10, x - 1))}
                  className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  -
                </button>
                <span className="w-6 text-center font-mono font-bold text-emerald-700">{cannonX}</span>
                <button
                  type="button"
                  onClick={() => setCannonX((x) => Math.min(10, x + 1))}
                  className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  +
                </button>
              </div>
            </div>

            {/* Battery Y0 */}
            <div className={`flex items-center justify-between p-1.5 rounded border ${
              isDark ? 'bg-slate-900/80 border-slate-700/80' : 'bg-white border-slate-200'
            }`}>
              <span className="text-slate-500 font-medium">Y₀ Base:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCannonY((y) => Math.max(-10, y - 1))}
                  className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  -
                </button>
                <span className="w-6 text-center font-mono font-bold text-emerald-700">{cannonY}</span>
                <button
                  type="button"
                  onClick={() => setCannonY((y) => Math.min(10, y + 1))}
                  className={`w-5 h-5 flex items-center justify-center rounded text-xs font-bold ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Last Shot Telemetry Card (Displayed after firing) */}
      {lastShotResult && (
        <div
          className={`p-2.5 rounded-lg border text-xs flex flex-col gap-1.5 transition-all ${
            lastShotResult.hit
              ? isDark
                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                : 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              : isDark
              ? 'bg-slate-900 border-slate-700 text-slate-200'
              : 'bg-slate-50 border-slate-200 text-slate-800'
          }`}
        >
          <div className="flex items-center justify-between font-bold">
            <span className="flex items-center gap-1.5">
              {lastShotResult.hit ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
              )}
              {lastShotResult.hit ? 'Target Neutralized!' : 'Ballistic Feedback'}
            </span>
            <span className={`font-mono text-[11px] px-2 py-0.5 rounded border ${
              isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200 text-slate-700 font-bold'
            }`}>
              Aim: ({lastShotResult.x}, {lastShotResult.y})
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
            <div className={`p-1.5 rounded border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-slate-400 text-[10px] block font-sans">Equation:</span>
              <strong className={isDark ? 'text-sky-300' : 'text-sky-700'}>{lastShotResult.equationStr}</strong>
            </div>

            <div className={`p-1.5 rounded border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-white border-slate-200'}`}>
              <span className="text-slate-400 text-[10px] block font-sans">Zero (y=0):</span>
              <strong className={isDark ? 'text-amber-300' : 'text-amber-700'}>{lastShotResult.roots.rootStr}</strong>
            </div>
          </div>
        </div>
      )}
      {/* 3. Interactive X and Y Coordinate Inputs */}
      <div className="grid grid-cols-2 gap-2.5">
        {/* X Field (Horizontal Run) */}
        <div
          onClick={() => {
            setActiveField('X');
            inputXRef.current?.focus();
            inputXRef.current?.select();
          }}
          className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
            activeField === 'X'
              ? isDark
                ? 'border-sky-500 bg-sky-950/40 shadow-sm shadow-sky-500/20 ring-1 ring-sky-500/50'
                : 'border-sky-600 bg-sky-50/70 shadow-xs ring-2 ring-sky-100'
              : isDark
              ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-extrabold text-sm text-sky-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              X (Run)
            </span>
            <span className="text-xs text-slate-500 font-semibold">↔ Horizontal</span>
          </div>

          <div className="flex items-center justify-between gap-1 mt-1">
            {/* Real Interactive Editable Input */}
            <input
              ref={inputXRef}
              type="text"
              inputMode="numeric"
              value={rawX}
              onChange={handleXInputChange}
              onBlur={handleXBlur}
              onFocus={(e) => {
                setActiveField('X');
                e.target.select();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onFire(cannonType || 'linear');
                if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  handleStep('X', 1);
                }
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  handleStep('X', -1);
                }
              }}
              className={`w-16 sm:w-22 font-mono text-3xl sm:text-4xl font-black bg-transparent outline-none cursor-text ${
                inputX >= 0 ? (isDark ? 'text-sky-300' : 'text-sky-800') : 'text-amber-600'
              }`}
              title="Click to type X coordinate (-10 to 10)"
              aria-label="X coordinate horizontal run"
            />

            {/* Stepper & Sign Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {!isLevel1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSign('X');
                  }}
                  className={`w-8 h-8 flex items-center justify-center text-sm font-mono font-bold rounded-lg border transition-colors cursor-pointer ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-2xs'
                  }`}
                  title="Toggle +/- sign"
                >
                  ±
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStep('X', -1);
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-2xs'
                }`}
                title="Decrease X"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStep('X', 1);
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-2xs'
                }`}
                title="Increase X"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Y Field (Vertical Rise) */}
        <div
          onClick={() => {
            setActiveField('Y');
            inputYRef.current?.focus();
            inputYRef.current?.select();
          }}
          className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
            activeField === 'Y'
              ? isDark
                ? 'border-amber-500 bg-amber-950/40 shadow-sm shadow-amber-500/20 ring-1 ring-amber-500/50'
                : 'border-amber-600 bg-amber-50/70 shadow-xs ring-2 ring-amber-100'
              : isDark
              ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-1">
            <span className="font-extrabold text-sm text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span>
              Y (Rise)
            </span>
            <span className="text-xs text-slate-500 font-semibold">↕ Vertical</span>
          </div>

          <div className="flex items-center justify-between gap-1 mt-1">
            {/* Real Interactive Editable Input */}
            <input
              ref={inputYRef}
              type="text"
              inputMode="numeric"
              value={rawY}
              onChange={handleYInputChange}
              onBlur={handleYBlur}
              onFocus={(e) => {
                setActiveField('Y');
                e.target.select();
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onFire(cannonType || 'linear');
                if (e.key === 'ArrowUp') {
                  e.preventDefault();
                  handleStep('Y', 1);
                }
                if (e.key === 'ArrowDown') {
                  e.preventDefault();
                  handleStep('Y', -1);
                }
              }}
              className={`w-16 sm:w-22 font-mono text-3xl sm:text-4xl font-black bg-transparent outline-none cursor-text ${
                inputY >= 0 ? (isDark ? 'text-amber-300' : 'text-amber-800') : 'text-amber-600'
              }`}
              title="Click to type Y coordinate (-10 to 10)"
              aria-label="Y coordinate vertical rise"
            />

            {/* Stepper & Sign Buttons */}
            <div className="flex items-center gap-1 shrink-0">
              {!isLevel1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSign('Y');
                  }}
                  className={`w-8 h-8 flex items-center justify-center text-sm font-mono font-bold rounded-lg border transition-colors cursor-pointer ${
                    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-2xs'
                  }`}
                  title="Toggle +/- sign"
                >
                  ±
                </button>
              )}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStep('Y', -1);
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-2xs'
                }`}
                title="Decrease Y"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStep('Y', 1);
                }}
                className={`w-8 h-8 flex items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 shadow-2xs'
                }`}
                title="Increase Y"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Action Buttons Row: Dual Weapons (Laser vs Cannon) + Keypad */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          {/* Weapon 1: Fire Laser (Linear: y = mx) */}
          <button
            type="button"
            onClick={() => onFire('linear')}
            disabled={isFiring || (inputX === cannonX && inputY === cannonY)}
            className={`py-3 px-2 sm:px-3 rounded-xl font-extrabold text-xs sm:text-sm tracking-wider uppercase flex flex-col items-center justify-center gap-0.5 transition-all shadow-md active:scale-[0.98] cursor-pointer ${
              isFiring
                ? 'bg-slate-400 text-white cursor-not-allowed opacity-60'
                : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sky-600/30 ring-1 ring-sky-400/50'
            }`}
            title="Fire straight linear laser beam (y = mx)"
          >
            <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
              <Crosshair className="w-4 h-4 shrink-0 text-sky-200" />
              <span>Fire Laser</span>
            </div>
            <span className="font-mono text-[10px] opacity-90 normal-case font-bold tracking-normal">
              Linear (y = mx)
            </span>
          </button>

          {/* Weapon 2: Fire Cannon (Quadratic: y = ax² + bx) */}
          <button
            type="button"
            onClick={() => onFire('quadratic')}
            disabled={isFiring || (inputX === cannonX && inputY === cannonY)}
            className={`py-3 px-2 sm:px-3 rounded-xl font-extrabold text-xs sm:text-sm tracking-wider uppercase flex flex-col items-center justify-center gap-0.5 transition-all shadow-md active:scale-[0.98] cursor-pointer ${
              isFiring
                ? 'bg-slate-400 text-white cursor-not-allowed opacity-60'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30 ring-1 ring-amber-400/50'
            }`}
            title="Fire parabolic quadratic mortar cannon (y = ax² + bx)"
          >
            <div className="flex items-center gap-1.5 font-black text-xs sm:text-sm">
              <Zap className="w-4 h-4 shrink-0 text-amber-200" />
              <span>Fire Cannon</span>
            </div>
            <span className="font-mono text-[10px] opacity-90 normal-case font-bold tracking-normal">
              Quadratic (y = ax² + bx)
            </span>
          </button>
        </div>

        {/* Tactile Keypad Toggle */}
        <button
          type="button"
          onClick={() => setShowNumpad(!showNumpad)}
          className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
            showNumpad
              ? isDark
                ? 'bg-slate-800 border-slate-600 text-white'
                : 'bg-slate-200 border-slate-300 text-slate-900 shadow-2xs'
              : isDark
              ? 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 shadow-2xs'
          }`}
          title="Toggle on-screen tactile keypad"
        >
          <Keyboard className="w-3.5 h-3.5" />
          <span>{showNumpad ? 'Hide Tactile Keypad' : 'Show Tactile Keypad'}</span>
        </button>
      </div>

      {/* 5. On-screen Tactile Numpad for Tablets & Quick Clicks */}
      {showNumpad && (
        <div
          className={`pt-3 border-t grid grid-cols-4 gap-1.5 animate-in fade-in duration-150 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => handleKeypadPress(num.toString())}
              className={`py-2.5 text-base font-mono font-bold rounded-lg border transition-all active:scale-95 cursor-pointer ${
                isDark
                  ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-100'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900 shadow-2xs'
              }`}
            >
              {num}
            </button>
          ))}

          {/* Special Key: Invert Sign */}
          <button
            type="button"
            onClick={() => handleKeypadPress('+/-')}
            disabled={isLevel1}
            className={`py-2.5 text-base font-mono font-bold rounded-lg border transition-all active:scale-95 cursor-pointer ${
              isLevel1
                ? 'opacity-30 cursor-not-allowed bg-slate-100 border-slate-200 text-slate-400'
                : isDark
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400'
                : 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800 shadow-2xs'
            }`}
            title="Invert +/- sign"
          >
            ±
          </button>

          {/* Zero */}
          <button
            type="button"
            onClick={() => handleKeypadPress('0')}
            className={`py-2.5 text-base font-mono font-bold rounded-lg border transition-all active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-100'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900 shadow-2xs'
            }`}
          >
            0
          </button>

          {/* Backspace */}
          <button
            type="button"
            onClick={() => handleKeypadPress('BACKSPACE')}
            className={`py-2.5 text-sm font-bold rounded-lg border transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300'
                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700 shadow-2xs'
            }`}
            title="Backspace"
          >
            <Delete className="w-4 h-4" />
          </button>

          {/* Clear */}
          <button
            type="button"
            onClick={() => handleKeypadPress('CLEAR')}
            className={`py-2.5 text-xs font-bold rounded-lg border transition-all active:scale-95 flex items-center justify-center cursor-pointer ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-rose-400'
                : 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-700 shadow-2xs'
            }`}
            title="Reset to 0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Switch Focus Button */}
          <button
            type="button"
            onClick={() => handleKeypadPress('SWITCH')}
            className={`col-span-4 py-2 text-xs font-bold rounded-lg border transition-all active:scale-95 cursor-pointer ${
              isDark
                ? 'bg-sky-950/60 hover:bg-sky-900/80 border-sky-800 text-sky-300'
                : 'bg-sky-50 hover:bg-sky-100 border-sky-200 text-sky-800'
            }`}
          >
            Active Field: <strong>[{activeField}]</strong> (Click to switch to [{activeField === 'X' ? 'Y' : 'X'}])
          </button>
        </div>
      )}
    </div>
  );
};
