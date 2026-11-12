import { DiagnosticFeedback, Target, CannonType, WallBarrier, LineRootsInfo } from '../types/game';

/**
 * Returns greatest common divisor using Euclidean algorithm
 */
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

/**
 * Formats a fraction N/D into reduced form "N/D" or integer "N"
 */
export function formatFraction(num: number, den: number): {
  num: number;
  den: number;
  fractionStr: string;
  decimalStr: string;
} {
  if (den === 0) {
    return {
      num: num > 0 ? 1 : num < 0 ? -1 : 0,
      den: 0,
      fractionStr: 'undefined',
      decimalStr: 'undefined',
    };
  }
  if (num === 0) {
    return { num: 0, den: 1, fractionStr: '0', decimalStr: '0' };
  }

  let n = Math.round(num);
  let d = Math.round(den);

  if (d < 0) {
    n = -n;
    d = -d;
  }

  const divisor = gcd(n, d);
  n = n / divisor;
  d = d / divisor;

  const fractionStr = d === 1 ? `${n}` : `${n}/${d}`;
  const decimalVal = (n / d).toFixed(2).replace(/\.00$/, '');

  return { num: n, den: d, fractionStr, decimalStr: decimalVal };
}

/**
 * Formats slope as a reduced fraction or integer: "rise / run"
 * Accepts either delta coordinates (dx, dy) or (aimX, aimY)
 */
export function formatSlopeFraction(dx: number, dy: number): {
  numerator: number;
  denominator: number;
  fractionStr: string;
  decimalStr: string;
  isVertical: boolean;
  isHorizontal: boolean;
} {
  if (dx === 0 && dy === 0) {
    return {
      numerator: 0,
      denominator: 1,
      fractionStr: '0',
      decimalStr: '0',
      isVertical: false,
      isHorizontal: true,
    };
  }

  if (dx === 0) {
    return {
      numerator: dy > 0 ? 1 : -1,
      denominator: 0,
      fractionStr: 'undefined (vertical)',
      decimalStr: 'undefined',
      isVertical: true,
      isHorizontal: false,
    };
  }

  if (dy === 0) {
    return {
      numerator: 0,
      denominator: 1,
      fractionStr: '0 (horizontal)',
      decimalStr: '0',
      isVertical: false,
      isHorizontal: true,
    };
  }

  const frac = formatFraction(dy, dx);

  return {
    numerator: frac.num,
    denominator: frac.den,
    fractionStr: frac.fractionStr,
    decimalStr: frac.decimalStr,
    isVertical: false,
    isHorizontal: false,
  };
}

/**
 * Builds the line equation string through arbitrary cannon origin (x0, y0) to (x1, y1)
 */
export function getLineEquation(
  x1: number,
  y1: number,
  x0 = 0,
  y0 = 0
): string {
  const dx = x1 - x0;
  const dy = y1 - y0;

  if (dx === 0 && dy === 0) {
    return `Point (${x0}, ${y0})`;
  }

  if (dx === 0) {
    return `x = ${x0}`;
  }

  if (dy === 0) {
    return `y = ${y0}`;
  }

  const slope = formatSlopeFraction(dx, dy);

  // Compute y-intercept b = y0 - m * x0
  // b = (y0 * den - num * x0) / den
  const bNum = y0 * slope.denominator - slope.numerator * x0;
  const bDen = slope.denominator;
  const bFrac = formatFraction(bNum, bDen);

  // Format slope part
  let slopePart = '';
  if (slope.numerator === 1 && slope.denominator === 1) {
    slopePart = 'x';
  } else if (slope.numerator === -1 && slope.denominator === 1) {
    slopePart = '-x';
  } else if (slope.denominator === 1) {
    slopePart = `${slope.numerator}x`;
  } else {
    slopePart = `(${slope.fractionStr})x`;
  }

  // Format intercept part
  if (bFrac.num === 0) {
    return `y = ${slopePart}`;
  }

  const sign = bFrac.num > 0 ? '+' : '-';
  const bAbsStr = bFrac.den === 1 ? `${Math.abs(bFrac.num)}` : `${Math.abs(bFrac.num)}/${bFrac.den}`;

  return `y = ${slopePart} ${sign} ${bAbsStr}`;
}

/**
 * Returns point-slope form: y - y0 = m(x - x0)
 */
export function getPointSlopeEquation(
  x1: number,
  y1: number,
  x0 = 0,
  y0 = 0
): string {
  const dx = x1 - x0;
  const dy = y1 - y0;

  if (dx === 0) return `x = ${x0}`;
  if (dy === 0) return `y = ${y0}`;

  const slope = formatSlopeFraction(dx, dy);
  const mStr = slope.fractionStr;

  const yPart = y0 === 0 ? 'y' : y0 > 0 ? `(y - ${y0})` : `(y + ${Math.abs(y0)})`;
  const xPart = x0 === 0 ? 'x' : x0 > 0 ? `(x - ${x0})` : `(x + ${Math.abs(x0)})`;

  return `${yPart} = ${mStr}${xPart === 'x' ? 'x' : ` · ${xPart}`}`;
}

/**
 * Computes roots / zeroes / solutions (where y = 0) and intercepts for the line
 */
export function getLineRoots(
  x1: number,
  y1: number,
  x0 = 0,
  y0 = 0
): LineRootsInfo {
  const dx = x1 - x0;
  const dy = y1 - y0;

  // Single point case
  if (dx === 0 && dy === 0) {
    if (y0 === 0) {
      return {
        hasRoots: true,
        isInfinite: false,
        roots: [x0],
        rootStr: `x = ${x0}`,
        rootFractionStr: `${x0}`,
        explanation: `Point is at origin (${x0}, 0) where y = 0.`,
        xInterceptCoord: { x: x0, y: 0 },
        yInterceptCoord: { x: 0, y: y0 },
        yInterceptStr: `(0, ${y0})`,
      };
    }
    return {
      hasRoots: false,
      isInfinite: false,
      roots: [],
      rootStr: 'No zero (single off-axis point)',
      rootFractionStr: 'None',
      explanation: `Stationary point at (${x0}, ${y0}) never touches y = 0.`,
      yInterceptStr: 'None',
    };
  }

  // Vertical Line x = x0
  if (dx === 0) {
    return {
      hasRoots: true,
      isInfinite: false,
      roots: [x0],
      rootStr: `x = ${x0}`,
      rootFractionStr: `${x0}`,
      explanation: `Vertical line x = ${x0} intersects the X-axis (y = 0) at (${x0}, 0). Root: x = ${x0}.`,
      xInterceptCoord: { x: x0, y: 0 },
      yInterceptCoord: x0 === 0 ? { x: 0, y: 0 } : undefined,
      yInterceptStr: x0 === 0 ? 'All points on Y-axis (x = 0)' : 'No Y-intercept (parallel to Y-axis)',
    };
  }

  // Horizontal Line y = y0
  if (dy === 0) {
    if (y0 === 0) {
      return {
        hasRoots: true,
        isInfinite: true,
        roots: [0],
        rootStr: 'x ∈ ℝ (All real numbers)',
        rootFractionStr: 'Infinite',
        explanation: 'Line lies exactly on the X-axis (y = 0). Every coordinate x is a root/solution.',
        xInterceptCoord: { x: 0, y: 0 },
        yInterceptCoord: { x: 0, y: 0 },
        yInterceptStr: '(0, 0)',
      };
    }
    return {
      hasRoots: false,
      isInfinite: false,
      roots: [],
      rootStr: 'No real zeroes (Parallel to X-axis)',
      rootFractionStr: 'None',
      explanation: `Horizontal line y = ${y0} is parallel to the X-axis and never touches y = 0.`,
      yInterceptCoord: { x: 0, y: y0 },
      yInterceptStr: `(0, ${y0})`,
    };
  }

  // Oblique Line: Find x where y = 0
  // y - y0 = m(x - x0) => 0 - y0 = m(x - x0) => x = x0 - y0/m
  // Since m = dy/dx, x_root = x0 - y0 * (dx / dy) = (x0*dy - y0*dx) / dy
  // x_root = (x0*(y1 - y0) - y0*(x1 - x0)) / (y1 - y0) = (x0*y1 - y0*x1) / (y1 - y0)
  const rootNum = x0 * y1 - y0 * x1;
  const rootDen = y1 - y0;
  const rootFrac = formatFraction(rootNum, rootDen);
  const rootVal = rootNum / rootDen;

  // Y-intercept: x = 0 => y = y0 - m*x0 = (y0*dx - x0*dy) / dx = (y0*x1 - x0*y1) / (x1 - x0)
  const yIntNum = y0 * x1 - x0 * y1;
  const yIntDen = x1 - x0;
  const yIntFrac = formatFraction(yIntNum, yIntDen);
  const yIntVal = yIntNum / yIntDen;

  const rootDisplay =
    rootFrac.den === 1
      ? `x = ${rootFrac.num}`
      : `x = ${rootFrac.fractionStr} (≈ ${rootFrac.decimalStr})`;

  const yIntDisplay = `(0, ${yIntFrac.fractionStr})`;

  return {
    hasRoots: true,
    isInfinite: false,
    roots: [rootVal],
    rootStr: rootDisplay,
    rootFractionStr: rootFrac.fractionStr,
    explanation: `Setting y = 0 gives 0 = m(x - x₀) + y₀, yielding the X-intercept root at (${rootFrac.fractionStr}, 0).`,
    xInterceptCoord: { x: rootVal, y: 0 },
    yInterceptCoord: { x: 0, y: yIntVal },
    yInterceptStr: yIntDisplay,
  };
}

/**
 * Computes quadratic coefficients a, b, c for y = ax² + bx + c passing through (x0, y0) and (x1, y1)
 * with an upward parabolic arc height boost.
 */
export function getQuadraticCoefficients(
  targetX: number,
  targetY: number,
  cannonX = 0,
  cannonY = 0,
  apexBoost = 3.5
): {
  a: number;
  b: number;
  c: number;
  apexX: number;
  apexY: number;
  equationStr: string;
  roots: LineRootsInfo;
} {
  const dx = targetX - cannonX;
  const dy = targetY - cannonY;

  if (Math.abs(dx) < 1e-4) {
    // Vertical mortar fallback
    const topY = Math.max(cannonY, targetY) + apexBoost;
    return {
      a: 0,
      b: 1,
      c: -targetX,
      apexX: targetX,
      apexY: topY,
      equationStr: `x = ${targetX}, y ≤ ${topY.toFixed(1)}`,
      roots: {
        hasRoots: true,
        isInfinite: false,
        roots: [targetX],
        rootStr: `x = ${targetX}`,
        rootFractionStr: `${targetX}`,
        explanation: `Vertical arc crosses x = ${targetX} at y = 0.`,
      },
    };
  }

  // Parabolic formula: y(x) = y0 + (dy/dx)(x - x0) + a*(x - x0)(x - x1)
  // At midpoint x = (x0 + x1)/2: (x - x0)*(x - x1) = (dx/2)*(-dx/2) = -dx²/4
  // We want upward boost H = apexBoost: a * (-dx²/4) = apexBoost => a = -4*apexBoost / dx²
  const a = (-4 * apexBoost) / (dx * dx);

  // Expanding:
  // a*(x - x0)(x - x1) = a*(x² - (x0 + x1)x + x0*x1)
  // Linear chord: y0 + (dy/dx)*x - (dy/dx)*x0
  const m = dy / dx;
  const b = m - a * (cannonX + targetX);
  const c = cannonY - m * cannonX + a * cannonX * targetX;

  const apexX = (cannonX + targetX) / 2;
  const chordMidY = (cannonY + targetY) / 2;
  const apexY = chordMidY + apexBoost;

  const equationStr = formatGeneralQuadraticEquation(a, b, c);

  // Calculate roots of ax² + bx + c = 0
  const discriminant = b * b - 4 * a * c;
  let rootsInfo: LineRootsInfo;

  if (discriminant > 1e-5) {
    const sqrtD = Math.sqrt(discriminant);
    const r1 = (-b - sqrtD) / (2 * a);
    const r2 = (-b + sqrtD) / (2 * a);
    const sorted = [Math.min(r1, r2), Math.max(r1, r2)];
    rootsInfo = {
      hasRoots: true,
      isInfinite: false,
      roots: sorted,
      rootStr: `x₁ ≈ ${sorted[0].toFixed(2)}, x₂ ≈ ${sorted[1].toFixed(2)}`,
      rootFractionStr: `${sorted[0].toFixed(2)}, ${sorted[1].toFixed(2)}`,
      explanation: `Parabolic trajectory intersects ground (y = 0) at x = ${sorted[0].toFixed(2)} and x = ${sorted[1].toFixed(2)}.`,
    };
  } else if (Math.abs(discriminant) <= 1e-5) {
    const r = -b / (2 * a);
    rootsInfo = {
      hasRoots: true,
      isInfinite: false,
      roots: [r],
      rootStr: `x = ${r.toFixed(2)} (Double root)`,
      rootFractionStr: `${r.toFixed(2)}`,
      explanation: `Parabolic trajectory tangentially touches ground at x = ${r.toFixed(2)}.`,
    };
  } else {
    rootsInfo = {
      hasRoots: false,
      isInfinite: false,
      roots: [],
      rootStr: 'No real zeroes (Arc does not cross y = 0)',
      rootFractionStr: 'None',
      explanation: 'The quadratic curve remains entirely above or below the horizontal ground line y = 0.',
    };
  }

  return { a, b, c, apexX, apexY, equationStr, roots: rootsInfo };
}

/**
 * Formats a quadratic equation string: y = ax² + bx + c
 */
export function formatGeneralQuadraticEquation(a: number, b: number, c: number): string {
  const aStr = a.toFixed(2).replace(/\.00$/, '');
  const bSign = b >= 0 ? '+' : '-';
  const bStr = Math.abs(b).toFixed(2).replace(/\.00$/, '');
  const cSign = c >= 0 ? '+' : '-';
  const cStr = Math.abs(c).toFixed(2).replace(/\.00$/, '');

  if (Math.abs(c) < 0.01) {
    return `y = ${aStr}x² ${bSign} ${bStr}x`;
  }
  return `y = ${aStr}x² ${bSign} ${bStr}x ${cSign} ${cStr}`;
}

/**
 * Gets y value for a given x on quadratic arc y = ax² + bx + c
 */
export function getQuadraticY(x: number, a: number, b: number, c = 0): number {
  return a * x * x + b * x + c;
}

/**
 * Helper to check if two line segments (p1 -> p2) and (p3 -> p4) intersect
 */
export function checkSegmentIntersection(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  x4: number,
  y4: number
): { intersects: boolean; x: number; y: number } {
  const denom = (y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1);
  if (Math.abs(denom) < 1e-9) {
    return { intersects: false, x: 0, y: 0 };
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

  // Intersects strictly along both segments (excluding origin start)
  if (ua > 0.05 && ua < 0.999 && ub >= 0 && ub <= 1) {
    return {
      intersects: true,
      x: x1 + ua * (x2 - x1),
      y: y1 + ua * (y2 - y1),
    };
  }

  return { intersects: false, x: 0, y: 0 };
}

/**
 * Checks if a straight-line shot from (x0, y0) to (endX, endY) hits any wall barrier
 */
export function checkLinearWallCollision(
  endX: number,
  endY: number,
  walls: WallBarrier[],
  startX = 0,
  startY = 0
): { blocked: boolean; wall?: WallBarrier; hitPoint?: { x: number; y: number } } {
  if (!walls || walls.length === 0) return { blocked: false };

  let closestDist = Infinity;
  let closestWall: WallBarrier | undefined = undefined;
  let closestHit: { x: number; y: number } | undefined = undefined;

  for (const wall of walls) {
    const res = checkSegmentIntersection(startX, startY, endX, endY, wall.x1, wall.y1, wall.x2, wall.y2);
    if (res.intersects) {
      const dist = Math.hypot(res.x - startX, res.y - startY);
      if (dist < closestDist) {
        closestDist = dist;
        closestWall = wall;
        closestHit = { x: res.x, y: res.y };
      }
    }
  }

  if (closestWall && closestHit) {
    return { blocked: true, wall: closestWall, hitPoint: closestHit };
  }

  return { blocked: false };
}

/**
 * Checks if a quadratic parabolic arc from (startX, startY) to (targetX, targetY) hits any wall barrier.
 */
export function checkQuadraticWallCollision(
  targetX: number,
  targetY: number,
  a: number,
  b: number,
  c: number,
  walls: WallBarrier[],
  startX = 0
): { blocked: boolean; wall?: WallBarrier; hitPoint?: { x: number; y: number } } {
  if (!walls || walls.length === 0) return { blocked: false };

  const steps = 32;
  for (let i = 0; i < steps; i++) {
    const t0 = i / steps;
    const t1 = (i + 1) / steps;
    const px0 = startX + (targetX - startX) * t0;
    const py0 = getQuadraticY(px0, a, b, c);
    const px1 = startX + (targetX - startX) * t1;
    const py1 = getQuadraticY(px1, a, b, c);

    for (const wall of walls) {
      const res = checkSegmentIntersection(px0, py0, px1, py1, wall.x1, wall.y1, wall.x2, wall.y2);
      if (res.intersects) {
        return { blocked: true, wall, hitPoint: { x: res.x, y: res.y } };
      }
    }
  }

  return { blocked: false };
}

/**
 * Identifies the quadrant of an ordered pair
 */
export function getQuadrant(x: number, y: number): 1 | 2 | 3 | 4 | 0 {
  if (x === 0 || y === 0) return 0; // On axis or origin
  if (x > 0 && y > 0) return 1;
  if (x < 0 && y > 0) return 2;
  if (x < 0 && y < 0) return 3;
  return 4; // x > 0 && y < 0
}

export function getQuadrantDescription(q: 1 | 2 | 3 | 4 | 0): string {
  switch (q) {
    case 1:
      return 'Quadrant I (+X, +Y) [Top-Right]';
    case 2:
      return 'Quadrant II (-X, +Y) [Top-Left]';
    case 3:
      return 'Quadrant III (-X, -Y) [Bottom-Left]';
    case 4:
      return 'Quadrant IV (+X, -Y) [Bottom-Right]';
    case 0:
      return 'Coordinate Axis';
  }
}

/**
 * Checks if a target is collinear with a ray from (cannonX, cannonY) through (aimX, aimY)
 */
export function isCollinearRay(
  aimX: number,
  aimY: number,
  targetX: number,
  targetY: number,
  cannonX = 0,
  cannonY = 0
): boolean {
  const dirX = aimX - cannonX;
  const dirY = aimY - cannonY;
  const tgtX = targetX - cannonX;
  const tgtY = targetY - cannonY;

  if (dirX === 0 && dirY === 0) return false;
  if (tgtX === 0 && tgtY === 0) return false;

  // Cross product must be 0 for collinearity: dirX * tgtY - dirY * tgtX == 0
  const cross = dirX * tgtY - dirY * tgtX;
  if (Math.abs(cross) > 0.001) return false;

  // Also check that it's in the same ray direction (dot product > 0)
  const dot = dirX * tgtX + dirY * tgtY;
  return dot > 0;
}

/**
 * Diagnostic logic for shots, analyzing miss causes and offering pedagogical tips.
 * Includes variable cannon position, wall collisions, line equations, and roots calculation.
 */
export function diagnoseShot(
  enteredX: number,
  enteredY: number,
  targets: Target[],
  cannonType: CannonType = 'linear',
  walls: WallBarrier[] = [],
  cannonX = 0,
  cannonY = 0
): DiagnosticFeedback {
  const isCustomOrigin = cannonX !== 0 || cannonY !== 0;
  const lineEq = getLineEquation(enteredX, enteredY, cannonX, cannonY);
  const rootsInfo =
    cannonType === 'quadratic'
      ? getQuadraticCoefficients(enteredX, enteredY, cannonX, cannonY).roots
      : getLineRoots(enteredX, enteredY, cannonX, cannonY);

  const quadCoeffs = getQuadraticCoefficients(enteredX, enteredY, cannonX, cannonY);
  const slopeInfo = formatSlopeFraction(enteredX - cannonX, enteredY - cannonY);

  // Check Wall Barrier Collision first
  if (walls && walls.length > 0) {
    if (cannonType === 'linear') {
      const linearHit = checkLinearWallCollision(enteredX, enteredY, walls, cannonX, cannonY);
      if (linearHit.blocked && linearHit.hitPoint) {
        return {
          type: 'wall_blocked',
          title: 'Deflected! Linear Shot Blocked by Wall Barrier',
          message: `Your linear shell was stopped by a wall barrier at (${linearHit.hitPoint.x.toFixed(1)}, ${linearHit.hitPoint.y.toFixed(1)}).`,
          pedagogicalTip: isCustomOrigin
            ? `Your trajectory ${lineEq} was obstructed. Try repositioning your cannon battery or switch to Quadratic Cannon to lob over the wall!`
            : 'Linear cannons travel along straight lines and cannot bypass solid barriers. Switch to Quadratic Cannon or reposition battery!',
          entered: { x: enteredX, y: enteredY },
          wallHitRef: linearHit.hitPoint,
          cannonPos: { x: cannonX, y: cannonY },
          equationStr: lineEq,
          rootsInfo,
        };
      }
    } else {
      const quadHit = checkQuadraticWallCollision(
        enteredX,
        enteredY,
        quadCoeffs.a,
        quadCoeffs.b,
        quadCoeffs.c,
        walls,
        cannonX
      );
      if (quadHit.blocked && quadHit.hitPoint) {
        return {
          type: 'wall_blocked',
          title: 'Parabolic Arc Clipped Wall Barrier',
          message: `The quadratic arc clipped the wall at (${quadHit.hitPoint.x.toFixed(1)}, ${quadHit.hitPoint.y.toFixed(1)}).`,
          pedagogicalTip:
            'The barrier is taller than the arc. Try adjusting aim, aiming farther, or moving the cannon for better clearance.',
          entered: { x: enteredX, y: enteredY },
          wallHitRef: quadHit.hitPoint,
          cannonPos: { x: cannonX, y: cannonY },
          equationStr: quadCoeffs.equationStr,
          rootsInfo,
        };
      }
    }
  }

  // Direct Hit check
  const hitTarget = targets.find((t) => t.x === enteredX && t.y === enteredY);
  if (hitTarget) {
    const isOverWall = cannonType === 'quadratic' && walls.length > 0;
    const originNote = isCustomOrigin ? ` from Battery (${cannonX}, ${cannonY})` : '';

    return {
      type: 'hit',
      title: isOverWall ? 'Direct Hit! Cleared Wall with Parabolic Arc' : 'Direct Hit! Target Neutralized',
      message: isOverWall
        ? `Parabolic mortar arc arched safely over the barrier and detonated on target at (${enteredX}, ${enteredY})${originNote}!`
        : `Target at (${enteredX}, ${enteredY}) destroyed${originNote}! Trajectory equation: ${cannonType === 'quadratic' ? quadCoeffs.equationStr : lineEq}.`,
      pedagogicalTip:
        cannonType === 'quadratic'
          ? `Quadratic trajectory: ${quadCoeffs.equationStr}. Roots / Zeroes: ${rootsInfo.rootStr}.`
          : `Line: ${lineEq}. Slope m = ${slopeInfo.fractionStr} (Rise: ${enteredY - cannonY}, Run: ${enteredX - cannonX}). Zero: ${rootsInfo.rootStr}.`,
      targetRef: { x: hitTarget.x, y: hitTarget.y },
      entered: { x: enteredX, y: enteredY },
      cannonPos: { x: cannonX, y: cannonY },
      equationStr: cannonType === 'quadratic' ? quadCoeffs.equationStr : lineEq,
      rootsInfo,
    };
  }

  // Check 1: Inverted coordinates (swapped x and y)
  const invertedTarget = targets.find(
    (t) => t.x === enteredY && t.y === enteredX && t.x !== t.y
  );

  if (invertedTarget) {
    return {
      type: 'inverted',
      title: 'Inverted Coordinate Alert! Swapped X and Y',
      message: `You entered (${enteredX}, ${enteredY}), but the target is at (${invertedTarget.x}, ${invertedTarget.y}).`,
      pedagogicalTip:
        'Remember: Ordered pairs are (X, Y). Horizontal Run comes FIRST (left/right along X), then Vertical Rise comes SECOND (up/down along Y).',
      targetRef: { x: invertedTarget.x, y: invertedTarget.y },
      entered: { x: enteredX, y: enteredY },
      cannonPos: { x: cannonX, y: cannonY },
      equationStr: cannonType === 'quadratic' ? quadCoeffs.equationStr : lineEq,
      rootsInfo,
    };
  }

  // Check 2: Sign error for existing targets with matching absolute coordinates
  const signTarget = targets.find(
    (t) => Math.abs(t.x) === Math.abs(enteredX) && Math.abs(t.y) === Math.abs(enteredY)
  );

  if (signTarget) {
    const targetQuad = getQuadrant(signTarget.x, signTarget.y);
    const enteredQuad = getQuadrant(enteredX, enteredY);

    if (signTarget.x !== enteredX && signTarget.y === enteredY) {
      return {
        type: 'quadrant_sign',
        title: 'Sign Error: Horizontal X Direction Inverted',
        message: `The target is at (${signTarget.x}, ${signTarget.y}), but you entered (${enteredX}, ${enteredY}).`,
        pedagogicalTip:
          signTarget.x > 0
            ? 'Moving RIGHT requires a POSITIVE +X value.'
            : 'Moving LEFT requires a NEGATIVE -X value.',
        targetRef: { x: signTarget.x, y: signTarget.y },
        entered: { x: enteredX, y: enteredY },
        cannonPos: { x: cannonX, y: cannonY },
        equationStr: cannonType === 'quadratic' ? quadCoeffs.equationStr : lineEq,
        rootsInfo,
      };
    }

    if (signTarget.x === enteredX && signTarget.y !== enteredY) {
      return {
        type: 'quadrant_sign',
        title: 'Sign Error: Vertical Y Direction Inverted',
        message: `The target is at (${signTarget.x}, ${signTarget.y}), but you entered (${enteredX}, ${enteredY}).`,
        pedagogicalTip:
          signTarget.y > 0
            ? 'Moving UP requires a POSITIVE +Y value.'
            : 'Moving DOWN requires a NEGATIVE -Y value.',
        targetRef: { x: signTarget.x, y: signTarget.y },
        entered: { x: enteredX, y: enteredY },
        cannonPos: { x: cannonX, y: cannonY },
        equationStr: cannonType === 'quadratic' ? quadCoeffs.equationStr : lineEq,
        rootsInfo,
      };
    }

    if (signTarget.x !== enteredX && signTarget.y !== enteredY) {
      return {
        type: 'quadrant_sign',
        title: 'Quadrant Inversion: Both Signs Reversed',
        message: `The target is in ${getQuadrantDescription(targetQuad)}, but you fired into ${getQuadrantDescription(enteredQuad)}.`,
        pedagogicalTip:
          'Check quadrant signs: Q1 is (+, +), Q2 is (-, +), Q3 is (-, -), and Q4 is (+, -).',
        targetRef: { x: signTarget.x, y: signTarget.y },
        entered: { x: enteredX, y: enteredY },
        cannonPos: { x: cannonX, y: cannonY },
        equationStr: cannonType === 'quadratic' ? quadCoeffs.equationStr : lineEq,
        rootsInfo,
      };
    }
  }

  // Check 3: Near Miss (off by 1-2 units)
  let closestTarget: Target | null = null;
  let minDistance = Infinity;

  for (const t of targets) {
    const dist = Math.hypot(t.x - enteredX, t.y - enteredY);
    if (dist < minDistance) {
      minDistance = dist;
      closestTarget = t;
    }
  }

  if (closestTarget && minDistance <= 2.2) {
    const dx = closestTarget.x - enteredX;
    const dy = closestTarget.y - enteredY;
    let hint = '';
    if (dx !== 0 && dy !== 0) {
      hint = `Adjust X by ${dx > 0 ? `+${dx}` : dx} and Y by ${dy > 0 ? `+${dy}` : dy}.`;
    } else if (dx !== 0) {
      hint = `Adjust X by ${dx > 0 ? `+${dx}` : dx} (move ${dx > 0 ? 'right' : 'left'}).`;
    } else {
      hint = `Adjust Y by ${dy > 0 ? `+${dy}` : dy} (move ${dy > 0 ? 'up' : 'down'}).`;
    }

    return {
      type: 'close_miss',
      title: 'Near Miss! Detonated Nearby',
      message: `Your shell detonated at (${enteredX}, ${enteredY}), missing nearest target at (${closestTarget.x}, ${closestTarget.y}).`,
      pedagogicalTip: `${hint} Trajectory: ${cannonType === 'quadratic' ? quadCoeffs.equationStr : lineEq}. Root / Zero: ${rootsInfo.rootStr}.`,
      targetRef: { x: closestTarget.x, y: closestTarget.y },
      entered: { x: enteredX, y: enteredY },
      cannonPos: { x: cannonX, y: cannonY },
      equationStr: cannonType === 'quadratic' ? quadCoeffs.equationStr : lineEq,
      rootsInfo,
    };
  }

  // General Miss
  return {
    type: 'far_miss',
    title: 'Shell Detonated in Open Space',
    message: `Detonated at (${enteredX}, ${enteredY}). Shot line: ${cannonType === 'quadratic' ? quadCoeffs.equationStr : lineEq}.`,
    pedagogicalTip: `Line equation: ${cannonType === 'quadratic' ? quadCoeffs.equationStr : lineEq}. Zero / Solution (y = 0): ${rootsInfo.rootStr}.`,
    entered: { x: enteredX, y: enteredY },
    cannonPos: { x: cannonX, y: cannonY },
    equationStr: cannonType === 'quadratic' ? quadCoeffs.equationStr : lineEq,
    rootsInfo,
  };
}
