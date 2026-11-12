export type GameMode =
  | 'q1_mode'         // 1 Quadrant Tab (Positive X, Y, 1 target at a time)
  | 'q4_mode'         // 4 Quadrants Tab (All 4 quadrants, 1 target at a time)
  | 'custom_quest'    // Custom Quest Tab (Set by teacher)
  | 'teacher_editor'  // Teacher Studio (Mission builder)
  | 'level1_q1'       // Legacy aliases
  | 'level2_quadrants'
  | 'level3_wave'
  | 'level4_linear'
  | 'level5_mobile'
  | 'custom_mission'
  | 'sandbox';

export type ThemeMode = 'tactical' | 'projector';

export type CannonType = 'linear' | 'quadratic';

export interface WallBarrier {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  name?: string;
}

export interface Target {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  type: 'drone' | 'cruiser' | 'satellite' | 'collinear';
  name: string;
  quadrant: 1 | 2 | 3 | 4 | 0; // 0 for axes/origin
  spawnTurn?: number;
  advanceStep?: number;
}

export interface LineRootsInfo {
  hasRoots: boolean;
  isInfinite: boolean;
  roots: number[];
  rootStr: string;
  rootFractionStr: string;
  explanation: string;
  xInterceptCoord?: { x: number; y: number };
  yInterceptCoord?: { x: number; y: number };
  yInterceptStr?: string;
}

export interface ShotResult {
  x: number;
  y: number;
  cannonX: number;
  cannonY: number;
  timestamp: number;
  hit: boolean;
  targetsHit: Target[];
  diagnostic: DiagnosticFeedback;
  slopeStr: string;
  equationStr: string;
  pointSlopeStr?: string;
  roots: LineRootsInfo;
  cannonType?: CannonType;
  calculatedAim?: boolean;
  multiplier?: number;
}

export interface DiagnosticFeedback {
  type: 'hit' | 'inverted' | 'quadrant_sign' | 'close_miss' | 'linear_pierce' | 'far_miss' | 'wall_blocked';
  title: string;
  message: string;
  pedagogicalTip: string;
  targetRef?: { x: number; y: number };
  entered: { x: number; y: number };
  wallHitRef?: { x: number; y: number };
  cannonPos?: { x: number; y: number };
  equationStr?: string;
  rootsInfo?: LineRootsInfo;
  calculatedAim?: boolean;
  multiplier?: number;
}

export interface TrajectoryTrace {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  equation: string;
  pointSlopeEquation?: string;
  slopeFraction: string;
  roots?: LineRootsInfo;
  timestamp: number;
  color: string;
  cannonType?: CannonType;
  quadraticA?: number;
  quadraticB?: number;
  quadraticC?: number;
  hitTarget?: { x: number; y: number } | null;
  beyondX?: number;
  beyondY?: number;
}

export interface ExplosionParticle {
  x: number; // canvas px
  y: number; // canvas px
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
}

export interface DetonationMarker {
  gridX: number;
  gridY: number;
  cannonX: number;
  cannonY: number;
  canvasX: number;
  canvasY: number;
  hit: boolean;
  progress: number; // 0 to 1
  equation: string;
  rootsInfo?: LineRootsInfo;
  createdAt: number;
  blockedByWall?: boolean;
}
