import React from 'react';
import { FacingDirection, VehicleModel } from '../types';
import { CarGraphic } from './CarGraphic';

interface NumberLineRoadProps {
  currentPos: number;
  minRange: number;
  maxRange: number;
  direction: FacingDirection;
  vehicleModel: VehicleModel;
  isDriving: boolean;
  isReversing: boolean;
  isTurning: boolean;
  targetPos: number | null;
  lastMoveArc?: {
    start: number;
    end: number;
    delta: number;
  } | null;
  onSelectCoordinate?: (coord: number) => void;
}

export const NumberLineRoad: React.FC<NumberLineRoadProps> = ({
  currentPos,
  minRange,
  maxRange,
  direction,
  vehicleModel,
  isDriving,
  isReversing,
  isTurning,
  targetPos,
  lastMoveArc,
  onSelectCoordinate,
}) => {
  // Generate array of integer coordinates
  const coordinates: number[] = [];
  for (let i = minRange; i <= maxRange; i++) {
    coordinates.push(i);
  }

  const totalSteps = maxRange - minRange;
  // Calculate percentage along the line (0% at minRange, 100% at maxRange)
  const getPercentage = (val: number) => {
    return ((val - minRange) / totalSteps) * 100;
  };

  const carPercent = Math.max(0, Math.min(100, getPercentage(currentPos)));
  const targetPercent = targetPos !== null ? Math.max(0, Math.min(100, getPercentage(targetPos))) : null;

  return (
    <div className="relative w-full rounded-2xl bg-white border border-slate-200/90 p-2.5 sm:p-3 shadow-sm select-none">
      {/* Target & Arc Layer + Car Stage */}
      <div className="relative w-full px-6 sm:px-10 pt-2 pb-0.5">
        {/* Jump Arc Visualizer for previous move */}
        {lastMoveArc && (
          <div className="absolute top-0 left-6 right-6 sm:left-10 sm:right-10 h-8 pointer-events-none z-10">
            {(() => {
              const p1 = getPercentage(lastMoveArc.start);
              const p2 = getPercentage(lastMoveArc.end);
              const left = Math.min(p1, p2);
              const width = Math.abs(p2 - p1);
              const isForward = lastMoveArc.delta > 0;

              return (
                <div
                  className="absolute h-8 transition-all duration-500 ease-out"
                  style={{
                    left: `${left}%`,
                    width: `${Math.max(width, 2)}%`,
                  }}
                >
                  <svg className="w-full h-full overflow-visible">
                    <path
                      d={`M 0 24 Q ${50}% 0, 100% 24`}
                      fill="none"
                      stroke={isForward ? '#059669' : '#e11d48'}
                      strokeWidth="3"
                      strokeDasharray="6 3"
                      className="animate-pulse"
                    />
                  </svg>
                  <div
                    className={`absolute -top-1 left-1/2 -translate-x-1/2 px-1.5 py-0.1 rounded-md text-[9px] font-extrabold shadow-sm border ${
                      isForward
                        ? 'bg-emerald-600 text-white border-emerald-500'
                        : 'bg-rose-600 text-white border-rose-500'
                    }`}
                  >
                    {lastMoveArc.delta > 0 ? `+${lastMoveArc.delta}` : `${lastMoveArc.delta}`}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Target Flag / Milestone */}
        {targetPercent !== null && (
          <div
            className="absolute -top-2 z-20 -translate-x-1/2 transition-all duration-300 pointer-events-none"
            style={{ left: `calc(24px + (100% - 48px) * ${targetPercent / 100})` }}
          >
            <div className="flex flex-col items-center animate-bounce">
              <span className="text-lg drop-shadow-sm">🚩</span>
              <span className="bg-amber-400 text-amber-950 font-black text-[9px] px-1.5 py-0.2 rounded-full shadow-sm border border-amber-300">
                GOAL {targetPos! > 0 ? `+${targetPos}` : targetPos}
              </span>
            </div>
          </div>
        )}

        {/* Car Position on Track */}
        <div className="relative h-16 w-full mb-0.5">
          <div
            className="absolute bottom-0 -translate-x-1/2 transition-all duration-300 ease-out z-20"
            style={{
              left: `calc(24px + (100% - 48px) * ${carPercent / 100})`,
            }}
          >
            <CarGraphic
              model={vehicleModel}
              direction={direction}
              isDriving={isDriving}
              isReversing={isReversing}
              isTurning={isTurning}
            />
          </div>
        </div>

        {/* The Clean Road Surface Strip in light theme */}
        <div className="relative h-8 sm:h-9 w-full rounded-xl bg-slate-700 shadow-inner border border-slate-600 flex items-center overflow-hidden">
          {/* Subtle curbs */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-400" />

          {/* Road center dashes */}
          <div
            className={`w-full h-0.5 border-t-2 border-dashed border-amber-200/80 transition-all ${
              isDriving ? 'animate-pulse' : ''
            }`}
          />

          {/* Origin zero marker line crossing the track */}
          <div
            className="absolute top-0 bottom-0 w-1 bg-amber-300 shadow-[0_0_6px_#fde047] z-10"
            style={{
              left: `calc(24px + (100% - 48px) * ${getPercentage(0) / 100})`,
            }}
          />
        </div>

        {/* The Number Line Ruler & Ticks */}
        <div className="relative mt-1">
          {/* Horizontal Line Axis */}
          <div className="h-1 w-full bg-slate-400 rounded-full relative">
            <div className="absolute -left-2 -top-1.5 text-slate-600 font-bold text-xs leading-none">
              ◀
            </div>
            <div className="absolute -right-2 -top-1.5 text-slate-600 font-bold text-xs leading-none">
              ▶
            </div>
          </div>

          {/* Coordinate Markers and Ticks */}
          <div className="relative h-8 mt-0.5">
            {coordinates.map((coord) => {
              const isZero = coord === 0;
              const isPositive = coord > 0;
              const isCurrent = coord === currentPos;
              const isTarget = coord === targetPos;

              return (
                <button
                  key={coord}
                  type="button"
                  onClick={() => onSelectCoordinate?.(coord)}
                  title={`Coordinate ${coord > 0 ? `+${coord}` : coord}. Click to position.`}
                  className="group absolute -translate-x-1/2 flex flex-col items-center focus:outline-none cursor-pointer"
                  style={{
                    left: `calc(24px + (100% - 48px) * ${getPercentage(coord) / 100})`,
                  }}
                >
                  {/* Tick Mark */}
                  <div
                    className={`w-0.5 transition-all ${
                      isZero
                        ? 'h-3.5 bg-amber-600 w-1'
                        : coord % 5 === 0
                        ? 'h-3 bg-slate-700'
                        : 'h-1.5 bg-slate-400'
                    }`}
                  />

                  {/* Numeric Label */}
                  <div
                    className={`mt-0.5 font-bold text-[10px] sm:text-xs tabular-nums px-1 py-0.2 rounded transition-all select-none ${
                      isCurrent
                        ? 'bg-indigo-600 text-white font-extrabold scale-110 shadow-sm ring-1 ring-indigo-300'
                        : isTarget
                        ? 'bg-amber-400 text-amber-950 font-black scale-105'
                        : isZero
                        ? 'bg-amber-100 text-amber-900 font-black border border-amber-300'
                        : isPositive
                        ? 'text-emerald-700 group-hover:bg-emerald-50 group-hover:text-emerald-900 font-semibold'
                        : 'text-rose-700 group-hover:bg-rose-50 group-hover:text-rose-900 font-semibold'
                    }`}
                  >
                    {isZero ? '0' : isPositive ? `+${coord}` : coord}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
