/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  OpticalElement,
  TorchSource,
  RaySegment,
  RayPoint,
  ImageFormation,
  WavelengthColor,
} from '../types/optics';

// Spectral colors for dispersion (ROYGBIV)
export const SPECTRUM_RAYS = [
  { name: 'Red', wavelength: 660, nOffset: -0.008, color: '#ef4444' },
  { name: 'Orange', wavelength: 610, nOffset: -0.004, color: '#f97316' },
  { name: 'Yellow', wavelength: 580, nOffset: 0.000, color: '#eab308' },
  { name: 'Green', wavelength: 530, nOffset: +0.005, color: '#22c55e' },
  { name: 'Cyan', wavelength: 490, nOffset: +0.010, color: '#06b6d4' },
  { name: 'Blue', wavelength: 450, nOffset: +0.017, color: '#3b82f6' },
  { name: 'Violet', wavelength: 410, nOffset: +0.026, color: '#a855f7' },
];

export function getLaserColorHex(colorScheme: WavelengthColor): string {
  switch (colorScheme) {
    case 'laser-green':
      return '#22c55e'; // 532nm
    case 'laser-red':
      return '#ef4444'; // 650nm
    case 'laser-cyan':
      return '#06b6d4'; // 488nm
    case 'laser-amber':
      return '#f59e0b'; // 589nm
    case 'white-dispersive':
      return '#f8fafc';
    default:
      return '#f59e0b';
  }
}

/**
 * Calculates analytical image formation using Gauss / Thin Lens & Mirror equation:
 * 1/f = 1/do + 1/di  =>  di = (f * do) / (do - f)
 */
export function calculateImageFormation(
  element: OpticalElement,
  torch: TorchSource
): ImageFormation {
  const isLens = element.type === 'convex-lens' || element.type === 'concave-lens';
  const isMirror = element.type === 'concave-mirror' || element.type === 'convex-mirror' || element.type === 'plane-mirror';

  if (element.type === 'prism') {
    return {
      exists: false,
      isReal: false,
      isVirtual: false,
      isInverted: false,
      isUpright: true,
      distance: 0,
      x: 0,
      height: 0,
      magnification: 1,
      explanation: 'Dispersive prism bends light via wavelength-dependent refraction without a fixed focal plane.',
    };
  }

  if (element.type === 'plane-mirror') {
    const doVal = Math.abs(element.x - torch.x);
    const diVal = -doVal; // Virtual image at equal distance behind mirror
    return {
      exists: true,
      isReal: false,
      isVirtual: true,
      isInverted: false,
      isUpright: true,
      distance: diVal,
      x: element.x + doVal, // Behind mirror
      height: torch.objectHeight,
      magnification: 1,
      explanation: 'Plane mirror forms a virtual, upright, identical-size image equidistant behind the reflective surface.',
    };
  }

  const f = element.focalLength;
  const doVal = Math.abs(element.x - torch.x);
  const ho = torch.y !== undefined ? torch.y : (torch.objectHeight ?? 10);

  // Object exactly at focal point
  if (Math.abs(doVal - Math.abs(f)) < 0.1 && f > 0) {
    return {
      exists: false,
      isReal: false,
      isVirtual: false,
      isInverted: false,
      isUpright: true,
      distance: Infinity,
      x: Infinity,
      height: Infinity,
      magnification: Infinity,
      explanation: 'Object is at the focal point (d_o = f). Rays exit parallel; image forms at infinity (searchlight effect).',
    };
  }

  // Thin lens / mirror equation
  let di: number;
  let explanation = '';

  if (isLens) {
    // 1/di = 1/f - 1/do  => di = (f * do) / (do - f)
    di = (f * doVal) / (doVal - f);
    const m = -di / doVal;
    const hi = m * ho;
    const isReal = di > 0;
    const isVirtual = di < 0;
    const imgX = element.x + di;

    if (element.type === 'convex-lens') {
      if (doVal > 2 * f) {
        explanation = `Object is beyond 2F (${doVal.toFixed(1)} cm > ${(2 * f).toFixed(1)} cm). Image is real, inverted, diminished (m = ${m.toFixed(2)}). Typical camera/eye mode.`;
      } else if (Math.abs(doVal - 2 * f) < 0.5) {
        explanation = `Object is at 2F (${doVal.toFixed(1)} cm = ${(2 * f).toFixed(1)} cm). Image is real, inverted, exactly 1:1 scale (m = ${m.toFixed(2)}).`;
      } else if (doVal > f && doVal < 2 * f) {
        explanation = `Object is between F and 2F. Image is real, inverted, and magnified (m = ${m.toFixed(2)}). Typical projector/microscope objective mode.`;
      } else {
        explanation = `Object is within focal length (d_o < F). Image is virtual, upright, and magnified (m = ${Math.abs(m).toFixed(2)}). Classic magnifying glass mode.`;
      }
    } else {
      // Concave lens: f is negative
      explanation = `Concave diverging lens always forms a virtual, upright, diminished image (m = ${m.toFixed(2)}) on the same side as the object. Corrects myopia.`;
    }

    return {
      exists: true,
      isReal,
      isVirtual,
      isInverted: m < 0,
      isUpright: m > 0,
      distance: di,
      x: imgX,
      height: hi,
      magnification: m,
      explanation,
    };
  }

  if (isMirror) {
    // For mirrors, reflection stays in front for real images: di = (f * do) / (do - f)
    di = (f * doVal) / (doVal - f);
    const m = -di / doVal;
    const hi = m * ho;
    const isReal = di > 0;
    const isVirtual = di < 0;
    // For concave mirror, real image is in front (x_e - di), virtual is behind (x_e + |di|)
    const imgX = isReal ? element.x - di : element.x + Math.abs(di);

    if (element.type === 'concave-mirror') {
      if (doVal > 2 * f) {
        explanation = `Object beyond Center of Curvature C (2F). Real, inverted, diminished image in front of mirror.`;
      } else if (Math.abs(doVal - 2 * f) < 0.5) {
        explanation = `Object at Center of Curvature C. Real, inverted, equal-sized image formed at C.`;
      } else if (doVal > f && doVal < 2 * f) {
        explanation = `Object between F and C. Real, inverted, magnified image beyond C.`;
      } else {
        explanation = `Object inside focal point (d_o < F). Virtual, upright, enlarged image behind mirror. Makeup/shaving mirror.`;
      }
    } else {
      // Convex mirror
      explanation = `Convex mirror always produces a virtual, upright, diminished image behind the mirror. Ideal for wide-angle rearview/security.`;
    }

    return {
      exists: true,
      isReal,
      isVirtual,
      isInverted: m < 0,
      isUpright: m > 0,
      distance: di,
      x: imgX,
      height: hi,
      magnification: m,
      explanation,
    };
  }

  return {
    exists: false,
    isReal: false,
    isVirtual: false,
    isInverted: false,
    isUpright: true,
    distance: 0,
    x: 0,
    height: 0,
    magnification: 1,
    explanation: 'No image formation computed for this setup.',
  };
}

/**
 * Traces principal 3 rays for physics students:
 * 1. Ray parallel to principal axis
 * 2. Ray through optical center / vertex
 * 3. Ray through focal point
 */
export function tracePrincipalRays(
  element: OpticalElement,
  torch: TorchSource,
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
): { segments: RaySegment[]; image: ImageFormation } {
  const segments: RaySegment[] = [];
  const image = calculateImageFormation(element, torch);
  const ho = torch.y !== undefined ? torch.y : (torch.objectHeight ?? 10);
  const origin: RayPoint = { x: torch.x, y: ho };
  const xe = element.x;
  const f = element.focalLength;

  if (element.type === 'convex-lens' || element.type === 'concave-lens') {
    const isConvex = element.type === 'convex-lens';
    const f1 = xe - f; // Front focus
    const f2 = xe + f; // Back focus

    // 1. Ray 1: Parallel to axis, refracts through back focus (or diverges from front focus)
    const hit1: RayPoint = { x: xe, y: ho };

    if (isConvex) {
      // Convex: goes through (xe + f, 0)
      const slope1 = (0 - ho) / (f2 - xe); // -ho / f
      const exitX = bounds.maxX;
      const exitY = ho + slope1 * (exitX - xe);
      segments.push({
        points: [origin, hit1, { x: exitX, y: exitY }],
        color: '#38bdf8', // Sky blue
        opacity: 0.95,
        width: 2.5,
      });

      // If virtual image (object inside focus), draw backward dashed ray
      if (image.isVirtual && image.exists) {
        segments.push({
          points: [hit1, { x: image.x, y: image.height }],
          color: '#38bdf8',
          opacity: 0.6,
          isVirtual: true,
          width: 2,
        });
      }
    } else {
      // Concave: diverges as if coming from front focus (xe - |f|, 0)
      const virtualF = xe - Math.abs(f);
      const slope1 = (ho - 0) / (xe - virtualF);
      const exitX = bounds.maxX;
      const exitY = ho + slope1 * (exitX - xe);
      segments.push({
        points: [origin, hit1, { x: exitX, y: exitY }],
        color: '#38bdf8',
        opacity: 0.95,
        width: 2.5,
      });
      // Backward virtual ray to front focus
      segments.push({
        points: [hit1, { x: virtualF, y: 0 }],
        color: '#38bdf8',
        opacity: 0.6,
        isVirtual: true,
        width: 2,
      });
    }

    // 2. Ray 2: Central ray through (xe, 0) straight without deflection
    const slope2 = (0 - ho) / (xe - torch.x);
    const exitX2 = bounds.maxX;
    const exitY2 = 0 + slope2 * (exitX2 - xe);
    segments.push({
      points: [origin, { x: xe, y: 0 }, { x: exitX2, y: exitY2 }],
      color: '#f59e0b', // Amber
      opacity: 0.95,
      width: 2.5,
    });

    if (image.isVirtual && image.exists) {
      // Backward extension of central ray
      segments.push({
        points: [{ x: xe, y: 0 }, { x: image.x, y: image.height }],
        color: '#f59e0b',
        opacity: 0.6,
        isVirtual: true,
        width: 2,
      });
    }

    // 3. Ray 3: Focal ray
    if (isConvex) {
      // Passes through front focus (xe - f, 0), emerges parallel
      const slope3 = (0 - ho) / (f1 - torch.x);
      const hit3Y = ho + slope3 * (xe - torch.x);
      if (Math.abs(hit3Y) <= element.height / 2 + 5) {
        const hit3: RayPoint = { x: xe, y: hit3Y };
        segments.push({
          points: [origin, hit3, { x: bounds.maxX, y: hit3Y }],
          color: '#ec4899', // Pink
          opacity: 0.95,
          width: 2.5,
        });

        if (image.isVirtual && image.exists) {
          segments.push({
            points: [hit3, { x: image.x, y: hit3Y }],
            color: '#ec4899',
            opacity: 0.6,
            isVirtual: true,
            width: 2,
          });
        }
      }
    } else {
      // Concave: aims at back focus (xe + |f|, 0), emerges parallel
      const backF = xe + Math.abs(f);
      const slope3 = (0 - ho) / (backF - torch.x);
      const hit3Y = ho + slope3 * (xe - torch.x);
      if (Math.abs(hit3Y) <= element.height / 2 + 5) {
        const hit3: RayPoint = { x: xe, y: hit3Y };
        segments.push({
          points: [origin, hit3, { x: bounds.maxX, y: hit3Y }],
          color: '#ec4899',
          opacity: 0.95,
          width: 2.5,
        });
        segments.push({
          points: [hit3, { x: image.x, y: hit3Y }],
          color: '#ec4899',
          opacity: 0.6,
          isVirtual: true,
          width: 2,
        });
      }
    }
  } else if (element.type === 'concave-mirror' || element.type === 'convex-mirror') {
    const isConcave = element.type === 'concave-mirror';
    const fVal = Math.abs(element.focalLength);

    // 1. Parallel Ray -> reflects through focus
    const hit1: RayPoint = { x: xe, y: ho };

    if (isConcave) {
      const focusPoint: RayPoint = { x: xe - fVal, y: 0 };
      const slope1 = (0 - ho) / ((xe - fVal) - xe); // reflected towards left
      const exitX = bounds.minX;
      const exitY = ho + slope1 * (exitX - xe);
      segments.push({
        points: [origin, hit1, focusPoint, { x: exitX, y: exitY }],
        color: '#38bdf8',
        opacity: 0.95,
        width: 2.5,
      });

      if (image.isVirtual && image.exists) {
        segments.push({
          points: [hit1, { x: image.x, y: image.height }],
          color: '#38bdf8',
          opacity: 0.6,
          isVirtual: true,
          width: 2,
        });
      }
    } else {
      // Convex mirror: reflects diverging as if from virtual focus (xe + fVal, 0)
      const virtualF: RayPoint = { x: xe + fVal, y: 0 };
      const slope1 = (ho - 0) / (xe - (xe + fVal)); // -ho / fVal
      const exitX = bounds.minX;
      const exitY = ho + slope1 * (exitX - xe);
      segments.push({
        points: [origin, hit1, { x: exitX, y: exitY }],
        color: '#38bdf8',
        opacity: 0.95,
        width: 2.5,
      });
      segments.push({
        points: [hit1, virtualF],
        color: '#38bdf8',
        opacity: 0.6,
        isVirtual: true,
        width: 2,
      });
    }

    // 2. Vertex Ray: hits (xe, 0) at angle -theta and reflects symmetrically
    const hitVertex: RayPoint = { x: xe, y: 0 };
    const slopeIn = (0 - ho) / (xe - torch.x);
    const slopeOut = -slopeIn; // Symmetrical reflection
    const exitX2 = bounds.minX;
    const exitY2 = 0 + slopeOut * (exitX2 - xe);
    segments.push({
      points: [origin, hitVertex, { x: exitX2, y: exitY2 }],
      color: '#f59e0b',
      opacity: 0.95,
      width: 2.5,
    });

    if (image.isVirtual && image.exists) {
      segments.push({
        points: [hitVertex, { x: image.x, y: image.height }],
        color: '#f59e0b',
        opacity: 0.6,
        isVirtual: true,
        width: 2,
      });
    }

    // 3. Focal Ray
    if (isConcave && torch.x < xe - fVal) {
      // Passes through focus on way to mirror, reflects parallel
      const focusPoint: RayPoint = { x: xe - fVal, y: 0 };
      const slope3 = (0 - ho) / (focusPoint.x - torch.x);
      const hit3Y = ho + slope3 * (xe - torch.x);
      if (Math.abs(hit3Y) <= element.height / 2 + 5) {
        const hit3: RayPoint = { x: xe, y: hit3Y };
        segments.push({
          points: [origin, hit3, { x: bounds.minX, y: hit3Y }],
          color: '#ec4899',
          opacity: 0.95,
          width: 2.5,
        });
      }
    }
  } else if (element.type === 'plane-mirror') {
    // Plane mirror reflection
    const hit1: RayPoint = { x: xe, y: ho };
    segments.push({
      points: [origin, hit1, { x: bounds.minX, y: ho }],
      color: '#38bdf8',
      opacity: 0.95,
      width: 2.5,
    });
    segments.push({
      points: [hit1, { x: image.x, y: ho }],
      color: '#38bdf8',
      opacity: 0.6,
      isVirtual: true,
      width: 2,
    });

    const hitVertex: RayPoint = { x: xe, y: 0 };
    const slopeIn = (0 - ho) / (xe - torch.x);
    const slopeOut = -slopeIn;
    segments.push({
      points: [origin, hitVertex, { x: bounds.minX, y: 0 + slopeOut * (bounds.minX - xe) }],
      color: '#f59e0b',
      opacity: 0.95,
      width: 2.5,
    });
    segments.push({
      points: [hitVertex, { x: image.x, y: image.height }],
      color: '#f59e0b',
      opacity: 0.6,
      isVirtual: true,
      width: 2,
    });
  }

  return { segments, image };
}

/**
 * Traces torch beam rays with customizable beam width, angle, aperture, and dispersion.
 */
export function traceTorchRays(
  element: OpticalElement,
  torch: TorchSource,
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
): RaySegment[] {
  const segments: RaySegment[] = [];
  const baseColor = getLaserColorHex(torch.colorScheme);
  const isDispersive = torch.colorScheme === 'white-dispersive' && (element.type === 'prism' || element.type === 'convex-lens');

  // Generate initial rays based on rayMode
  interface RaySample {
    origin: RayPoint;
    angleRad: number;
    color: string;
    wavelength?: number;
    nOffset?: number;
    width?: number;
  }

  const rawRays: RaySample[] = [];
  const baseAngleRad = (torch.angle * Math.PI) / 180;
  const halfSpreadRad = (torch.beamWidth * Math.PI) / 360;

  if (torch.rayMode === 'single-pencil') {
    // Exact single beam
    rawRays.push({
      origin: { x: torch.x, y: torch.y },
      angleRad: baseAngleRad,
      color: baseColor,
      width: 3.5,
    });
  } else if (torch.rayMode === 'parallel-array') {
    // Parallel rays across the torch aperture width
    const count = Math.max(3, torch.rayCount);
    const aperture = torch.beamAperture || 6; // cm
    const normalAngle = baseAngleRad + Math.PI / 2;

    for (let i = 0; i < count; i++) {
      const offset = (i / (count - 1) - 0.5) * aperture;
      const ox = torch.x + offset * Math.cos(normalAngle);
      const oy = torch.y + offset * Math.sin(normalAngle);

      rawRays.push({
        origin: { x: ox, y: oy },
        angleRad: baseAngleRad,
        color: baseColor,
        width: i === Math.floor(count / 2) ? 3 : 2,
      });
    }
  } else if (torch.rayMode === 'beam' || torch.rayMode === 'divergent-fan') {
    // Cone beam or diverging fan
    const count = torch.rayCount;
    if (count <= 1 || torch.beamWidth === 0) {
      rawRays.push({
        origin: { x: torch.x, y: torch.y },
        angleRad: baseAngleRad,
        color: baseColor,
        width: 3,
      });
    } else {
      for (let i = 0; i < count; i++) {
        const factor = (i / (count - 1) - 0.5) * 2; // -1 to +1
        const rayAngle = baseAngleRad + factor * halfSpreadRad;
        rawRays.push({
          origin: { x: torch.x, y: torch.y },
          angleRad: rayAngle,
          color: baseColor,
          width: i === Math.floor(count / 2) ? 3 : 2,
        });
      }
    }
  }

  // If dispersive mode on prism or lens, expand each ray into spectrum components
  const activeRays: RaySample[] = [];
  if (isDispersive) {
    for (const r of rawRays) {
      for (const spec of SPECTRUM_RAYS) {
        activeRays.push({
          origin: r.origin,
          angleRad: r.angleRad,
          color: spec.color,
          wavelength: spec.wavelength,
          nOffset: spec.nOffset,
          width: 2,
        });
      }
    }
  } else {
    activeRays.push(...rawRays);
  }

  // Trace each ray through optical elements
  for (const ray of activeRays) {
    traceSingleRay(ray, element, bounds, segments);
  }

  return segments;
}

/**
 * Traces a single ray hitting lens, mirror, or prism.
 */
function traceSingleRay(
  ray: { origin: RayPoint; angleRad: number; color: string; wavelength?: number; nOffset?: number; width?: number },
  element: OpticalElement,
  bounds: { minX: number; maxX: number; minY: number; maxY: number },
  segments: RaySegment[]
) {
  const { origin, angleRad, color, nOffset = 0, width = 2 } = ray;
  const dirX = Math.cos(angleRad);
  const dirY = Math.sin(angleRad);
  const xe = element.x;
  const halfH = element.height / 2;

  // LENS REFRACTION
  if (element.type === 'convex-lens' || element.type === 'concave-lens') {
    // Find intersection with vertical lens plane x = xe
    if (Math.abs(dirX) < 1e-6) {
      // Parallel to element, just draw to bounds
      const t = dirY > 0 ? (bounds.maxY - origin.y) / dirY : (bounds.minY - origin.y) / dirY;
      segments.push({
        points: [origin, { x: origin.x, y: origin.y + t * dirY }],
        color,
        opacity: 0.9,
        width,
      });
      return;
    }

    const t = (xe - origin.x) / dirX;
    if (t < 0) {
      // Ray directed away from lens
      const tEnd = dirX < 0 ? (bounds.minX - origin.x) / dirX : (bounds.maxX - origin.x) / dirX;
      segments.push({
        points: [origin, { x: origin.x + tEnd * dirX, y: origin.y + tEnd * dirY }],
        color,
        opacity: 0.9,
        width,
      });
      return;
    }

    const hitY = origin.y + t * dirY;

    if (Math.abs(hitY) <= halfH) {
      const hitPoint: RayPoint = { x: xe, y: hitY };

      // Refraction deflection:
      // Effective focal length (including chromatic dispersion if applicable)
      // Lensmaker's formula: 1/f = (n - 1) * C => f_eff = f / (1 + nOffset / (n - 1))
      const baseN = element.refractiveIndex || 1.52;
      const nEff = baseN + nOffset;
      const fEff = element.focalLength * (baseN - 1) / (nEff - 1);

      // Paraxial refraction: Delta(slope) = -hitY / fEff
      const tanIn = dirY / dirX;
      const tanOut = tanIn - hitY / fEff;
      const angleOut = Math.atan(tanOut);
      const outDirX = Math.cos(angleOut) * Math.sign(dirX);
      const outDirY = Math.sin(angleOut) * Math.sign(dirX);

      // Propagate to boundary
      const tOut = outDirX > 0 ? (bounds.maxX - xe) / outDirX : (bounds.minX - xe) / outDirX;
      const endPoint: RayPoint = {
        x: xe + tOut * outDirX,
        y: hitY + tOut * outDirY,
      };

      // Continuous ray from source origin through lens to exit boundary
      segments.push({
        points: [origin, hitPoint, endPoint],
        color,
        opacity: 0.95,
        width,
      });

      // Virtual backwards ray if diverging
      if (element.focalLength < 0 || (element.focalLength > 0 && Math.abs(origin.x - xe) < element.focalLength)) {
        // Backtrace
        const backT = -50;
        segments.push({
          points: [hitPoint, { x: hitPoint.x + backT * outDirX, y: hitPoint.y + backT * outDirY }],
          color,
          opacity: 0.45,
          isVirtual: true,
          width: 1.5,
        });
      }
    } else {
      // Ray misses the aperture
      const tEnd = dirX > 0 ? (bounds.maxX - origin.x) / dirX : (bounds.minX - origin.x) / dirX;
      segments.push({
        points: [origin, { x: origin.x + tEnd * dirX, y: origin.y + tEnd * dirY }],
        color,
        opacity: 0.7,
        width,
      });
    }
  } else if (element.type === 'concave-mirror' || element.type === 'convex-mirror' || element.type === 'plane-mirror') {
    // MIRROR REFLECTION
    const isPlane = element.type === 'plane-mirror';
    const isConcave = element.type === 'concave-mirror';
    const f = element.focalLength;
    const R = 2 * Math.abs(f);

    // Approximate intersection with mirror surface:
    // For concave: surface bows rightward at edges: x = xe - y^2 / (2R) or plane at xe
    const t = (xe - origin.x) / dirX;
    if (t <= 0) {
      // Ray moving away
      const tEnd = dirX < 0 ? (bounds.minX - origin.x) / dirX : (bounds.maxX - origin.x) / dirX;
      segments.push({
        points: [origin, { x: origin.x + tEnd * dirX, y: origin.y + tEnd * dirY }],
        color,
        opacity: 0.8,
        width,
      });
      return;
    }

    const hitY = origin.y + t * dirY;

    if (Math.abs(hitY) <= halfH) {
      // Curvature sagitta
      const sagitta = isPlane ? 0 : (isConcave ? -(hitY * hitY) / (2 * R) : +(hitY * hitY) / (2 * R));
      const tSagitta = (xe + sagitta - origin.x) / dirX;
      const trueHitY = origin.y + tSagitta * dirY;
      const hitPoint: RayPoint = { x: xe + sagitta, y: trueHitY };

      // Reflection normal
      // For plane mirror: normal is (-1, 0)
      // For concave mirror: normal angle alpha ~ -hitY / R
      // For convex mirror: normal angle alpha ~ +hitY / R
      let normalAngle = Math.PI; // default pointing left
      if (!isPlane) {
        const curvatureSign = isConcave ? -1 : 1;
        normalAngle = Math.PI + Math.atan((curvatureSign * trueHitY) / R);
      }

      // Law of reflection: r_out = r_in - 2 * (r_in . n) * n
      const rayAngle = angleRad;
      const incAngle = rayAngle - normalAngle;
      const reflAngle = normalAngle - incAngle + Math.PI;

      const reflDirX = Math.cos(reflAngle);
      const reflDirY = Math.sin(reflAngle);

      const tRefl = reflDirX < 0 ? (bounds.minX - hitPoint.x) / reflDirX : (bounds.maxX - hitPoint.x) / reflDirX;
      const endPoint: RayPoint = {
        x: hitPoint.x + tRefl * reflDirX,
        y: hitPoint.y + tRefl * reflDirY,
      };

      // Continuous ray from source origin to mirror hit point to reflected exit
      segments.push({
        points: [origin, hitPoint, endPoint],
        color,
        opacity: 0.95,
        width,
      });

      // Virtual back-ray behind mirror
      const tBack = 45;
      segments.push({
        points: [hitPoint, { x: hitPoint.x - tBack * reflDirX, y: hitPoint.y - tBack * reflDirY }],
        color,
        opacity: 0.45,
        isVirtual: true,
        width: 1.5,
      });
    } else {
      // Misses mirror
      const tEnd = dirX > 0 ? (bounds.maxX - origin.x) / dirX : (bounds.minX - origin.x) / dirX;
      segments.push({
        points: [origin, { x: origin.x + tEnd * dirX, y: origin.y + tEnd * dirY }],
        color,
        opacity: 0.7,
        width,
      });
    }
  } else if (element.type === 'prism') {
    // EQUILATERAL / APEX PRISM REFRACTION
    // Prism centered horizontally at (xe, 0) with side element.height
    const side = element.height;
    const apexAngle = (element.prismApexAngle || 60) * (Math.PI / 180);
    const halfBase = side * Math.sin(apexAngle / 2);
    const heightPrism = side * Math.cos(apexAngle / 2);

    const pApex: RayPoint = { x: xe, y: heightPrism / 2 };
    const pLeft: RayPoint = { x: xe - halfBase, y: -heightPrism / 2 };
    const pRight: RayPoint = { x: xe + halfBase, y: -heightPrism / 2 };

    const rayDir = { x: dirX, y: dirY };

    // Define 3 prism faces with outward-facing unit normals
    const faces = [
      {
        name: 'left' as const,
        p1: pLeft,
        p2: pApex,
        normal: {
          x: -heightPrism / side,
          y: halfBase / side,
        },
      },
      {
        name: 'right' as const,
        p1: pApex,
        p2: pRight,
        normal: {
          x: heightPrism / side,
          y: halfBase / side,
        },
      },
      {
        name: 'bottom' as const,
        p1: pLeft,
        p2: pRight,
        normal: {
          x: 0,
          y: -1,
        },
      },
    ];

    // Find first face hit from outside (where ray heads against face normal)
    let bestEntranceHit: { point: RayPoint; t: number; faceIndex: number } | null = null;

    for (let i = 0; i < faces.length; i++) {
      const face = faces[i];
      // Must be heading into the surface from outside: dir . normal < 0
      const dot = rayDir.x * face.normal.x + rayDir.y * face.normal.y;
      if (dot < -1e-4) {
        const hit = raySegmentIntersect(origin, rayDir, face.p1, face.p2);
        if (hit && hit.t > 1e-4) {
          if (!bestEntranceHit || hit.t < bestEntranceHit.t) {
            bestEntranceHit = { ...hit, faceIndex: i };
          }
        }
      }
    }

    if (bestEntranceHit) {
      const entranceFace = faces[bestEntranceHit.faceIndex];
      const hitEntrance = bestEntranceHit.point;

      // Snell's Law at Entrance Face (Air -> Glass)
      const n1 = 1.0;
      const n2 = (element.refractiveIndex || 1.52) + nOffset;

      const enterResult = refractVector(rayDir, entranceFace.normal, n1, n2);

      if (!enterResult.tir) {
        const internalDir = enterResult.refracted;

        // Trace internal ray to next prism face (excluding entrance face)
        let bestExitHit: { point: RayPoint; t: number; faceIndex: number } | null = null;

        for (let i = 0; i < faces.length; i++) {
          if (i === bestEntranceHit.faceIndex) continue;
          const face = faces[i];
          const hit = raySegmentIntersect(hitEntrance, internalDir, face.p1, face.p2);
          if (hit && hit.t > 1e-4) {
            if (!bestExitHit || hit.t < bestExitHit.t) {
              bestExitHit = { ...hit, faceIndex: i };
            }
          }
        }

        if (bestExitHit) {
          const exitFace = faces[bestExitHit.faceIndex];
          const hitExit = bestExitHit.point;

          // Snell's Law at Exit Face (Glass -> Air)
          const exitResult = refractVector(internalDir, exitFace.normal, n2, n1);

          if (!exitResult.tir) {
            const exitDir = exitResult.refracted;
            const tExit = getDistanceToBounds(hitExit, exitDir, bounds);
            const exitEnd: RayPoint = {
              x: hitExit.x + tExit * exitDir.x,
              y: hitExit.y + tExit * exitDir.y,
            };

            // Continuous beam: origin -> entrance face -> exit face -> bounds
            segments.push({
              points: [origin, hitEntrance, hitExit, exitEnd],
              color,
              opacity: 0.95,
              width,
            });
          } else {
            // Total internal reflection inside prism
            const tirDir = exitResult.reflected;
            segments.push({
              points: [
                origin,
                hitEntrance,
                hitExit,
                { x: hitExit.x + tirDir.x * 25, y: hitExit.y + tirDir.y * 25 },
              ],
              color,
              opacity: 0.85,
              width,
            });
          }
        } else {
          // Internal ray continues forward inside
          segments.push({
            points: [
              origin,
              hitEntrance,
              { x: hitEntrance.x + internalDir.x * 30, y: hitEntrance.y + internalDir.y * 30 },
            ],
            color,
            opacity: 0.85,
            width,
          });
        }
      } else {
        // TIR at entrance surface (rare for air-to-glass, but handled)
        const tirDir = enterResult.reflected;
        segments.push({
          points: [
            origin,
            hitEntrance,
            { x: hitEntrance.x + tirDir.x * 25, y: hitEntrance.y + tirDir.y * 25 },
          ],
          color,
          opacity: 0.85,
          width,
        });
      }
    } else {
      // Misses prism: draw straight ray to bounds
      const tEnd = getDistanceToBounds(origin, rayDir, bounds);
      segments.push({
        points: [origin, { x: origin.x + tEnd * rayDir.x, y: origin.y + tEnd * rayDir.y }],
        color,
        opacity: 0.7,
        width,
      });
    }
  }
}

/**
 * 2D Snell's Law vector refraction & reflection.
 * normal is the outward-pointing unit normal of the surface.
 */
function refractVector(
  dir: { x: number; y: number },
  outwardNormal: { x: number; y: number },
  n1: number,
  n2: number
): { refracted: { x: number; y: number }; tir: boolean; reflected: { x: number; y: number } } {
  // Determine if ray is entering or exiting
  const dot = dir.x * outwardNormal.x + dir.y * outwardNormal.y;
  // N points against the incident ray
  const Nx = dot < 0 ? outwardNormal.x : -outwardNormal.x;
  const Ny = dot < 0 ? outwardNormal.y : -outwardNormal.y;

  const cosI = -(dir.x * Nx + dir.y * Ny); // always >= 0
  const r = n1 / n2;
  const sinT2 = r * r * Math.max(0, 1.0 - cosI * cosI);

  // Reflection vector: r = d - 2*(d.N)*N
  const dDotN = dir.x * Nx + dir.y * Ny;
  const reflDirX = dir.x - 2 * dDotN * Nx;
  const reflDirY = dir.y - 2 * dDotN * Ny;
  const reflLen = Math.hypot(reflDirX, reflDirY) || 1;
  const reflected = { x: reflDirX / reflLen, y: reflDirY / reflLen };

  if (sinT2 > 1.0) {
    // Total Internal Reflection
    return { refracted: reflected, tir: true, reflected };
  }

  const cosT = Math.sqrt(Math.max(0, 1.0 - sinT2));
  const refrX = r * dir.x + (r * cosI - cosT) * Nx;
  const refrY = r * dir.y + (r * cosI - cosT) * Ny;
  const refrLen = Math.hypot(refrX, refrY) || 1;

  return {
    refracted: { x: refrX / refrLen, y: refrY / refrLen },
    tir: false,
    reflected,
  };
}

/**
 * Robust ray-to-segment intersection: origin + t * dir = p1 + u * (p2 - p1)
 */
export function raySegmentIntersect(
  origin: RayPoint,
  dir: { x: number; y: number },
  p1: RayPoint,
  p2: RayPoint
): { point: RayPoint; t: number } | null {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;

  const denom = dir.x * dy - dir.y * dx;
  if (Math.abs(denom) < 1e-10) return null; // Parallel

  const qx = p1.x - origin.x;
  const qy = p1.y - origin.y;

  const t = (qx * dy - qy * dx) / denom;
  const u = (qx * dir.y - qy * dir.x) / denom;

  if (t > 1e-4 && u >= -1e-6 && u <= 1 + 1e-6) {
    return {
      point: {
        x: origin.x + t * dir.x,
        y: origin.y + t * dir.y,
      },
      t,
    };
  }
  return null;
}

/**
 * Calculates distance from origin along direction to nearest boundary box wall.
 */
function getDistanceToBounds(
  origin: RayPoint,
  dir: { x: number; y: number },
  bounds: { minX: number; maxX: number; minY: number; maxY: number }
): number {
  let minT = Infinity;

  if (dir.x > 1e-6) {
    const t = (bounds.maxX - origin.x) / dir.x;
    if (t > 0 && t < minT) minT = t;
  } else if (dir.x < -1e-6) {
    const t = (bounds.minX - origin.x) / dir.x;
    if (t > 0 && t < minT) minT = t;
  }

  if (dir.y > 1e-6) {
    const t = (bounds.maxY - origin.y) / dir.y;
    if (t > 0 && t < minT) minT = t;
  } else if (dir.y < -1e-6) {
    const t = (bounds.minY - origin.y) / dir.y;
    if (t > 0 && t < minT) minT = t;
  }

  return isFinite(minT) && minT > 0 ? minT : 100;
}

/**
 * Segment-segment intersection for general lines.
 */
export function lineIntersect(p1: RayPoint, p2: RayPoint, p3: RayPoint, p4: RayPoint): RayPoint | null {
  const dx1 = p2.x - p1.x;
  const dy1 = p2.y - p1.y;
  const dx2 = p4.x - p3.x;
  const dy2 = p4.y - p3.y;

  const denom = dx1 * dy2 - dy1 * dx2;
  if (Math.abs(denom) < 1e-10) return null;

  const dx3 = p3.x - p1.x;
  const dy3 = p3.y - p1.y;

  const ua = (dx3 * dy2 - dy3 * dx2) / denom;
  const ub = (dx3 * dy1 - dy3 * dx1) / denom;

  if (ua >= -1e-6 && ua <= 1 + 1e-6 && ub >= -1e-6 && ub <= 1 + 1e-6) {
    return {
      x: p1.x + ua * dx1,
      y: p1.y + ua * dy1,
    };
  }
  return null;
}
