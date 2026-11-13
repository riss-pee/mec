import React from 'react';

/**
 * PixelMathHero — Original Pixel-Art SVG composition for Slide 1 (Mathematics)
 * Features:
 * - Stepped pixel fraction circle (cut in quarters with yellow and teal fills)
 * - Retro pocket calculator with pixel display and buttons
 * - Coordinate mini-grid with pixel sine wave
 * - Mathematical symbols: +, ×, ÷, =, π, √
 */
export const PixelMathHero: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 380 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[4px_4px_0px_rgba(0,0,0,0.8)]"
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        {/* Background Ambient Glow Card */}
        <rect x="10" y="10" width="360" height="240" rx="8" fill="#FFFDF5" stroke="#000000" strokeWidth="3" />
        
        {/* Pixel Grid Pattern in Background */}
        <g opacity="0.15">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`h-${i}`} x1="10" y1={20 + i * 13} x2="370" y2={20 + i * 13} stroke="#000000" strokeWidth="1" strokeDasharray="2 2" />
          ))}
          {Array.from({ length: 27 }).map((_, i) => (
            <line key={`v-${i}`} x1={20 + i * 13} y1="10" x2={20 + i * 13} y2="250" stroke="#000000" strokeWidth="1" strokeDasharray="2 2" />
          ))}
        </g>

        {/* ====================================================
            1. PIXEL FRACTION CIRCLE (Top Left, x: 30, y: 30)
            ==================================================== */}
        <g transform="translate(30, 30)">
          {/* Outer circle frame - Stepped pixel boundary (Radius ~ 40px) */}
          {/* Top quadrant (Yellow #FFD166) */}
          <rect x="25" y="5" width="30" height="5" fill="#FFD166" stroke="#000" strokeWidth="2" />
          <rect x="15" y="10" width="50" height="10" fill="#FFD166" stroke="#000" strokeWidth="2" />
          <rect x="10" y="20" width="60" height="10" fill="#FFD166" stroke="#000" strokeWidth="2" />
          <rect x="5" y="30" width="70" height="10" fill="#FFD166" stroke="#000" strokeWidth="2" />
          {/* Bottom quadrant (Mint Teal #06D6A0) */}
          <rect x="5" y="40" width="35" height="10" fill="#06D6A0" stroke="#000" strokeWidth="2" />
          <rect x="5" y="50" width="35" height="10" fill="#06D6A0" stroke="#000" strokeWidth="2" />
          <rect x="10" y="60" width="30" height="10" fill="#06D6A0" stroke="#000" strokeWidth="2" />
          <rect x="15" y="70" width="25" height="8" fill="#06D6A0" stroke="#000" strokeWidth="2" />
          {/* Bottom Right quadrant (White unfilled) */}
          <rect x="40" y="40" width="35" height="10" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
          <rect x="40" y="50" width="35" height="10" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
          <rect x="40" y="60" width="30" height="10" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
          <rect x="40" y="70" width="25" height="8" fill="#FFFFFF" stroke="#000" strokeWidth="2" />

          {/* Central cross dividers */}
          <rect x="0" y="38" width="80" height="4" fill="#000000" />
          <rect x="38" y="0" width="4" height="80" fill="#000000" />

          {/* Fraction badge: "3/4" */}
          <rect x="22" y="90" width="36" height="18" rx="3" fill="#000000" />
          <text x="40" y="103" fill="#FFD166" fontSize="10" fontFamily="monospace" fontWeight="900" textAnchor="middle">
            3/4
          </text>
        </g>

        {/* ====================================================
            2. RETRO PIXEL CALCULATOR (Top Right, x: 230, y: 25)
            ==================================================== */}
        <g transform="translate(230, 25)">
          {/* Calculator Body */}
          <rect x="0" y="0" width="115" height="150" rx="6" fill="#1E293B" stroke="#000000" strokeWidth="3" />
          <rect x="4" y="4" width="107" height="142" rx="4" fill="#334155" />

          {/* Solar Panel */}
          <rect x="12" y="10" width="42" height="12" rx="2" fill="#0F172A" stroke="#000" strokeWidth="1.5" />
          <line x1="26" y1="10" x2="26" y2="22" stroke="#475569" strokeWidth="1" />
          <line x1="40" y1="10" x2="40" y2="22" stroke="#475569" strokeWidth="1" />

          {/* MEC Logo Tag on Calculator */}
          <rect x="62" y="10" width="40" height="12" rx="2" fill="#FFD166" stroke="#000" strokeWidth="1.5" />
          <text x="82" y="19" fill="#000" fontSize="7" fontFamily="monospace" fontWeight="900" textAnchor="middle">
            ZIRNA-84
          </text>

          {/* LCD Screen */}
          <rect x="12" y="28" width="91" height="26" rx="3" fill="#86EFAC" stroke="#000" strokeWidth="2" />
          <text x="96" y="45" fill="#064E3B" fontSize="13" fontFamily="monospace" fontWeight="900" textAnchor="end">
            3.14159
          </text>

          {/* Pixel Button Matrix (4x3 grid) */}
          {/* Row 1 */}
          <rect x="14" y="60" width="18" height="14" rx="2" fill="#F87171" stroke="#000" strokeWidth="1.5" />
          <text x="23" y="70" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">C</text>
          <rect x="38" y="60" width="18" height="14" rx="2" fill="#E2E8F0" stroke="#000" strokeWidth="1.5" />
          <text x="47" y="70" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">±</text>
          <rect x="62" y="60" width="18" height="14" rx="2" fill="#E2E8F0" stroke="#000" strokeWidth="1.5" />
          <text x="71" y="70" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">%</text>
          <rect x="85" y="60" width="18" height="14" rx="2" fill="#FFD166" stroke="#000" strokeWidth="1.5" />
          <text x="94" y="70" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">÷</text>

          {/* Row 2 */}
          <rect x="14" y="79" width="18" height="14" rx="2" fill="#FFFFFF" stroke="#000" strokeWidth="1.5" />
          <text x="23" y="89" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">7</text>
          <rect x="38" y="79" width="18" height="14" rx="2" fill="#FFFFFF" stroke="#000" strokeWidth="1.5" />
          <text x="47" y="89" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">8</text>
          <rect x="62" y="79" width="18" height="14" rx="2" fill="#FFFFFF" stroke="#000" strokeWidth="1.5" />
          <text x="71" y="89" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">9</text>
          <rect x="85" y="79" width="18" height="14" rx="2" fill="#FFD166" stroke="#000" strokeWidth="1.5" />
          <text x="94" y="89" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">×</text>

          {/* Row 3 */}
          <rect x="14" y="98" width="18" height="14" rx="2" fill="#FFFFFF" stroke="#000" strokeWidth="1.5" />
          <text x="23" y="108" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">4</text>
          <rect x="38" y="98" width="18" height="14" rx="2" fill="#FFFFFF" stroke="#000" strokeWidth="1.5" />
          <text x="47" y="108" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">5</text>
          <rect x="62" y="98" width="18" height="14" rx="2" fill="#FFFFFF" stroke="#000" strokeWidth="1.5" />
          <text x="71" y="108" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">6</text>
          <rect x="85" y="98" width="18" height="14" rx="2" fill="#FFD166" stroke="#000" strokeWidth="1.5" />
          <text x="94" y="108" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">-</text>

          {/* Row 4 */}
          <rect x="14" y="117" width="18" height="14" rx="2" fill="#FFFFFF" stroke="#000" strokeWidth="1.5" />
          <text x="23" y="127" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">1</text>
          <rect x="38" y="117" width="18" height="14" rx="2" fill="#FFFFFF" stroke="#000" strokeWidth="1.5" />
          <text x="47" y="127" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">2</text>
          <rect x="62" y="117" width="18" height="14" rx="2" fill="#FFFFFF" stroke="#000" strokeWidth="1.5" />
          <text x="71" y="127" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">3</text>
          <rect x="85" y="117" width="18" height="14" rx="2" fill="#06D6A0" stroke="#000" strokeWidth="1.5" />
          <text x="94" y="127" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">=</text>
        </g>

        {/* ====================================================
            3. PIXEL SINE WAVE / COORDINATE GRAPH (Bottom Left, x: 25, y: 155)
            ==================================================== */}
        <g transform="translate(25, 155)">
          <rect x="0" y="0" width="185" height="80" rx="5" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />
          {/* Axis */}
          <line x1="15" y1="40" x2="175" y2="40" stroke="#000000" strokeWidth="2" />
          <line x1="25" y1="10" x2="25" y2="72" stroke="#000000" strokeWidth="2" />

          {/* Pixelated Stepped Sine Wave */}
          <rect x="25" y="38" width="6" height="4" fill="#3B82F6" />
          <rect x="31" y="30" width="8" height="5" fill="#3B82F6" />
          <rect x="39" y="22" width="10" height="5" fill="#3B82F6" />
          <rect x="49" y="16" width="12" height="6" fill="#3B82F6" />
          <rect x="61" y="14" width="14" height="6" fill="#2563EB" />
          <rect x="75" y="16" width="12" height="6" fill="#3B82F6" />
          <rect x="87" y="22" width="10" height="5" fill="#3B82F6" />
          <rect x="97" y="30" width="8" height="5" fill="#3B82F6" />
          <rect x="105" y="38" width="8" height="4" fill="#3B82F6" />
          <rect x="113" y="46" width="8" height="5" fill="#3B82F6" />
          <rect x="121" y="54" width="10" height="5" fill="#3B82F6" />
          <rect x="131" y="60" width="12" height="6" fill="#2563EB" />
          <rect x="143" y="62" width="14" height="6" fill="#2563EB" />
          <rect x="157" y="56" width="10" height="5" fill="#3B82F6" />
          <rect x="167" y="46" width="8" height="5" fill="#3B82F6" />

          {/* Axis Labels */}
          <text x="175" y="36" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold">x</text>
          <text x="20" y="16" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="bold">y</text>
          <text x="95" y="74" fill="#64748B" fontSize="8" fontFamily="monospace" fontWeight="bold">f(x) = sin(x)</text>
        </g>

        {/* ====================================================
            4. FLOATING PIXEL MATH SYMBOLS
            ==================================================== */}
        {/* Plus block */}
        <g transform="translate(130, 45)">
          <rect x="0" y="0" width="28" height="28" rx="4" fill="#C4B5FD" stroke="#000" strokeWidth="2" />
          <rect x="12" y="6" width="4" height="16" fill="#000" />
          <rect x="6" y="12" width="16" height="4" fill="#000" />
        </g>

        {/* Multiply block */}
        <g transform="translate(170, 75)">
          <rect x="0" y="0" width="28" height="28" rx="4" fill="#FFD166" stroke="#000" strokeWidth="2" />
          <text x="14" y="19" fill="#000" fontSize="16" fontFamily="monospace" fontWeight="900" textAnchor="middle">×</text>
        </g>

        {/* Pi Symbol block */}
        <g transform="translate(135, 110)">
          <rect x="0" y="0" width="26" height="26" rx="4" fill="#06D6A0" stroke="#000" strokeWidth="2" />
          <text x="13" y="18" fill="#000" fontSize="14" fontFamily="monospace" fontWeight="900" textAnchor="middle">π</text>
        </g>

        {/* Square Root block */}
        <g transform="translate(230, 190)">
          <rect x="0" y="0" width="48" height="32" rx="4" fill="#FDE047" stroke="#000" strokeWidth="2" />
          <text x="24" y="21" fill="#000" fontSize="13" fontFamily="monospace" fontWeight="900" textAnchor="middle">√144</text>
        </g>

        {/* Golden Equals block */}
        <g transform="translate(290, 190)">
          <rect x="0" y="0" width="55" height="32" rx="4" fill="#000000" stroke="#000" strokeWidth="2" />
          <text x="27" y="21" fill="#FFD166" fontSize="14" fontFamily="monospace" fontWeight="900" textAnchor="middle">= 12</text>
        </g>
      </svg>
    </div>
  );
};
