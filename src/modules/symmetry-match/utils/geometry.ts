import { Coordinate, GridBlock, MirrorAxis, SymmetryType, LineSegment } from '../types';

// Reflects a coordinate on an N x N coordinate grid
export function reflectPoint(
  pt: Coordinate,
  axis: SymmetryType,
  axisValue: number,
  gridSize: number
): Coordinate {
  const { x, y } = pt;
  switch (axis) {
    case 'vertical':
      // x' = 2 * axisValue - x
      return { x: 2 * axisValue - x, y };
    case 'horizontal':
      // y' = 2 * axisValue - y
      return { x, y: 2 * axisValue - y };
    case 'diagonal-up':
      // Reflection across y = x (or shifted)
      // Standard y = x swap: (y, x)
      // If shifted: we can treat it as swapping coordinates relative to the grid center or diagonal.
      // In our standard grids, diagonal-up goes from (0, gridSize) to (gridSize, 0) in SVG space (where 0,0 is top-left),
      // or from (0,0) to (gridSize, gridSize) in standard Cartesian coordinates.
      // Let's assume standard Cartesian representation where:
      // x_new = y, y_new = x
      return { x: y, y: x };
    case 'diagonal-down':
      // Reflection across y = gridSize - x
      // x_new = gridSize - y, y_new = gridSize - x
      return { x: gridSize - y, y: gridSize - x };
    default:
      return { x, y };
  }
}

// Reflects a grid block (for cell-based grid of dimensions gridSize x gridSize)
export function reflectBlock(
  block: GridBlock,
  axis: SymmetryType,
  axisValue: number,
  gridSize: number
): GridBlock {
  const { x, y, color } = block;
  switch (axis) {
    case 'vertical':
      // For cells, if axis is exactly in the middle of cells (e.g. index 3.5 on 8x8 grid)
      // Otherwise, index mirror: x' = (2 * axisValue) - x
      // Let's round to maintain whole cell indices
      const rx = Math.round(2 * axisValue - x);
      return { x: rx, y, color };
    case 'horizontal':
      const ry = Math.round(2 * axisValue - y);
      return { x, y: ry, color };
    case 'diagonal-up':
      // Swapping x and y
      return { x: y, y: x, color };
    case 'diagonal-down':
      // Swapping and mirroring relative to gridSize - 1
      return { x: gridSize - 1 - y, y: gridSize - 1 - x, color };
    default:
      return { x, y, color };
  }
}

// Rotate a block 180 degrees around the grid center
export function rotateBlock180(block: GridBlock, gridSize: number): GridBlock {
  const cx = (gridSize - 1) / 2;
  const cy = (gridSize - 1) / 2;
  // (x', y') = (2*cx - x, 2*cy - y) => (gridSize - 1 - x, gridSize - 1 - y)
  return {
    x: gridSize - 1 - block.x,
    y: gridSize - 1 - block.y,
    color: block.color,
  };
}

export function rotatePoint180(pt: Coordinate, gridSize: number): Coordinate {
  return {
    x: gridSize - pt.x,
    y: gridSize - pt.y,
  };
}

// Reflect wrong axis (e.g., if axis is vertical, do horizontal reflection, and vice versa)
export function reflectBlockWrongAxis(
  block: GridBlock,
  axis: SymmetryType,
  axisValue: number,
  gridSize: number
): GridBlock {
  const wrongAxis: SymmetryType =
    axis === 'vertical'
      ? 'horizontal'
      : axis === 'horizontal'
      ? 'vertical'
      : axis === 'diagonal-up'
      ? 'diagonal-down'
      : 'diagonal-up';

  const wrongValue = (gridSize - 1) / 2;
  return reflectBlock(block, wrongAxis, wrongValue, gridSize);
}

export function reflectPointWrongAxis(
  pt: Coordinate,
  axis: SymmetryType,
  gridSize: number
): Coordinate {
  const wrongAxis: SymmetryType =
    axis === 'vertical'
      ? 'horizontal'
      : axis === 'horizontal'
      ? 'vertical'
      : axis === 'diagonal-up'
      ? 'diagonal-down'
      : 'diagonal-up';

  const wrongValue = gridSize / 2;
  return reflectPoint(pt, wrongAxis, wrongValue, gridSize);
}

// Skew / perturb slightly (shift one cell, or change color of one cell, or offset a point)
export function skewBlocks(blocks: GridBlock[], gridSize: number): GridBlock[] {
  if (blocks.length === 0) return [];
  // Clone
  const result = blocks.map((b) => ({ ...b }));
  // Move one block slightly or swap color
  const indexToModify = Math.floor(Math.random() * result.length);
  const block = result[indexToModify];
  if (Math.random() > 0.5) {
    // Shift coordinate
    if (block.x < gridSize - 1) block.x += 1;
    else block.x -= 1;
  } else {
    // Modify color
    block.color = '#ef4444'; // Red-ish error color
  }
  return result;
}

export function skewPoints(points: Coordinate[], gridSize: number): Coordinate[] {
  if (points.length === 0) return [];
  const result = points.map((p) => ({ ...p }));
  // Shift one vertex by 1 unit
  const indexToModify = Math.floor(Math.random() * result.length);
  const pt = result[indexToModify];
  if (pt.x < gridSize) pt.x += 1;
  else pt.x -= 1;
  return result;
}

// Helper to determine if two sets of blocks match exactly
export function areBlocksSymmetric(
  blocksA: GridBlock[],
  blocksB: GridBlock[],
  axis: SymmetryType,
  axisValue: number,
  gridSize: number
): boolean {
  // Reflect all blocks from A
  const reflectedA = blocksA.map((b) => reflectBlock(b, axis, axisValue, gridSize));

  // Compare the reflected A blocks with blocks B
  // They should have same cells with same colors
  if (reflectedA.length !== blocksB.length) return false;

  // Create lookup string for blocksB
  const setB = new Set(blocksB.map((b) => `${b.x},${b.y},${b.color}`));

  for (const ra of reflectedA) {
    const key = `${ra.x},${ra.y},${ra.color}`;
    if (!setB.has(key)) {
      return false;
    }
  }

  return true;
}

// Helper to determine if two sets of line segments match exactly when reflected
export function areSegmentsSymmetric(
  segsA: LineSegment[],
  segsB: LineSegment[],
  axis: SymmetryType,
  axisValue: number,
  gridSize: number
): boolean {
  if (segsA.length !== segsB.length) return false;

  const reflectedA = segsA.map((s) => {
    const rStart = reflectPoint(s.start, axis, axisValue, gridSize);
    const rEnd = reflectPoint(s.end, axis, axisValue, gridSize);
    return {
      start: rStart,
      end: rEnd,
      color: s.color,
    };
  });

  // For each reflected segment in reflectedA, find a matching segment in segsB
  const matchedBIndices = new Set<number>();

  for (const rSeg of reflectedA) {
    let found = false;
    for (let i = 0; i < segsB.length; i++) {
      if (matchedBIndices.has(i)) continue;
      const bSeg = segsB[i];

      const matchNormal =
        rSeg.start.x === bSeg.start.x &&
        rSeg.start.y === bSeg.start.y &&
        rSeg.end.x === bSeg.end.x &&
        rSeg.end.y === bSeg.end.y;
      const matchInverted =
        rSeg.start.x === bSeg.end.x &&
        rSeg.start.y === bSeg.end.y &&
        rSeg.end.x === bSeg.start.x &&
        rSeg.end.y === bSeg.start.y;

      if ((matchNormal || matchInverted) && rSeg.color === bSeg.color) {
        matchedBIndices.add(i);
        found = true;
        break;
      }
    }
    if (!found) return false;
  }

  return true;
}
