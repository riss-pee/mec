import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Plus, Equal, Sparkles, HelpCircle } from 'lucide-react';
import { Fraction } from '../types';
import { PieFractionVisualizer, getSectorPath } from './PieFractionVisualizer';

export const FractionAddition: React.FC = () => {
  const [frac1, setFrac1] = useState<Fraction>({ numerator: 1, denominator: 3 });
  const [frac2, setFrac2] = useState<Fraction>({ numerator: 1, denominator: 2 });

  // Calculate common denominator (b * d is simple and standard for elementary kids)
  const commonDenominator = frac1.denominator * frac2.denominator;
  
  // Calculate equivalent numerators
  const equivNumerator1 = frac1.numerator * frac2.denominator;
  const equivNumerator2 = frac2.numerator * frac1.denominator;
  const sumNumerator = equivNumerator1 + equivNumerator2;

  // Simplification logic
  const gcd = (x: number, y: number): number => (!y ? x : gcd(y, x % y));
  const currentGcd = gcd(sumNumerator, commonDenominator);
  const simplifiedNumerator = sumNumerator / currentGcd;
  const simplifiedDenominator = commonDenominator / currentGcd;

  const handleFrac1Num = (val: number) => {
    setFrac1(prev => ({ ...prev, numerator: Math.max(0, Math.min(prev.denominator * 2, val)) }));
  };

  const handleFrac1Den = (val: number) => {
    setFrac1(prev => {
      const nextDen = Math.max(1, Math.min(12, val)); // restrict to 12 for children
      const nextNum = Math.min(prev.numerator, nextDen * 2);
      return { numerator: nextNum, denominator: nextDen };
    });
  };

  const handleFrac2Num = (val: number) => {
    setFrac2(prev => ({ ...prev, numerator: Math.max(0, Math.min(prev.denominator * 2, val)) }));
  };

  const handleFrac2Den = (val: number) => {
    setFrac2(prev => {
      const nextDen = Math.max(1, Math.min(12, val));
      const nextNum = Math.min(prev.numerator, nextDen * 2);
      return { numerator: nextNum, denominator: nextDen };
    });
  };

  // Color configurations
  const colorFrac1 = { fill: '#60A5FA', stroke: '#000000' }; // Sky
  const colorFrac2 = { fill: '#C084FC', stroke: '#000000' }; // Purple
  const colorEmpty = { fill: '#FFFFFF', stroke: '#000000' };

  // Calculate slices for the combined pie
  const renderCombinedPie = () => {
    const totalPiesNeeded = Math.max(1, Math.ceil(sumNumerator / commonDenominator));
    const size = totalPiesNeeded <= 1 ? 160 : totalPiesNeeded === 2 ? 100 : 75;
    const sliceAngle = 360 / commonDenominator;

    return (
      <div className="flex flex-wrap items-center justify-center gap-2 max-w-full">
        {Array.from({ length: totalPiesNeeded }).map((_, pieIndex) => {
          return (
            <div key={pieIndex} className="flex flex-col items-center justify-center shrink-0" style={{ width: size, minHeight: size + (totalPiesNeeded > 1 ? 16 : 0) }}>
              <svg width={size} height={size} viewBox="-6 -6 216 216" className="overflow-hidden shrink-0">
                {/* Background shadow circle (Brutalist style) */}
                <circle cx="104" cy="104" r="88" fill="#000000" />
                <circle cx="100" cy="100" r="88" fill="#ffffff" stroke="#000000" strokeWidth="3.5" />
                
                {Array.from({ length: commonDenominator }).map((_, sliceIndex) => {
                  const absoluteSliceIndex = pieIndex * commonDenominator + sliceIndex;
                  
                  // Decide which color this slice should be
                  let fill = colorEmpty.fill;
                  let stroke = colorEmpty.stroke;
                  
                  if (absoluteSliceIndex < equivNumerator1) {
                    fill = colorFrac1.fill;
                    stroke = colorFrac1.stroke;
                  } else if (absoluteSliceIndex < sumNumerator) {
                    fill = colorFrac2.fill;
                    stroke = colorFrac2.stroke;
                  }

                  const startAngle = sliceIndex * sliceAngle;
                  const endAngle = (sliceIndex + 1) * sliceAngle;
                  const pathData = getSectorPath(100, 100, 86, startAngle, endAngle);

                  return (
                    <motion.path
                      key={sliceIndex}
                      d={pathData}
                      fill={fill}
                      stroke={stroke}
                      strokeWidth="3.5"
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2, delay: sliceIndex * 0.02 }}
                    />
                  );
                })}

                <circle cx="100" cy="100" r="88" fill="none" stroke="#000000" strokeWidth="1.5" strokeDasharray="4 4" className="opacity-30" />
                <circle cx="100" cy="100" r="8" fill="#000000" />
              </svg>
              {totalPiesNeeded > 1 && (
                <span className="mt-1 bg-black text-white text-[8px] px-1.5 py-0.5 font-mono font-bold brutal-border-sm shadow-2xs leading-none">
                  Pie #{pieIndex + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl bg-white brutal-border brutal-shadow p-3.5 sm:p-4 flex flex-col gap-3.5">
      <div>
        <h3 className="font-serif text-xl text-black font-bold italic leading-tight">Fraction Belhkhawm Visualizer</h3>
        <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">Fraction pahnih belhkhawm la, an phel sawmte a ruala inzawm khawm hi thlir rawh!</p>
      </div>

      {/* Grid containing Fraction inputs and display */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* Fraction 1 Controls & Visualizer */}
        <div className="lg:col-span-4 flex flex-col items-center bg-sky-50 p-4 brutal-border-sm brutal-shadow-sm">
          <span className="font-serif text-sm font-bold text-black mb-3 italic">Fraction 1 (A Pawl)</span>
          <div className="flex gap-4 items-center justify-center">
            {/* Input Numerator / Denominator */}
            <div className="flex flex-col items-center">
              {/* Numerator */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleFrac1Num(frac1.numerator - 1)}
                  className="w-7 h-7 bg-white hover:bg-sky-100 border-2 border-black text-black font-bold flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  value={frac1.numerator}
                  onChange={(e) => handleFrac1Num(parseInt(e.target.value) || 0)}
                  className="w-10 text-center font-sans text-lg font-bold text-black bg-transparent focus:outline-none"
                />
                <button
                  onClick={() => handleFrac1Num(frac1.numerator + 1)}
                  className="w-7 h-7 bg-white hover:bg-sky-100 border-2 border-black text-black font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <div className="w-12 h-[3px] bg-black my-1.5 rounded-none"></div>
              {/* Denominator */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleFrac1Den(frac1.denominator - 1)}
                  className="w-7 h-7 bg-white hover:bg-sky-100 border-2 border-black text-black font-bold flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  value={frac1.denominator}
                  onChange={(e) => handleFrac1Den(parseInt(e.target.value) || 1)}
                  className="w-10 text-center font-sans text-lg font-bold text-black bg-transparent focus:outline-none"
                />
                <button
                  onClick={() => handleFrac1Den(frac1.denominator + 1)}
                  className="w-7 h-7 bg-white hover:bg-sky-100 border-2 border-black text-black font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Visual Pie */}
            <div className="p-1 bg-white brutal-border-sm brutal-shadow-sm rounded-lg scale-90">
              <PieFractionVisualizer numerator={frac1.numerator} denominator={frac1.denominator} color="sky" size={80} />
            </div>
          </div>
        </div>

        {/* Plus Symbol */}
        <div className="lg:col-span-1 flex justify-center items-center">
          <div className="w-10 h-10 bg-white brutal-border rounded-full flex items-center justify-center font-bold text-xl brutal-shadow-sm">
            +
          </div>
        </div>

        {/* Fraction 2 Controls & Visualizer */}
        <div className="lg:col-span-4 flex flex-col items-center bg-purple-50 p-4 brutal-border-sm brutal-shadow-sm">
          <span className="font-serif text-sm font-bold text-black mb-3 italic">Fraction 2 (A Senduk)</span>
          <div className="flex gap-4 items-center justify-center">
            {/* Input Numerator / Denominator */}
            <div className="flex flex-col items-center">
              {/* Numerator */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleFrac2Num(frac2.numerator - 1)}
                  className="w-7 h-7 bg-white hover:bg-purple-100 border-2 border-black text-black font-bold flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  value={frac2.numerator}
                  onChange={(e) => handleFrac2Num(parseInt(e.target.value) || 0)}
                  className="w-10 text-center font-sans text-lg font-bold text-black bg-transparent focus:outline-none"
                />
                <button
                  onClick={() => handleFrac2Num(frac2.numerator + 1)}
                  className="w-7 h-7 bg-white hover:bg-purple-100 border-2 border-black text-black font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
              <div className="w-12 h-[3px] bg-black my-1.5 rounded-none"></div>
              {/* Denominator */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleFrac2Den(frac2.denominator - 1)}
                  className="w-7 h-7 bg-white hover:bg-purple-100 border-2 border-black text-black font-bold flex items-center justify-center"
                >
                  -
                </button>
                <input
                  type="number"
                  value={frac2.denominator}
                  onChange={(e) => handleFrac2Den(parseInt(e.target.value) || 1)}
                  className="w-10 text-center font-sans text-lg font-bold text-black bg-transparent focus:outline-none"
                />
                <button
                  onClick={() => handleFrac2Den(frac2.denominator + 1)}
                  className="w-7 h-7 bg-white hover:bg-purple-100 border-2 border-black text-black font-bold flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>

            {/* Visual Pie */}
            <div className="p-1 bg-white brutal-border-sm brutal-shadow-sm rounded-lg scale-90">
              <PieFractionVisualizer numerator={frac2.numerator} denominator={frac2.denominator} color="purple" size={80} />
            </div>
          </div>
        </div>

        {/* Equal Symbol */}
        <div className="lg:col-span-1 flex justify-center items-center">
          <div className="w-10 h-10 bg-white brutal-border rounded-full flex items-center justify-center font-bold text-xl brutal-shadow-sm">
            =
          </div>
        </div>

        {/* Combined Result Panel */}
        <div className="lg:col-span-2 flex flex-col items-center bg-[#FFD166] p-4 brutal-border-sm brutal-shadow-sm min-h-[160px] justify-center">
          <span className="font-serif text-xs font-bold text-black mb-2 uppercase tracking-wide italic">A Belhkhawm Zat</span>
          <div className="font-sans text-2xl font-black text-black flex flex-col items-center">
            <span>{sumNumerator}</span>
            <div className="w-8 h-[3px] bg-black my-1.5"></div>
            <span className="text-black">{commonDenominator}</span>
          </div>
          {simplifiedDenominator !== commonDenominator && (
            <div className="mt-2 flex items-center gap-1 bg-white px-2 py-1 brutal-border-sm text-xs text-black font-bold">
              <Sparkles className="w-3 h-3 text-[#FF9F1C]" />
              {simplifiedNumerator}/{simplifiedDenominator}
            </div>
          )}
        </div>
      </div>

      {/* Step by Step Common Denominator Explanation (Extremely Educational) */}
      <div className="mt-4 bg-[#F5F5F0] brutal-border-sm p-5">
        <h4 className="font-serif text-lg font-bold text-black mb-3 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-black" />
          Engtin nge kan belh? A chhut dan step te hi thlir ang u:
        </h4>
        
        <div className="flex flex-col gap-4 text-sm text-slate-800 font-medium">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Step 1: Phel sawm zat a inan loh avangin, a hnuai nambar te hi kan puntir hmasa phawt a:</span>
            <code className="bg-white brutal-border-sm px-2 py-0.5 font-mono font-bold text-black text-xs">
              {frac1.denominator} × {frac2.denominator} = {commonDenominator}
            </code>
          </div>

          <div className="flex flex-wrap items-center gap-y-1.5">
            <span>Step 2: Fraction pahnih te phel sawm {commonDenominator} nei tlukpui ah kan thlak a:</span>
            <div className="flex flex-wrap items-center gap-3 ml-2 mt-1">
              <span className="flex items-center gap-1 bg-white px-2 py-1 brutal-border-sm text-xs font-bold">
                <span className="text-blue-600 font-sans">{frac1.numerator}/{frac1.denominator}</span> = 
                <span className="text-slate-700 font-sans">({frac1.numerator}×{frac2.denominator})/({frac1.denominator}×{frac2.denominator})</span> = 
                <span className="text-blue-600 font-sans">{equivNumerator1}/{commonDenominator}</span>
              </span>
              <span className="text-black font-bold">|</span>
              <span className="flex items-center gap-1 bg-white px-2 py-1 brutal-border-sm text-xs font-bold">
                <span className="text-purple-600 font-sans">{frac2.numerator}/{frac2.denominator}</span> = 
                <span className="text-slate-700 font-sans">({frac2.numerator}×{frac1.denominator})/({frac2.denominator}×{frac1.denominator})</span> = 
                <span className="text-purple-600 font-sans">{equivNumerator2}/{commonDenominator}</span>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Step 3: Tunah chuan a chung nambar te kan belhkhawm a, a hnuai nambar erawh a pangngai kan hmang ang:</span>
            <code className="bg-white brutal-border-sm px-2 py-0.5 font-mono font-bold text-black text-xs">
              ({equivNumerator1} + {equivNumerator2}) / {commonDenominator} = {sumNumerator} / {commonDenominator}
            </code>
          </div>
        </div>
      </div>

      {/* Result Visual Pie (Merged Pie) */}
      <div className="flex flex-col items-center justify-center p-6 bg-white brutal-border-sm brutal-shadow-sm mt-2">
        <span className="font-serif text-base font-bold text-black mb-4 uppercase tracking-wider italic">Lem Inzawmkhawm Thlirna</span>
        {renderCombinedPie()}
        
        <p className="text-xs font-bold text-slate-700 mt-4 text-center max-w-md">
          <span className="text-blue-500 underline font-black">Slices a pawl</span> ({equivNumerator1}) leh <span className="text-purple-500 underline font-black">Slices a senduk</span> ({equivNumerator2}) te belhkhawm hian phel sawm {commonDenominator} zinga phel sawm <span className="text-indigo-600">{sumNumerator}</span> chiah an luah a ni!
        </p>
      </div>
    </div>
  );
};

