import React from 'react';

/**
 * PixelDiscoveryHero — Original Pixel-Art SVG composition for Slide 3 (Discovery & Soroban)
 * Features:
 * - Pixel-art student / young scientist avatar with lab glasses and smile
 * - Pixel-art Soroban Japanese Abacus with upper/lower beads and beam
 * - Pixel-art Number Line with milestone values and cruiser marker
 * - Radiant pixel discovery lightbulb with golden energy sparks
 */
export const PixelDiscoveryHero: React.FC<{ className?: string }> = ({ className = '' }) => {
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
        <rect x="10" y="10" width="360" height="240" rx="8" fill="#FAF5FF" stroke="#000000" strokeWidth="3" />

        {/* Pixel Grid Pattern */}
        <g opacity="0.16">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`h-${i}`} x1="10" y1={20 + i * 13} x2="370" y2={20 + i * 13} stroke="#9333EA" strokeWidth="1" strokeDasharray="2 2" />
          ))}
          {Array.from({ length: 27 }).map((_, i) => (
            <line key={`v-${i}`} x1={20 + i * 13} y1="10" x2={20 + i * 13} y2="250" stroke="#9333EA" strokeWidth="1" strokeDasharray="2 2" />
          ))}
        </g>

        {/* ====================================================
            1. PIXEL STUDENT / SCIENTIST AVATAR (Left side, x: 25, y: 25)
            ==================================================== */}
        <g transform="translate(30, 25)">
          {/* Hair */}
          <rect x="25" y="5" width="45" height="15" rx="3" fill="#1E293B" />
          <rect x="18" y="15" width="60" height="15" rx="2" fill="#1E293B" />
          
          {/* Head & Face */}
          <rect x="25" y="25" width="45" height="40" rx="4" fill="#FDE047" stroke="#000" strokeWidth="2" />

          {/* Retro Pixel Goggles / Glasses */}
          <rect x="20" y="32" width="22" height="16" rx="2" fill="#38BDF8" stroke="#000" strokeWidth="2" />
          <rect x="52" y="32" width="22" height="16" rx="2" fill="#38BDF8" stroke="#000" strokeWidth="2" />
          <rect x="42" y="38" width="10" height="4" fill="#000" />
          {/* Goggle lens shine */}
          <rect x="23" y="35" width="4" height="4" fill="#FFFFFF" />
          <rect x="55" y="35" width="4" height="4" fill="#FFFFFF" />

          {/* Smile */}
          <rect x="40" y="54" width="14" height="3" fill="#000" />
          <rect x="38" y="52" width="4" height="3" fill="#000" />
          <rect x="52" y="52" width="4" height="3" fill="#000" />

          {/* Student Collar & Lab Coat */}
          <rect x="18" y="65" width="60" height="35" rx="4" fill="#FFFFFF" stroke="#000" strokeWidth="2" />
          <rect x="35" y="65" width="24" height="15" fill="#C4B5FD" stroke="#000" strokeWidth="1.5" />
          <polygon points="47,80 43,65 51,65" fill="#EF4444" />
          {/* Badge on coat */}
          <rect x="22" y="75" width="10" height="6" fill="#06D6A0" stroke="#000" strokeWidth="1" />

          {/* Name Tag */}
          <rect x="12" y="105" width="70" height="16" rx="3" fill="#000000" />
          <text x="47" y="116" fill="#FFD166" fontSize="8" fontFamily="monospace" fontWeight="900" textAnchor="middle">
            ZIRLAI • MIZO
          </text>
        </g>

        {/* ====================================================
            2. GLOWING DISCOVERY LIGHTBULB (Center, x: 135, y: 25)
            ==================================================== */}
        <g transform="translate(135, 25)">
          {/* Radiant Sparks */}
          <line x1="25" y1="2" x2="25" y2="10" stroke="#FFD166" strokeWidth="3" />
          <line x1="5" y1="12" x2="12" y2="18" stroke="#FFD166" strokeWidth="3" />
          <line x1="45" y1="12" x2="38" y2="18" stroke="#FFD166" strokeWidth="3" />

          {/* Bulb Dome */}
          <circle cx="25" cy="30" r="18" fill="#FDE047" stroke="#000" strokeWidth="2.5" />
          <circle cx="20" cy="25" r="4" fill="#FFFFFF" opacity="0.8" />

          {/* Pixel Filament */}
          <path d="M 20 32 L 23 24 L 27 24 L 30 32" stroke="#B45309" strokeWidth="2" fill="none" />

          {/* Bulb Base */}
          <rect x="19" y="48" width="12" height="8" fill="#94A3B8" stroke="#000" strokeWidth="1.5" />
          <rect x="21" y="56" width="8" height="4" rx="1" fill="#475569" stroke="#000" strokeWidth="1" />

          {/* Idea Bubble Tag */}
          <rect x="0" y="66" width="50" height="15" rx="3" fill="#FFD166" stroke="#000" strokeWidth="1.5" />
          <text x="25" y="77" fill="#000" fontSize="7" fontFamily="monospace" fontWeight="900" textAnchor="middle">
            EUREKA!
          </text>
        </g>

        {/* ====================================================
            3. PIXEL SOROBAN JAPANESE ABACUS (Right side, x: 215, y: 25)
            ==================================================== */}
        <g transform="translate(210, 25)">
          {/* Wooden Frame */}
          <rect x="0" y="0" width="145" height="95" rx="5" fill="#78350F" stroke="#000000" strokeWidth="3" />
          <rect x="6" y="6" width="133" height="83" rx="3" fill="#1C1917" />

          {/* The Horizontal Separator Beam */}
          <rect x="6" y="32" width="133" height="6" fill="#FBBF24" stroke="#000" strokeWidth="1.5" />
          {/* Unit reckoning dot on beam */}
          <circle cx="72" cy="35" r="2" fill="#000" />
          <circle cx="106" cy="35" r="2" fill="#000" />

          {/* 4 Vertical Rods */}
          {[24, 58, 92, 124].map((xPos, rodIdx) => (
            <g key={`rod-${rodIdx}`}>
              <line x1={xPos} y1="6" x2={xPos} y2="89" stroke="#A8A29E" strokeWidth="2" />

              {/* Upper Deck Bead (Value 5) - Bi-conical diamond bead */}
              <polygon
                points={`${xPos - 8},18 ${xPos},12 ${xPos + 8},18 ${xPos},24`}
                fill={rodIdx % 2 === 0 ? '#F59E0B' : '#FDE68A'}
                stroke="#000"
                strokeWidth="1.5"
              />

              {/* Lower Deck Beads (Value 1 each, 4 beads) */}
              {[46, 56, 66, 76].map((yPos, beadIdx) => (
                <polygon
                  key={`lower-${rodIdx}-${beadIdx}`}
                  points={`${xPos - 8},${yPos} ${xPos},${yPos - 5} ${xPos + 8},${yPos} ${xPos},${yPos + 5}`}
                  fill={rodIdx % 2 === 0 ? '#F59E0B' : '#FDE68A'}
                  stroke="#000"
                  strokeWidth="1.5"
                />
              ))}
            </g>
          ))}

          {/* Soroban Tag */}
          <rect x="35" y="103" width="75" height="16" rx="3" fill="#C4B5FD" stroke="#000" strokeWidth="1.5" />
          <text x="72" y="114" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="900" textAnchor="middle">
            SOROBAN MATH
          </text>
        </g>

        {/* ====================================================
            4. NUMBER LINE CRUISER (Bottom Bar, x: 25, y: 165)
            ==================================================== */}
        <g transform="translate(25, 160)">
          {/* Main Card */}
          <rect x="0" y="0" width="330" height="75" rx="6" fill="#FFFFFF" stroke="#000000" strokeWidth="2.5" />

          {/* Header row */}
          <text x="15" y="18" fill="#000" fontSize="9" fontFamily="monospace" fontWeight="900">
            NUMBER LINE CRUISER
          </text>
          <rect x="235" y="6" width="80" height="16" rx="3" fill="#06D6A0" stroke="#000" strokeWidth="1" />
          <text x="275" y="17" fill="#000" fontSize="7" fontFamily="monospace" fontWeight="900" textAnchor="middle">
            TACTILE CRUISE
          </text>

          {/* The Number Line Axis */}
          <line x1="20" y1="42" x2="310" y2="42" stroke="#000000" strokeWidth="2.5" />
          {/* Arrow heads */}
          <polygon points="18,42 24,38 24,46" fill="#000" />
          <polygon points="312,42 306,38 306,46" fill="#000" />

          {/* Number Line Integer Ticks and Labels: -3, -2, -1, 0, 1, 2, 3 */}
          {[
            { val: '-3', x: 45 },
            { val: '-2', x: 85 },
            { val: '-1', x: 125 },
            { val: '0', x: 165 },
            { val: '+1', x: 205 },
            { val: '+2', x: 245 },
            { val: '+3', x: 285 },
          ].map((item, idx) => (
            <g key={`num-${idx}`}>
              <line x1={item.x} y1="35" x2={item.x} y2="49" stroke="#000" strokeWidth={item.val === '0' ? 3 : 2} />
              <text
                x={item.x}
                y="62"
                fill={item.val === '0' ? '#000000' : '#475569'}
                fontSize="9"
                fontFamily="monospace"
                fontWeight={item.val === '0' ? '900' : 'bold'}
                textAnchor="middle"
              >
                {item.val}
              </text>
            </g>
          ))}

          {/* Pixel Cruiser Car / Milestone Flag at x: 205 (+1) */}
          <g transform="translate(195, 22)">
            {/* Cruiser flag */}
            <rect x="0" y="0" width="20" height="12" rx="2" fill="#EF4444" stroke="#000" strokeWidth="1" />
            <text x="10" y="9" fill="#FFF" fontSize="7" fontFamily="monospace" fontWeight="900" textAnchor="middle">
              GO
            </text>
            <line x1="10" y1="12" x2="10" y2="20" stroke="#000" strokeWidth="2" />
          </g>
        </g>
      </svg>
    </div>
  );
};
