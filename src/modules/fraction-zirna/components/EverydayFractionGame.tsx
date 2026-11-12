import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Award, CheckCircle, ArrowRight, RefreshCw, AlertCircle, HelpCircle, Flame, Star, Sparkles } from 'lucide-react';
import { getSectorPath } from './PieFractionVisualizer';

interface PizzaRound {
  id: number;
  totalSlices: number; // Denominator
  targetSlices: number; // Numerator
  title: string;
}

// Initial staged progression rounds with high slice complexity from the start
const BASE_ROUNDS: PizzaRound[] = [
  { id: 1, totalSlices: 8, targetSlices: 5, title: 'Round 1: Phel 8 zinga 5 (5/8)' },
  { id: 2, totalSlices: 8, targetSlices: 3, title: 'Round 2: Phel 8 zinga 3 (3/8)' },
  { id: 3, totalSlices: 10, targetSlices: 7, title: 'Round 3: Phel 10 zinga 7 (7/10)' },
  { id: 4, totalSlices: 12, targetSlices: 7, title: 'Round 4: Phel 12 zinga 7 (7/12)' },
  { id: 5, totalSlices: 12, targetSlices: 5, title: 'Round 5: Phel 12 zinga 5 (5/12)' },
  { id: 6, totalSlices: 14, targetSlices: 9, title: 'Round 6: Phel 14 zinga 9 (9/14)' },
  { id: 7, totalSlices: 16, targetSlices: 11, title: 'Round 7: Phel 16 zinga 11 (11/16)' },
  { id: 8, totalSlices: 16, targetSlices: 7, title: 'Round 8: Phel 16 zinga 7 (7/16)' },
  { id: 9, totalSlices: 16, targetSlices: 13, title: 'Round 9: Phel 16 zinga 13 (13/16)' },
  { id: 10, totalSlices: 20, targetSlices: 13, title: 'Round 10: Phel 20 zinga 13 (13/20)' },
  { id: 11, totalSlices: 20, targetSlices: 15, title: 'Round 11: Phel 20 zinga 15 (15/20)' },
  { id: 12, totalSlices: 24, targetSlices: 17, title: 'Round 12: Phel 24 zinga 17 (17/24)' },
];

function generateNextRound(roundNumber: number): PizzaRound {
  if (roundNumber <= BASE_ROUNDS.length) {
    return BASE_ROUNDS[roundNumber - 1];
  }
  // Generate progressively challenging rounds with high slice counts
  const sliceOptions = [8, 10, 12, 14, 16, 20, 24];
  const difficultyIdx = Math.min(sliceOptions.length - 1, Math.floor((roundNumber - BASE_ROUNDS.length) / 2) + 2);
  const possibleDenominators = sliceOptions.slice(Math.max(1, difficultyIdx - 2), difficultyIdx + 1);
  const totalSlices = possibleDenominators[Math.floor(Math.random() * possibleDenominators.length)];
  const targetSlices = Math.floor(Math.random() * (totalSlices - 1)) + 1;
  return {
    id: roundNumber,
    totalSlices,
    targetSlices,
    title: `Round ${roundNumber}: Phel ${totalSlices} zinga ${targetSlices} (${targetSlices}/${totalSlices})`
  };
}

export function EverydayFractionGame() {
  const [roundNumber, setRoundNumber] = useState(1);
  const [currentRound, setCurrentRound] = useState<PizzaRound>(BASE_ROUNDS[0]);
  
  // Player inputs
  const [inputNum, setInputNum] = useState<number>(1);
  const [inputDen, setInputDen] = useState<number>(8);

  // Game state
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');
  const [showSliceNumbers, setShowSliceNumbers] = useState<boolean>(false);
  const [selectedSliceIndex, setSelectedSliceIndex] = useState<number | null>(null);

  // Check player's answer
  const handleCheckAnswer = () => {
    const targetN = currentRound.targetSlices;
    const targetD = currentRound.totalSlices;

    // Check exact fraction or equivalent fraction match
    const exactMatch = inputNum === targetN && inputDen === targetD;
    const equivalentMatch = (inputNum / inputDen) === (targetN / targetD);

    if (exactMatch || equivalentMatch) {
      setIsCorrect(true);
      const pointsEarned = 10 + streak * 2;
      setScore(prev => prev + pointsEarned);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);

      if (exactMatch) {
        setFeedbackMsg(`I ti dik chiah e! 🎉 Pizza slice fraction hi ${targetN}/${targetD} a ni.`);
      } else {
        setFeedbackMsg(`I ti dik lutuk! 🎉 ${inputNum}/${inputDen} hi ${targetN}/${targetD} nen an intluk chiah a ni! (+${pointsEarned} pt)`);
      }
    } else {
      setIsCorrect(false);
      setStreak(0);
      setFeedbackMsg(
        `A la dik lo deuh hlek! Pizza slice awm zat hi chhiar rawh le: Phel zawng zawng (Denominator) = ${targetD}, Slice awm zat (Numerator) = ${targetN}.`
      );
    }
    setIsAnswerChecked(true);
  };

  // Advance to next round with more slices
  const handleNextRound = () => {
    const nextNum = roundNumber + 1;
    const nextRoundData = generateNextRound(nextNum);
    setRoundNumber(nextNum);
    setCurrentRound(nextRoundData);
    // Reset inputs to clean defaults
    setInputNum(1);
    setInputDen(nextRoundData.totalSlices > 2 ? 4 : 2);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setFeedbackMsg('');
    setShowSliceNumbers(false);
    setSelectedSliceIndex(null);
  };

  // Reset entire session
  const handleRestart = () => {
    setRoundNumber(1);
    setCurrentRound(BASE_ROUNDS[0]);
    setInputNum(1);
    setInputDen(2);
    setScore(0);
    setStreak(0);
    setIsAnswerChecked(false);
    setIsCorrect(false);
    setFeedbackMsg('');
    setShowSliceNumbers(false);
    setSelectedSliceIndex(null);
  };

  const { totalSlices, targetSlices } = currentRound;
  const sliceAngle = 360 / totalSlices;

  return (
    <div className="w-full max-w-4xl bg-white brutal-border brutal-shadow p-3.5 sm:p-4 flex flex-col gap-3">
      
      {/* Top Game Bar: Title, Score, Streak */}
      <div className="flex flex-wrap justify-between items-center bg-[#FFD166] p-2.5 sm:p-3 brutal-border-sm brutal-shadow-xs gap-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-white brutal-border text-black shadow-xs rounded-none font-bold text-lg">
            🍕
          </div>
          <div>
            <div className="text-[9px] font-bold text-slate-800 uppercase tracking-widest font-mono leading-none">
              Pizza slice fraction
            </div>
            <div className="font-serif text-lg sm:text-xl font-black text-black italic leading-tight mt-0.5">
              Round {roundNumber}: {totalSlices} Slices Pizza
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Score Point */}
          <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 brutal-border-sm brutal-shadow-xs">
            <Award className="w-3.5 h-3.5 text-black" />
            <span className="font-mono text-xs font-black text-black">{score} pts</span>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-1 bg-[#FF9F1C] px-2.5 py-1 brutal-border-sm text-black font-bold text-xs uppercase tracking-wider brutal-shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-black stroke-black" />
            <span>{streak} Streak</span>
          </div>

          {/* Restart */}
          <button
            onClick={handleRestart}
            title="Start from Round 1"
            className="text-[11px] font-bold text-black hover:underline transition-all flex items-center gap-1 cursor-pointer uppercase tracking-wider"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Thar</span>
          </button>
        </div>
      </div>

      {/* Main Game Interface: SVG Pizza Image + Interactive Input Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 sm:gap-5 items-center">
        
        {/* Left: Delicious SVG Pizza Visual Model */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center bg-[#FFF9E6] brutal-border p-3 sm:p-3.5 relative">
          
          {/* Slice Count / Helper Tooltip */}
          <div className="w-full flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider bg-black text-white px-1.5 py-0.5 font-mono">
                Lem Thlir Rawh
              </span>
              <span className="text-[11px] font-mono font-bold text-slate-700">
                Phel {totalSlices} awm
              </span>
            </div>

            <button
              onClick={() => setShowSliceNumbers(!showSliceNumbers)}
              className="text-[11px] font-bold bg-white hover:bg-slate-50 text-black px-2 py-0.5 brutal-border-sm brutal-shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3 h-3" />
              <span>{showSliceNumbers ? 'Nambar Thup' : 'Nambar Tarlang'}</span>
            </button>
          </div>

          {/* SVG Canvas for Whole Pizza and Highlighted Slices */}
          <div className="relative flex items-center justify-center py-1 max-w-full overflow-hidden">
            <svg width="210" height="210" viewBox="-4 -4 288 288" className="overflow-hidden drop-shadow-xs max-w-full h-auto">
              {/* Wooden Cutting Board / Serving Pan */}
              <circle cx="140" cy="140" r="136" fill="#e2b170" stroke="#000" strokeWidth="3" />
              <circle cx="140" cy="140" r="126" fill="#fdf0dd" stroke="#c08a4e" strokeWidth="2" strokeDasharray="6 4" />
              
              {/* Pizza Base Outer Crust */}
              <circle cx="140" cy="140" r="114" fill="#d97706" stroke="#000" strokeWidth="2.5" />
              {/* Tomato Sauce layer */}
              <circle cx="140" cy="140" r="104" fill="#dc2626" />
              {/* Melted Cheese background */}
              <circle cx="140" cy="140" r="100" fill="#fbbf24" />

              {/* Pizza Slices */}
              {Array.from({ length: totalSlices }).map((_, i) => {
                const isTarget = i < targetSlices;
                const startAngle = i * sliceAngle;
                const endAngle = (i + 1) * sliceAngle;
                const midAngle = ((startAngle + endAngle) / 2) * (Math.PI / 180) - (Math.PI / 2);

                if (isTarget) {
                  // Active Slices: Drawn with rich cheese, crust border & pepperoni toppings
                  const slicePath = getSectorPath(140, 140, 100, startAngle, endAngle);
                  return (
                    <g 
                      key={i}
                      className="cursor-pointer transition-transform hover:opacity-95"
                      onClick={() => setSelectedSliceIndex(i)}
                    >
                      {/* Rich Cheese & Sauce Slice */}
                      <path 
                        d={slicePath} 
                        fill="#f59e0b" 
                        stroke="#000" 
                        strokeWidth="2.5" 
                      />

                      {/* Pepperoni Slices scattered along radial distance */}
                      {[0.4, 0.72].map((ratio, pIdx) => {
                        const dist = 100 * ratio;
                        const angleOffset = (pIdx === 0 ? -0.1 : 0.12);
                        const px = 140 + dist * Math.cos(midAngle + angleOffset);
                        const py = 140 + dist * Math.sin(midAngle + angleOffset);
                        return (
                          <g key={pIdx}>
                            <circle cx={px} cy={py} r="6.5" fill="#991b1b" stroke="#000" strokeWidth="1.5" />
                            <circle cx={px - 2} cy={py - 1.5} r="1.5" fill="#fca5a5" opacity="0.6" />
                          </g>
                        );
                      })}

                      {/* Slice Number Badge (if toggled) */}
                      {showSliceNumbers && (
                        <text
                          x={140 + 72 * Math.cos(midAngle)}
                          y={145 + 72 * Math.sin(midAngle)}
                          fontSize="13"
                          fontWeight="bold"
                          textAnchor="middle"
                          fill="#000"
                          className="font-mono select-none pointer-events-none"
                        >
                          {i + 1}
                        </text>
                      )}
                    </g>
                  );
                } else {
                  // Empty / Eaten Slices: Gray dashed outline representing missing slice slots of the whole pizza
                  const emptyPath = getSectorPath(140, 140, 100, startAngle, endAngle);
                  return (
                    <g key={i}>
                      <path
                        d={emptyPath}
                        fill="#f8fafc"
                        stroke="#000"
                        strokeWidth="1.8"
                        strokeDasharray="4 3"
                        className="opacity-60"
                      />
                      {showSliceNumbers && (
                        <text
                          x={140 + 72 * Math.cos(midAngle)}
                          y={145 + 72 * Math.sin(midAngle)}
                          fontSize="12"
                          fontWeight="bold"
                          textAnchor="middle"
                          fill="#94a3b8"
                          className="font-mono select-none pointer-events-none"
                        >
                          {i + 1}
                        </text>
                      )}
                    </g>
                  );
                }
              })}

              {/* Pizza Center Pivot Pin */}
              <circle cx="140" cy="140" r="8" fill="#451a03" stroke="#000" strokeWidth="2" />
              <circle cx="140" cy="140" r="3" fill="#fbbf24" />
            </svg>
          </div>

          {/* Visual Legend: Slices vs Whole Pizza */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 text-[11px] font-bold font-mono">
            <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 brutal-border-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-black inline-block"></span>
              <span>Slice awm zat: <strong className="text-black font-extrabold">{targetSlices}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 brutal-border-sm">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f8fafc] border border-black border-dashed inline-block"></span>
              <span>Pum pui phel: <strong className="text-black font-extrabold">{totalSlices}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Question Prompt and Fraction Input Form */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          
          <div>
            <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-400 text-black px-2 py-0.5 brutal-border-sm font-mono inline-block mb-1">
              Fraction Dahlut Rawh
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-black leading-snug">
              Pizza slice fraction eng nge ni?
            </h3>
            <p className="text-[11px] text-slate-700 font-semibold leading-tight">
              Slice awm zat (Numerator) leh pum pui phel zat (Denominator) dahlut rawh.
            </p>
          </div>

          {/* Interactive Fraction Input Card */}
          <div className="bg-[#F8F9FA] brutal-border p-3 sm:p-3.5 flex flex-col items-center gap-3">
            
            {/* Visual Fraction Notation Box */}
            <div className="flex flex-col items-center gap-1.5 bg-white brutal-border-sm p-2.5 w-full">
              
              {/* Numerator Input Row */}
              <div className="w-full flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex-1">
                  Numerator (Slice):
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setInputNum(prev => Math.max(1, prev - 1))}
                    disabled={isAnswerChecked && isCorrect}
                    className="w-7 h-7 bg-white border-2 border-black hover:bg-[#FFD166] disabled:opacity-50 font-bold text-sm transition-colors flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="64"
                    value={inputNum}
                    disabled={isAnswerChecked && isCorrect}
                    onChange={(e) => setInputNum(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center font-mono text-lg font-black text-black bg-white border-2 border-black py-0.5 focus:outline-none"
                  />
                  <button
                    onClick={() => setInputNum(prev => prev + 1)}
                    disabled={isAnswerChecked && isCorrect}
                    className="w-7 h-7 bg-white border-2 border-black hover:bg-[#FFD166] disabled:opacity-50 font-bold text-sm transition-colors flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Fraction Separator Line */}
              <div className="w-full border-t-2 border-black my-0.5"></div>

              {/* Denominator Input Row */}
              <div className="w-full flex items-center justify-between gap-2">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex-1">
                  Denominator (Pum pui):
                </span>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setInputDen(prev => Math.max(1, prev - 1))}
                    disabled={isAnswerChecked && isCorrect}
                    className="w-7 h-7 bg-white border-2 border-black hover:bg-[#FFD166] disabled:opacity-50 font-bold text-sm transition-colors flex items-center justify-center cursor-pointer"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="64"
                    value={inputDen}
                    disabled={isAnswerChecked && isCorrect}
                    onChange={(e) => setInputDen(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-12 text-center font-mono text-lg font-black text-black bg-white border-2 border-black py-0.5 focus:outline-none"
                  />
                  <button
                    onClick={() => setInputDen(prev => prev + 1)}
                    disabled={isAnswerChecked && isCorrect}
                    className="w-7 h-7 bg-white border-2 border-black hover:bg-[#FFD166] disabled:opacity-50 font-bold text-sm transition-colors flex items-center justify-center cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Live Fraction Preview Badge */}
            <div className="flex items-center gap-2 text-[11px] font-mono font-bold text-slate-600">
              <span>I dahlut zat:</span>
              <span className="bg-white border-2 border-black px-2.5 py-0.5 font-black text-sm text-black">
                {inputNum} / {inputDen}
              </span>
            </div>

            {/* Feedback Message */}
            <AnimatePresence>
              {isAnswerChecked && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`w-full p-2.5 brutal-border-sm text-[11px] font-bold leading-snug flex items-start gap-2 ${
                    isCorrect ? 'bg-emerald-100 text-emerald-900 border-emerald-600' : 'bg-rose-100 text-rose-900 border-rose-600'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div>{feedbackMsg}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons: Check Answer or Next Round */}
            <div className="w-full flex flex-col gap-2">
              {!isAnswerChecked || !isCorrect ? (
                <button
                  onClick={handleCheckAnswer}
                  className="w-full py-2 bg-[#FFD166] hover:bg-[#ffe19a] brutal-border-sm brutal-shadow-xs font-serif italic font-bold text-sm text-black transition-all active:translate-y-0.5 cursor-pointer uppercase tracking-wider"
                >
                  Endik Rawh ➔
                </button>
              ) : (
                <motion.button
                  initial={{ scale: 0.96 }}
                  animate={{ scale: 1 }}
                  onClick={handleNextRound}
                  className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-500 brutal-border-sm brutal-shadow font-serif italic font-black text-sm text-black transition-all active:translate-y-0.5 cursor-pointer flex items-center justify-center gap-1.5 uppercase tracking-wider"
                >
                  <span>A Dawt Leh (More Slices)</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* Elementary Educational Helper Footer Note */}
      <div className="bg-[#F8F9FA] p-2 brutal-border-sm text-[11px] font-semibold text-slate-700 flex flex-col sm:flex-row items-center justify-between gap-1.5">
        <span>💡 <strong>Hriat tur:</strong> Numerator hian slice awm zat a entir a, Denominator hian pizza pum pui phel zawng zawng a entir.</span>
        <span className="font-mono font-bold text-black shrink-0">Round: {roundNumber} / Streak: {streak}</span>
      </div>

    </div>
  );
}

export default EverydayFractionGame;
