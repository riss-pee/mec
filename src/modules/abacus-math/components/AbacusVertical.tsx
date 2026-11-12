import React from 'react';
import { motion } from 'motion/react';
import { PlaceValueConfig } from '../types';
import { playBeadSound } from '../utils/audio';

interface AbacusVerticalProps {
  columns: PlaceValueConfig[]; // Same as rows, but displayed left-to-right (high power to low power)
  beadStates: { [exponent: number]: number };
  onBeadChange: (exponent: number, activeCount: number) => void;
  beadTheme: string;
  isCompact?: boolean;
}

export const AbacusVertical: React.FC<AbacusVerticalProps> = ({
  columns,
  beadStates,
  onBeadChange,
  beadTheme,
  isCompact = false,
}) => {
  // Sort columns: highest power of 10 on the left, units (1s) on the far right
  const sortedColumns = [...columns].sort((a, b) => b.exponent - a.exponent);

  // Handle clicking a bead: active beads are counted at the bottom, directly above the digit readout
  const handleBeadClick = (exponent: number, clickedIndex: number, currentActive: number) => {
    const isActive = clickedIndex >= (10 - currentActive);
    
    if (!isActive) {
      // Clicked an inactive bead (at the top)
      // Slide this bead and all inactive beads below it down to the active bottom side
      const newActive = 10 - clickedIndex;
      playBeadSound(false, 0.7 + (exponent * 0.15));
      onBeadChange(exponent, newActive);
    } else {
      // Clicked an active bead (at the bottom)
      // Slide this bead and all active beads above it back up to the inactive top side
      const newActive = 9 - clickedIndex;
      playBeadSound(true, 0.7 + (exponent * 0.15));
      onBeadChange(exponent, newActive);
    }
  };

  const getBeadStyle = (config: PlaceValueConfig, isActive: boolean) => {
    const sizeClasses = isCompact 
      ? "h-4 w-7 sm:h-5 sm:w-8 md:h-5 md:w-9 rounded-full border-x border-y-2"
      : "h-5 w-8 sm:h-6 sm:w-10 md:h-6 md:w-11 rounded-full border-x-2 border-y-2";
    const baseStyle = `${sizeClasses} shadow-sm cursor-pointer transition-all duration-150 transform hover:scale-105 active:scale-95 flex items-center justify-center relative shrink-0`;
    
    if (beadTheme === 'wooden') {
      return `${baseStyle} bg-amber-800 border-amber-950 border-x-amber-700 shadow-amber-900/40`;
    }
    if (beadTheme === 'candy') {
      return `${baseStyle} ${config.beadColor} border-white/20`;
    }
    if (beadTheme === 'cosmic') {
      return `${baseStyle} bg-slate-800 border-slate-950 border-x-cyan-500/50 shadow-cyan-900/30`;
    }
    return `${baseStyle} ${config.beadColor}`;
  };

  return (
    <div className={`w-full bg-amber-950/10 rounded-2xl border border-amber-900/20 shadow-inner ${isCompact ? 'p-1.5 sm:p-2.5' : 'p-2 sm:p-4'}`}>
      {/* Outer Wooden Cabinet */}
      <div className={`relative bg-stone-900 rounded-xl shadow-lg overflow-hidden border-amber-900 ${
        isCompact 
          ? 'border-4 sm:border-6 md:border-8 p-1.5 sm:p-2.5' 
          : 'border-6 sm:border-8 md:border-[10px] p-2 sm:p-3.5'
      }`}>
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/40 pointer-events-none z-10" />
        
        {/* Horizontal dividing beams of the cabinet */}
        <div className="absolute top-[32%] inset-x-0 h-0.5 sm:h-1 bg-amber-950/80 pointer-events-none z-10" />
        <div className="absolute bottom-[32%] inset-x-0 h-0.5 sm:h-1 bg-amber-950/80 pointer-events-none z-10" />

        {/* Rods container (flowing horizontally, side-by-side) */}
        <div className={`flex justify-around items-stretch relative z-20 ${
          isCompact ? 'min-h-[170px] sm:min-h-[195px] md:min-h-[220px]' : 'min-h-[210px] sm:min-h-[240px] md:min-h-[270px]'
        }`}>
          {sortedColumns.map((col) => {
            const activeCount = beadStates[col.exponent] || 0;
            const inactiveCount = 10 - activeCount;

            return (
              <div 
                key={col.exponent} 
                className="relative flex flex-col items-center flex-grow py-1 sm:py-2 group"
                style={{ minWidth: isCompact ? '32px' : '40px' }}
                id={`abacus-rod-${col.exponent}`}
              >
                {/* Rod Header Label */}
                <div className="bg-stone-800/95 border border-stone-700/80 px-1.5 py-0.5 rounded-md shadow text-xs sm:text-sm font-mono font-bold text-stone-200 pointer-events-none select-none mb-1 z-30 flex flex-col items-center leading-tight">
                  <span className="font-extrabold tracking-tight">{col.shortName}</span>
                  <span className="text-[9px] text-stone-400 font-mono">10<sup>{col.exponent}</sup></span>
                </div>

                {/* The Rod (Vertical metal beam) */}
                <div className="absolute top-8 bottom-2 w-1 sm:w-1.5 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-500 rounded-full shadow-inner border-x border-stone-600/40 z-0" />

                {/* Vertical Beads Area */}
                <div className="flex-grow flex flex-col justify-between items-center w-full relative z-10 py-0.5">
                  
                  {/* Top Group (Inactive beads stored at TOP) */}
                  <div className={`flex flex-col items-center justify-start gap-0.5 w-full ${
                    isCompact ? 'min-h-[50px] sm:min-h-[60px] md:min-h-[70px]' : 'min-h-[65px] sm:min-h-[78px] md:min-h-[90px]'
                  }`}>
                    {Array.from({ length: 10 }).map((_, i) => {
                      const isActive = i >= (10 - activeCount);
                      if (isActive) return null;
                      return (
                        <motion.div
                          key={`bead-v-${col.exponent}-${i}`}
                          layoutId={`bead-v-${col.exponent}-${i}`}
                          transition={{ type: "spring", stiffness: 280, damping: 25 }}
                          className={getBeadStyle(col, false)}
                          onClick={() => handleBeadClick(col.exponent, i, activeCount)}
                        >
                          {/* Inner bead groove */}
                          <div className="absolute inset-x-0 top-1/2 -mt-0.5 h-0.5 bg-black/20 rounded-full" />
                          <div className="absolute inset-0.5 rounded-full bg-white/10 filter blur-[0.5px] pointer-events-none" />
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Division Space */}
                  <div className="h-3.5 sm:h-4 flex items-center justify-center z-10 bg-stone-900/50 px-1 rounded">
                    <span className="text-[7px] sm:text-[8px] font-mono font-bold text-stone-500 pointer-events-none tracking-wider">
                      {activeCount}
                    </span>
                  </div>

                  {/* Bottom Group (Active beads counted at BOTTOM directly above digit box) */}
                  <div className={`flex flex-col items-center justify-end gap-0.5 w-full ${
                    isCompact ? 'min-h-[50px] sm:min-h-[60px] md:min-h-[70px]' : 'min-h-[65px] sm:min-h-[78px] md:min-h-[90px]'
                  }`}>
                    {Array.from({ length: 10 }).map((_, i) => {
                      const isActive = i >= (10 - activeCount);
                      if (!isActive) return null;
                      return (
                        <motion.div
                          key={`bead-v-${col.exponent}-${i}`}
                          layoutId={`bead-v-${col.exponent}-${i}`}
                          transition={{ type: "spring", stiffness: 280, damping: 25 }}
                          className={getBeadStyle(col, true)}
                          onClick={() => handleBeadClick(col.exponent, i, activeCount)}
                        >
                          {/* Inner bead groove */}
                          <div className="absolute inset-x-0 top-1/2 -mt-0.5 h-0.5 bg-black/30 rounded-full" />
                          <div className="absolute inset-0.5 rounded-full bg-white/10 filter blur-[0.5px] pointer-events-none" />
                          <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-white/50 filter blur-[0.5px]" />
                        </motion.div>
                      );
                    })}
                  </div>

                </div>

                {/* Visual Alignment representation directly aligned below column */}
                <div className="mt-1.5 flex flex-col items-center z-30 pointer-events-none select-none">
                  {/* Circle indicator aligned with column theme */}
                  <div className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-gradient-to-br ${col.color} shadow-xs`} />
                  
                  {/* Digit display matching column */}
                  <div className={`mt-1 bg-stone-950 border border-stone-800 text-stone-100 font-mono font-black rounded-lg flex items-center justify-center shadow-md group-hover:border-stone-500 transition-colors ${
                    isCompact ? 'w-7 h-7 sm:w-8 sm:h-8 text-sm sm:text-base' : 'w-8 h-8 sm:w-10 sm:h-10 text-base sm:text-xl'
                  }`}>
                    {activeCount}
                  </div>

                  {/* Exponent value identifier */}
                  <span className="text-[9px] sm:text-[10px] text-stone-400 font-mono mt-0.5 font-bold">
                    ×10<sup>{col.exponent}</sup>
                  </span>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
