import React, { useState, useEffect } from 'react';
import { Mission } from '../types';
import { Award, ChevronRight, HelpCircle } from 'lucide-react';

interface MissionsPanelProps {
  missions: Mission[];
  currentMissionIndex: number;
  completedMissionIds: number[];
  isMissionCompleted: boolean;
  customTargetPos: number | null;
  currentPos: number;
  minRange: number;
  maxRange: number;
  onSelectMission: (index: number) => void;
  onNextMission: () => void;
  onRestartMission: () => void;
  onUpdateTargetPos: (targetPos: number) => void;
  onUpdateVehiclePos: (pos: number) => void;
}

export const MissionsPanel: React.FC<MissionsPanelProps> = ({
  missions,
  currentMissionIndex,
  completedMissionIds,
  isMissionCompleted,
  customTargetPos,
  currentPos,
  minRange,
  maxRange,
  onSelectMission,
  onNextMission,
  onRestartMission,
  onUpdateTargetPos,
  onUpdateVehiclePos,
}) => {
  const currentMission = missions[currentMissionIndex];
  const [showHint, setShowHint] = useState(false);

  const activeTargetPos = customTargetPos !== null ? customTargetPos : currentMission.targetPos;

  // Local draft inputs for Teacher Customization integrated directly into the panel
  const [carPosInput, setCarPosInput] = useState<string>(currentPos.toString());
  const [goalInput, setGoalInput] = useState<string>(activeTargetPos.toString());

  // Keep inputs in sync when car position or mission changes externally
  useEffect(() => {
    setCarPosInput(currentPos.toString());
  }, [currentPos]);

  useEffect(() => {
    setGoalInput(activeTargetPos.toString());
  }, [activeTargetPos]);

  const handleCarPosBlur = () => {
    const parsed = parseInt(carPosInput, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(minRange, Math.min(maxRange, parsed));
      onUpdateVehiclePos(clamped);
      setCarPosInput(clamped.toString());
    } else {
      setCarPosInput(currentPos.toString());
    }
  };

  const handleGoalBlur = () => {
    const parsed = parseInt(goalInput, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(minRange, Math.min(maxRange, parsed));
      onUpdateTargetPos(clamped);
      setGoalInput(clamped.toString());
    } else {
      setGoalInput(activeTargetPos.toString());
    }
  };

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    type: 'car' | 'goal'
  ) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-xl p-2.5 shadow-sm">
      {/* Top Header with Level Selector */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-200">
        <div className="flex items-center gap-1.5">
          <Award className="w-3.5 h-3.5 text-amber-500" />
          <h4 className="font-extrabold text-xs text-slate-800">Math Missions</h4>
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
            {completedMissionIds.length}/{missions.length} Solved ⭐
          </span>
          {customTargetPos !== null && (
            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Custom Values Active
            </span>
          )}
        </div>

        {/* Level Selector buttons */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {missions.map((m, idx) => {
            const isCompleted = completedMissionIds.includes(m.id);
            const isCurrent = idx === currentMissionIndex;

            return (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  onSelectMission(idx);
                  setShowHint(false);
                }}
                className={`w-6 h-6 rounded-md font-bold text-[10px] flex items-center justify-center transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-400 text-amber-950 ring-2 ring-amber-300 font-black shadow-xs'
                    : isCompleted
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold'
                    : 'bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200'
                }`}
                title={`Level ${m.id}: ${m.title}`}
              >
                {isCompleted ? '✓' : m.id}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Integrated Mission Section with In-Place Editable Blank Fields */}
      <div className="mt-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        {/* Left Side: Story & Objectives */}
        <div className="space-y-0.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 shrink-0">
              LVL {currentMission.id}
            </span>
            <span className="text-xs font-bold text-slate-800 truncate">
              {currentMission.title}
            </span>
          </div>

          <p className="text-[11px] text-slate-600 line-clamp-1">
            {currentMission.story}
          </p>

          <div className="text-[10px] font-semibold text-slate-500">
            🎯 Objective: {currentMission.objective}
          </div>
        </div>

        {/* Right Side: Integrated Editable Blank Fields for Teacher & Actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {/* Integrated Blank Field 1: Car Position */}
          <div className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-lg border border-slate-200">
            <label className="text-[9px] font-bold text-slate-500 uppercase tracking-tight block">
              Car Pos:
            </label>
            <input
              type="number"
              min={minRange}
              max={maxRange}
              value={carPosInput}
              onChange={(e) => setCarPosInput(e.target.value)}
              onBlur={handleCarPosBlur}
              onKeyDown={(e) => handleInputKeyDown(e, 'car')}
              title={`Edit starting coordinate (${minRange} to +${maxRange}). Press Enter or click outside to set.`}
              className="w-11 px-1 py-0.5 text-xs font-black font-mono text-center bg-white border border-indigo-300 rounded shadow-2xs text-indigo-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Integrated Blank Field 2: Target Goal */}
          <div className="flex items-center gap-1 bg-amber-50/70 px-2 py-1 rounded-lg border border-amber-300">
            <label className="text-[9px] font-bold text-amber-800 uppercase tracking-tight block">
              Goal:
            </label>
            <input
              type="number"
              min={minRange}
              max={maxRange}
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              onBlur={handleGoalBlur}
              onKeyDown={(e) => handleInputKeyDown(e, 'goal')}
              title={`Edit target goal coordinate (${minRange} to +${maxRange}). Press Enter or click outside to set.`}
              className="w-11 px-1 py-0.5 text-xs font-black font-mono text-center bg-white border border-amber-400 rounded shadow-2xs text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          {/* Next Level / Restart Button */}
          {isMissionCompleted ? (
            currentMissionIndex < missions.length - 1 ? (
              <button
                type="button"
                onClick={onNextMission}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1 transition-all cursor-pointer shadow-sm"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs text-amber-700 font-black">
                Done! 🏆
              </span>
            )
          ) : (
            <button
              type="button"
              onClick={onRestartMission}
              className="px-2 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-[10px] font-semibold cursor-pointer"
            >
              Reset
            </button>
          )}

          {/* Hint Button */}
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-[10px] text-amber-600 hover:text-amber-800 p-1 cursor-pointer"
            title="Toggle Math Hint"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showHint && (
        <div className="mt-1.5 p-1.5 bg-amber-50 border border-amber-300 rounded-lg text-[10px] text-amber-900 font-medium">
          💡 <span className="font-bold">Hint:</span> {currentMission.hint}
        </div>
      )}
    </div>
  );
};
