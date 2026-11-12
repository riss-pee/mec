import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  GraduationCap,
  Sparkles,
  Flame,
  Star,
  Plus,
  HelpCircle,
  ArrowLeft,
  BookOpen,
  Award,
  Trophy,
  Maximize,
  Minimize
} from 'lucide-react';
import { GameMode } from './types';
import { InteractiveSliceMaker } from './components/InteractiveSliceMaker';
import { EverydayFractionGame } from './components/EverydayFractionGame';
import { FractionAddition } from './components/FractionAddition';
import { ComparisonVisualizer } from './components/ComparisonVisualizer';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
    }
  };

  // Modes config
  const modes = [
    {
      id: 'everyday' as GameMode,
      title: '🍕 Pizza slice fraction',
      desc: 'Pizza slice lem thlir la, slice awm zat leh pizza pum pui fraction dik tak chhut rawh!',
      emoji: '🍕',
      bgColor: 'bg-[#FFF9E6]',
      cardColor: 'bg-[#FFD166]',
      hoverColor: 'hover:bg-[#ffe19a]',
      accentColor: 'border-amber-400',
      badgeText: 'Pizza Fractions',
      mascotQuote: 'Pizza slice leh a pum pui inlaichinna thlir la, slice fraction dik tak chhut rawh le!'
    },
    {
      id: 'slice' as GameMode,
      title: '🎯 Target Slice Challenge',
      desc: 'Pie chart lem target mil tur hian chocolate bar phel sawm zat siamrem la, equate rawh!',
      emoji: '🎯',
      bgColor: 'bg-[#E6F9F0]',
      cardColor: 'bg-emerald-400',
      hoverColor: 'hover:bg-emerald-500',
      accentColor: 'border-emerald-500',
      badgeText: 'Pie & Chocolate Equator',
      mascotQuote: 'Pie chart lem target mil tur hian chocolate bar phelte hi siamrem la, equate rawh le!'
    },
    {
      id: 'addition' as GameMode,
      title: '➕ Fraction Belhkhawm Lab',
      desc: 'Fraction pahnih denominator hrang nei belh la, visual slice inzawm khawm hi thlir rawh!',
      emoji: '➕',
      bgColor: 'bg-[#E6F2FF]',
      cardColor: 'bg-sky-400',
      hoverColor: 'hover:bg-sky-500',
      accentColor: 'border-sky-500',
      badgeText: 'Laboratory',
      mascotQuote: 'A hnuai nambar (denominator) a inan loh chuan puntir phawt a ngai thin a ni, entirna step te thlir ang u!'
    },
    {
      id: 'compare' as GameMode,
      title: '⚖️ Inthlar Tlar Tehkhinna',
      desc: 'Chocolate bar phel hrangte tlar khatah dah hian fraction khawi zawk nge lian tih thlir rawh!',
      emoji: '⚖️',
      bgColor: 'bg-[#FFF0F5]',
      cardColor: 'bg-pink-400',
      hoverColor: 'hover:bg-pink-500',
      accentColor: 'border-pink-500',
      badgeText: 'Comparison Scale',
      mascotQuote: 'Chocolate bar tlar khata an awm hian fraction len leh te, a in tluk leh tluk loh te a hriat thiam bik hle!'
    }
  ];

  const activeModeDetails = modes.find(m => m.id === currentMode);

  return (
    <div className={`min-h-screen transition-colors duration-500 text-slate-900 flex flex-col justify-between ${currentMode ? activeModeDetails?.bgColor : 'bg-[#F5F5F0]'}`}>
      
      {/* Playful Compact Neobrutalist Header */}
      <header className="bg-[#FFD166] border-b-3 border-black py-2.5 px-4 sm:px-6 relative overflow-hidden brutal-shadow-sm">
        {/* Simple decorative fraction graphic */}
        <div className="hidden sm:flex absolute right-6 top-1/2 -translate-y-1/2 items-center gap-3 opacity-25 pointer-events-none select-none">
          <svg width="36" height="36" viewBox="0 0 44 44" fill="none" className="text-black">
            <circle cx="22" cy="22" r="18" fill="white" stroke="black" strokeWidth="2.5" />
            <path d="M22 4 A18 18 0 0 1 40 22 L22 22 Z" fill="black" />
            <path d="M40 22 A18 18 0 0 1 22 40 L22 22 Z" fill="black" />
            <path d="M22 40 A18 18 0 0 1 4 22 L22 22 Z" fill="black" />
            <line x1="22" y1="4" x2="22" y2="40" stroke="black" strokeWidth="2" />
            <line x1="4" y1="22" x2="40" y2="22" stroke="black" strokeWidth="2" />
          </svg>
        </div>
        
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="text-left">
            <h1 className="font-serif text-2xl font-bold text-black italic leading-none">
              FRACTION ZIRNA
            </h1>
            <p className="text-[11px] uppercase tracking-wider font-bold opacity-75 mt-0.5">
              Denominator te, equivalent values te, belhkhawm leh tehkhinna te visual hmangin thiam rawh!
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
              aria-label={isFullscreen ? 'Exit Full Screen' : 'Full Screen'}
              className="flex items-center gap-1.5 text-xs bg-white hover:bg-slate-50 border-2 border-black text-black px-2.5 py-1 rounded-md font-mono font-bold brutal-shadow-sm transition-all active:translate-y-0.5 cursor-pointer"
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-3.5 h-3.5" />
                  <span>Exit Fullscreen</span>
                </>
              ) : (
                <>
                  <Maximize className="w-3.5 h-3.5" />
                  <span>Full Screen</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className={`w-full ${currentMode ? 'max-w-none px-0' : 'max-w-6xl mx-auto px-3 sm:px-4'} mt-1 sm:mt-2 flex flex-col gap-2 flex-1 justify-center`}>
        
        <AnimatePresence mode="wait">
          {currentMode === null ? (
            /* ==============================================
               1. SELECTION / LANDING SCREEN (COMPACT ONE-WINDOW VIEW)
               ============================================== */
            <motion.div
              key="selection-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col gap-2.5 sm:gap-3 w-full"
            >
              {/* Compact Fraction Visual Guide Banner */}
              <div className="bg-white brutal-border brutal-shadow p-3 sm:p-3.5 text-black flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3.5 text-left flex-1">
                  {/* Clean SVG Visual Graphic */}
                  <div className="shrink-0 flex items-center justify-center bg-[#FFF9E6] brutal-border-sm p-2 rounded-md">
                    <svg width="68" height="68" viewBox="0 0 120 120" className="drop-shadow-xs">
                      {/* Quarter 1 */}
                      <path d="M60 60 L60 10 A50 50 0 0 1 110 60 Z" fill="#FF6B6B" stroke="#000" strokeWidth="2.5" />
                      {/* Quarter 2 */}
                      <path d="M60 60 L110 60 A50 50 0 0 1 60 110 Z" fill="#4ECDC4" stroke="#000" strokeWidth="2.5" />
                      {/* Quarter 3 */}
                      <path d="M60 60 L60 110 A50 50 0 0 1 10 60 Z" fill="#FFD166" stroke="#000" strokeWidth="2.5" />
                      {/* Quarter 4 (unfilled remainder) */}
                      <path d="M60 60 L10 60 A50 50 0 0 1 60 10 Z" fill="#F3F4F6" stroke="#000" strokeWidth="2.5" strokeDasharray="4 3" />
                      {/* Center pivot */}
                      <circle cx="60" cy="60" r="4.5" fill="#000" />
                    </svg>
                  </div>

                  {/* Clean Conceptual Explanation */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-black text-white px-1.5 py-0.5 rounded-xs font-mono">
                        Visual Guide
                      </span>
                      <span className="text-[11px] font-mono font-bold text-slate-600">
                        3/4 (Phel 4 zinga 3)
                      </span>
                    </div>

                    <h2 className="font-serif text-base sm:text-lg italic font-bold text-slate-900 leading-tight">
                      Fractions : Thil pum khat phelsawm atanga a phel kan teh zat
                    </h2>

                    <p className="text-[11px] text-slate-700 font-medium leading-snug mt-0.5 max-w-xl">
                      <strong>Denominator:</strong> Thil pum pui phel sawm zat (4). <strong>Numerator:</strong> Phel kan neih zat (3).
                    </p>
                  </div>
                </div>

                {/* Minimalist Fraction Breakdown Graphic Badge */}
                <div className="flex flex-row sm:flex-col items-center justify-center gap-1.5 bg-[#F8F9FA] brutal-border-sm p-2 w-full sm:w-auto min-w-[105px]">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-base font-black text-black">3</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Numerator</span>
                  </div>
                  <div className="w-full border-t-2 border-black"></div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-base font-black text-black">4</span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">Denominator</span>
                  </div>
                </div>
              </div>

              {/* Grid Selection (Tightly spaced tabs) */}
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1.5 text-left">
                  ZIRLAI CHI HRANG HRANG TE (CHOOSE A CHALLENGE):
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                  {modes.map((mode) => (
                    <motion.div
                      key={mode.id}
                      whileHover={{ scale: 1.008, y: -2 }}
                      className="bg-white brutal-border brutal-shadow flex flex-col justify-between p-3 sm:p-3.5 relative overflow-hidden group min-h-[120px]"
                    >
                      {/* Decorative subtle background emoji */}
                      <span className="absolute -right-2 -bottom-2 text-6xl opacity-10 select-none group-hover:scale-105 transition-transform duration-200">
                        {mode.emoji}
                      </span>

                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xl">{mode.emoji}</span>
                          <h4 className="font-serif text-base sm:text-lg font-bold italic text-black group-hover:underline leading-snug">
                            {mode.title}
                          </h4>
                        </div>
                        
                        <p className="text-[11px] text-slate-700 leading-normal font-semibold max-w-md line-clamp-2">
                          {mode.desc}
                        </p>
                      </div>

                      <div className="mt-2 flex items-center justify-end relative z-10">
                        <button
                          onClick={() => setCurrentMode(mode.id)}
                          className={`px-3.5 py-1.5 font-serif italic font-bold text-xs text-black brutal-border-sm brutal-shadow-sm cursor-pointer transition-all active:translate-y-0.5 active:shadow-none ${mode.cardColor} ${mode.hoverColor}`}
                        >
                          Lut Rawh ➔
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Compact Info Banner */}
              <div className="bg-white py-1.5 px-3 brutal-border-sm text-center">
                <p className="text-[11px] font-semibold text-slate-700">
                  💡 <strong>Tip:</strong> Lem thlir chungin fraction phel sawm, belhkhawm leh inthlar tehkhinna te awlsam takin zir rawh le!
                </p>
              </div>

            </motion.div>
          ) : (
            /* ==============================================
               2. DEDICATED INDIVIDUAL GAME INTERFACES
               ============================================== */
            <motion.div
              key="game-screen"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2.5 sm:gap-3 w-full"
            >
              {/* Back Navigation Bar with Custom Theme */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 bg-white brutal-border p-2.5 sm:p-3 brutal-shadow-sm">
                <button
                  onClick={() => setCurrentMode(null)}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-bold text-black bg-[#FFD166] hover:bg-[#ffe19a] brutal-border-sm brutal-shadow-sm transition-all active:translate-y-0.5 cursor-pointer uppercase tracking-wider"
                >
                  <ArrowLeft className="w-3.5 h-3.5 stroke-black" />
                  <span>Kirna (Zirlai dang)</span>
                </button>

                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-lg">{activeModeDetails?.emoji}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-slate-500 bg-slate-100 px-2.5 py-1 rounded-sm">
                    {activeModeDetails?.title}
                  </span>
                </div>
              </div>

              {/* Dynamic Game Workspace */}
              <div className="flex justify-center items-center w-full">
                {currentMode === 'everyday' && (
                  <div className="w-full flex justify-center animate-fade-in">
                    <EverydayFractionGame />
                  </div>
                )}
                {currentMode === 'slice' && (
                  <div className="w-full flex justify-center animate-fade-in">
                    <InteractiveSliceMaker />
                  </div>
                )}
                {currentMode === 'addition' && (
                  <div className="w-full flex justify-center animate-fade-in">
                    <FractionAddition />
                  </div>
                )}
                {currentMode === 'compare' && (
                  <div className="w-full flex justify-center animate-fade-in">
                    <ComparisonVisualizer />
                  </div>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Elementary Educational Compact Footer */}
      <footer className="max-w-6xl mx-auto w-full px-4 mt-2 sm:mt-3 pt-2 pb-2 border-t-2 border-black text-center text-[11px] font-bold uppercase tracking-wider text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2">
        <div>
          <p>© 2026 Fraction Zirna • Naupang zirlaite tana siam a ni.</p>
        </div>
        <div className="flex gap-4">
          <button onClick={() => setCurrentMode('everyday')} className="hover:text-black transition-colors cursor-pointer underline">🍕 Pizza slice fraction</button>
          <button onClick={() => setCurrentMode('slice')} className="hover:text-black transition-colors cursor-pointer underline">🎯 Slicing Challenge</button>
          <button onClick={() => setCurrentMode('addition')} className="hover:text-black transition-colors cursor-pointer underline">➕ Belhkhawm</button>
          <button onClick={() => setCurrentMode('compare')} className="hover:text-black transition-colors cursor-pointer underline">⚖️ Inthlar Tlar</button>
        </div>
      </footer>

    </div>
  );
}
