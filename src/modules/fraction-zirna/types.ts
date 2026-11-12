export interface Fraction {
  numerator: number;
  denominator: number;
}

export type GameMode = 'slice' | 'addition' | 'compare' | 'everyday';

export interface Level {
  id: number;
  title: string;
  category: string;
  scenario: string;
  instructions: string;
  mode: GameMode;
  targetFraction?: Fraction;
  initialFraction1?: Fraction;
  initialFraction2?: Fraction;
  comparisonTarget?: {
    fractionA: Fraction;
    fractionB: Fraction;
  };
  everydayType: 'pizza' | 'baking' | 'candy' | 'cookie' | 'garden';
  questionText: string;
  options?: string[];
  correctOptionIndex?: number;
  // For standard checks:
  correctNumerator?: number;
  correctDenominator?: number;
  targetDecimal?: number; // fallback check
}

export interface UserStats {
  score: number;
  streak: number;
  completedLevels: number[];
}
