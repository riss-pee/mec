import { ParseResult, Challenge, Language } from '../types';

// Helper to calculate the Greatest Common Divisor
export function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a || 1;
}

// Simplify a fraction
export function simplifyFraction(num: number, denom: number): { numerator: number; denominator: number } {
  if (num === 0) return { numerator: 0, denominator: 1 };
  const commonDivisor = gcd(num, denom);
  return {
    numerator: num / commonDivisor,
    denominator: denom / commonDivisor,
  };
}

// Check if a float is very close to another float
export function approxEqual(v1: number, v2: number, tolerance: number = 0.0001): boolean {
  return Math.abs(v1 - v2) < tolerance;
}

// Parse custom mathematical input
export function parseMathInput(
  input: string,
  totalSquares: number,
  shadedSquares: number,
  lang: Language = 'en'
): ParseResult {
  const isMizo = lang === 'mizo';
  const clean = input.trim().toLowerCase().replace(/\s+/g, '');
  if (!clean) {
    return { 
      isValid: false, 
      type: 'unknown', 
      value: 0, 
      error: isMizo ? 'Khawngaihin chhanna chhu lut rawh.' : 'Please enter a value.' 
    };
  }

  const targetRatio = shadedSquares / totalSquares;

  // 1. Percentage check (ends with % or is in decimal format)
  if (clean.includes('%')) {
    const parts = clean.split('%');
    const val = parseFloat(parts[0]);
    if (isNaN(val)) {
      return { 
        isValid: false, 
        type: 'percentage', 
        value: 0, 
        error: isMizo ? 'Percentage dik lo.' : 'Invalid percentage format.' 
      };
    }
    const parsedRatio = val / 100;
    const isCorrect = approxEqual(parsedRatio, targetRatio, 0.005); // slightly wider tolerance for percentages like 33.3%
    const errorMsg = isMizo
      ? `A dik lo. ${val}% chu ${parsedRatio.toFixed(3)} a ni a, mahse rawng hnawih zat chu ${(targetRatio * 100).toFixed(1)}% a ni.`
      : `Incorrect. ${val}% equals ${parsedRatio.toFixed(3)}, but shaded ratio is ${(targetRatio * 100).toFixed(1)}%.`;

    return {
      isValid: isCorrect,
      type: 'percentage',
      value: parsedRatio,
      error: isCorrect ? undefined : errorMsg
    };
  }

  // 2. Ratio check (contains : or "to")
  if (clean.includes(':') || clean.includes('to')) {
    const parts = clean.includes(':') ? clean.split(':') : clean.split('to');
    const a = parseFloat(parts[0]);
    const b = parseFloat(parts[1]);

    if (isNaN(a) || isNaN(b) || b === 0) {
      return { 
        isValid: false, 
        type: 'ratio', 
        value: 0, 
        error: isMizo ? 'Ratio dik lo a ni.' : 'Invalid ratio format.' 
      };
    }

    // Part-to-Whole interpretation: a shaded squares out of b total squares
    const partToWholeRatio = a / b;
    // Part-to-Part interpretation: a shaded squares to b unshaded squares
    const partToPartRatio = a / (a + b);

    const matchPartToWhole = approxEqual(partToWholeRatio, targetRatio, 0.001);
    const matchPartToPart = approxEqual(partToPartRatio, targetRatio, 0.001);

    if (matchPartToWhole) {
      return {
        isValid: true,
        type: 'ratio',
        value: partToWholeRatio,
      };
    } else if (matchPartToPart) {
      return {
        isValid: true,
        type: 'ratio',
        value: partToPartRatio,
      };
    } else {
      const currentUnshaded = totalSquares - shadedSquares;
      const simplifiedShadedToTotal = simplifyFraction(shadedSquares, totalSquares);
      const simplifiedShadedToUnshaded = simplifyFraction(shadedSquares, currentUnshaded);
      const errorMsg = isMizo
        ? `Ratio a dik lo. Rawng hnawih leh a vai zat inlaichinna chu ${simplifiedShadedToTotal.numerator}:${simplifiedShadedToTotal.denominator} a ni a, hnawih zat leh hnawih loh zat chu ${simplifiedShadedToUnshaded.numerator}:${simplifiedShadedToUnshaded.denominator} a ni.`
        : `Incorrect ratio. Shaded to Total is ${simplifiedShadedToTotal.numerator}:${simplifiedShadedToTotal.denominator}, Shaded to Unshaded is ${simplifiedShadedToUnshaded.numerator}:${simplifiedShadedToUnshaded.denominator}.`;
      return {
        isValid: false,
        type: 'ratio',
        value: partToWholeRatio,
        error: errorMsg
      };
    }
  }

  // 3. Fraction check (contains /)
  if (clean.includes('/')) {
    const parts = clean.split('/');
    if (parts.length !== 2) {
      return { 
        isValid: false, 
        type: 'fraction', 
        value: 0, 
        error: isMizo ? 'Slash pakhat chauh hmang rawh (e.g., 3/5).' : 'Please use a single slash (e.g., 3/5).' 
      };
    }
    const a = parseFloat(parts[0]);
    const b = parseFloat(parts[1]);

    if (isNaN(a) || isNaN(b)) {
      return { 
        isValid: false, 
        type: 'fraction', 
        value: 0, 
        error: isMizo ? 'Chunglam leh hnuailam hi number an ni tur a ni.' : 'Numerator and denominator must be numbers.' 
      };
    }
    if (b === 0) {
      return { 
        isValid: false, 
        type: 'fraction', 
        value: 0, 
        error: isMizo ? 'Hnuailam (denominator) hi 0 a ni thei lo.' : 'Denominator cannot be zero.' 
      };
    }

    const val = a / b;
    const isCorrect = approxEqual(val, targetRatio, 0.001);
    const errorMsg = isMizo
      ? `A dik lo. ${a}/${b} chu ${val.toFixed(3)} a ni a, mahse rawng hnawih zat chu ${targetRatio.toFixed(3)} a ni.`
      : `Incorrect. ${a}/${b} is equivalent to ${val.toFixed(3)}, but shaded ratio is ${targetRatio.toFixed(3)}.`;

    return {
      isValid: isCorrect,
      type: 'fraction',
      value: val,
      error: isCorrect ? undefined : errorMsg
    };
  }

  // 4. Raw number check (decimal or whole percentage)
  const numericVal = parseFloat(clean);
  if (isNaN(numericVal)) {
    return { 
      isValid: false, 
      type: 'unknown', 
      value: 0, 
      error: isMizo ? 'Fraction, decimal, emaw percentage dik tak chhu lut rawh.' : 'Please enter a valid fraction, decimal, or percentage.' 
    };
  }

  // If the user entered a decimal less than or equal to 1.0 (e.g. 0.35)
  if (numericVal >= 0 && numericVal <= 1) {
    const isCorrect = approxEqual(numericVal, targetRatio, 0.015); // slightly wider tolerance for decimals like 0.33
    const errorMsg = isMizo
      ? `A dik lo. Decimal ${numericVal} hian rawng hnawih zat ${targetRatio.toFixed(3)} a tluk lo.`
      : `Incorrect. Decimal ${numericVal} does not match shaded ratio of ${targetRatio.toFixed(3)}.`;
    return {
      isValid: isCorrect,
      type: 'decimal',
      value: numericVal,
      error: isCorrect ? undefined : errorMsg
    };
  } else {
    // If user enters a number > 1, check if they meant percentage (e.g. they typed "35" instead of "35%")
    const percentEquivalent = numericVal / 100;
    const isCorrectPercent = approxEqual(percentEquivalent, targetRatio, 0.015);

    if (isCorrectPercent) {
      return {
        isValid: true,
        type: 'percentage',
        value: percentEquivalent,
      };
    } else {
      const errorMsg = isMizo
        ? `A dik lo. ${numericVal}% i tihna a nih chuan ${percentEquivalent.toFixed(3)} a ni a, mahse rawng hnawih zat chu ${targetRatio.toFixed(3)} a ni.`
        : `Incorrect. If you meant ${numericVal}%, it is equal to ${percentEquivalent.toFixed(3)}, but shaded is ${targetRatio.toFixed(3)}. If you meant a raw number, it is out of grid bounds.`;
      return {
        isValid: false,
        type: 'decimal',
        value: numericVal,
        error: errorMsg
      };
    }
  }
}

// Generate an educational challenge
export function generateChallenge(difficulty: 'easy' | 'medium' | 'hard', currentGrid?: { rows: number; cols: number }): Challenge {
  const id = Math.random().toString(36).substring(2, 9);
  
  // Decide dimensions
  let r = 5;
  let c = 5;
  if (difficulty === 'easy') {
    // Easy dimensions between 2 and 10
    r = Math.floor(Math.random() * 5) + 3; // 3 to 7
    c = Math.floor(Math.random() * 5) + 3; // 3 to 7
  } else if (difficulty === 'medium') {
    // Medium dimensions between 5 and 15
    r = Math.floor(Math.random() * 8) + 6; // 6 to 13
    c = Math.floor(Math.random() * 8) + 6; // 6 to 13
  } else {
    // Hard dimensions between 10 and 25 (or more, but keep it readable)
    r = Math.floor(Math.random() * 11) + 10; // 10 to 20
    c = Math.floor(Math.random() * 11) + 10; // 10 to 20
  }

  const total = r * c;

  // Decide on a target fraction/ratio
  // We want to pick a target that can be represented on the grid.
  // i.e., we select a target fraction a/b where b is a factor of total,
  // or a random number of squares, and convert to fraction/decimal/percent.
  
  // Find factors of total to make nice fractions
  const factors: number[] = [];
  for (let i = 2; i <= total; i++) {
    if (total % i === 0 && i <= 20) {
      factors.push(i);
    }
  }

  let chosenDenom = total;
  if (factors.length > 0 && Math.random() < 0.7) {
    // Pick a random factor
    chosenDenom = factors[Math.floor(Math.random() * factors.length)];
  }

  // Choose numerator
  let chosenNum = Math.floor(Math.random() * (chosenDenom - 1)) + 1; // 1 to denom-1

  // Simplify numerator/denominator
  const simplified = simplifyFraction(chosenNum, chosenDenom);
  chosenNum = simplified.numerator;
  chosenDenom = simplified.denominator;

  const targetRatio = chosenNum / chosenDenom;
  const types: Array<'fraction' | 'decimal' | 'percentage' | 'ratio'> = ['fraction', 'decimal', 'percentage', 'ratio'];
  const type = types[Math.floor(Math.random() * types.length)];

  let targetString = '';
  let instruction = '';

  switch (type) {
    case 'fraction':
      targetString = `${chosenNum}/${chosenDenom}`;
      instruction = `Shade exactly ${targetString} of the grid.`;
      break;
    case 'decimal':
      targetString = targetRatio.toFixed(2).replace(/\.?0+$/, ''); // clean decimals e.g. 0.5 instead of 0.50
      if (targetString === '0') targetString = targetRatio.toFixed(3);
      instruction = `Shade ${targetString} of the grid (as a decimal).`;
      break;
    case 'percentage':
      const percentVal = Math.round(targetRatio * 1000) / 10;
      targetString = `${percentVal}%`;
      instruction = `Shade ${targetString} of the grid.`;
      break;
    case 'ratio':
      targetString = `${chosenNum}:${chosenDenom}`;
      instruction = `Shade a ratio of ${targetString} (shaded to total).`;
      break;
  }

  return {
    id,
    type,
    targetValue: targetRatio,
    targetString,
    rows: r,
    cols: c,
    instruction,
  };
}
