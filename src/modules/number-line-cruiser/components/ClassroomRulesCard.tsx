import React from 'react';
import { MoveStep } from '../types';
import { BookOpen, ListOrdered, Trash2 } from 'lucide-react';

interface ClassroomRulesCardProps {
  history: MoveStep[];
  onClearHistory: () => void;
}

export const ClassroomRulesCard: React.FC<ClassroomRulesCardProps> = ({
  history,
  onClearHistory,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-3">
      {/* 4 Universal Rules of Integers Card */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
        <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-slate-200">
          <BookOpen className="w-4 h-4 text-sky-600" />
          <h3 className="font-extrabold text-xs text-slate-800">Integer Movement Rules</h3>
        </div>

        <div className="space-y-1.5">
          {/* Rule 1 */}
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-2">
            <span className="text-sm">🚗➡️</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-emerald-800 font-mono">
                  (+) × (+) = (+)
                </span>
                <span className="text-[10px] text-slate-600 font-semibold">Forward & Forward</span>
              </div>
              <p className="text-[10px] text-slate-600">
                Facing Forward (+) & Driving Forward (Add): <strong className="text-emerald-800">Moves Right (+)</strong>
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-2">
            <span className="text-sm">🚗⏪</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-amber-800 font-mono">
                  (+) × (−) = (−)
                </span>
                <span className="text-[10px] text-slate-600 font-semibold">Forward & Reverse</span>
              </div>
              <p className="text-[10px] text-slate-600">
                Facing Forward (+) & Reversing (Subtract): <strong className="text-amber-800">Moves Left (−)</strong>
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="p-2 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2">
            <span className="text-sm">⬅️🚗</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-rose-800 font-mono">
                  (−) × (+) = (−)
                </span>
                <span className="text-[10px] text-slate-600 font-semibold">Rear & Forward</span>
              </div>
              <p className="text-[10px] text-slate-600">
                Facing Rear (−) & Driving Forward: <strong className="text-rose-800">Moves Left (−)</strong>
              </p>
            </div>
          </div>

          {/* Rule 4: The Golden Rule */}
          <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-200 flex items-start gap-2 shadow-2xs">
            <span className="text-sm">✨⏪</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-indigo-800 font-mono">
                  (−) × (−) = (+)
                </span>
                <span className="text-[10px] text-indigo-900 font-bold">Rear & Reverse</span>
              </div>
              <p className="text-[10px] text-indigo-800">
                Facing Rear (−) & Reversing (Subtract): <strong className="text-indigo-950 font-black">Moves Right (+)!</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Driver's Log & Move History */}
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-emerald-600" />
              <h3 className="font-extrabold text-xs text-slate-800">Calculation Log</h3>
              <span className="text-[10px] font-semibold text-slate-500">({history.length} moves)</span>
            </div>
            {history.length > 0 && (
              <button
                type="button"
                onClick={onClearHistory}
                className="text-[11px] text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="h-28 flex flex-col items-center justify-center text-slate-400 text-xs text-center p-2">
              <span className="text-2xl mb-1">🚥</span>
              <span className="font-medium text-slate-500">No drives logged yet.</span>
              <span className="text-[10px] text-slate-400">Drive the car to record calculations!</span>
            </div>
          ) : (
            <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
              {history.map((step, idx) => (
                <div
                  key={step.id || idx}
                  className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 font-mono text-[9px] flex items-center justify-center font-bold">
                      {history.length - idx}
                    </span>
                    <div>
                      <div className="font-mono font-bold text-slate-800 text-[11px]">
                        {step.equation}
                      </div>
                      <div className="text-[9px] text-slate-500">
                        {step.ruleExplanation}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`font-mono font-black text-xs px-1.5 py-0.2 rounded ${
                        step.endPos === 0
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : step.endPos > 0
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-rose-100 text-rose-900 border border-rose-300'
                      }`}
                    >
                      {step.endPos > 0 ? `+${step.endPos}` : step.endPos}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-2 pt-1 text-[10px] text-slate-500 border-t border-slate-100 flex items-center justify-between">
          <span>Tip: Ask students to predict the final coordinate before driving!</span>
        </div>
      </div>
    </div>
  );
};
