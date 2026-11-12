export type Language = 'en' | 'mizo';

export type GameMode = 'explore' | 'shade' | 'guess';

export interface GridDimensions {
  rows: number;
  cols: number;
}

export interface ParseResult {
  isValid: boolean;
  type: 'fraction' | 'decimal' | 'percentage' | 'ratio' | 'unknown';
  value: number;
  error?: string;
}

export interface Challenge {
  id: string;
  type: 'fraction' | 'decimal' | 'percentage' | 'ratio';
  targetValue: number; // e.g., 0.6
  targetString: string; // e.g., "3/5", "60%", "0.6", "3:5"
  rows: number;
  cols: number;
  instruction: string;
}
