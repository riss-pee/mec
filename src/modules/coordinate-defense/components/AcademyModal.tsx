import React from 'react';
import { X, BookOpen, Compass, MoveRight, MoveUp, CheckCircle, Calculator } from 'lucide-react';
import { ThemeMode } from '../types/game';

interface AcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const AcademyModal: React.FC<AcademyModalProps> = ({ isOpen, onClose, theme }) => {
  if (!isOpen) return null;
  const isDark = theme === 'tactical';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl p-6 ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b mb-6 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600'}`}>
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Coordinate Geometry Field Manual</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Core principles for mastering Cartesian space and linear targeting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-lg transition-colors ${
              isDark ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Modules */}
        <div className="space-y-6 text-sm">
          {/* Rule 1: Run Before Rise */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className={`font-bold text-base flex items-center gap-2 mb-2 ${isDark ? 'text-sky-400' : 'text-sky-700'}`}>
              <MoveRight className="w-4 h-4" />
              1. Ordered Pairs (X, Y) — "Run Across Before You Rise Up"
            </h3>
            <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              Coordinates are always written as <strong>(x, y)</strong> in alphabetical order. Horizontal position comes <em>first</em>, vertical position comes <em>second</em>.
            </p>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-lg border ${
                isDark ? 'bg-sky-950/40 border-sky-800/60 text-slate-300' : 'bg-sky-50/80 border-sky-200 text-sky-950'
              }`}>
                <span className={`font-bold block mb-1 ${isDark ? 'text-sky-300' : 'text-sky-800'}`}>X-Coordinate (Run)</span>
                <span>Horizontal movement along the floor. Positive (+) goes <strong>Right</strong>, Negative (-) goes <strong>Left</strong>.</span>
              </div>
              <div className={`p-3 rounded-lg border ${
                isDark ? 'bg-amber-950/40 border-amber-800/60 text-slate-300' : 'bg-amber-50/80 border-amber-200 text-amber-950'
              }`}>
                <span className={`font-bold block mb-1 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>Y-Coordinate (Rise)</span>
                <span>Vertical movement like an elevator. Positive (+) goes <strong>Up</strong>, Negative (-) goes <strong>Down</strong>.</span>
              </div>
            </div>
          </div>

          {/* Rule 2: The Four Quadrants */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className={`font-bold text-base flex items-center gap-2 mb-2 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
              <Compass className="w-4 h-4" />
              2. The Four Quadrants & Sign Rules
            </h3>
            <p className={`text-xs leading-relaxed mb-3 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              The Cartesian plane is divided into four zones by the X and Y axes, counted counter-clockwise starting from top-right:
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className={`p-2.5 rounded-lg border ${
                isDark ? 'bg-emerald-950/40 border-emerald-800/60' : 'bg-emerald-50 border-emerald-200 text-emerald-950'
              }`}>
                <div className={`font-bold ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>Quadrant I (+, +)</div>
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Top-Right · Right (+X) & Up (+Y)</div>
              </div>
              <div className={`p-2.5 rounded-lg border ${
                isDark ? 'bg-blue-950/40 border-blue-800/60' : 'bg-blue-50 border-blue-200 text-blue-950'
              }`}>
                <div className={`font-bold ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>Quadrant II (-, +)</div>
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Top-Left · Left (-X) & Up (+Y)</div>
              </div>
              <div className={`p-2.5 rounded-lg border ${
                isDark ? 'bg-amber-950/40 border-amber-800/60' : 'bg-amber-50 border-amber-200 text-amber-950'
              }`}>
                <div className={`font-bold ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>Quadrant III (-, -)</div>
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Bottom-Left · Left (-X) & Down (-Y)</div>
              </div>
              <div className={`p-2.5 rounded-lg border ${
                isDark ? 'bg-purple-950/40 border-purple-800/60' : 'bg-purple-50 border-purple-200 text-purple-950'
              }`}>
                <div className={`font-bold ${isDark ? 'text-purple-300' : 'text-purple-800'}`}>Quadrant IV (+, -)</div>
                <div className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Bottom-Right · Right (+X) & Down (-Y)</div>
              </div>
            </div>
          </div>

          {/* Rule 3: Slope & Linear Trajectories */}
          <div className={`p-4 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <h3 className={`font-bold text-base flex items-center gap-2 mb-2 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
              <Calculator className="w-4 h-4" />
              3. Slope and Linear Trajectories (m = y / x)
            </h3>
            <p className={`text-xs leading-relaxed mb-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
              For any shot fired from the origin (0, 0) to a target at (x, y), the slope <strong>m</strong> represents the steepness ratio:
            </p>
            <div className={`p-3 rounded-lg border font-mono text-xs space-y-1 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className={`font-bold ${isDark ? 'text-sky-300' : 'text-sky-700'}`}>m = Rise / Run = Δy / Δx = y / x</div>
              <div className={isDark ? 'text-slate-400' : 'text-slate-500'}>Line Equation: y = mx</div>
              <div className={`text-[11px] ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                Example: Target at (3, 6) → slope m = 6 / 3 = 2 → Equation: y = 2x.
              </div>
            </div>
            <p className={`text-xs mt-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              In <strong>Level 4 (Linear Railgun)</strong>, all targets that lie along the same line equation can be pierced simultaneously in a single strike!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className={`mt-6 pt-4 border-t flex justify-end ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 font-semibold text-xs text-white transition-colors"
          >
            Understood, Return to Grid
          </button>
        </div>
      </div>
    </div>
  );
};
