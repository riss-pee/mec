/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type OpticalElementType =
  | 'convex-lens'
  | 'concave-lens'
  | 'concave-mirror'
  | 'convex-mirror'
  | 'plane-mirror'
  | 'prism';

export type RayMode =
  | 'single-pencil'      // Single precision central ray
  | 'beam'               // Adjustable beam width bundle
  | 'parallel-array'     // Parallel rays from aperture (collimated)
  | 'divergent-fan'      // Diverging fan from torch bulb
  | 'principal-rays';    // 3 classic physics rays from object arrow

export type WavelengthColor =
  | 'laser-green'   // 532 nm
  | 'laser-red'     // 650 nm
  | 'laser-cyan'    // 488 nm
  | 'laser-amber'   // 589 nm
  | 'white-dispersive'; // Full visible spectrum with chromatic dispersion

export interface OpticalElement {
  id: string;
  type: OpticalElementType;
  name: string;
  x: number;             // X position on optical axis (in cm, 0 is center)
  focalLength: number;   // Focal length in cm (positive for convex lens / concave mirror, negative for concave lens / convex mirror)
  height: number;        // Physical aperture height in cm
  refractiveIndex: number; // For lenses and prisms (e.g., 1.52)
  prismApexAngle?: number; // In degrees, for prism
  rotation?: number;       // In degrees (for plane mirror / prism)
}

export interface TorchSource {
  x: number;             // X position on bench in cm (e.g. -35 cm)
  y: number;             // Y position above/below optical axis in cm (e.g. 10 cm)
  angle: number;         // Emission angle in degrees (0 = pointing straight right towards element)
  beamWidth: number;     // Beam spread angle in degrees (0 = single pencil beam, up to 45 deg)
  beamAperture: number;  // Physical aperture width in cm (for parallel rays)
  rayCount: number;      // Number of discrete traced rays (1 for single beam, up to 31)
  intensity: number;     // 0 to 100%
  rayMode: RayMode;
  colorScheme: WavelengthColor;
  objectHeight: number;  // For principal rays mode: arrow height in cm
}

export interface RayPoint {
  x: number;
  y: number;
}

export interface RaySegment {
  points: RayPoint[];
  color: string;
  opacity: number;
  isVirtual?: boolean;   // Dashed ray extending backwards
  width?: number;
  wavelength?: number;   // In nm
}

export interface ImageFormation {
  exists: boolean;
  isReal: boolean;
  isVirtual: boolean;
  isInverted: boolean;
  isUpright: boolean;
  distance: number;       // d_i in cm relative to element
  x: number;              // Absolute x position in cm
  height: number;         // h_i in cm
  magnification: number;  // m = -d_i / d_o
  explanation: string;
}

export interface OpticalPreset {
  id: string;
  title: string;
  category: 'Lenses' | 'Mirrors' | 'Prisms & Dispersion' | 'Systems';
  description: string;
  element: OpticalElement;
  torch: Partial<TorchSource>;
  keyLearning: string;
  formulaNote: string;
}

export interface CaliperMeasurement {
  active: boolean;
  p1: RayPoint | null;
  p2: RayPoint | null;
  distanceCm: number | null;
}
