/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  OpticalElement,
  TorchSource,
  OpticalElementType,
  RayMode,
  WavelengthColor,
} from '../types/optics';
import {
  Sliders,
  Sun,
  Layers,
  Sparkles,
  Compass,
} from 'lucide-react';

interface ControlsPanelProps {
  element: OpticalElement;
  torch: TorchSource;
  onUpdateElement: (patch: Partial<OpticalElement>) => void;
  onUpdateTorch: (patch: Partial<TorchSource>) => void;
}

export const ControlsPanel: React.FC<ControlsPanelProps> = ({
  element,
  torch,
  onUpdateElement,
  onUpdateTorch,
}) => {
  const isLens = element.type === 'convex-lens' || element.type === 'concave-lens';
  const isCurvedMirror = element.type === 'concave-mirror' || element.type === 'convex-mirror';
  const hasFocalLength = isLens || isCurvedMirror;

  // Handle element type change
  const handleElementTypeChange = (newType: OpticalElementType) => {
    let newFocal = element.focalLength;
    let newName = '';

    if (newType === 'convex-lens') {
      newFocal = Math.abs(newFocal) || 20;
      newName = 'Biconvex Converging Lens';
    } else if (newType === 'concave-lens') {
      newFocal = -Math.abs(newFocal) || -20;
      newName = 'Biconcave Diverging Lens';
    } else if (newType === 'concave-mirror') {
      newFocal = Math.abs(newFocal) || 20;
      newName = 'Concave Spherical Mirror';
    } else if (newType === 'convex-mirror') {
      newFocal = -Math.abs(newFocal) || -20;
      newName = 'Convex Spherical Mirror';
    } else if (newType === 'plane-mirror') {
      newFocal = 999;
      newName = 'Flat Plane Mirror';
    } else if (newType === 'prism') {
      newFocal = 0;
      newName = 'Equilateral Glass Prism';
    }

    onUpdateElement({
      type: newType,
      name: newName,
      focalLength: newFocal,
    });
  };

  return (
    <div className="flex flex-col gap-5 w-full bg-[#fffef9] border-2 border-slate-700/80 rounded-lg p-5 shadow-[4px_5px_0px_rgba(51,65,85,0.18)] text-slate-800 font-hand">
      {/* 1. OPTICAL ELEMENT SELECTION & CONFIGURATION (Notebook Section 1) */}
      <div className="flex flex-col gap-4 pb-5 border-b-2 border-dashed border-slate-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔍</span>
            <h2 className="text-xl font-bold font-caveat text-slate-900">
              1. Choose Optical Element (Lens or Mirror)
            </h2>
          </div>
          <span className="text-sm font-hand font-bold text-blue-800 bg-blue-100/80 px-2 py-0.5 rounded border border-blue-300">
            {element.type.toUpperCase().replace('-', ' ')}
          </span>
        </div>

        {/* Element Type Selector Grid (Hand-sketched buttons) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {[
            { id: 'convex-lens', label: 'Convex Lens', icon: '🔍', hint: 'Converging (f > 0)' },
            { id: 'concave-lens', label: 'Concave Lens', icon: '🔎', hint: 'Diverging (f < 0)' },
            { id: 'concave-mirror', label: 'Concave Mirror', icon: '🪞', hint: 'Focus in front' },
            { id: 'convex-mirror', label: 'Convex Mirror', icon: '🛡️', hint: 'Virtual focus' },
            { id: 'plane-mirror', label: 'Flat Plane Mirror', icon: '🪟', hint: 'f = ∞' },
            { id: 'prism', label: 'Glass Prism', icon: '📐', hint: 'Rainbow dispersion' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleElementTypeChange(item.id as OpticalElementType)}
              className={`flex items-start gap-2 p-2.5 rounded text-left transition-all sketch-card-sm ${
                element.type === item.id
                  ? 'bg-amber-100 text-amber-950 border-amber-700 shadow-[2px_3px_0px_rgba(180,83,9,0.3)]'
                  : 'bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-400'
              }`}
            >
              <span className="text-xl select-none mt-0.5">{item.icon}</span>
              <div className="flex flex-col min-w-0">
                <span className="text-base font-bold truncate leading-tight">{item.label}</span>
                <span className="text-xs text-slate-500 font-hand truncate">{item.hint}</span>
              </div>
            </button>
          ))}
        </div>

        {/* FOCAL LENGTH CONFIGURATION */}
        {hasFocalLength && (
          <div className="flex flex-col gap-3 bg-[#fdfbf3] border-2 border-slate-400/80 rounded-md p-3.5 mt-1 shadow-sm">
            <div className="flex items-center justify-between">
              <label htmlFor="focal-length-input" className="text-base font-bold text-slate-800 flex items-center gap-2">
                <span>Focal Length (f):</span>
                <span className="text-sm font-caveat font-bold text-blue-700">
                  {element.focalLength > 0 ? 'Converges Light (+)' : 'Spreads Light (-)'}
                </span>
              </label>

              {/* Interactive Numeric Input Field */}
              <div className="flex items-center gap-1.5">
                <input
                  id="focal-length-input"
                  type="number"
                  step="0.5"
                  min={element.focalLength < 0 ? -50 : 5}
                  max={element.focalLength < 0 ? -5 : 50}
                  value={Math.round(element.focalLength * 10) / 10}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      onUpdateElement({ focalLength: val });
                    }
                  }}
                  className="w-20 px-2 py-1 text-right text-base font-sketch font-bold bg-white border-2 border-slate-700 rounded text-blue-900 focus:outline-none focus:border-amber-600"
                />
                <span className="text-base text-slate-600 font-hand">cm</span>
              </div>
            </div>

            {/* Synchronized Focal Length Range Slider */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-hand text-slate-500">
                {element.focalLength < 0 ? '-50cm' : '5cm'}
              </span>
              <input
                type="range"
                min={element.focalLength < 0 ? -50 : 5}
                max={element.focalLength < 0 ? -5 : 50}
                step="0.5"
                value={element.focalLength}
                onChange={(e) => onUpdateElement({ focalLength: parseFloat(e.target.value) })}
                className="flex-1 accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <span className="text-xs font-hand text-slate-500">
                {element.focalLength < 0 ? '-5cm' : '50cm'}
              </span>
            </div>

            {/* Quick Focal Presets */}
            <div className="flex items-center gap-2 pt-1 text-sm font-hand">
              <span className="text-slate-600">Quick set:</span>
              {[15, 20, 25, 30].map((val) => {
                const targetF = element.focalLength < 0 ? -val : val;
                return (
                  <button
                    key={val}
                    onClick={() => onUpdateElement({ focalLength: targetF })}
                    className="px-2.5 py-0.5 bg-white hover:bg-slate-100 text-slate-800 rounded font-hand text-sm border border-slate-400 shadow-sm"
                  >
                    {targetF > 0 ? `+${val}` : `-${val}`} cm
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Position on Bench & Aperture Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-1">
          {/* Element X Position Slider */}
          <div className="flex flex-col gap-1.5 bg-[#fdfbf3] border border-slate-300 rounded p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-semibold">Bench Position (X)</span>
              <span className="font-sketch font-bold text-blue-900">{element.x.toFixed(1)} cm</span>
            </div>
            <input
              type="range"
              min="-40"
              max="40"
              step="1"
              value={element.x}
              onChange={(e) => onUpdateElement({ x: parseFloat(e.target.value) })}
              className="accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded"
            />
          </div>

          {/* Aperture Height */}
          <div className="flex flex-col gap-1.5 bg-[#fdfbf3] border border-slate-300 rounded p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-semibold">Physical Aperture Height</span>
              <span className="font-sketch font-bold text-blue-900">{element.height} cm</span>
            </div>
            <input
              type="range"
              min="14"
              max="36"
              step="1"
              value={element.height}
              onChange={(e) => onUpdateElement({ height: parseFloat(e.target.value) })}
              className="accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded"
            />
          </div>
        </div>

        {/* Refractive Index (for Lenses / Prisms) */}
        {(isLens || element.type === 'prism') && (
          <div className="flex flex-wrap items-center justify-between gap-2 bg-[#fdfbf3] border border-slate-300 rounded px-3 py-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-slate-700 font-semibold">Refractive Index (n):</span>
              <span className="font-sketch font-bold text-blue-800">
                {element.refractiveIndex.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {[
                { n: 1.33, label: 'Water (1.33)' },
                { n: 1.52, label: 'Crown Glass (1.52)' },
                { n: 1.66, label: 'Flint Glass (1.66)' },
              ].map((opt) => (
                <button
                  key={opt.n}
                  onClick={() => onUpdateElement({ refractiveIndex: opt.n })}
                  className={`px-2.5 py-0.5 rounded text-xs font-hand border ${
                    Math.abs(element.refractiveIndex - opt.n) < 0.02
                      ? 'bg-blue-100 border-blue-600 text-blue-900 font-bold'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Apex Angle (for Prism) */}
        {element.type === 'prism' && (
          <div className="flex flex-col gap-1.5 bg-[#fdfbf3] border border-slate-300 rounded p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-semibold">Prism Apex Angle (α)</span>
              <span className="font-sketch font-bold text-blue-800">
                {element.prismApexAngle || 60}°
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="30"
                max="90"
                step="5"
                value={element.prismApexAngle || 60}
                onChange={(e) => onUpdateElement({ prismApexAngle: parseFloat(e.target.value) })}
                className="flex-1 accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded"
              />
              <div className="flex items-center gap-1">
                {[45, 60, 75].map((ang) => (
                  <button
                    key={ang}
                    onClick={() => onUpdateElement({ prismApexAngle: ang })}
                    className={`px-2 py-0.5 rounded text-xs font-hand border ${
                      (element.prismApexAngle || 60) === ang
                        ? 'bg-blue-100 border-blue-600 text-blue-900 font-bold'
                        : 'bg-white border-slate-300 text-slate-700'
                    }`}
                  >
                    {ang}°
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. CUSTOMIZABLE TORCH LIGHT SOURCE CONTROLS (Notebook Section 2) */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔦</span>
            <h2 className="text-xl font-bold font-caveat text-slate-900">
              2. Flashlight & Light Ray Controls
            </h2>
          </div>
          <span className="text-sm font-hand font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
            Torch: [{torch.x.toFixed(1)}, {torch.y.toFixed(1)}] cm
          </span>
        </div>

        {/* Ray Mode Selector (Sketched Notebook Tabs) */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-bold text-slate-700">Select How Rays are Drawn:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'principal-rays', label: '3 Principal Rays', desc: 'Candle / Object ray diagram' },
              { id: 'beam', label: 'Torch Cone Beam', desc: 'Adjustable spread angle' },
              { id: 'single-pencil', label: 'Single Laser Pencil', desc: 'One precise central ray' },
              { id: 'parallel-array', label: 'Parallel Laser Array', desc: 'Collimated light beam' },
              { id: 'divergent-fan', label: 'Divergent Fan', desc: 'Spreads out from bulb' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  const patch: Partial<TorchSource> = { rayMode: m.id as RayMode };
                  if (m.id === 'single-pencil') {
                    patch.beamWidth = 0;
                    patch.rayCount = 1;
                  } else if (m.id === 'beam' && torch.beamWidth === 0) {
                    patch.beamWidth = 18;
                    patch.rayCount = 7;
                  } else if (m.id === 'parallel-array') {
                    patch.beamAperture = torch.beamAperture || 6;
                    patch.rayCount = Math.max(5, torch.rayCount);
                  }
                  onUpdateTorch(patch);
                }}
                className={`flex flex-col p-2.5 rounded text-left transition-all sketch-card-sm ${
                  torch.rayMode === m.id
                    ? 'bg-amber-100 text-amber-950 border-amber-700 shadow-[2px_3px_0px_rgba(180,83,9,0.25)]'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                }`}
              >
                <span className="text-base font-bold leading-tight">{m.label}</span>
                <span className="text-xs text-slate-500 font-hand truncate mt-0.5">{m.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Position Sliders (X and Y) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Torch X Slider */}
          <div className="flex flex-col gap-1.5 bg-[#fdfbf3] border border-slate-300 rounded p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-semibold">Torch X Position</span>
              <span className="font-sketch font-bold text-amber-800">{torch.x.toFixed(1)} cm</span>
            </div>
            <input
              type="range"
              min="-65"
              max="65"
              step="0.5"
              value={torch.x}
              onChange={(e) => onUpdateTorch({ x: parseFloat(e.target.value) })}
              className="accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded"
            />
          </div>

          {/* Torch Y Slider */}
          <div className="flex flex-col gap-1.5 bg-[#fdfbf3] border border-slate-300 rounded p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-semibold">Torch Y Height (Object Height)</span>
              <span className="font-sketch font-bold text-amber-800">
                {torch.y > 0 ? `+${torch.y.toFixed(1)}` : torch.y.toFixed(1)} cm
              </span>
            </div>
            <input
              type="range"
              min="-22"
              max="22"
              step="0.5"
              value={torch.y}
              onChange={(e) => onUpdateTorch({ y: parseFloat(e.target.value), objectHeight: parseFloat(e.target.value) })}
              className="accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded"
            />
          </div>
        </div>

        {/* Torch Angle (Tilt) & Beam Width Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Angle Slider */}
          <div className="flex flex-col gap-1.5 bg-[#fdfbf3] border border-slate-300 rounded p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-700 font-semibold flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-amber-700" />
                <span>Tilt Angle (Degrees)</span>
              </span>
              <span className="font-sketch font-bold text-amber-800">{torch.angle}°</span>
            </div>
            <input
              type="range"
              min="-50"
              max="50"
              step="1"
              value={torch.angle}
              onChange={(e) => onUpdateTorch({ angle: parseFloat(e.target.value) })}
              className="accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded"
            />
          </div>

          {/* Beam Width or Parallel Aperture Slider */}
          {torch.rayMode === 'parallel-array' ? (
            <div className="flex flex-col gap-1.5 bg-[#fdfbf3] border border-slate-300 rounded p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700 font-semibold flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-amber-700" />
                  <span>Aperture Width</span>
                </span>
                <span className="font-sketch font-bold text-amber-800">
                  {(torch.beamAperture || 6).toFixed(1)} cm
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="24"
                step="0.5"
                value={torch.beamAperture || 6}
                onChange={(e) => onUpdateTorch({ beamAperture: parseFloat(e.target.value) })}
                className="accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1.5 bg-[#fdfbf3] border border-slate-300 rounded p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-700 font-semibold flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5 text-amber-700" />
                  <span>Cone Spread Angle</span>
                </span>
                <span className="font-sketch font-bold text-amber-800">
                  {torch.beamWidth === 0 ? 'Single (0°)' : `${torch.beamWidth}°`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                step="1"
                value={torch.beamWidth}
                onChange={(e) => {
                  const bw = parseFloat(e.target.value);
                  onUpdateTorch({
                    beamWidth: bw,
                    rayMode: bw === 0 ? 'single-pencil' : torch.rayMode === 'single-pencil' ? 'beam' : torch.rayMode,
                    rayCount: bw === 0 ? 1 : Math.max(3, torch.rayCount),
                  });
                }}
                className="accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded"
              />
            </div>
          )}
        </div>

        {/* Ray Count & Laser Color Spectrum */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#fdfbf3] border border-slate-300 rounded p-3 text-sm">
          {/* Ray Count */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <span className="text-slate-700 font-semibold whitespace-nowrap">Ray Density:</span>
            <input
              type="range"
              min="1"
              max="21"
              step="2"
              value={torch.rayCount}
              onChange={(e) => onUpdateTorch({ rayCount: parseInt(e.target.value, 10) })}
              className="accent-amber-600 cursor-pointer h-2 w-28 bg-slate-200 rounded"
            />
            <span className="font-sketch font-bold text-slate-800 text-xs">{torch.rayCount} rays</span>
          </div>

          {/* Color Scheme (Color Pencils Palette) */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-slate-700 font-semibold text-xs">Pen Ink Color:</span>
            {[
              { id: 'laser-green', color: '#16a34a', name: 'Emerald Green (532nm)' },
              { id: 'laser-red', color: '#dc2626', name: 'Ruby Red (650nm)' },
              { id: 'laser-cyan', color: '#0891b2', name: 'Cyan Blue (488nm)' },
              { id: 'laser-amber', color: '#d97706', name: 'Amber Yellow (589nm)' },
              { id: 'white-dispersive', color: 'linear-gradient(45deg, #ef4444, #eab308, #22c55e, #3b82f6, #a855f7)', name: 'Rainbow Spectrum' },
            ].map((c) => (
              <button
                key={c.id}
                onClick={() => onUpdateTorch({ colorScheme: c.id as WavelengthColor })}
                title={c.name}
                className={`w-6 h-6 rounded-full border-2 transition-all ${
                  torch.colorScheme === c.id
                    ? 'scale-125 border-slate-900 shadow-md ring-2 ring-amber-400'
                    : 'border-slate-300 hover:scale-110 opacity-80 hover:opacity-100'
                }`}
                style={{ background: c.color }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
