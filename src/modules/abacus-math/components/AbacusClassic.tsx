import React from 'react';
import { motion } from 'motion/react';
import { PlaceValueConfig } from '../types';
import { playBeadSound } from '../utils/audio';

interface AbacusClassicProps {
  rows: PlaceValueConfig[];
  beadStates: { [exponent: number]: number };
  onBeadChange: (exponent: number, activeCount: number) => void;
  beadTheme: string;
  isCompact?: boolean;
}

export const AbacusClassic: React.FC<AbacusClassicProps> = ({
  rows,
  beadStates,
  onBeadChange,
  beadTheme,
  isCompact = false,
}) => {
  // Handle clicking a bead using stable absolute indexing (0 to 9)
  const handleBeadClick = (exponent: number, clickedIndex: number, currentActive: number) => {
    const isActive = clickedIndex >= (10 - currentActive);
    
    if (!isActive) {
      // Clicked an inactive bead (on the left)
      // Slide this bead and all inactive beads to its right to the active side
      const newActive = 10 - clickedIndex;
      playBeadSound(false, 0.7 + (exponent * 0.15));
      onBeadChange(exponent, newActive);
    } else {
      // Clicked an active bead (on the right)
      // Slide this bead and all active beads to its left back to the left side
      const newActive = 9 - clickedIndex;
      playBeadSound(true, 0.7 + (exponent * 0.15));
      onBeadChange(exponent, newActive);
    }
  };

  // Helper to get bead styling classes based on theme
  const getBeadStyle = (config: PlaceValueConfig, isActive: boolean) => {
    const sizeClasses = isCompact
      ? "w-5 h-7 sm:w-5.5 sm:h-7.5 md:w-6 md:h-8 rounded-full border-y border-x-2"
      : "w-6 h-8 sm:w-7 sm:h-9 md:w-8 md:h-10 rounded-full border-y-2 border-x-3";
    const baseStyle = `${sizeClasses} shadow-sm cursor-pointer transition-all duration-150 transform hover:scale-105 active:scale-95 flex items-center justify-center relative shrink-0`;
    
    if (beadTheme === 'wooden') {
      return `${baseStyle} bg-amber-800 border-amber-950 border-y-amber-700 shadow-amber-900/40 text-amber-100/50`;
    }
    if (beadTheme === 'candy') {
      return `${baseStyle} ${config.beadColor} border-white/20 text-white/50`;
    }
    if (beadTheme === 'cosmic') {
      return `${baseStyle} bg-slate-800 border-slate-950 border-y-cyan-500/50 shadow-cyan-900/30 text-cyan-400/30`;
    }
    // Classic/Rainbow Default
    return `${baseStyle} ${config.beadColor}`;
  };

  return (
    <div className={`w-full bg-amber-950/10 rounded-2xl border border-amber-900/20 shadow-inner ${isCompact ? 'p-1.5 sm:p-2' : 'p-2 sm:p-4'}`}>
      {/* Outer Wooden Frame */}
      <div className={`relative bg-stone-900 rounded-xl shadow-lg overflow-hidden border-amber-900 ${
        isCompact 
          ? 'border-4 sm:border-6 md:border-8 p-1.5 sm:p-2.5' 
          : 'border-6 sm:border-8 md:border-[10px] p-2 sm:p-3.5'
      }`}>
        {/* Subtle wood texture overlays */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/35 pointer-events-none" />
        
        {/* Vertical frame supports (wooden bars behind wires) */}
        <div className="absolute left-[20%] top-0 bottom-0 w-1.5 sm:w-2 bg-amber-950/60 pointer-events-none" />
        <div className="absolute right-[20%] top-0 bottom-0 w-1.5 sm:w-2 bg-amber-950/60 pointer-events-none" />
        <div className="absolute left-1/2 top-0 bottom-0 w-1.5 sm:w-2 bg-amber-950/70 pointer-events-none" />

        {/* Wires container */}
        <div className={`flex flex-col relative z-10 ${isCompact ? 'gap-1.5 sm:gap-2' : 'gap-2 sm:gap-3.5'}`}>
          {rows.map((row) => {
            const activeCount = beadStates[row.exponent] || 0;
            const inactiveCount = 10 - activeCount;

            return (
              <div 
                key={row.exponent} 
                className={`flex items-center gap-1.5 sm:gap-2.5 ${isCompact ? 'h-7 sm:h-8 md:h-8.5' : 'h-8 sm:h-9.5 md:h-11'}`}
                id={`abacus-row-${row.exponent}`}
              >
                {/* Left Column: Row Label */}
                <div className="w-20 sm:w-26 md:w-32 shrink-0 bg-stone-800/95 border border-stone-700/60 px-2 py-1 rounded-lg shadow select-none z-20 flex items-center gap-1.5">
                  <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${row.color} shrink-0`} />
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="font-extrabold text-xs sm:text-sm text-stone-200 truncate">{row.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono font-bold">({row.shortName})</span>
                  </div>
                </div>

                {/* Middle Column: Wire and Beads Sliding Area */}
                <div className="flex-grow relative h-full flex items-center bg-stone-950/40 rounded-lg px-1 overflow-hidden border border-stone-800/50">
                  {/* The Wire (Metallic rod) */}
                  <div className="absolute inset-x-0 h-1 sm:h-1.5 bg-gradient-to-b from-stone-400 via-stone-200 to-stone-500 rounded-full shadow-inner border border-stone-600/40" />

                  {/* Sliding Beads Area */}
                  <div className="w-full flex justify-between items-center relative px-1 h-full z-10">
                    
                    {/* Left Group (Inactive beads) */}
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 10 }).map((_, i) => {
                        const isActive = i >= (10 - activeCount);
                        if (isActive) return null;
                        return (
                          <motion.div
                            key={`bead-${row.exponent}-${i}`}
                            layoutId={`bead-${row.exponent}-${i}`}
                            transition={{ type: "spring", stiffness: 280, damping: 25 }}
                            className={getBeadStyle(row, false)}
                            onClick={() => handleBeadClick(row.exponent, i, activeCount)}
                          >
                            {/* Inner bead groove for realistic physical look */}
                            <div className="absolute inset-y-0 left-1/2 -ml-0.5 w-0.5 bg-black/20 rounded-full" />
                            <div className="absolute inset-0.5 rounded-full bg-white/10 filter blur-[0.5px] pointer-events-none" />
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Physical Gap in Between representing division */}
                    <div className="flex-grow h-full flex items-center justify-center min-w-[12px]">
                      {inactiveCount === 0 && (
                        <span className="text-[7px] sm:text-[8px] font-mono text-stone-600 tracking-wider font-semibold pointer-events-none select-none">
                          MAX
                        </span>
                      )}
                      {activeCount === 0 && (
                        <span className="text-[7px] sm:text-[8px] font-mono text-stone-600 tracking-wider font-semibold pointer-events-none select-none">
                          ZERO
                        </span>
                      )}
                    </div>

                    {/* Right Group (Active beads) */}
                    <div className="flex items-center gap-0.5 justify-end">
                      {Array.from({ length: 10 }).map((_, i) => {
                        const isActive = i >= (10 - activeCount);
                        if (!isActive) return null;
                        return (
                          <motion.div
                            key={`bead-${row.exponent}-${i}`}
                            layoutId={`bead-${row.exponent}-${i}`}
                            transition={{ type: "spring", stiffness: 280, damping: 25 }}
                            className={getBeadStyle(row, true)}
                            onClick={() => handleBeadClick(row.exponent, i, activeCount)}
                          >
                            {/* Inner bead groove */}
                            <div className="absolute inset-y-0 left-1/2 -ml-0.5 w-0.5 bg-black/30 rounded-full" />
                            <div className="absolute inset-0.5 rounded-full bg-white/20 filter blur-[0.5px] pointer-events-none" />
                            {/* Highlight dot for active bead */}
                            <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-white/50 filter blur-[0.5px]" />
                          </motion.div>
                        );
                      })}
                    </div>

                  </div>
                </div>

                {/* Right Column: Multiplier Display */}
                <div className="w-20 sm:w-26 md:w-32 shrink-0 bg-stone-800/95 border border-stone-700/60 px-2 py-1 rounded-lg shadow text-right select-none z-20 flex flex-col justify-center leading-tight">
                  <div className="text-[9px] font-mono font-bold text-stone-400">Value</div>
                  <div className="text-xs sm:text-sm font-mono font-bold text-stone-100 mt-0.5 truncate">
                    {activeCount} × 10<sup>{row.exponent}</sup>
                  </div>
                  <div className="text-xs sm:text-sm font-mono text-emerald-400 font-black border-t border-stone-700/50 mt-0.5 pt-0.5">
                    = {(activeCount * Math.pow(10, row.exponent)).toLocaleString()}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
