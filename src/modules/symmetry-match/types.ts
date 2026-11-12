export type SymmetryType = 'vertical' | 'horizontal' | 'diagonal-up' | 'diagonal-down';

export interface Coordinate {
  x: number;
  y: number;
}

export interface LineSegment {
  id: string;
  start: Coordinate;
  end: Coordinate;
  color: string;
}

export interface GridBlock {
  x: number;
  y: number;
  color: string;
}

export interface MirrorAxis {
  type: SymmetryType;
  coordinateValue: number; // e.g. x = 4 for vertical, y = 4 for horizontal, or y = x
  label: string; // e.g., "x = 4", "y = 4", "y = x"
}

export interface Option {
  id: 'A' | 'B' | 'C' | 'D';
  blocks?: GridBlock[];
  polygonPoints?: Coordinate[];
  type: 'correct' | 'rotated-180' | 'wrong-axis' | 'skewed';
  explanation: string;
  explanationMizo?: string;
}

export interface Challenge {
  id: string;
  level: number;
  title: string;
  titleMizo?: string;
  description: string;
  descriptionMizo?: string;
  shapeType: 'block' | 'polygon';
  gridSize: number; // e.g., 6, 8, or 10
  blocks?: GridBlock[]; // Original blocks
  polygonPoints?: Coordinate[]; // Original polygon points
  polygonColor?: string;
  mirrorAxis: MirrorAxis;
  options: Option[];
  realWorldImage?: string;
  realWorldTitle?: string;
  realWorldTitleMizo?: string;
  realWorldDescription?: string;
  realWorldDescriptionMizo?: string;
}

export interface LevelInfo {
  levelNum: number;
  name: string;
  nameMizo?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard' | 'Expert';
  difficultyMizo?: string;
  description: string;
  descriptionMizo?: string;
  badgeColor: string;
}

export interface PlayerStats {
  score: number;
  streak: number;
  highestStreak: number;
  completedChallenges: string[]; // List of challenge IDs solved
  sandboxSaves: {
    id: string;
    timestamp: number;
    gridSize: number;
    blocks: GridBlock[];
    lineSegments?: LineSegment[];
    activeTool?: 'line' | 'block';
    axis: SymmetryType;
  }[];
}
