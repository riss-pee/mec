import React from 'react';
import { VehicleModel, FacingDirection } from '../types';

interface CarGraphicProps {
  model: VehicleModel;
  direction: FacingDirection; // 1 = facing Right (+), -1 = facing Left (-)
  isDriving?: boolean;
  isReversing?: boolean;
  isTurning?: boolean;
}

export const VEHICLE_OPTIONS = [
  { id: 'red_rocket' as VehicleModel, name: 'Red Speedster', emoji: '🏎️', color: '#ef4444' },
  { id: 'school_bus' as VehicleModel, name: 'Math Bus', emoji: '🚌', color: '#f59e0b' },
  { id: 'cyber_buggy' as VehicleModel, name: 'Cyber EV', emoji: '⚡', color: '#06b6d4' },
  { id: 'green_jeep' as VehicleModel, name: 'Jungle 4x4', emoji: '🚙', color: '#10b981' },
];

export const CarGraphic: React.FC<CarGraphicProps> = ({
  model,
  direction,
  isDriving = false,
  isReversing = false,
  isTurning = false,
}) => {
  const isFacingForward = direction === 1;

  return (
    <div
      className={`relative select-none ${isDriving ? 'animate-bounce' : ''}`}
      style={{
        width: 126,
        height: 60,
        transform: isTurning ? 'rotate(10deg) scale(1.08)' : undefined,
        transition: 'transform 0.25s ease-out',
      }}
    >
      {/* 
        FLIPPABLE CAR GRAPHIC LAYER:
        Only this container flips with scaleX.
        It contains only directional visual vehicle parts.
      */}
      <div
        className="w-full h-full relative"
        style={{
          transform: isFacingForward ? 'scaleX(1)' : 'scaleX(-1)',
          transformOrigin: 'center center',
          transition: 'transform 0.25s ease-out',
        }}
      >
        {/* Headlight beam shining brightly out of FRONT */}
        <div
          className="absolute top-2 left-[110px] w-28 h-16 pointer-events-none z-10"
          style={{
            background: 'radial-gradient(ellipse at left, rgba(254, 240, 138, 0.75) 0%, rgba(254, 240, 138, 0.25) 50%, rgba(254, 240, 138, 0) 80%)',
            clipPath: 'polygon(0% 30%, 100% 0%, 100% 100%, 0% 70%)',
          }}
        />

        {/* Reversing hazard light & exhaust puff out of BACK */}
        {isReversing && (
          <>
            <div className="absolute top-7 -left-3 w-3 h-3 rounded-full bg-amber-400 animate-ping z-20" />
            <div className="absolute top-7 -left-8 flex space-x-1.5 opacity-80 animate-pulse z-10 pointer-events-none">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
              <span className="w-3.5 h-3.5 rounded-full bg-slate-500"></span>
              <span className="w-2 h-2 rounded-full bg-slate-600"></span>
            </div>
          </>
        )}

        {/* MODEL 1: RED SPEEDSTER / RACER */}
        {model === 'red_rocket' && (
          <svg width="126" height="58" viewBox="0 0 126 58" fill="none" className="drop-shadow-md overflow-visible">
            <ellipse cx="62" cy="52" rx="54" ry="4" fill="rgba(0,0,0,0.3)" />

            {/* BACK: Spoiler Wing */}
            <rect x="6" y="14" width="4" height="18" fill="#1E293B" rx="1.5" />
            <rect x="15" y="18" width="4" height="14" fill="#1E293B" rx="1.5" />
            <path d="M2 13 L22 13 L24 16 L0 16 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />

            {/* BACK: Dual Chrome Exhaust Pipes */}
            <rect x="2" y="38" width="8" height="3" rx="1.5" fill="#94A3B8" stroke="#475569" strokeWidth="1" />
            <rect x="2" y="42" width="8" height="3" rx="1.5" fill="#94A3B8" stroke="#475569" strokeWidth="1" />

            {/* Body */}
            <path
              d="M10 28 L32 26 L52 14 L80 14 L102 28 L122 34 C125 35 126 38 126 41 L124 44 L10 44 Z"
              fill="#EF4444"
            />
            <polygon points="80,16 100,28 120,34 98,34" fill="#DC2626" />

            {/* Windshield */}
            <path d="M50 16 L76 16 L94 28 L40 28 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="64" cy="20" r="5" fill="#FBBF24" />
            <circle cx="67" cy="19" r="1.5" fill="#0F172A" />
            <path d="M60 21 C62 18 68 18 70 21" stroke="#EF4444" strokeWidth="2" fill="none" />
            <line x1="82" y1="23" x2="78" y2="28" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

            {/* Racing Stripe */}
            <path d="M12 36 L120 36 L118 39 L12 39 Z" fill="#FFFFFF" />

            {/* FRONT: Big Bright Angled Headlight */}
            <polygon points="112,32 124,35 124,40 110,38" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1" />
            <polygon points="116,34 123,36 123,39 114,37" fill="#FFFFFF" />

            {/* FRONT: Front Nose Air Splitter */}
            <path d="M112 44 L125 44 C126 44 126 45 125 46 L108 46 Z" fill="#0F172A" />

            {/* BACK: Red Taillight Bar */}
            <rect x="8" y="30" width="4" height="8" rx="1.5" fill="#991B1B" />
            <rect x="8" y="31" width="3" height="6" rx="1" fill="#EF4444" />

            {/* Wheels */}
            <g className={isDriving ? 'animate-spin' : ''} style={{ transformOrigin: '30px 45px' }}>
              <circle cx="30" cy="45" r="10" fill="#18181B" stroke="#52525B" strokeWidth="2" />
              <circle cx="30" cy="45" r="5" fill="#E2E8F0" />
              <circle cx="30" cy="45" r="2" fill="#EF4444" />
            </g>
            <g className={isDriving ? 'animate-spin' : ''} style={{ transformOrigin: '98px 45px' }}>
              <circle cx="98" cy="45" r="8.5" fill="#18181B" stroke="#52525B" strokeWidth="2" />
              <circle cx="98" cy="45" r="4" fill="#E2E8F0" />
              <circle cx="98" cy="45" r="1.5" fill="#EF4444" />
            </g>
          </svg>
        )}

        {/* MODEL 2: SCHOOL BUS */}
        {model === 'school_bus' && (
          <svg width="126" height="58" viewBox="0 0 126 58" fill="none" className="drop-shadow-md overflow-visible">
            <ellipse cx="62" cy="53" rx="56" ry="4" fill="rgba(0,0,0,0.3)" />

            <rect x="10" y="10" width="88" height="34" rx="4" fill="#F59E0B" />
            <path d="M98 22 L116 28 C119 29 120 32 120 35 L120 44 L98 44 Z" fill="#F59E0B" />

            <rect x="10" y="32" width="108" height="3" fill="#1E293B" />
            <rect x="10" y="41" width="108" height="2" fill="#1E293B" />
            <text x="24" y="29" fill="#78350F" fontSize="6.5" fontWeight="900" fontFamily="sans-serif">
              MATH EXPRESS
            </text>

            <rect x="14" y="15" width="13" height="11" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
            <rect x="31" y="15" width="13" height="11" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
            <rect x="48" y="15" width="13" height="11" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />
            <rect x="65" y="15" width="13" height="11" rx="2" fill="#BAE6FD" stroke="#0284C7" strokeWidth="1" />

            <circle cx="20" cy="20" r="3" fill="#FBBF24" />
            <circle cx="37" cy="20" r="3" fill="#F472B6" />
            <circle cx="54" cy="20" r="3" fill="#34D399" />
            <circle cx="71" cy="20" r="3" fill="#A78BFA" />

            <path d="M82 14 L98 14 L108 26 L82 26 Z" fill="#7DD3FC" stroke="#0284C7" strokeWidth="1.5" />
            <circle cx="90" cy="20" r="3.5" fill="#FDE047" />
            <circle cx="92" cy="19.5" r="0.9" fill="#1E293B" />
            <line x1="97" y1="22" x2="95" y2="26" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />

            <rect x="114" y="32" width="6" height="6" rx="2" fill="#FEF08A" stroke="#B45309" strokeWidth="1" />
            <rect x="115" y="33" width="4" height="4" rx="1" fill="#FFFFFF" />
            <line x1="120" y1="39" x2="114" y2="39" stroke="#1E293B" strokeWidth="1.5" />
            <line x1="120" y1="41" x2="114" y2="41" stroke="#1E293B" strokeWidth="1.5" />
            <rect x="112" y="43" width="10" height="3" rx="1" fill="#1E293B" />

            <line x1="10" y1="12" x2="10" y2="42" stroke="#B45309" strokeWidth="1.5" strokeDasharray="3 2" />
            <circle cx="10" cy="18" r="2.5" fill="#EF4444" />
            <circle cx="10" cy="36" r="2.5" fill="#DC2626" />
            <rect x="7" y="42" width="6" height="3" rx="1" fill="#1E293B" />

            <g className={isDriving ? 'animate-spin' : ''} style={{ transformOrigin: '32px 46px' }}>
              <circle cx="32" cy="46" r="9.5" fill="#1E293B" />
              <circle cx="32" cy="46" r="4.5" fill="#94A3B8" />
            </g>
            <g className={isDriving ? 'animate-spin' : ''} style={{ transformOrigin: '96px 46px' }}>
              <circle cx="96" cy="46" r="9.5" fill="#1E293B" />
              <circle cx="96" cy="46" r="4.5" fill="#94A3B8" />
            </g>
          </svg>
        )}

        {/* MODEL 3: CYBER BUGGY */}
        {model === 'cyber_buggy' && (
          <svg width="126" height="58" viewBox="0 0 126 58" fill="none" className="drop-shadow-md overflow-visible">
            <ellipse cx="62" cy="52" rx="54" ry="4" fill="rgba(6,182,212,0.25)" />

            <polygon points="12,14 26,20 22,28 10,28" fill="#0891B2" stroke="#22D3EE" strokeWidth="1" />
            <polygon points="10,38 16,24 38,20 68,14 96,24 124,38 116,43 12,43" fill="#0E7490" />
            <polygon points="14,36 20,26 40,22 68,16 94,25 120,38 112,41 16,41" fill="#06B6D4" />

            <polygon points="46,20 68,14 90,24 50,24" fill="#164E63" stroke="#22D3EE" strokeWidth="1.5" />
            <rect x="68" y="16" width="7" height="6" rx="1.5" fill="#A5F3FC" />
            <circle cx="72" cy="18" r="1" fill="#0891B2" />

            <polygon points="106,32 124,37 124,40 106,37" fill="#67E8F9" />
            <line x1="102" y1="36" x2="125" y2="39" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" />

            <rect x="10" y="32" width="4" height="7" rx="1" fill="#E11D48" />
            <line x1="16" y1="34" x2="28" y2="34" stroke="#F43F5E" strokeWidth="1.5" />

            <g className={isDriving ? 'animate-spin' : ''} style={{ transformOrigin: '32px 44px' }}>
              <circle cx="32" cy="44" r="10" fill="#083344" stroke="#22D3EE" strokeWidth="1.5" />
              <circle cx="32" cy="44" r="4.5" fill="#06B6D4" />
            </g>
            <g className={isDriving ? 'animate-spin' : ''} style={{ transformOrigin: '98px 44px' }}>
              <circle cx="98" cy="44" r="8.5" fill="#083344" stroke="#22D3EE" strokeWidth="1.5" />
              <circle cx="98" cy="44" r="4" fill="#06B6D4" />
            </g>
          </svg>
        )}

        {/* MODEL 4: JUNGLE 4x4 */}
        {model === 'green_jeep' && (
          <svg width="126" height="58" viewBox="0 0 126 58" fill="none" className="drop-shadow-md overflow-visible">
            <ellipse cx="62" cy="52" rx="54" ry="4" fill="rgba(0,0,0,0.3)" />

            <rect x="2" y="20" width="8" height="18" rx="3" fill="#18181B" stroke="#3F3F46" strokeWidth="1.5" />
            <line x1="2" y1="29" x2="10" y2="29" stroke="#FACC15" strokeWidth="2" />

            <rect x="10" y="26" width="94" height="17" rx="3" fill="#047857" />
            <polygon points="76,26 98,26 112,31 114,39 76,39" fill="#10B981" />

            <path d="M16 26 L26 12 L72 12 L78 26" stroke="#064E3B" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <line x1="72" y1="12" x2="80" y2="26" stroke="#6EE7B7" strokeWidth="2.5" />

            <circle cx="50" cy="20" r="4.5" fill="#FDE047" />
            <path d="M44 16 Q50 12 56 16" stroke="#065F46" strokeWidth="2.5" fill="#065F46" />
            <circle cx="53" cy="20" r="1" fill="#1E293B" />
            <line x1="64" y1="22" x2="60" y2="27" stroke="#18181B" strokeWidth="2.5" strokeLinecap="round" />

            <path d="M112 30 L118 30 L120 44 L112 44" stroke="#1E293B" strokeWidth="2.5" fill="none" />
            <rect x="117" y="38" width="6" height="4" rx="1" fill="#94A3B8" />

            <circle cx="112" cy="34" r="4" fill="#FEF08A" stroke="#78350F" strokeWidth="1" />
            <circle cx="112" cy="34" r="2" fill="#FFFFFF" />

            <rect x="10" y="30" width="3" height="5" rx="1" fill="#DC2626" />

            <g className={isDriving ? 'animate-spin' : ''} style={{ transformOrigin: '32px 44px' }}>
              <circle cx="32" cy="44" r="10.5" fill="#18181B" stroke="#71717A" strokeWidth="2" />
              <circle cx="32" cy="44" r="4.5" fill="#FACC15" />
            </g>
            <g className={isDriving ? 'animate-spin' : ''} style={{ transformOrigin: '94px 44px' }}>
              <circle cx="94" cy="44" r="10.5" fill="#18181B" stroke="#71717A" strokeWidth="2" />
              <circle cx="94" cy="44" r="4.5" fill="#FACC15" />
            </g>
          </svg>
        )}
      </div>

      {/* 
        NON-FLIPPED STATIC BADGES LAYER:
        Always 100% upright and never mirrored!
        Positions are swapped based on isFacingForward so FRONT badge stays right at the front bumper.
      */}
      {/* FRONT Badge (always on front nose: right if facing forward, left if facing rear) */}
      <div
        className={`absolute -top-5.5 z-30 flex items-center gap-1 bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full text-[10px] shadow-sm border border-amber-300 pointer-events-none transition-all duration-200 ${
          isFacingForward ? 'right-0' : 'left-0'
        }`}
      >
        {!isFacingForward && <span className="text-xs">◀</span>}
        <span>FRONT</span>
        {isFacingForward && <span className="text-xs">▶</span>}
      </div>

      {/* BACK Badge (always on tail: left if facing forward, right if facing rear) */}
      <div
        className={`absolute -top-5.5 z-30 flex items-center gap-1 bg-slate-800 text-slate-100 font-bold px-1.5 py-0.5 rounded-full text-[9px] border border-slate-600 shadow-sm pointer-events-none transition-all duration-200 ${
          isFacingForward ? 'left-0' : 'right-0'
        }`}
      >
        {isFacingForward && <span>◀</span>}
        <span>BACK</span>
        {!isFacingForward && <span>▶</span>}
      </div>

      {/* Facing Direction Ribbon at bottom: Always upright, never mirrored */}
      <div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider shadow-sm border whitespace-nowrap z-30 flex items-center gap-1 transition-colors duration-200"
        style={{
          backgroundColor: isFacingForward ? '#0284c7' : '#e11d48',
          borderColor: isFacingForward ? '#7dd3fc' : '#fda4af',
          color: '#ffffff',
        }}
      >
        <span>{isFacingForward ? '👉 FACING FORWARD (+)' : '👈 FACING REAR (−)'}</span>
      </div>
    </div>
  );
};
