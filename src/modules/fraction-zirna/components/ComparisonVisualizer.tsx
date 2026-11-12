import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, HelpCircle, RefreshCw } from 'lucide-react';
import { Fraction } from '../types';

interface ComparisonVisualizerProps {
  initialFractionA?: Fraction;
  initialFractionB?: Fraction;
  onCompareResult?: (result: 'greater' | 'less' | 'equal') => void;
  hideInputs?: boolean;
}

export const ComparisonVisualizer: React.FC<ComparisonVisualizerProps> = ({
  initialFractionA = { numerator: 1, denominator: 2 },
  initialFractionB = { numerator: 2, denominator: 3 },
  onCompareResult,
  hideInputs = false,
}) => {
  const [fracA, setFracA] = useState<Fraction>(initialFractionA);
  const [fracB, setFracB] = useState<Fraction>(initialFractionB);

  const valA = fracA.numerator / fracA.denominator;
  const valB = fracB.numerator / fracB.denominator;

  const handleNumeratorA = (val: number) => {
    setFracA(prev => {
      const nextNum = Math.max(0, Math.min(prev.denominator * 6, val)); // Allow up to 6x for improper fractions
      return { ...prev, numerator: nextNum };
    });
  };

  const handleDenominatorA = (val: number) => {
    setFracA(prev => {
      const nextDen = Math.max(1, Math.min(24, val));
      const nextNum = Math.min(prev.numerator, nextDen * 6);
      return { numerator: nextNum, denominator: nextDen };
    });
  };

  const handleNumeratorB = (val: number) => {
    setFracB(prev => {
      const nextNum = Math.max(0, Math.min(prev.denominator * 6, val));
      return { ...prev, numerator: nextNum };
    });
  };

  const handleDenominatorB = (val: number) => {
    setFracB(prev => {
      const nextDen = Math.max(1, Math.min(24, val));
      const nextNum = Math.min(prev.numerator, nextDen * 6);
      return { numerator: nextNum, denominator: nextDen };
    });
  };

  const getRelation = () => {
    // avoid float precision errors
    const diff = valA - valB;
    if (Math.abs(diff) < 0.000001) return 'equal';
    return diff > 0 ? 'greater' : 'less';
  };

  const relation = getRelation();

  const handleRandomize = () => {
    const denA = Math.floor(Math.random() * 8) + 2; // 2 to 9
    const numA = Math.floor(Math.random() * (denA - 1)) + 1; // 1 to den-1
    const denB = Math.floor(Math.random() * 8) + 2;
    const numB = Math.floor(Math.random() * (denB - 1)) + 1;
    setFracA({ numerator: numA, denominator: denA });
    setFracB({ numerator: numB, denominator: denB });
  };

  return (
    <div className="w-full max-w-3xl bg-white brutal-border brutal-shadow p-3.5 sm:p-4 flex flex-col gap-3.5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2.5">
        <div>
          <h3 className="font-serif text-xl text-black font-bold italic leading-tight">Chocolate Bar Tehkhinna</h3>
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Chocolate bar khat chhung engzah nge khat tih khaikhin rawh!</p>
        </div>
        {!hideInputs && (
          <button
            onClick={handleRandomize}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-black bg-[#FFD166] hover:bg-[#ffe19a] brutal-border-sm brutal-shadow-sm transition-all active:translate-y-0.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Fraction Thlak Rawh
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Fraction A Input Panel */}
        {!hideInputs && (
          <div className="md:col-span-3 bg-emerald-50 p-4 brutal-border-sm brutal-shadow-sm flex flex-col gap-3">
            <div className="text-center font-serif font-bold italic text-black">Chocolate Bar A</div>
            <div className="flex flex-col items-center justify-center">
              {/* Numerator */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNumeratorA(fracA.numerator - 1)}
                  className="w-8 h-8 bg-white hover:bg-emerald-100 border-2 border-black font-bold text-black transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={fracA.numerator}
                  onChange={(e) => handleNumeratorA(parseInt(e.target.value) || 0)}
                  className="w-12 text-center font-sans text-lg font-bold text-black focus:outline-none bg-transparent"
                />
                <button
                  onClick={() => handleNumeratorA(fracA.numerator + 1)}
                  className="w-8 h-8 bg-white hover:bg-emerald-100 border-2 border-black font-bold text-black transition-colors"
                >
                  +
                </button>
              </div>
              <div className="w-16 h-[3px] bg-black my-1.5"></div>
              {/* Denominator */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDenominatorA(fracA.denominator - 1)}
                  className="w-8 h-8 bg-white hover:bg-emerald-100 border-2 border-black font-bold text-black transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={fracA.denominator}
                  onChange={(e) => handleDenominatorA(parseInt(e.target.value) || 1)}
                  className="w-12 text-center font-sans text-lg font-bold text-black focus:outline-none bg-transparent"
                />
                <button
                  onClick={() => handleDenominatorA(fracA.denominator + 1)}
                  className="w-8 h-8 bg-white hover:bg-emerald-100 border-2 border-black font-bold text-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-[10px] text-center text-slate-700 italic font-mono mt-1 font-bold">
              Hlutna: {valA.toFixed(2)} ({Math.round(valA * 100)}%)
            </div>
          </div>
        )}

        {/* Visual Display Center */}
        <div className={hideInputs ? "col-span-12" : "md:col-span-6 flex flex-col gap-8 w-full"}>
          
          {/* Bar A Container */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-600">
              <span className="text-emerald-700">
                Bar A ({fracA.numerator}/{fracA.denominator})
                {fracA.numerator >= fracA.denominator && (
                  <span className="ml-1.5 text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded-2xs border border-emerald-400">
                    {Math.floor(fracA.numerator / fracA.denominator)} {fracA.numerator % fracA.denominator > 0 ? `${fracA.numerator % fracA.denominator}/${fracA.denominator}` : ''}
                  </span>
                )}
              </span>
              <span>{Math.round(valA * 100)}%</span>
            </div>
            
            <div className="w-full max-h-[165px] overflow-y-auto overflow-x-hidden pr-0.5 flex flex-col gap-1.5">
              {Array.from({ length: Math.max(1, Math.ceil(fracA.numerator / fracA.denominator)) }).map((_, barIdx) => {
                const filledInThisBar = Math.max(0, Math.min(fracA.denominator, fracA.numerator - barIdx * fracA.denominator));
                const barFillPercent = (filledInThisBar / fracA.denominator) * 100;

                return (
                  <div key={barIdx} className="relative h-9 sm:h-10 w-full bg-[#FFFFFF] brutal-border overflow-hidden flex shrink-0">
                    {/* Grid mark dividers */}
                    {Array.from({ length: fracA.denominator }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 border-r-2 border-black border-dashed z-10 pointer-events-none h-full"
                        style={{ left: `${((i + 1) / fracA.denominator) * 100}%` }}
                      />
                    ))}
                    {/* Colored filled bar */}
                    <motion.div
                      className="h-full bg-emerald-400 border-r-2 border-black"
                      initial={{ width: 0 }}
                      animate={{ width: `${barFillPercent}%` }}
                      transition={{ type: 'spring', stiffness: 60 }}
                    />
                    {barIdx > 0 && (
                      <span className="absolute right-1 top-0.5 text-[8px] font-mono font-bold bg-black text-white px-1 rounded-2xs pointer-events-none z-20">
                        Bar #{barIdx + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Relation Sign Card */}
          <div className="flex justify-center items-center -my-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={relation}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center font-serif text-2xl sm:text-3xl font-extrabold border-3 border-black brutal-shadow-sm ${
                  relation === 'greater'
                    ? 'bg-emerald-300 text-black'
                    : relation === 'less'
                    ? 'bg-amber-300 text-black'
                    : 'bg-indigo-300 text-black'
                }`}
              >
                {relation === 'greater' ? '>' : relation === 'less' ? '<' : '='}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bar B Container */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-600">
              <span className="text-amber-700">
                Bar B ({fracB.numerator}/{fracB.denominator})
                {fracB.numerator >= fracB.denominator && (
                  <span className="ml-1.5 text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-2xs border border-amber-400">
                    {Math.floor(fracB.numerator / fracB.denominator)} {fracB.numerator % fracB.denominator > 0 ? `${fracB.numerator % fracB.denominator}/${fracB.denominator}` : ''}
                  </span>
                )}
              </span>
              <span>{Math.round(valB * 100)}%</span>
            </div>

            <div className="w-full max-h-[165px] overflow-y-auto overflow-x-hidden pr-0.5 flex flex-col gap-1.5">
              {Array.from({ length: Math.max(1, Math.ceil(fracB.numerator / fracB.denominator)) }).map((_, barIdx) => {
                const filledInThisBar = Math.max(0, Math.min(fracB.denominator, fracB.numerator - barIdx * fracB.denominator));
                const barFillPercent = (filledInThisBar / fracB.denominator) * 100;

                return (
                  <div key={barIdx} className="relative h-9 sm:h-10 w-full bg-[#FFFFFF] brutal-border overflow-hidden flex shrink-0">
                    {/* Grid mark dividers */}
                    {Array.from({ length: fracB.denominator }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 border-r-2 border-black border-dashed z-10 pointer-events-none h-full"
                        style={{ left: `${((i + 1) / fracB.denominator) * 100}%` }}
                      />
                    ))}
                    {/* Colored filled bar */}
                    <motion.div
                      className="h-full bg-amber-400 border-r-2 border-black"
                      initial={{ width: 0 }}
                      animate={{ width: `${barFillPercent}%` }}
                      transition={{ type: 'spring', stiffness: 60 }}
                    />
                    {barIdx > 0 && (
                      <span className="absolute right-1 top-0.5 text-[8px] font-mono font-bold bg-black text-white px-1 rounded-2xs pointer-events-none z-20">
                        Bar #{barIdx + 1}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Fraction B Input Panel */}
        {!hideInputs && (
          <div className="md:col-span-3 bg-amber-50 p-4 brutal-border-sm brutal-shadow-sm flex flex-col gap-3">
            <div className="text-center font-serif font-bold italic text-black">Chocolate Bar B</div>
            <div className="flex flex-col items-center justify-center">
              {/* Numerator */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNumeratorB(fracB.numerator - 1)}
                  className="w-8 h-8 bg-white hover:bg-amber-100 border-2 border-black font-bold text-black transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={fracB.numerator}
                  onChange={(e) => handleNumeratorB(parseInt(e.target.value) || 0)}
                  className="w-12 text-center font-sans text-lg font-bold text-black focus:outline-none bg-transparent"
                />
                <button
                  onClick={() => handleNumeratorB(fracB.numerator + 1)}
                  className="w-8 h-8 bg-white hover:bg-amber-100 border-2 border-black font-bold text-black transition-colors"
                >
                  +
                </button>
              </div>
              <div className="w-16 h-[3px] bg-black my-1.5"></div>
              {/* Denominator */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDenominatorB(fracB.denominator - 1)}
                  className="w-8 h-8 bg-white hover:bg-amber-100 border-2 border-black font-bold text-black transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  value={fracB.denominator}
                  onChange={(e) => handleDenominatorB(parseInt(e.target.value) || 1)}
                  className="w-12 text-center font-sans text-lg font-bold text-black focus:outline-none bg-transparent"
                />
                <button
                  onClick={() => handleDenominatorB(fracB.denominator + 1)}
                  className="w-8 h-8 bg-white hover:bg-amber-100 border-2 border-black font-bold text-black transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <div className="text-[10px] text-center text-slate-700 italic font-mono mt-1 font-bold">
              Hlutna: {valB.toFixed(2)} ({Math.round(valB * 100)}%)
            </div>
          </div>
        )}
      </div>

      {/* Comparison Text Summary for kids */}
      <div className="mt-4 bg-[#F5F5F0] brutal-border-sm brutal-shadow-sm p-4 flex items-center justify-center text-center">
        <p className="font-serif text-base font-bold text-black">
          {relation === 'greater' ? (
            <span>
              🍫 <span className="bg-emerald-200 px-1 brutal-border-sm font-bold font-sans">{fracA.numerator}/{fracA.denominator}</span> hi{' '}
              <span className="bg-amber-200 px-1 brutal-border-sm font-bold font-sans">{fracB.numerator}/{fracB.denominator}</span> aiin{' '}
              <span className="text-emerald-600 font-extrabold italic">A LIAN ZAWK</span> a ni! (
              {Math.round(valA * 100)}% &gt; {Math.round(valB * 100)}%)
            </span>
          ) : relation === 'less' ? (
            <span>
              🍫 <span className="bg-emerald-200 px-1 brutal-border-sm font-bold font-sans">{fracA.numerator}/{fracA.denominator}</span> hi{' '}
              <span className="bg-amber-200 px-1 brutal-border-sm font-bold font-sans">{fracB.numerator}/{fracB.denominator}</span> aiin{' '}
              <span className="text-amber-600 font-extrabold italic">A TE ZAWK</span> a ni! (
              {Math.round(valA * 100)}% &lt; {Math.round(valB * 100)}%)
            </span>
          ) : (
            <span>
              🎉 Wow! <span className="bg-indigo-200 px-1 brutal-border-sm font-extrabold italic">AN IN TLUKTLÂNG CHIAH</span>!{' '}
              <span className="bg-emerald-200 px-1 brutal-border-sm font-bold font-sans">{fracA.numerator}/{fracA.denominator}</span> leh{' '}
              <span className="bg-amber-200 px-1 brutal-border-sm font-bold font-sans">{fracB.numerator}/{fracB.denominator}</span> te hi{' '}
              <span className="text-indigo-600 font-extrabold italic">Fraction Tlukpui</span> an ni! An awm zat a in tluk chiah a ni!
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

