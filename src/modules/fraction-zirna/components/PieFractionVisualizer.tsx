import React from 'react';
import { motion } from 'motion/react';

interface PieFractionVisualizerProps {
  numerator: number;
  denominator: number;
  interactive?: boolean;
  onSliceToggle?: (newNumerator: number) => void;
  color?: string; // Tailwind color class prefix (e.g. "amber", "emerald", "blue")
  size?: number;   // Width/height of the container
  label?: string;
  hideFractionDisplay?: boolean;
  borderless?: boolean;
}

export function getSectorPath(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const angleToRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  
  const sRad = angleToRad(startAngle);
  const eRad = angleToRad(endAngle);
  
  const x1 = cx + r * Math.cos(sRad);
  const y1 = cy + r * Math.sin(sRad);
  const x2 = cx + r * Math.cos(eRad);
  const y2 = cy + r * Math.sin(eRad);
  
  const angleDiff = Math.abs(endAngle - startAngle);
  const largeArcFlag = angleDiff > 180 ? 1 : 0;
  const sweepFlag = 1; // Clockwise
  
  if (angleDiff >= 359.99) {
    return `M ${cx} ${cy - r} A ${r} ${r} 0 1 1 ${cx - 0.01} ${cy - r} Z`;
  }
  
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArcFlag} ${sweepFlag} ${x2} ${y2} Z`;
}

export const PieFractionVisualizer: React.FC<PieFractionVisualizerProps> = ({
  numerator,
  denominator,
  interactive = false,
  onSliceToggle,
  color = 'indigo',
  size = 200,
  label,
  hideFractionDisplay = false,
  borderless = false,
}) => {
  // Ensure valid values to avoid division by zero or NaN rendering
  const validDenominator = Math.max(1, Math.min(64, denominator));
  const validNumerator = Math.max(0, numerator);

  // Calculate how many full circles and remaining slices we need
  const fullPiesCount = Math.floor(validNumerator / validDenominator);
  const remainderSlices = validNumerator % validDenominator;
  const totalPiesNeeded = Math.max(1, Math.ceil(validNumerator / validDenominator));

  // Dynamically calculate individual pie diameter based on count so improper fractions scale neatly
  const effectivePieSize = (() => {
    if (totalPiesNeeded <= 1) return Math.min(size, 115);
    if (totalPiesNeeded === 2) return Math.min(size * 0.72, 85);
    if (totalPiesNeeded === 3) return Math.min(size * 0.58, 68);
    if (totalPiesNeeded <= 4) return Math.min(size * 0.52, 60);
    return Math.min(size * 0.44, 52);
  })();

  // Determine slice angle in degrees
  const sliceAngle = 360 / validDenominator;

  // Handles clicking a slice in a specific pie index
  const handleSliceClick = (pieIndex: number, sliceIndex: number) => {
    if (!interactive || !onSliceToggle) return;

    // Calculate clicked slice absolute index
    const clickedAbsoluteIndex = pieIndex * validDenominator + sliceIndex;
    
    // Toggle logic: If we click a slice that is active, set the numerator to that slice index (meaning we turn off this one and subsequent ones)
    // If we click an inactive slice, set the numerator to active it and all before it.
    if (clickedAbsoluteIndex < validNumerator) {
      onSliceToggle(clickedAbsoluteIndex);
    } else {
      onSliceToggle(clickedAbsoluteIndex + 1);
    }
  };

  // Color mappings
  const getColorClasses = (isActive: boolean) => {
    if (isActive) {
      switch (color) {
        case 'emerald': return { fill: '#34D399', stroke: '#000000' };
        case 'amber': return { fill: '#FFD166', stroke: '#000000' };
        case 'rose': return { fill: '#F87171', stroke: '#000000' };
        case 'sky': return { fill: '#60A5FA', stroke: '#000000' };
        case 'purple': return { fill: '#C084FC', stroke: '#000000' };
        case 'indigo':
        default: return { fill: '#818CF8', stroke: '#000000' };
      }
    } else {
      return { fill: '#FFFFFF', stroke: '#000000' }; // empty slice white with black borders
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center w-full max-w-full overflow-hidden ${borderless ? '' : 'p-3 bg-white brutal-border brutal-shadow rounded-xl'}`}>
      {label && (
        <span className="mb-2 font-serif text-sm font-bold uppercase tracking-wider text-black">
          {label}
        </span>
      )}

      {/* Pies container: wrapped and neatly spaced */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-full overflow-hidden p-0.5">
        {Array.from({ length: totalPiesNeeded }).map((_, pieIndex) => {
          // Check how many slices of this pie are filled
          let filledSlicesInThisPie = 0;
          if (pieIndex < fullPiesCount) {
            filledSlicesInThisPie = validDenominator;
          } else if (pieIndex === fullPiesCount) {
            filledSlicesInThisPie = remainderSlices;
          }

          return (
            <div
              key={pieIndex}
              className="flex flex-col items-center justify-center shrink-0"
              style={{ width: effectivePieSize, minHeight: effectivePieSize + (totalPiesNeeded > 1 ? 16 : 0) }}
            >
              {/* Outer boundary and drop shadow strictly contained within viewBox */}
              <svg
                width={effectivePieSize}
                height={effectivePieSize}
                viewBox="-6 -6 216 216"
                className="overflow-hidden shrink-0"
              >
                {/* Background shadow circle (Brutalist style) */}
                <circle cx="104" cy="104" r="88" fill="#000000" />
                <circle cx="100" cy="100" r="88" fill="#ffffff" stroke="#000000" strokeWidth="3.5" />

                {/* Slices */}
                {Array.from({ length: validDenominator }).map((_, sliceIndex) => {
                  const isActive = sliceIndex < filledSlicesInThisPie;
                  const startAngle = sliceIndex * sliceAngle;
                  const endAngle = (sliceIndex + 1) * sliceAngle;
                  const colors = getColorClasses(isActive);

                  const pathData = getSectorPath(100, 100, 86, startAngle, endAngle);

                  return (
                    <motion.path
                      key={sliceIndex}
                      d={pathData}
                      fill={colors.fill}
                      stroke={colors.stroke}
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                      whileHover={interactive ? { scale: 1.02, filter: 'brightness(1.05)' } : {}}
                      onClick={() => handleSliceClick(pieIndex, sliceIndex)}
                      className={`${interactive ? 'cursor-pointer' : ''} transition-colors duration-150`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.25, delay: sliceIndex * Math.min(0.04, 0.4 / validDenominator) }}
                    />
                  );
                })}

                {/* Draw dotted/dashed circle inside for elegance */}
                <circle
                  cx="100"
                  cy="100"
                  r="84"
                  fill="none"
                  stroke="#000000"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  className="pointer-events-none opacity-30"
                />

                {/* Center dot */}
                <circle cx="100" cy="100" r="8" fill="#000000" />
              </svg>

              {/* Sub-label for multiple pies without overflow */}
              {totalPiesNeeded > 1 && (
                <span className="mt-0.5 bg-black text-white text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-2xs brutal-border-sm leading-none whitespace-nowrap shadow-2xs">
                  Pie #{pieIndex + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Numerical Fraction display below */}
      {!hideFractionDisplay && (
        <div className="mt-6 flex items-center gap-3 font-serif text-lg font-bold text-black bg-[#F5F5F0] p-3 brutal-border-sm brutal-shadow-sm">
          <span className="flex flex-col items-center">
            <span className="px-2 text-2xl font-bold font-sans">
              {validNumerator}
            </span>
            <span className="w-10 h-[3px] bg-black my-1"></span>
            <span className="px-2 text-xl text-slate-700 font-sans">
              {validDenominator}
            </span>
          </span>
          
          {validNumerator > validDenominator && (
            <span className="text-black font-bold text-sm ml-2 self-center bg-white px-2 py-1 brutal-border-sm">
              {`= ${fullPiesCount} ${remainderSlices > 0 ? `${remainderSlices}/${validDenominator}` : ''}`} (Fraction Pawlh)
            </span>
          )}
        </div>
      )}
    </div>
  );
};
