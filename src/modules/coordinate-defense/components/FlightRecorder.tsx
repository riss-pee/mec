import React from 'react';
import { ShotResult, ThemeMode } from '../types/game';
import { History, CheckCircle2, AlertTriangle, ArrowRightLeft, X, Trash2 } from 'lucide-react';

interface FlightRecorderProps {
  shots: ShotResult[];
  onClear: () => void;
  isOpen: boolean;
  onClose: () => void;
  theme: ThemeMode;
}

export const FlightRecorder: React.FC<FlightRecorderProps> = ({
  shots,
  onClear,
  isOpen,
  onClose,
  theme,
}) => {
  if (!isOpen) return null;
  const isDark = theme === 'tactical';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className={`relative w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl p-5 ${
          isDark ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-3 border-b mb-4 ${
          isDark ? 'border-slate-800' : 'border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600'}`}>
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Flight Recorder & Diagnostic Log</h2>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {shots.length} shots recorded this session
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {shots.length > 0 && (
              <button
                onClick={onClear}
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'text-slate-400 hover:text-rose-400 hover:bg-slate-800' : 'text-slate-400 hover:text-rose-600 hover:bg-slate-100'
                }`}
                title="Clear flight history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-1.5 rounded-lg transition-colors ${
                isDark ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800' : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of Shots */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {shots.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-500">
              No ballistic telemetry recorded yet. Fire the cannon to begin tracking diagnostic data.
            </div>
          ) : (
            shots.map((shot, idx) => {
              const isHit = shot.hit;
              const isInverted = shot.diagnostic.type === 'inverted';

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                    isHit
                      ? isDark
                        ? 'bg-emerald-950/30 border-emerald-800/40 text-emerald-200'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : isInverted
                      ? isDark
                        ? 'bg-amber-950/30 border-amber-800/40 text-amber-200'
                        : 'bg-amber-50 border-amber-200 text-amber-900'
                      : isDark
                      ? 'bg-slate-950/50 border-slate-800 text-slate-300'
                      : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {isHit ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    ) : isInverted ? (
                      <ArrowRightLeft className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                    )}

                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-mono font-bold text-sm">
                          Shot #{shots.length - idx}: Aim ({shot.x}, {shot.y})
                        </span>
                        {(shot.cannonX !== 0 || shot.cannonY !== 0) && (
                          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border ${
                            isDark ? 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300' : 'bg-emerald-100 border-emerald-200 text-emerald-800'
                          }`}>
                            From ({shot.cannonX}, {shot.cannonY})
                          </span>
                        )}
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border font-bold ${
                          isDark ? 'bg-sky-950/80 border-sky-700/60 text-sky-300' : 'bg-sky-100 border-sky-200 text-sky-800'
                        }`}>
                          {shot.equationStr}
                        </span>
                        {shot.roots && (
                          <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded border font-bold ${
                            isDark ? 'bg-amber-950/80 border-amber-700/60 text-amber-300' : 'bg-amber-100 border-amber-200 text-amber-800'
                          }`}>
                            Zero: {shot.roots.rootStr}
                          </span>
                        )}
                        {shot.calculatedAim && (
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 font-black">
                            2× CALCULATED AIM
                          </span>
                        )}
                      </div>
                      <p className={`text-[11px] leading-tight ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        {shot.diagnostic.message}
                      </p>
                    </div>
                  </div>

                  <div className={`text-right font-mono text-[11px] shrink-0 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    <div>m = {shot.slopeStr}</div>
                    <div className="text-[10px]">{new Date(shot.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
