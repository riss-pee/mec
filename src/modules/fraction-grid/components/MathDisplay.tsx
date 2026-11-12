import { simplifyFraction } from '../utils/mathUtils';
import { Language } from '../types';
import { translations } from '../utils/translations';

interface MathDisplayProps {
  total: number;
  shaded: number;
  lang?: Language;
}

export default function MathDisplay({ total, shaded, lang = 'en' }: MathDisplayProps) {
  const t = translations[lang];
  const unshaded = total - shaded;
  
  // 1. Fraction Simplification
  const simplified = simplifyFraction(shaded, total);
  const isSimplifiedSame = simplified.numerator === shaded && simplified.denominator === total;

  // 2. Decimal Value
  const decimalValue = shaded / total;
  const decimalStr = decimalValue % 1 === 0 ? decimalValue.toString() : decimalValue.toFixed(4).replace(/0+$/, '');

  // 3. Percentage
  const percentage = (shaded / total) * 100;
  const percentageStr = percentage % 1 === 0 ? percentage.toFixed(0) : percentage.toFixed(2);

  // 4. Ratios
  // Part-to-Whole Ratio: Shaded : Total
  const partToWholeSimplified = simplifyFraction(shaded, total);
  
  // Part-to-Part Ratio: Shaded : Unshaded
  const partToPartSimplified = simplifyFraction(shaded, unshaded);

  return (
    <div id="math-display-bento" className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full">
      
      {/* CARD 1: FRACTION */}
      <div id="card-fraction" className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between transition-all hover:border-amber-300">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          {t.fractionTitle}
        </span>
        <div className="flex items-center justify-center py-2">
          {shaded === 0 ? (
            <div className="text-center">
              <span className="text-3xl font-extrabold text-slate-800 font-mono">0</span>
              <span className="text-sm text-slate-400 block mt-1">
                {lang === 'mizo' ? `a vai ${total} atangin` : `${t.outOf} ${total}`}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              {/* Unsimplified Fraction */}
              <div className="flex flex-col items-center">
                <span className="text-2xl font-extrabold text-slate-700 font-mono border-b-2 border-slate-300 px-2 pb-0.5">
                  {shaded}
                </span>
                <span className="text-xl font-bold text-slate-500 font-mono pt-0.5 px-2">
                  {total}
                </span>
              </div>
              
              {!isSimplifiedSame && (
                <>
                  <span className="text-slate-300 font-bold">→</span>
                  {/* Simplified Fraction */}
                  <div className="flex flex-col items-center bg-amber-50 px-2 py-1 rounded-lg border border-amber-100">
                    <span className="text-2xl font-black text-amber-600 font-mono border-b-2 border-amber-300 px-2 pb-0.5">
                      {simplified.numerator}
                    </span>
                    <span className="text-xl font-extrabold text-amber-500 font-mono pt-0.5 px-2">
                      {simplified.denominator}
                    </span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
        <div className="text-center text-[10px] text-slate-500 mt-2 font-medium">
          {isSimplifiedSame ? t.simplifiedAlready : t.simplifiedForm}
        </div>
      </div>

      {/* CARD 2: DECIMAL */}
      <div id="card-decimal" className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between transition-all hover:border-amber-300">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          {t.decimalTitle}
        </span>
        <div className="flex flex-col items-center justify-center py-4">
          <span className="text-3xl md:text-4xl font-black text-slate-800 font-mono tracking-tight">
            {decimalStr}
          </span>
          <span className="text-[10px] text-slate-400 mt-2 text-center font-medium">
            {t.calculatedAs}: {shaded} ÷ {total}
          </span>
        </div>
        <div className="text-center text-[10px] text-slate-500 font-medium">
          {t.decimalAreaValue}
        </div>
      </div>

      {/* CARD 3: PERCENT */}
      <div id="card-percent" className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between transition-all hover:border-amber-300">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          {t.percentageTitle}
        </span>
        <div className="flex flex-col items-center justify-center py-3">
          <span className="text-3xl md:text-4xl font-black text-amber-500 font-mono tracking-tight">
            {percentageStr}%
          </span>
          {/* Progress bar visual indicator */}
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3 max-w-[120px]">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-300 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
        <div className="text-center text-[10px] text-slate-500 font-medium">
          {lang === 'mizo' ? `Bawm ${total} atanga hmun ${shaded}` : `${shaded} parts of ${total} total parts`}
        </div>
      </div>

      {/* CARD 4: RATIO */}
      <div id="card-ratio" className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between transition-all hover:border-amber-300">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
          {t.ratioTitle}
        </span>
        <div className="flex flex-col justify-center space-y-2 py-1">
          {/* Part-to-Whole */}
          <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{t.wholeRatio}</span>
            <span className="text-sm font-black text-slate-700 font-mono">
              {shaded}:{total}
              {shaded !== partToWholeSimplified.numerator && (
                <span className="text-amber-500 font-semibold text-xs ml-1 bg-amber-50 px-1 rounded">
                  ({partToWholeSimplified.numerator}:{partToWholeSimplified.denominator})
                </span>
              )}
            </span>
          </div>
          {/* Part-to-Part */}
          <div className="flex justify-between items-center bg-slate-50 p-1.5 rounded-lg border border-slate-100">
            <span className="text-[10px] font-bold text-slate-500 uppercase">{t.partRatio}</span>
            <span className="text-sm font-black text-slate-700 font-mono">
              {shaded}:{unshaded}
              {shaded !== partToPartSimplified.numerator && unshaded !== partToPartSimplified.denominator && (
                <span className="text-amber-500 font-semibold text-xs ml-1 bg-amber-50 px-1 rounded">
                  ({partToPartSimplified.numerator}:{partToPartSimplified.denominator})
                </span>
              )}
            </span>
          </div>
        </div>
        <div className="text-center text-[10px] text-slate-500 font-medium">
          {t.ratioComparison}
        </div>
      </div>

    </div>
  );
}
