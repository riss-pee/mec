import React from 'react';

/**
 * PixelOpticsHero — Original Pixel-Art SVG composition for Slide 2 (Physics & Optics)
 * Features:
 * - Stepped pixel biconvex lens with light refraction and focal point
 * - Pixel triangular dispersion prism with 6-color rainbow spectrum
 * - Laser emitter torch with collimated beams
 * - Pixel optical bench coordinate ruler with millimeter ticks
 */
export const PixelOpticsHero: React.FC<{ className?: string }> = ({ className = '' }) => {
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
        <rect x="10" y="10" width="360" height="240" rx="8" fill="#F0F9FF" stroke="#000000" strokeWidth="3" />

        {/* Pixel Grid Pattern */}
        <g opacity="0.18">
          {Array.from({ length: 18 }).map((_, i) => (
            <line key={`h-${i}`} x1="10" y1={20 + i * 13} x2="370" y2={20 + i * 13} stroke="#0284C7" strokeWidth="1" strokeDasharray="2 2" />
          ))}
          {Array.from({ length: 27 }).map((_, i) => (
            <line key={`v-${i}`} x1={20 + i * 13} y1="10" x2={20 + i * 13} y2="250" stroke="#0284C7" strokeWidth="1" strokeDasharray="2 2" />
          ))}
        </g>

        {/* ====================================================
            1. BICONVEX LENS & REFRACTION SYSTEM (Top Half, y: 30)
            ==================================================== */}
        <g transform="translate(25, 25)">
          {/* Laser Emitter Torch */}
          <rect x="0" y="25" width="35" height="40" rx="3" fill="#0F172A" stroke="#000" strokeWidth="2" />
          <rect x="5" y="30" width="10" height="30" fill="#38BDF8" />
          <rect x="35" y="32" width="6" height="8" fill="#F87171" stroke="#000" strokeWidth="1.5" />
          <rect x="35" y="50" width="6" height="8" fill="#F87171" stroke="#000" strokeWidth="1.5" />
          <text x="17" y="20" fill="#000" fontSize="7" fontFamily="monospace" fontWeight="900" textAnchor="middle">
            LASER
          </text>

          {/* Incoming Parallel Pixel Rays (Red / Amber) */}
          {/* Top Ray */}
          <rect x="41" y="35" width="65" height="3" fill="#EF4444" />
          {/* Central Optical Axis Ray */}
          <rect x="41" y="44" width="65" height="2" fill="#F59E0B" />
          {/* Bottom Ray */}
          <rect x="41" y="53" width="65" height="3" fill="#EF4444" />

          {/* Stepped Pixel Biconvex Lens (Glass, x: 106, y: 10, h: 70) */}
          <g>
            <rect x="110" y="10" width="8" height="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
            <rect x="108" y="16" width="12" height="8" fill="#7DD3FC" stroke="#0284C7" strokeWidth="1.5" />
            <rect x="106" y="24" width="16" height="12" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
            <rect x="104" y="36" width="20" height="18" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
            <rect x="106" y="54" width="16" height="12" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
            <rect x="108" y="66" width="12" height="8" fill="#7DD3FC" stroke="#0284C7" strokeWidth="1.5" />
            <rect x="110" y="74" width="8" height="6" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
          </g>

          {/* Refracted Converging Rays from Lens to Focal Point */}
          {/* Top converging ray */}
          <line x1="124" y1="36" x2="195" y2="45" stroke="#EF4444" strokeWidth="3" />
          {/* Center straight ray */}
          <line x1="124" y1="45" x2="230" y2="45" stroke="#F59E0B" strokeWidth="2" strokeDasharray="3 2" />
          {/* Bottom converging ray */}
          <line x1="124" y1="54" x2="195" y2="45" stroke="#EF4444" strokeWidth="3" />

          {/* Glowing Focal Point (x: 195, y: 45) */}
          <rect x="192" y="42" width="6" height="6" fill="#FFD166" stroke="#000" strokeWidth="1.5" />
          <rect x="190" y="40" width="10" height="10" fill="none" stroke="#FFD166" strokeWidth="1" strokeDasharray="2 1" />
          
          {/* Diverging beyond focal point */}
          <line x1="198" y1="45" x2="235" y2="35" stroke="#EF4444" strokeWidth="2" opacity="0.6" />
          <line x1="198" y1="45" x2="235" y2="55" stroke="#EF4444" strokeWidth="2" opacity="0.6" />

          {/* Lens Label Tag */}
          <rect x="94" y="86" width="40" height="15" rx="3" fill="#0284C7" />
          <text x="114" y="97" fill="#FFFFFF" fontSize="7" fontFamily="monospace" fontWeight="900" textAnchor="middle">
            f = +12 cm
          </text>

          {/* Focal Point Label Tag */}
          <rect x="180" y="58" width="30" height="14" rx="2" fill="#000000" />
          <text x="195" y="68" fill="#FFD166" fontSize="7" fontFamily="monospace" fontWeight="900" textAnchor="middle">
            FOCUS F
          </text>
        </g>

        {/* ====================================================
            2. DISPERSION PRISM WITH RAINBOW SPECTRUM (Bottom Right)
            ==================================================== */}
        <g transform="translate(185, 125)">
          {/* White Incoming Light Beam */}
          <rect x="0" y="50" width="45" height="4" fill="#FFFFFF" stroke="#000000" strokeWidth="1" />

          {/* Stepped Pixel Equilateral Prism (x: 45 to 90) */}
          <rect x="66" y="10" width="8" height="6" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="62" y="16" width="16" height="8" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="58" y="24" width="24" height="10" fill="#7DD3FC" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="54" y="34" width="32" height="12" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="50" y="46" width="40" height="14" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="46" y="60" width="48" height="16" fill="#E0F2FE" stroke="#0284C7" strokeWidth="1.5" />
          <rect x="42" y="76" width="56" height="10" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />

          {/* Refracted Rainbow Spectrum Beams Exit Prism */}
          {/* Red (Least refracted) */}
          <line x1="86" y1="48" x2="155" y2="35" stroke="#EF4444" strokeWidth="3" />
          {/* Orange */}
          <line x1="87" y1="52" x2="155" y2="43" stroke="#F97316" strokeWidth="3" />
          {/* Yellow */}
          <line x1="88" y1="56" x2="155" y2="51" stroke="#FACC15" strokeWidth="3" />
          {/* Green */}
          <line x1="89" y1="60" x2="155" y2="59" stroke="#22C55E" strokeWidth="3" />
          {/* Cyan */}
          <line x1="90" y1="64" x2="155" y2="67" stroke="#06B6D4" strokeWidth="3" />
          {/* Violet (Most refracted) */}
          <line x1="91" y1="68" x2="155" y2="75" stroke="#A855F7" strokeWidth="3" />

          {/* Spectrum Target Screen */}
          <rect x="155" y="28" width="6" height="54" rx="2" fill="#000000" stroke="#000" strokeWidth="1.5" />
          <text x="165" y="58" fill="#000000" fontSize="8" fontFamily="monospace" fontWeight="900" transform="rotate(90 165 58)">
            SPECTRUM
          </text>

          {/* Prism Tag */}
          <rect x="52" y="90" width="36" height="14" rx="2" fill="#000000" />
          <text x="70" y="100" fill="#06D6A0" fontSize="7" fontFamily="monospace" fontWeight="900" textAnchor="middle">
            n = 1.52
          </text>
        </g>

        {/* ====================================================
            3. PIXEL OPTICAL BENCH RULER (Bottom Left, x: 25, y: 185)
            ==================================================== */}
        <g transform="translate(25, 180)">
          {/* Bench Bar */}
          <rect x="0" y="10" width="145" height="26" rx="3" fill="#FFFDF5" stroke="#000000" strokeWidth="2.5" />
          {/* Millimeter graduation ticks */}
          {Array.from({ length: 25 }).map((_, i) => (
            <line
              key={`tick-${i}`}
              x1={10 + i * 5}
              y1={10}
              x2={10 + i * 5}
              y2={i % 5 === 0 ? 22 : 16}
              stroke="#000000"
              strokeWidth={i % 5 === 0 ? 1.8 : 1}
            />
          ))}
          <text x="10" y="32" fill="#000" fontSize="7" fontFamily="monospace" fontWeight="bold">0</text>
          <text x="35" y="32" fill="#000" fontSize="7" fontFamily="monospace" fontWeight="bold">5</text>
          <text x="60" y="32" fill="#000" fontSize="7" fontFamily="monospace" fontWeight="bold">10</text>
          <text x="85" y="32" fill="#000" fontSize="7" fontFamily="monospace" fontWeight="bold">15</text>
          <text x="110" y="32" fill="#000" fontSize="7" fontFamily="monospace" fontWeight="bold">20 cm</text>

          {/* Badge */}
          <rect x="0" y="40" width="75" height="16" rx="3" fill="#38BDF8" stroke="#000" strokeWidth="1.5" />
          <text x="37" y="51" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="900" textAnchor="middle">
            RAY TRACER v2
          </text>
        </g>

        {/* Top Right Corner Status Badge */}
        <g transform="translate(285, 20)">
          <rect x="0" y="0" width="70" height="20" rx="4" fill="#06D6A0" stroke="#000" strokeWidth="2" />
          <text x="35" y="13" fill="#000" fontSize="8" fontFamily="monospace" fontWeight="900" textAnchor="middle">
            60 FPS LIVE
          </text>
        </g>
      </svg>
    </div>
  );
};
