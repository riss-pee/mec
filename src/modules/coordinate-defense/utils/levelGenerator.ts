import { GameMode, Target, WallBarrier } from '../types/game';
import { getQuadrant } from './mathUtils';

export interface LevelConfig {
  id: GameMode;
  name: string;
  badge: string;
  description: string;
  pedagogicalFocus: string;
  gridRange: { min: number; max: number };
  initialShields: number;
}

export const PRIMARY_TABS: GameMode[] = ['q1_mode', 'q4_mode', 'custom_quest', 'teacher_editor'];

export const LEVEL_CONFIGS: Record<GameMode, LevelConfig> = {
  q1_mode: {
    id: 'q1_mode',
    name: '1 Quadrant',
    badge: '1 QUADRANT (1 TARGET AT A TIME)',
    description: 'Engage targets one at a time in Quadrant I (X > 0, Y > 0). Neutralizing a target spawns the next coordinate!',
    pedagogicalFocus: 'Establish horizontal run before vertical rise ("Run across before you Rise up").',
    gridRange: { min: 0, max: 8 },
    initialShields: 5,
  },
  q4_mode: {
    id: 'q4_mode',
    name: '4 Quadrants',
    badge: '4 QUADRANTS (1 TARGET AT A TIME)',
    description: 'Engage targets one at a time across all four quadrants (-10 to +10). Hit to spawn the next coordinate challenge!',
    pedagogicalFocus: 'Master coordinate signs in Quadrants I (+,+), II (-,+), III (-,-), and IV (+,-).',
    gridRange: { min: -10, max: 10 },
    initialShields: 5,
  },
  custom_quest: {
    id: 'custom_quest',
    name: 'Custom Quest',
    badge: 'TEACHER QUEST',
    description: 'Play the custom mission set by the teacher with unique coordinates, barriers, and challenge targets!',
    pedagogicalFocus: 'Teacher-configured mission to practice specific coordinate patterns, walls, and parabolic arcs.',
    gridRange: { min: -10, max: 10 },
    initialShields: 5,
  },
  teacher_editor: {
    id: 'teacher_editor',
    name: 'Teacher Studio',
    badge: 'QUEST BUILDER',
    description: 'Configure custom targets, construct wall barriers, and relocate the artillery battery for student quests.',
    pedagogicalFocus: 'Interactive mission designer for educators to customize student coordinate drills.',
    gridRange: { min: -10, max: 10 },
    initialShields: 99,
  },
  // Legacy aliases
  level1_q1: {
    id: 'level1_q1',
    name: '1 Quadrant',
    badge: '1 QUADRANT',
    description: 'Master ordered pairs (X, Y) using positive coordinates (0 to 8).',
    pedagogicalFocus: 'Run across before you rise up.',
    gridRange: { min: 0, max: 8 },
    initialShields: 5,
  },
  level2_quadrants: {
    id: 'level2_quadrants',
    name: '4 Quadrants',
    badge: '4 QUADRANTS',
    description: 'Engage targets across all quadrants (-10 to +10).',
    pedagogicalFocus: 'Demystify negative signs.',
    gridRange: { min: -10, max: 10 },
    initialShields: 5,
  },
  level3_wave: {
    id: 'level3_wave',
    name: 'Wave Defense',
    badge: 'DYNAMIC DEFENSE',
    description: 'Inward advancing swarms.',
    pedagogicalFocus: 'Real-time coordinate shifts.',
    gridRange: { min: -10, max: 10 },
    initialShields: 3,
  },
  level4_linear: {
    id: 'level4_linear',
    name: 'Linear Railgun',
    badge: 'LINEAR',
    description: 'Collinear targets along y = mx.',
    pedagogicalFocus: 'Slope ratio m = y/x.',
    gridRange: { min: -10, max: 10 },
    initialShields: 5,
  },
  level5_mobile: {
    id: 'level5_mobile',
    name: 'Mobile Battery',
    badge: 'MOBILE',
    description: 'Reposition artillery anywhere on the grid.',
    pedagogicalFocus: 'Point-slope form.',
    gridRange: { min: -10, max: 10 },
    initialShields: 5,
  },
  custom_mission: {
    id: 'custom_mission',
    name: 'Custom Quest',
    badge: 'CUSTOM',
    description: 'Teacher custom mission.',
    pedagogicalFocus: 'Teacher designed mission.',
    gridRange: { min: -10, max: 10 },
    initialShields: 5,
  },
  sandbox: {
    id: 'sandbox',
    name: 'Sandbox',
    badge: 'FREE PLAY',
    description: 'Free coordinate exploration.',
    pedagogicalFocus: 'Free exploration.',
    gridRange: { min: -10, max: 10 },
    initialShields: 99,
  },
};

let lastQ1Coord: { x: number; y: number } | null = null;
let q1TargetCount = 1;

/**
 * Generates a single target in Quadrant 1 (x: 1..8, y: 1..8)
 * Guarantees a different coordinate from the previous target.
 */
export function generateSingleTargetQ1(prevCoord?: { x: number; y: number }): Target {
  const coord = prevCoord || lastQ1Coord;
  let nx = Math.floor(Math.random() * 8) + 1;
  let ny = Math.floor(Math.random() * 8) + 1;

  if (coord && nx === coord.x && ny === coord.y) {
    nx = nx >= 8 ? 2 : nx + 1;
    ny = ny >= 8 ? 3 : ny + 1;
  }
  lastQ1Coord = { x: nx, y: ny };

  const targetTypes: Array<'drone' | 'cruiser' | 'satellite'> = ['drone', 'cruiser', 'satellite'];
  const type = targetTypes[Math.floor(Math.random() * targetTypes.length)];
  const targetNum = q1TargetCount++;

  return {
    id: `q1-target-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: `Target #${targetNum} (${nx}, ${ny})`,
    x: nx,
    y: ny,
    hp: 1,
    maxHp: 1,
    type,
    quadrant: 1,
  };
}

let lastQ4Coord: { x: number; y: number } | null = null;
let lastQuadrant: number = 0;
let q4TargetCount = 1;

/**
 * Generates a single target across all 4 Quadrants
 * Cycles or picks a different quadrant from the previous target.
 */
export function generateSingleTargetQ4(prevCoord?: { x: number; y: number }): Target {
  const coord = prevCoord || lastQ4Coord;
  const availableQuadrants = [1, 2, 3, 4].filter((q) => q !== lastQuadrant);
  const quad = (availableQuadrants[Math.floor(Math.random() * availableQuadrants.length)] || 1) as 1 | 2 | 3 | 4;
  lastQuadrant = quad;

  const absX = Math.floor(Math.random() * 8) + 1;
  const absY = Math.floor(Math.random() * 8) + 1;
  let nx = quad === 1 || quad === 4 ? absX : -absX;
  let ny = quad === 1 || quad === 2 ? absY : -absY;

  if (coord && nx === coord.x && ny === coord.y) {
    nx = -nx;
    ny = -ny;
  }
  lastQ4Coord = { x: nx, y: ny };

  const targetTypes: Array<'drone' | 'cruiser' | 'satellite'> = ['drone', 'cruiser', 'satellite'];
  const type = targetTypes[Math.floor(Math.random() * targetTypes.length)];
  const targetNum = q4TargetCount++;

  return {
    id: `q4-target-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: `Target #${targetNum} (${nx}, ${ny})`,
    x: nx,
    y: ny,
    hp: 1,
    maxHp: 1,
    type,
    quadrant: quad,
  };
}

/**
 * Generates initial targets for a given level
 */
export function generateTargetsForLevel(mode: GameMode): Target[] {
  if (mode === 'q1_mode' || mode === 'level1_q1') {
    return [generateSingleTargetQ1()];
  }
  if (mode === 'custom_quest' || mode === 'custom_mission' || mode === 'teacher_editor') {
    return [
      { id: 'cq-1', name: 'Target Alpha', x: 5, y: 3, hp: 1, maxHp: 1, type: 'cruiser', quadrant: 1 },
      { id: 'cq-2', name: 'Target Beta', x: -6, y: 4, hp: 1, maxHp: 1, type: 'drone', quadrant: 2 },
      { id: 'cq-3', name: 'Target Gamma', x: 6, y: -4, hp: 1, maxHp: 1, type: 'drone', quadrant: 4 },
    ];
  }
  return [generateSingleTargetQ4()];
}

function _legacyTargetGen(mode: any): Target[] {
  switch (mode) {
    case 'level1_q1':
      return [
        {
          id: 't-1-1',
          name: 'Scout Alpha',
          x: 3,
          y: 4,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 1,
        },
        {
          id: 't-1-2',
          name: 'Drone Beta',
          x: 5,
          y: 2,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 1,
        },
        {
          id: 't-1-3',
          name: 'Cruiser Delta',
          x: 2,
          y: 7,
          hp: 1,
          maxHp: 1,
          type: 'cruiser',
          quadrant: 1,
        },
        {
          id: 't-1-4',
          name: 'Recon Gamma',
          x: 7,
          y: 5,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 1,
        },
      ];

    case 'level2_quadrants':
      return [
        {
          id: 't-2-1',
          name: 'Drone Q1',
          x: 4,
          y: 5,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 1,
        },
        {
          id: 't-2-2',
          name: 'Specter Q2',
          x: -6,
          y: 3,
          hp: 1,
          maxHp: 1,
          type: 'cruiser',
          quadrant: 2,
        },
        {
          id: 't-2-3',
          name: 'Sub-Zero Q3',
          x: -4,
          y: -7,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 3,
        },
        {
          id: 't-2-4',
          name: 'Viper Q4',
          x: 5,
          y: -4,
          hp: 1,
          maxHp: 1,
          type: 'cruiser',
          quadrant: 4,
        },
        {
          id: 't-2-5',
          name: 'Axis Interceptor',
          x: -8,
          y: 0,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 0,
        },
      ];

    case 'level3_wave':
      return [
        {
          id: 't-3-1',
          name: 'Infiltrator North',
          x: 3,
          y: 8,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 1,
          advanceStep: 1,
        },
        {
          id: 't-3-2',
          name: 'Raider West',
          x: -8,
          y: 4,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 2,
          advanceStep: 1,
        },
        {
          id: 't-3-3',
          name: 'Crawler South',
          x: -5,
          y: -8,
          hp: 1,
          maxHp: 1,
          type: 'cruiser',
          quadrant: 3,
          advanceStep: 1,
        },
        {
          id: 't-3-4',
          name: 'Striker East',
          x: 8,
          y: -5,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 4,
          advanceStep: 1,
        },
      ];

    case 'level4_linear':
      // Collinear targets along lines through origin!
      // Line A: y = 2x -> (1, 2), (2, 4), (3, 6), (4, 8)
      // Line B: y = -x -> (-2, 2), (-4, 4), (-6, 6)
      // Line C: y = -1/2x -> (4, -2), (8, -4)
      return [
        // Collinear Line 1 (y = 2x)
        {
          id: 't-4-1a',
          name: 'Relay Alpha-1',
          x: 1,
          y: 2,
          hp: 1,
          maxHp: 1,
          type: 'collinear',
          quadrant: 1,
        },
        {
          id: 't-4-1b',
          name: 'Relay Alpha-2',
          x: 2,
          y: 4,
          hp: 1,
          maxHp: 1,
          type: 'collinear',
          quadrant: 1,
        },
        {
          id: 't-4-1c',
          name: 'Relay Alpha-3',
          x: 3,
          y: 6,
          hp: 1,
          maxHp: 1,
          type: 'collinear',
          quadrant: 1,
        },
        {
          id: 't-4-1d',
          name: 'Relay Alpha-4',
          x: 4,
          y: 8,
          hp: 1,
          maxHp: 1,
          type: 'collinear',
          quadrant: 1,
        },
        // Collinear Line 2 (y = -x in Q2)
        {
          id: 't-4-2a',
          name: 'Relay Beta-1',
          x: -2,
          y: 2,
          hp: 1,
          maxHp: 1,
          type: 'collinear',
          quadrant: 2,
        },
        {
          id: 't-4-2b',
          name: 'Relay Beta-2',
          x: -4,
          y: 4,
          hp: 1,
          maxHp: 1,
          type: 'collinear',
          quadrant: 2,
        },
        {
          id: 't-4-2c',
          name: 'Relay Beta-3',
          x: -6,
          y: 6,
          hp: 1,
          maxHp: 1,
          type: 'collinear',
          quadrant: 2,
        },
        // Collinear Line 3 (y = -0.5x in Q4)
        {
          id: 't-4-3a',
          name: 'Relay Gamma-1',
          x: 4,
          y: -2,
          hp: 1,
          maxHp: 1,
          type: 'collinear',
          quadrant: 4,
        },
        {
          id: 't-4-3b',
          name: 'Relay Gamma-2',
          x: 8,
          y: -4,
          hp: 1,
          maxHp: 1,
          type: 'collinear',
          quadrant: 4,
        },
      ];

    case 'level5_mobile':
      return [
        {
          id: 't-5-1',
          name: 'Bunker Alpha',
          x: 6,
          y: 4,
          hp: 1,
          maxHp: 1,
          type: 'cruiser',
          quadrant: 1,
        },
        {
          id: 't-5-2',
          name: 'Drone Beta',
          x: -5,
          y: 6,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 2,
        },
        {
          id: 't-5-3',
          name: 'Shadow Viper',
          x: 7,
          y: -5,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 4,
        },
        {
          id: 't-5-4',
          name: 'Citadel Core',
          x: -6,
          y: -4,
          hp: 1,
          maxHp: 1,
          type: 'cruiser',
          quadrant: 3,
        },
      ];

    case 'custom_mission':
      return [
        {
          id: 'cm-1',
          name: 'Fortress Core',
          x: 5,
          y: 3,
          hp: 1,
          maxHp: 1,
          type: 'cruiser',
          quadrant: 1,
        },
        {
          id: 'cm-2',
          name: 'Underground Bunker',
          x: 6,
          y: -4,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 4,
        },
        {
          id: 'cm-3',
          name: 'Watchtower Scout',
          x: -6,
          y: 4,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 2,
        },
      ];

    case 'teacher_editor':
      return [
        {
          id: 'te-1',
          name: 'Target Alpha',
          x: 5,
          y: 3,
          hp: 1,
          maxHp: 1,
          type: 'cruiser',
          quadrant: 1,
        },
        {
          id: 'te-2',
          name: 'Target Beta',
          x: 6,
          y: -4,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 4,
        },
      ];

    case 'sandbox':
      return [
        {
          id: 'sb-1',
          name: 'Target A',
          x: 4,
          y: 3,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 1,
        },
        {
          id: 'sb-2',
          name: 'Target B',
          x: -5,
          y: 5,
          hp: 1,
          maxHp: 1,
          type: 'cruiser',
          quadrant: 2,
        },
        {
          id: 'sb-3',
          name: 'Target C',
          x: 6,
          y: -4,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 4,
        },
      ];

    default:
      return [];
  }
}

/**
 * Returns default wall barriers for levels that feature barriers
 */
export function getDefaultWallsForLevel(mode: GameMode): WallBarrier[] {
  if (mode === 'level5_mobile') {
    return [
      {
        id: 'wall-5-1',
        name: 'Center Deflection Wall',
        x1: 2,
        y1: 1,
        x2: 2,
        y2: 7,
      },
      {
        id: 'wall-5-2',
        name: 'Southern Shield',
        x1: -6,
        y1: -2,
        x2: 0,
        y2: -2,
      },
    ];
  }

  if (mode === 'custom_quest' || mode === 'custom_mission' || mode === 'teacher_editor') {
    return [
      {
        id: 'wall-1',
        name: 'Fortress Shield Wall',
        x1: 3,
        y1: 0,
        x2: 3,
        y2: 5,
      },
      {
        id: 'wall-2',
        name: 'Southern Energy Barrier',
        x1: 2,
        y1: -2,
        x2: 7,
        y2: -2,
      },
    ];
  }

  return [];
}

/**
 * Returns default initial cannon battery position for each level
 */
export function getDefaultCannonPosition(mode: GameMode): { x: number; y: number } {
  if (mode === 'level5_mobile') {
    return { x: -4, y: -2 };
  }
  return { x: 0, y: 0 };
}

/**
 * Advances targets 1 step inward toward origin (0, 0)
 * Used in Level 3 Wave Defense
 */
export function advanceWaveTargets(targets: Target[]): {
  updatedTargets: Target[];
  breached: boolean;
} {
  let breached = false;

  const updatedTargets = targets.map((t) => {
    // Step 1 unit closer along the axis with larger distance, or diagonal
    let nextX = t.x;
    let nextY = t.y;

    if (Math.abs(t.x) >= Math.abs(t.y) && t.x !== 0) {
      nextX = t.x > 0 ? t.x - 1 : t.x + 1;
    } else if (t.y !== 0) {
      nextY = t.y > 0 ? t.y - 1 : t.y + 1;
    }

    // Check breach condition: reaches distance <= 1 from origin
    if (Math.hypot(nextX, nextY) <= 1.4) {
      breached = true;
    }

    return {
      ...t,
      x: nextX,
      y: nextY,
      quadrant: getQuadrant(nextX, nextY),
    };
  });

  return { updatedTargets, breached };
}
