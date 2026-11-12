/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OpticalElement, TorchSource, ImageFormation } from '../types/optics';
import { calculateImageFormation } from '../physics/rayTracer';
import { Award, CheckCircle2, ChevronRight, BookMarked, Sparkles } from 'lucide-react';

interface PhysicsDeckProps {
  element: OpticalElement;
  torch: TorchSource;
  onApplyChallengeSetup?: (elementPatch: Partial<OpticalElement>, torchPatch: Partial<TorchSource>) => void;
}

export const PhysicsDeck: React.FC<PhysicsDeckProps> = ({
  element,
  torch,
  onApplyChallengeSetup,
}) => {
  const [activeTab, setActiveTab] = useState<'solver' | 'challenges' | 'conventions'>('solver');
  const image: ImageFormation = calculateImageFormation(element, torch);

  const doVal = Math.abs(element.x - torch.x);
  const fVal = element.focalLength;
  const isLens = element.type === 'convex-lens' || element.type === 'concave-lens';

  // Lab Challenges
  const challenges = [
    {
      id: 'c1',
      title: 'Challenge 1: The Slide Projector',
      goal: 'Produce a real, magnified inverted image with |m| between 1.8 and 2.2.',
      hint: 'Place the object between F and 2F of a converging convex lens.',
      isCompleted:
        element.type === 'convex-lens' &&
        image.isReal &&
        Math.abs(image.magnification) >= 1.8 &&
        Math.abs(image.magnification) <= 2.2,
      quickSetup: {
        element: { type: 'convex-lens' as const, focalLength: 20, x: 0 },
        torch: { x: -30, y: 10, rayMode: 'principal-rays' as const },
      },
    },
    {
      id: 'c2',
      title: 'Challenge 2: Unit 1:1 Inversion Transfer',
      goal: 'Set object distance dₒ = 2F so the real inverted image forms at exactly 2F (m = -1.00 ± 0.05).',
      hint: 'Position the object exactly at twice the focal length (2F).',
      isCompleted:
        element.type === 'convex-lens' &&
        image.isReal &&
        Math.abs(Math.abs(image.magnification) - 1.0) <= 0.05,
      quickSetup: {
        element: { type: 'convex-lens' as const, focalLength: 20, x: 0 },
        torch: { x: -40, y: 10, rayMode: 'principal-rays' as const },
      },
    },
    {
      id: 'c3',
      title: 'Challenge 3: Collimated Searchlight Beam',
      goal: 'Place the torch at the focal point (dₒ = f) so rays exit parallel to the principal axis.',
      hint: 'When dₒ = f, refracted rays emerge parallel and the image is formed at infinity.',
      isCompleted:
        element.type === 'convex-lens' &&
        Math.abs(doVal - fVal) < 0.6 &&
        torch.rayMode !== 'single-pencil',
      quickSetup: {
        element: { type: 'convex-lens' as const, focalLength: 25, x: 0 },
        torch: { x: -29, y: 0, angle: -15, beamWidth: 20, rayMode: 'beam' as const },
      },
    },
    {
      id: 'c4',
      title: 'Challenge 4: Virtual Magnifier (Hand Lens)',
      goal: 'Form an upright virtual image with magnification m > 1.8.',
      hint: 'Place the object inside the focal distance (dₒ < F).',
      isCompleted:
        element.type === 'convex-lens' &&
        image.isVirtual &&
        image.magnification >= 1.8,
      quickSetup: {
        element: { type: 'convex-lens' as const, focalLength: 25, x: 0 },
        torch: { x: -15, y: 10, rayMode: 'principal-rays' as const },
      },
    },
    {
      id: 'c5',
      title: 'Challenge 5: Newton’s Prismatic Dispersion',
      goal: 'Select the triangular prism with Rainbow light mode to demonstrate spectral splitting.',
      hint: 'Switch element to Prism and ink color to Rainbow.',
      isCompleted:
        element.type === 'prism' &&
        torch.colorScheme === 'white-dispersive',
      quickSetup: {
        element: { type: 'prism' as const, refractiveIndex: 1.52, x: 0 },
        torch: { x: -35, y: 6, angle: 12, colorScheme: 'white-dispersive' as const, rayMode: 'single-pencil' as const },
      },
    },
  ];

  return (
    <div className="flex flex-col bg-[#fffef9] border-2 border-slate-700/80 rounded-lg p-5 shadow-[4px_5px_0px_rgba(51,65,85,0.18)] text-slate-800 font-hand">
      {/* Header and Notebook Section Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b-2 border-dashed border-slate-300">
        <div className="flex items-center gap-2">
          <span className="text-xl">📝</span>
          <h2 className="text-xl font-bold font-caveat text-slate-900">
            Student Physics Notes & Solver
          </h2>
        </div>

        {/* Tab Selector (Notebook paper tabs) */}
        <div className="flex items-center gap-1.5 bg-[#f6f2e4] p-1 rounded border border-slate-400">
          <button
            onClick={() => setActiveTab('solver')}
            className={`px-3 py-1 text-sm font-hand font-bold rounded transition-all ${
              activeTab === 'solver'
                ? 'bg-yellow-200 text-slate-900 shadow-[1px_2px_0px_rgba(51,65,85,0.2)]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📐 Step-by-Step Math
          </button>
          <button
            onClick={() => setActiveTab('challenges')}
            className={`px-3 py-1 text-sm font-hand font-bold rounded transition-all ${
              activeTab === 'challenges'
                ? 'bg-yellow-200 text-slate-900 shadow-[1px_2px_0px_rgba(51,65,85,0.2)]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⭐ Lab Practice
          </button>
          <button
            onClick={() => setActiveTab('conventions')}
            className={`px-3 py-1 text-sm font-hand font-bold rounded transition-all ${
              activeTab === 'conventions'
                ? 'bg-yellow-200 text-slate-900 shadow-[1px_2px_0px_rgba(51,65,85,0.2)]'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📖 Sign Rules
          </button>
        </div>
      </div>

      {/* TAB 1: FORMULA DERIVATION & LIVE SOLVER */}
      {activeTab === 'solver' && (
        <div className="flex flex-col gap-4 pt-4">
          {element.type === 'prism' ? (
            /* Prism Snell's Law & Dispersion Card */
            <div className="bg-[#fefce8] border-2 border-[#ca8a04] rounded-md p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-base font-bold text-amber-950">
                <span className="font-caveat text-xl">🌈 Snell's Law & Prism Dispersion</span>
                <span className="font-sketch text-xs text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  n₁ · sin(θ₁) = n₂ · sin(θ₂)
                </span>
              </div>

              <div className="text-sm space-y-2 text-slate-800">
                <div className="flex items-center justify-between py-1 border-b border-amber-200">
                  <span className="text-slate-700">1. Prism Apex Angle (α):</span>
                  <span className="font-sketch font-bold text-blue-900">{element.prismApexAngle || 60}°</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-amber-200">
                  <span className="text-slate-700">2. Glass Refractive Index (n_yellow):</span>
                  <span className="font-sketch font-bold text-amber-900">{(element.refractiveIndex || 1.52).toFixed(3)}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-amber-200">
                  <span className="text-slate-700">3. Spectral Dispersion Spread (Δn):</span>
                  <span className="font-sketch font-bold text-purple-900">+0.034 (Red to Violet)</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-amber-200">
                  <span className="text-slate-700">4. Critical Angle for Total Reflection (θ_c):</span>
                  <span className="font-sketch font-bold text-emerald-900">
                    {(Math.asin(1 / (element.refractiveIndex || 1.52)) * (180 / Math.PI)).toFixed(1)}°
                  </span>
                </div>
              </div>

              <div className="p-3 rounded bg-white border border-amber-300 text-xs text-slate-700 space-y-1">
                <div className="font-bold text-amber-900 font-caveat text-base">Student Note on Prisms:</div>
                <p className="leading-relaxed">
                  Violet light has higher frequency and bends more sharply than red light because glass slows it down slightly more. That's why the white light fans out into a colorful rainbow!
                </p>
              </div>
            </div>
          ) : (
            /* Gaussian Thin-Lens / Mirror Equation Card */
            <div className="bg-[#fefce8] border-2 border-[#ca8a04] rounded-md p-4 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-base font-bold text-amber-950">
                <span className="font-caveat text-xl">The Thin Lens & Mirror Formula</span>
                <span className="font-sketch text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300 font-bold">
                  1/f = 1/dₒ + 1/dᵢ
                </span>
              </div>

              {/* Step-by-Step Live Calculation */}
              <div className="text-sm space-y-2 text-slate-800">
                <div className="flex items-center justify-between py-1 border-b border-amber-200">
                  <span className="text-slate-700 font-semibold">1. Focal Length (f):</span>
                  <span className="font-sketch font-bold text-amber-900">
                    {element.type === 'plane-mirror'
                      ? '∞ (Flat)'
                      : `${element.focalLength > 0 ? '+' : ''}${element.focalLength.toFixed(1)} cm`}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-amber-200">
                  <span className="text-slate-700 font-semibold">2. Object Distance (dₒ):</span>
                  <span className="font-sketch font-bold text-blue-900">{doVal.toFixed(1)} cm in front</span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-amber-200">
                  <span className="text-slate-700 font-semibold">3. Calculated Image Distance (dᵢ):</span>
                  <span className="font-sketch font-bold text-emerald-900">
                    {image.exists
                      ? `${image.distance > 0 ? '+' : ''}${image.distance.toFixed(2)} cm`
                      : 'At Infinity (Parallel rays)'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1 border-b border-amber-200">
                  <span className="text-slate-700 font-semibold">4. Lateral Magnification (m = -dᵢ / dₒ):</span>
                  <span className="font-sketch font-bold text-purple-900">
                    {image.exists ? `${image.magnification.toFixed(2)}×` : 'Infinite'}
                  </span>
                </div>
              </div>

              {/* Friendly Explanation Prose */}
              <div className="p-3 rounded bg-white border border-amber-300 text-xs text-slate-700">
                <span className="font-bold text-amber-900 font-caveat text-base mr-1">Result:</span>
                <span>{image.explanation}</span>
              </div>
            </div>
          )}

          {/* Optical Properties Matrix (Hand-sketched boxes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-sm">
            <div className="bg-[#f8fafc] border-2 border-slate-400 rounded p-2.5 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Image Nature</div>
              <div className={`font-bold font-sketch text-base mt-1 ${image.isReal ? 'text-green-700' : 'text-purple-700'}`}>
                {image.isReal ? 'REAL (Inverted)' : 'VIRTUAL (Upright)'}
              </div>
            </div>

            <div className="bg-[#f8fafc] border-2 border-slate-400 rounded p-2.5 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Orientation</div>
              <div className="font-bold font-sketch text-base mt-1 text-blue-800">
                {image.isInverted ? 'INVERTED (m < 0)' : 'UPRIGHT (m > 0)'}
              </div>
            </div>

            <div className="bg-[#f8fafc] border-2 border-slate-400 rounded p-2.5 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Relative Size</div>
              <div className="font-bold font-sketch text-base mt-1 text-amber-800">
                {Math.abs(image.magnification) > 1.05
                  ? 'MAGNIFIED'
                  : Math.abs(image.magnification) < 0.95
                  ? 'DIMINISHED'
                  : 'SAME SIZE (1:1)'}
              </div>
            </div>

            <div className="bg-[#f8fafc] border-2 border-slate-400 rounded p-2.5 shadow-sm">
              <div className="text-xs text-slate-500 font-semibold">Position on Axis</div>
              <div className="font-bold font-sketch text-base mt-1 text-slate-800">
                x = {image.exists && isFinite(image.x) ? `${image.x.toFixed(1)} cm` : '±∞'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PHYSICS LAB CHALLENGES (Homework style with checkmarks) */}
      {activeTab === 'challenges' && (
        <div className="flex flex-col gap-3 pt-4">
          <div className="text-sm text-slate-600 mb-1">
            Complete each notebook lab exercise by adjusting the torch position, beam angle, and lens parameters:
          </div>

          <div className="space-y-3">
            {challenges.map((c) => (
              <div
                key={c.id}
                className={`p-3.5 rounded border-2 transition-all ${
                  c.isCompleted
                    ? 'bg-[#ecfdf5] border-[#059669] shadow-[2px_3px_0px_rgba(5,150,105,0.2)]'
                    : 'bg-[#fffdfa] border-slate-400 shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    {c.isCompleted ? (
                      <span className="text-lg select-none">✅</span>
                    ) : (
                      <span className="text-lg select-none">📝</span>
                    )}
                    <h3 className="text-base font-bold text-slate-900 font-caveat text-lg">{c.title}</h3>
                  </div>

                  {c.isCompleted ? (
                    <span className="text-xs font-hand font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-400">
                      SOLVED! ★★★
                    </span>
                  ) : (
                    <button
                      onClick={() => onApplyChallengeSetup?.(c.quickSetup.element, c.quickSetup.torch)}
                      className="text-xs text-blue-700 hover:text-blue-900 font-bold flex items-center gap-1 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded border border-blue-300"
                    >
                      <span>Try Setup</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-sm text-slate-800 mb-1 leading-snug">{c.goal}</p>
                <p className="text-xs text-slate-500 italic">💡 Hint: {c.hint}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SIGN CONVENTIONS REFERENCE (Student Study Guide) */}
      {activeTab === 'conventions' && (
        <div className="flex flex-col gap-3 pt-4 text-sm">
          <div className="bg-[#fef9c3] border border-[#ca8a04] p-3 rounded text-amber-950 mb-2">
            <span className="font-bold font-caveat text-base">Quick Rule of Thumb:</span>
            <p className="text-xs leading-relaxed mt-0.5">
              Light travels from Left to Right. Distances in the direction of light travel are positive (+), while distances measured against light are negative (-).
            </p>
          </div>

          <table className="w-full text-left font-hand border-collapse bg-white border-2 border-slate-400 rounded overflow-hidden">
            <thead>
              <tr className="border-b-2 border-slate-400 bg-slate-100 text-slate-800 text-xs font-bold">
                <th className="p-2.5">Parameter</th>
                <th className="p-2.5">Positive (+) Rule</th>
                <th className="p-2.5">Negative (-) Rule</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-300 text-xs">
              <tr>
                <td className="p-2.5 font-bold text-amber-900">Focal Length (f)</td>
                <td className="p-2.5 text-slate-800">Converging Lens / Concave Mirror</td>
                <td className="p-2.5 text-slate-800">Diverging Lens / Convex Mirror</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-blue-900">Object Dist (dₒ)</td>
                <td className="p-2.5 text-slate-800">Real object in front of lens/mirror</td>
                <td className="p-2.5 text-slate-800">Virtual object (cascaded setups)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-emerald-900">Image Dist (dᵢ)</td>
                <td className="p-2.5 text-slate-800">Real image (right side of lens / front of mirror)</td>
                <td className="p-2.5 text-slate-800">Virtual image (left side of lens / behind mirror)</td>
              </tr>
              <tr>
                <td className="p-2.5 font-bold text-purple-900">Magnification (m)</td>
                <td className="p-2.5 text-slate-800">Upright image (same direction as object)</td>
                <td className="p-2.5 text-slate-800">Inverted image (upside-down)</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
