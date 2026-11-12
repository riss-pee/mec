/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { OpticalElement, TorchSource, OpticalPreset } from './types/optics';
import { OPTICAL_PRESETS } from './data/presets';
import { Header } from './components/Header';
import { OpticsCanvas } from './components/OpticsCanvas';
import { ControlsPanel } from './components/ControlsPanel';
import { PresetSidebar } from './components/PresetSidebar';
import { PhysicsDeck } from './components/PhysicsDeck';
import { BookOpen, HelpCircle } from 'lucide-react';

const DEFAULT_ELEMENT: OpticalElement = {
  id: 'element-main',
  type: 'convex-lens',
  name: 'Biconvex Converging Lens',
  x: 0,
  focalLength: 20,
  height: 24,
  refractiveIndex: 1.52,
};

const DEFAULT_TORCH: TorchSource = {
  x: -45,
  y: 10,
  angle: 0,
  beamWidth: 16,
  beamAperture: 6,
  rayCount: 7,
  intensity: 100,
  rayMode: 'principal-rays',
  colorScheme: 'laser-green',
  objectHeight: 10,
};

export default function App() {
  const [element, setElement] = useState<OpticalElement>(DEFAULT_ELEMENT);
  const [torch, setTorch] = useState<TorchSource>(DEFAULT_TORCH);
  const [currentPresetId, setCurrentPresetId] = useState<string | null>(OPTICAL_PRESETS[0].id);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'simulator' | 'theory' | 'challenges'>('simulator');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleUpdateElement = (patch: Partial<OpticalElement>) => {
    setElement((prev) => ({ ...prev, ...patch }));
    setCurrentPresetId(null);
  };

  const handleUpdateTorch = (patch: Partial<TorchSource>) => {
    setTorch((prev) => ({ ...prev, ...patch }));
    setCurrentPresetId(null);
  };

  const handleSelectPreset = (preset: OpticalPreset) => {
    setElement({ ...preset.element });
    setTorch((prev) => ({ ...prev, ...preset.torch }));
    setCurrentPresetId(preset.id);
    showToast(`Loaded: ${preset.title}`);
  };

  const handleReset = () => {
    setElement(DEFAULT_ELEMENT);
    setTorch(DEFAULT_TORCH);
    setCurrentPresetId(OPTICAL_PRESETS[0].id);
    showToast('Clean notebook page ready!');
  };

  const handleSnapshot = () => {
    const info = `Physics Lab Notebook Setup:\n- Element: ${element.name} (f = ${element.focalLength} cm)\n- Light Source: Torch at [${torch.x}, ${torch.y}] cm, angle = ${torch.angle}°\n- Ray Mode: ${torch.rayMode}\nTimestamp: ${new Date().toLocaleTimeString()}`;
    navigator.clipboard?.writeText(info).then(() => {
      showToast('Lab notes copied to clipboard! 📋');
    }).catch(() => {
      showToast('Ready to print or save notes');
    });
  };

  const handleChallengeApply = (elemPatch: Partial<OpticalElement>, torchPatch: Partial<TorchSource>) => {
    setElement((prev) => ({ ...prev, ...elemPatch }));
    setTorch((prev) => ({ ...prev, ...torchPatch }));
    setCurrentPresetId(null);
    showToast('Lab exercise setup ready on bench!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f3eddf] text-slate-800 font-hand selection:bg-yellow-200 selection:text-slate-900">
      {/* Notebook Top Bar */}
      <Header
        onReset={handleReset}
        onSnapshot={handleSnapshot}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Toast Notification Alert (Styled like a yellow sticky note) */}
      {toastMessage && (
        <div className="fixed top-16 right-6 z-50 bg-[#fef08a] border-2 border-[#ca8a04] text-amber-950 font-bold px-4 py-2.5 rounded shadow-[3px_4px_0px_rgba(202,138,4,0.3)] text-sm flex items-center gap-2 transition-all">
          <span className="text-base">📌</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Sandbox Container with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Main Workspace Stage */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 flex flex-col gap-5 max-w-[1600px] w-full mx-auto">
          {/* Subheader Context Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 font-caveat text-xl">Lab Worksheet: Geometric Optics</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-slate-600">Thin Lens Equation & Law of Reflection</span>
              <span aria-hidden="true" className="text-slate-400">·</span>
              <span className="text-blue-800 font-bold bg-blue-100 px-2 py-0.5 rounded border border-blue-300 text-xs">
                Interactive Drawing
              </span>
            </div>

            {/* Sidebar Toggle & Quick Guide */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-bold transition-all sketch-card-sm ${
                  isSidebarOpen
                    ? 'bg-amber-100 text-amber-950 border-amber-600 shadow-[2px_3px_0px_rgba(180,83,9,0.25)]'
                    : 'bg-white text-slate-700 hover:text-slate-900 border-slate-400'
                }`}
              >
                <BookOpen className="w-4 h-4 text-amber-800" />
                <span>{isSidebarOpen ? 'Hide Experiment Library' : 'Open Experiment Library'}</span>
              </button>
            </div>
          </div>

          {/* PRIMARY OPTICAL BENCH CANVAS */}
          <section id="bench" aria-label="Optical Canvas Bench">
            <OpticsCanvas
              element={element}
              torch={torch}
              onUpdateElement={handleUpdateElement}
              onUpdateTorch={handleUpdateTorch}
            />
          </section>

          {/* TWO-ZONE CONTROL & CONCEPT DECK */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column: Interactive Controls for Torch, Lenses & Mirrors */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <ControlsPanel
                element={element}
                torch={torch}
                onUpdateElement={handleUpdateElement}
                onUpdateTorch={handleUpdateTorch}
              />
            </div>

            {/* Right Column: Physics Formulas, Solvers & Student Challenges */}
            <div className="lg:col-span-5 flex flex-col gap-5">
              <PhysicsDeck
                element={element}
                torch={torch}
                onApplyChallengeSetup={handleChallengeApply}
              />

              {/* Student Friendly Quick Help Guide (Styled like a handwritten sticky note) */}
              <div className="bg-[#fefce8] border-2 border-[#ca8a04] rounded-lg p-4 text-sm text-slate-800 shadow-[3px_4px_0px_rgba(202,138,4,0.2)] space-y-2 font-hand">
                <div className="flex items-center gap-2 text-amber-900 font-bold font-caveat text-lg">
                  <span className="text-xl">💡</span>
                  <span>Student Lab Tips (How to Play)</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 leading-relaxed">
                  <li>
                    <strong className="text-slate-900 font-bold">🔦 Drag the Flashlight:</strong> Grab the yellow flashlight body with your mouse to move it around, or drag the little amber dial to tilt the light ray.
                  </li>
                  <li>
                    <strong className="text-slate-900 font-bold">🔍 Move the Focal Point:</strong> Drag the blue diamond markers (F₁, F₂) along the axis line or type any focal length you want.
                  </li>
                  <li>
                    <strong className="text-slate-900 font-bold">🕯️ Candle & Image:</strong> In "3 Principal Rays" mode, watch how the candle rays pass through the lens to form real inverted images or virtual upright magnifying images!
                  </li>
                  <li>
                    <strong className="text-slate-900 font-bold">📏 School Caliper:</strong> Click the "Ruler Caliper" button above to measure distances anywhere on the paper.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>

        {/* SIDEBAR: PRESET OPTICAL ELEMENT LIBRARY */}
        <PresetSidebar
          currentPresetId={currentPresetId}
          onSelectPreset={handleSelectPreset}
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>
    </div>
  );
}
