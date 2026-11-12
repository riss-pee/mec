import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, RefreshCw, Star, Flame, Trophy, Sparkles, Scale, ArrowRight, Layers } from 'lucide-react';
import { Fraction } from '../types';
import { PieFractionVisualizer } from './PieFractionVisualizer';

interface ExtendedFraction extends Fraction {
  isImproper?: boolean;
}

const TARGET_FRACTIONS: ExtendedFraction[] = [
  // Proper fractions
  { numerator: 5, denominator: 8, isImproper: false },
  { numerator: 7, denominator: 10, isImproper: false },
  { numerator: 8, denominator: 12, isImproper: false },
  { numerator: 9, denominator: 12, isImproper: false },
  { numerator: 11, denominator: 14, isImproper: false },
  { numerator: 13, denominator: 16, isImproper: false },
  { numerator: 15, denominator: 16, isImproper: false },
  { numerator: 17, denominator: 20, isImproper: false },

  // Improper fractions (moderate to large extent: 1+ wholes up to 4+ wholes!)
  { numerator: 7, denominator: 4, isImproper: true },   // 1 3/4 (2 pies)
  { numerator: 9, denominator: 4, isImproper: true },   // 2 1/4 (3 pies)
  { numerator: 11, denominator: 4, isImproper: true },  // 2 3/4 (3 pies)
  { numerator: 15, denominator: 4, isImproper: true },  // 3 3/4 (4 pies)
  { numerator: 7, denominator: 3, isImproper: true },   // 2 1/3 (3 pies)
  { numerator: 10, denominator: 3, isImproper: true },  // 3 1/3 (4 pies)
  { numerator: 13, denominator: 5, isImproper: true },  // 2 3/5 (3 pies)
  { numerator: 17, denominator: 5, isImproper: true },  // 3 2/5 (4 pies)
  { numerator: 13, denominator: 6, isImproper: true },  // 2 1/6 (3 pies)
  { numerator: 19, denominator: 6, isImproper: true },  // 3 1/6 (4 pies)
  { numerator: 23, denominator: 6, isImproper: true },  // 3 5/6 (4 pies)
  { numerator: 13, denominator: 8, isImproper: true },  // 1 5/8 (2 pies)
  { numerator: 19, denominator: 8, isImproper: true },  // 2 3/8 (3 pies)
  { numerator: 25, denominator: 8, isImproper: true },  // 3 1/8 (4 pies)
  { numerator: 29, denominator: 8, isImproper: true },  // 3 5/8 (4 pies)
  { numerator: 35, denominator: 8, isImproper: true },  // 4 3/8 (5 pies)
  { numerator: 23, denominator: 10, isImproper: true }, // 2 3/10 (3 pies)
  { numerator: 27, denominator: 12, isImproper: true }, // 2 3/12 (3 pies)
  { numerator: 31, denominator: 12, isImproper: true }, // 2 7/12 (3 pies)
  { numerator: 37, denominator: 12, isImproper: true }, // 3 1/12 (4 pies)
  { numerator: 41, denominator: 12, isImproper: true }, // 3 5/12 (4 pies)
  { numerator: 49, denominator: 12, isImproper: true }  // 4 1/12 (5 pies)
];

type FractionFilter = 'all' | 'improper' | 'proper';

export const InteractiveSliceMaker: React.FC = () => {
  const [filterMode, setFilterMode] = useState<FractionFilter>('all');
  const [targetIndex, setTargetIndex] = useState<number>(0);
  
  // Filtered fractions list based on user preference
  const filteredFractions = useMemo(() => {
    if (filterMode === 'improper') return TARGET_FRACTIONS.filter(f => f.isImproper);
    if (filterMode === 'proper') return TARGET_FRACTIONS.filter(f => !f.isImproper);
    return TARGET_FRACTIONS;
  }, [filterMode]);

  const target = filteredFractions[targetIndex % filteredFractions.length] || TARGET_FRACTIONS[0];
  const targetBarsNeeded = Math.max(1, Math.ceil(target.numerator / target.denominator));

  // User's chocolate bar configuration (supports multiple bars for improper fractions)
  const [barsCount, setBarsCount] = useState<number>(() => Math.max(2, targetBarsNeeded));
  const [chocNum, setChocNum] = useState<number>(2);
  const [chocDen, setChocDen] = useState<number>(target.denominator);

  // Scoring and stats
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [checked, setChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const targetVal = target.numerator / target.denominator;
  const chocVal = chocDen > 0 ? chocNum / chocDen : 0;
  const isCurrentlyEqual = Math.abs(targetVal - chocVal) < 0.0001;

  // Sync chocolate denominator and sufficient bars whenever target changes
  useEffect(() => {
    setChocDen(target.denominator);
    const needed = Math.max(2, Math.ceil(target.numerator / target.denominator));
    setBarsCount(needed);
    setChocNum(1);
    setChecked(false);
    setMessage('');
  }, [targetIndex, filterMode]);

  // Reset checked state when slices change
  useEffect(() => {
    setChecked(false);
  }, [chocNum]);

  const handleNextTarget = () => {
    const nextIdx = (targetIndex + 1) % filteredFractions.length;
    setTargetIndex(nextIdx);
  };

  const handleRandomizeTarget = () => {
    const randomIdx = Math.floor(Math.random() * filteredFractions.length);
    setTargetIndex(randomIdx);
  };

  // Bar management controls
  const handleAddBar = () => {
    setBarsCount(prev => Math.min(10, prev + 1));
  };

  const handleRemoveBar = () => {
    setBarsCount(prev => {
      if (prev <= 1) return 1;
      const newMax = (prev - 1) * chocDen;
      if (chocNum > newMax) setChocNum(newMax);
      return prev - 1;
    });
  };

  const handlePieceClick = (pieceIdx: number) => {
    if (chocNum === pieceIdx + 1) {
      setChocNum(pieceIdx);
    } else {
      const nextNum = pieceIdx + 1;
      setChocNum(nextNum);
      const needed = Math.ceil(nextNum / chocDen);
      if (needed > barsCount) {
        setBarsCount(needed);
      }
    }
  };

  const handleToggleWholeBar = (barIdx: number) => {
    const barStart = barIdx * chocDen;
    const barEnd = (barIdx + 1) * chocDen;
    if (chocNum >= barEnd) {
      setChocNum(barStart);
    } else {
      setChocNum(barEnd);
    }
  };

  const checkMatch = () => {
    if (chocDen <= 0) {
      setIsCorrect(false);
      setMessage('Chocolate bar hi phel 1 emaw a aia tam emaw a nih a ngai!');
      setChecked(true);
      return;
    }

    if (isCurrentlyEqual) {
      setIsCorrect(true);
      setChecked(true);

      const isImproper = target.numerator >= target.denominator;
      if (isImproper) {
        const whole = Math.floor(target.numerator / target.denominator);
        const rem = target.numerator % target.denominator;
        setMessage(
          `🎉 ROPUI LUTUK! Improper Fraction dik tak a ni! A pum ${whole} leh ${rem > 0 ? `${rem}/${target.denominator}` : 'a kim'} in tluk chiah (=) e!`
        );
      } else {
        const isEquivalent = chocNum !== target.numerator || chocDen !== target.denominator;
        if (isEquivalent) {
          setMessage(
            `🎉 ROPUI LUTUK! Pie chart leh Chocolate bar an in tluk chiah (=) e! Equivalent fractions dik tak a ni!`
          );
        } else {
          setMessage(
            `🎉 DIK CHIAH E! Pie chart leh Chocolate bar an in tluk chiah (=) e!`
          );
        }
      }

      setStreak(prev => {
        const next = prev + 1;
        if (next > bestStreak) setBestStreak(next);
        return next;
      });
      setScore(prev => prev + (target.numerator >= target.denominator ? 150 : 100));
    } else {
      setIsCorrect(false);
      setChecked(true);
      setStreak(0);

      if (targetVal < chocVal) {
        setMessage(
          `Chocolate bar hi a LIAN ZAWK e (Pie < Chocolate). Pie chart mil turin chocolate phel tlem rawh le!`
        );
      } else {
        setMessage(
          `Chocolate bar hi a TE ZAWK e (Pie > Chocolate). Pie chart mil turin chocolate phel belh rawh le!`
        );
      }
    }
  };

  return (
    <div className="w-full max-w-full bg-white brutal-border brutal-shadow p-2 sm:p-3 grid grid-cols-1 lg:grid-cols-12 gap-2 sm:gap-2.5">
      
      {/* Target Game Header with Stats & Filter Toggle */}
      <div className="col-span-1 lg:col-span-12 flex flex-wrap items-center justify-between gap-2 bg-[#FFD166] p-2 sm:p-2.5 brutal-border-sm brutal-shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white brutal-border flex items-center justify-center font-bold text-base brutal-shadow-xs">
            🎯
          </div>
          <div>
            <h3 className="font-serif text-base sm:text-lg text-black font-bold italic leading-tight">
              Pie Chart & Chocolate Bar Equator
            </h3>
            <p className="text-[10px] text-slate-800 font-extrabold uppercase tracking-wide">
              Pie chart target mil tur hian chocolate bar phelte hi siamrem la, equate rawh!
            </p>
          </div>
        </div>

        {/* Filter Toggle for Improper / Proper / All Fractions */}
        <div className="flex items-center gap-1 bg-white brutal-border-sm p-0.5 text-[10px] font-bold">
          <span className="px-1 text-slate-500 font-mono text-[9px] uppercase hidden sm:inline">Mod:</span>
          <button
            onClick={() => { setFilterMode('all'); setTargetIndex(0); }}
            className={`px-1.5 py-0.5 rounded-2xs cursor-pointer transition-colors ${
              filterMode === 'all' ? 'bg-black text-white font-extrabold' : 'text-black hover:bg-slate-100'
            }`}
          >
            All
          </button>
          <button
            onClick={() => { setFilterMode('improper'); setTargetIndex(0); }}
            className={`px-1.5 py-0.5 rounded-2xs cursor-pointer transition-colors ${
              filterMode === 'improper' ? 'bg-[#FF9F1C] text-black font-extrabold' : 'text-black hover:bg-slate-100'
            }`}
            title="Improper fractions chiah zirna"
          >
            Pawlh / Improper
          </button>
          <button
            onClick={() => { setFilterMode('proper'); setTargetIndex(0); }}
            className={`px-1.5 py-0.5 rounded-2xs cursor-pointer transition-colors ${
              filterMode === 'proper' ? 'bg-emerald-400 text-black font-extrabold' : 'text-black hover:bg-slate-100'
            }`}
          >
            Proper
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white brutal-border-sm px-2 py-0.5 text-black text-xs font-bold">
            <Trophy className="w-3.5 h-3.5 text-black" />
            <span className="font-mono">{score} pts</span>
          </div>

          <div className="flex items-center gap-1 bg-[#FF9F1C] brutal-border-sm px-2 py-0.5 text-black text-xs font-bold">
            <Flame className="w-3.5 h-3.5 fill-black stroke-black" />
            <span className="font-mono">{streak} Streak</span>
          </div>

          <button
            onClick={handleRandomizeTarget}
            className="p-1 bg-white border-2 border-black hover:bg-[#F5F5F0] text-black cursor-pointer"
            title="Target thar thlang rawh"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Comparison Arena: Target Pie Chart vs Interactive Chocolate Bar */}
      <div className="col-span-1 lg:col-span-9 grid grid-cols-1 md:grid-cols-12 gap-2.5 items-stretch">
        
        {/* Left Side: 🥧 Target Pie Chart (Contained strictly within tab lines) */}
        <div className="md:col-span-5 bg-[#E6F9F0] brutal-border p-2 sm:p-2.5 flex flex-col items-center justify-between min-h-[290px] sm:min-h-[310px] md:min-h-[330px] overflow-hidden relative">
          <div className="w-full flex items-center justify-between mb-0.5 shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-wider bg-black text-white px-1.5 py-0.5 font-mono">
              Target Pie Chart
            </span>
            {target.numerator >= target.denominator && (
              <span className="text-[8px] font-extrabold uppercase tracking-wide bg-[#FFD166] text-black px-1.5 py-0.5 rounded-2xs border border-black shadow-2xs font-mono">
                Improper ({Math.ceil(target.numerator / target.denominator)} Pies)
              </span>
            )}
          </div>

          {/* SVG Pie Chart Graphic - strictly contained with flex-1 and bounded height so it never leaks outside tab lines */}
          <div className="w-full flex-1 my-auto min-h-[140px] max-h-[190px] sm:max-h-[210px] overflow-y-auto overflow-x-hidden p-1 flex items-center justify-center">
            <PieFractionVisualizer
              numerator={target.numerator}
              denominator={target.denominator}
              interactive={false}
              color="emerald"
              size={110}
              label=""
              hideFractionDisplay={true}
              borderless={true}
            />
          </div>

          {/* Stacked Target Fraction Box (Shows '?' until Endik Rawh is pressed) - pinned cleanly at bottom */}
          <div className="flex flex-col items-center w-full max-w-[220px] bg-white brutal-border-sm p-1.5 mt-auto shadow-xs shrink-0">
            {/* Target Numerator */}
            <div className="flex items-center justify-between w-full px-2 py-0.5">
              <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">
                Numerator (Chung):
              </span>
              <span className={`font-mono text-sm sm:text-base font-black text-center transition-all ${
                !checked ? 'text-slate-400 bg-slate-100 px-2 rounded-xs' : 'text-emerald-700 font-extrabold'
              }`}>
                {!checked
                  ? '?'
                  : target.numerator >= target.denominator
                  ? `${target.numerator} (${Math.floor(target.numerator / target.denominator)}${target.numerator % target.denominator ? ` ${target.numerator % target.denominator}/${target.denominator}` : ''})`
                  : target.numerator}
              </span>
            </div>

            {/* Fraction Dividing Line */}
            <div className="w-full border-t-2 border-black my-0.5"></div>

            {/* Target Denominator */}
            <div className="flex items-center justify-between w-full px-2 py-0.5">
              <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">
                Denominator (Hnuai):
              </span>
              <span className={`font-mono text-sm sm:text-base font-black text-center transition-all ${
                !checked ? 'text-slate-400 bg-slate-100 px-2 rounded-xs' : 'text-slate-900 font-extrabold'
              }`}>
                {!checked ? '?' : target.denominator}
              </span>
            </div>
          </div>
        </div>

        {/* Middle Equality Sign / Comparison Meter Indicator (Pie on left, Chocolate on right) */}
        <div className="md:col-span-2 flex flex-row md:flex-col items-center justify-center gap-1.5 p-1 my-auto shrink-0">
          <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center font-black text-xl transition-all ${
            !checked
              ? 'bg-slate-50 text-slate-400'
              : isCorrect
              ? 'bg-emerald-400 scale-110 shadow-sm text-black ring-2 ring-emerald-500'
              : targetVal < chocVal
              ? 'bg-amber-300 text-black shadow-xs'
              : 'bg-sky-300 text-black shadow-xs'
          }`}>
            {!checked ? '?' : isCorrect ? '=' : targetVal < chocVal ? '<' : '>'}
          </div>
          <span className={`text-[9px] font-mono font-bold uppercase tracking-wider text-center px-1.5 py-0.5 rounded-xs transition-colors ${
            !checked
              ? 'text-slate-400 bg-slate-100'
              : isCorrect
              ? 'text-emerald-800 bg-emerald-100 font-extrabold border border-emerald-400'
              : targetVal < chocVal
              ? 'text-amber-900 bg-amber-100 font-bold border border-amber-300'
              : 'text-sky-900 bg-sky-100 font-bold border border-sky-300'
          }`}>
            {!checked
              ? 'Endik Rawh'
              : isCorrect
              ? 'IN TLUK (=)'
              : targetVal < chocVal
              ? 'Pie < Choc'
              : 'Pie > Choc'}
          </span>
        </div>

        {/* Right Side: 🍫 Interactive Chocolate Bar (Supports Multiple Bars for Improper Fractions) */}
        <div className="md:col-span-5 bg-[#FFF0F5] brutal-border p-2 sm:p-2.5 flex flex-col items-center justify-between min-h-[290px] sm:min-h-[310px] md:min-h-[330px] overflow-hidden relative">
          <div className="w-full flex items-center justify-between mb-0.5 shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-wider bg-black text-white px-1.5 py-0.5 font-mono">
              Chocolate Bar
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[8px] font-mono font-bold text-slate-700 bg-white px-1 py-0.5 border border-black rounded-2xs">
                {barsCount} {barsCount > 1 ? 'Bars' : 'Bar'}
              </span>
              <button
                type="button"
                onClick={handleAddBar}
                className="text-[9px] font-bold bg-[#FFD166] hover:bg-[#ffe19a] px-1.5 py-0.2 border border-black rounded-2xs cursor-pointer transition-colors"
                title="Chocolate bar belh rawh"
              >
                + Bar
              </button>
              {barsCount > 1 && (
                <button
                  type="button"
                  onClick={handleRemoveBar}
                  className="text-[9px] font-bold bg-white hover:bg-slate-100 px-1.5 py-0.2 border border-black rounded-2xs cursor-pointer transition-colors"
                  title="Chocolate bar paih rawh"
                >
                  - Bar
                </button>
              )}
            </div>
          </div>

          {/* Multiple Chocolate Bars stacked inside scrollable, contained area */}
          <div className="w-full flex-1 my-auto min-h-[140px] max-h-[190px] sm:max-h-[210px] overflow-y-auto overflow-x-hidden pr-0.5 flex flex-col gap-1.5">
            {Array.from({ length: barsCount }).map((_, barIdx) => {
              const barStart = barIdx * chocDen;
              const barEnd = (barIdx + 1) * chocDen;
              const barFilledCount = Math.max(0, Math.min(chocDen, chocNum - barStart));
              const isMultiBar = barsCount >= 3;

              return (
                <div key={barIdx} className="w-full bg-[#3e1f07] p-1 rounded-xs border-2 border-black shadow-xs shrink-0">
                  <div className="flex items-center justify-between px-1 mb-0.5">
                    <span className="text-[8px] font-mono font-bold text-amber-200 uppercase">
                      Bar #{barIdx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleToggleWholeBar(barIdx)}
                      className="text-[7.5px] font-mono text-white/90 underline hover:text-amber-300 cursor-pointer"
                    >
                      {barFilledCount === chocDen ? 'Paih vek' : 'Bar Pum Thlang'}
                    </button>
                  </div>
                  <div className="bg-[#5c2e0b] p-0.5 rounded-2xs border border-[#78350f]">
                    <div
                      className="grid gap-0.5 w-full"
                      style={{
                        gridTemplateColumns: `repeat(${
                          chocDen <= 5
                            ? chocDen
                            : chocDen <= 10
                            ? Math.ceil(chocDen / 2)
                            : Math.ceil(chocDen / 3)
                        }, minmax(0, 1fr))`
                      }}
                    >
                      {Array.from({ length: chocDen }).map((_, i) => {
                        const pieceIdx = barIdx * chocDen + i;
                        const isFilled = pieceIdx < chocNum;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handlePieceClick(pieceIdx)}
                            title={`Piece ${pieceIdx + 1}: Hmet la thlang rawh`}
                            className={`${isMultiBar ? 'h-5 sm:h-5.5' : 'h-6 sm:h-6.5'} rounded-2xs transition-all relative cursor-pointer border flex items-center justify-center ${
                              isFilled
                                ? 'bg-[#78350f] hover:bg-[#8d3e12] border-[#a04e19] shadow-inner'
                                : 'bg-[#f5ebe0] hover:bg-[#eddcd2] border-[#cb997e] opacity-40'
                            }`}
                          >
                            {isFilled ? (
                              <div className="w-4/5 h-4/5 border border-[#451a03] bg-[#672d0c] rounded-2xs flex items-center justify-center shadow-2xs">
                                <span className="text-[7px] font-black text-[#a04e19] select-none leading-none">🍫</span>
                              </div>
                            ) : (
                              <div className="w-4/5 h-4/5 border border-dashed border-[#cb997e] rounded-2xs opacity-40" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Stacked Chocolate Fraction Box (Shows '?' until Endik Rawh is pressed) - pinned cleanly at bottom */}
          <div className="flex flex-col items-center w-full max-w-[220px] bg-white brutal-border-sm p-1.5 mt-auto shadow-xs shrink-0">
            {/* Chocolate Numerator */}
            <div className="flex items-center justify-between w-full px-2 py-0.5">
              <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">
                Numerator (Chung):
              </span>
              <span className={`font-mono text-sm sm:text-base font-black text-center transition-all ${
                !checked ? 'text-slate-400 bg-slate-100 px-2 rounded-xs' : 'text-[#78350f] font-extrabold'
              }`}>
                {!checked
                  ? '?'
                  : chocNum >= chocDen
                  ? `${chocNum} (${Math.floor(chocNum / chocDen)}${chocNum % chocDen ? ` ${chocNum % chocDen}/${chocDen}` : ''})`
                  : chocNum}
              </span>
            </div>

            {/* Fraction Dividing Line */}
            <div className="w-full border-t-2 border-black my-0.5"></div>

            {/* Chocolate Denominator */}
            <div className="flex items-center justify-between w-full px-2 py-0.5">
              <span className="text-[10px] font-mono font-bold text-slate-700 uppercase">
                Denominator (Hnuai):
              </span>
              <span className={`font-mono text-sm sm:text-base font-black text-center transition-all ${
                !checked ? 'text-slate-400 bg-slate-100 px-2 rounded-xs' : 'text-slate-900 font-extrabold'
              }`}>
                {!checked ? '?' : chocDen}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Shifted to the right side of the table: Controls & Verification Tab */}
      <div className="col-span-1 lg:col-span-3 bg-[#F8F9FA] brutal-border p-2.5 sm:p-3 flex flex-col justify-between gap-2.5 min-h-[290px] sm:min-h-[310px] md:min-h-[330px]">
        <div className="w-full flex items-center justify-between border-b-2 border-black pb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-xs">⚡</span>
            <span className="text-[10px] font-mono font-black uppercase tracking-wider text-black">
              Endikna Tab
            </span>
          </div>
          <span className="text-[9px] font-bold bg-[#FFD166] border border-black px-1.5 py-0.5 rounded-xs">
            Controls
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 w-full my-auto">
          <button
            onClick={checkMatch}
            className="w-full bg-[#FFD166] hover:bg-[#ffe19a] text-black font-serif italic text-xs font-bold py-2.5 px-3 brutal-border-sm brutal-shadow-xs transition-all active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            <span>Endik Rawh</span>
          </button>

          {checked && isCorrect && (
            <button
              onClick={handleNextTarget}
              className="w-full bg-emerald-400 hover:bg-emerald-500 text-black font-serif italic text-xs font-black py-2.5 px-3 brutal-border-sm brutal-shadow-xs transition-all active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider animate-bounce"
            >
              <span>A Dawt Leh</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}

          <button
            onClick={handleRandomizeTarget}
            className="w-full py-1.5 px-2 bg-white hover:bg-slate-100 border-2 border-black text-black text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer mt-0.5"
            title="Target thar thlang rawh"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Target Thar</span>
          </button>
        </div>

        {/* Live Status & Feedback Box inside the tab */}
        <div className="w-full">
          {checked ? (
            <div
              className={`p-2 brutal-border-sm text-[10px] font-bold leading-tight flex flex-col gap-1 ${
                isCorrect
                  ? 'bg-emerald-100 text-emerald-950 border-emerald-600'
                  : 'bg-rose-100 text-rose-950 border-rose-600'
              }`}
            >
              <div className="flex items-center gap-1">
                {isCorrect ? (
                  <Star className="w-3.5 h-3.5 text-emerald-600 shrink-0 fill-current" />
                ) : (
                  <span className="text-xs shrink-0">⚠️</span>
                )}
                <span className="font-mono text-[10px] uppercase font-black">
                  {isCorrect ? 'DIK CHIAH!' : 'LA DIK LO!'}
                </span>
              </div>
              <p className="text-[10px] leading-tight font-medium">
                {message}
              </p>
            </div>
          ) : (
            <div className="p-2 bg-white border border-slate-300 rounded-xs text-[10px] font-medium text-slate-600 leading-tight">
              💡 Chocolate bar hi hmet la phel zat thlang rawh, chumi hnuah <strong>Endik Rawh</strong> hmet rawh le.
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
