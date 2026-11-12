/**
 * Types and interfaces for the Interactive Abacus Game
 */

export type AbacusType = 'horizontal' | 'vertical' | 'soroban';

export interface PlaceValueConfig {
  exponent: number;
  name: string;
  shortName: string;
  color: string;
  beadColor: string;
}

export type GameMode = 'free_play' | 'challenges' | 'lessons';

export interface Challenge {
  id: string;
  type: 'represent' | 'identify' | 'addition' | 'place_value';
  question: string;
  targetValue: number;
  initialState?: number[]; // Values for each row/column
  hint: string;
  explanation: string;
  points: number;
}

export interface LessonPage {
  id: string;
  title: string;
  content: string;
  abacusSetup?: { [exponent: number]: number }; // Preset beads to show
  instruction: string;
}
