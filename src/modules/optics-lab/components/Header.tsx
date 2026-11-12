/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { RotateCcw, Camera, Sparkles, BookOpen } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  onSnapshot: () => void;
  activeTab: 'simulator' | 'theory' | 'challenges';
  setActiveTab: (tab: 'simulator' | 'theory' | 'challenges') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onReset,
  onSnapshot,
  activeTab,
  setActiveTab,
}) => {
  return (
    <header className="relative flex items-center justify-between gap-6 px-5 py-3 border-b-2 border-slate-700/70 bg-[#faf6ec] shadow-sm sticky top-0 z-40 shrink-0">
      {/* Notebook Spiral Binding Holes along the top */}
      <div className="absolute top-0 left-0 right-0 h-1.5 flex justify-evenly pointer-events-none overflow-hidden">
        {Array.from({ length: 28 }).map((_, i) => (
          <div key={i} className="w-3 h-1.5 bg-[#475569]/30 rounded-b-full mx-1" />
        ))}
      </div>

      {/* Zone 1: Brand Wordmark (Handwritten Notebook Title) */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="#bench" className="flex items-center gap-2 group">
          <span className="text-2xl select-none">📓</span>
          <div>
            <div className="text-2xl font-bold font-caveat tracking-tight text-slate-900 whitespace-nowrap leading-none group-hover:text-blue-800 transition-colors">
              Physics Lab Notebook
            </div>
            <div className="text-xs font-hand text-slate-500 tracking-wider">
              Experiment 04 · Geometric Optics & Ray Tracing
            </div>
          </div>
        </a>
      </div>

      {/* Zone 2: Single-line Navigation Links (Notebook Sticky Tabs) */}
      <nav className="hidden md:flex items-center gap-5 text-base font-hand font-medium text-slate-700">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`transition-all whitespace-nowrap shrink-0 px-2.5 py-1 rounded relative ${
            activeTab === 'simulator'
              ? 'text-blue-900 font-bold bg-yellow-200/80 shadow-[1px_2px_0px_rgba(51,65,85,0.2)]'
              : 'hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>✏️ Optical Bench</span>
        </button>
        <button
          onClick={() => setActiveTab('theory')}
          className={`transition-all whitespace-nowrap shrink-0 px-2.5 py-1 rounded relative ${
            activeTab === 'theory'
              ? 'text-blue-900 font-bold bg-yellow-200/80 shadow-[1px_2px_0px_rgba(51,65,85,0.2)]'
              : 'hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>📐 Formulas & Laws</span>
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`transition-all whitespace-nowrap shrink-0 px-2.5 py-1 rounded relative ${
            activeTab === 'challenges'
              ? 'text-blue-900 font-bold bg-yellow-200/80 shadow-[1px_2px_0px_rgba(51,65,85,0.2)]'
              : 'hover:text-slate-900 hover:bg-slate-200/60'
          }`}
        >
          <span>⭐ Lab Challenges</span>
        </button>
      </nav>

      {/* Zone 3: Primary Action & Export */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onSnapshot}
          title="Save optical bench screenshot & notes"
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-hand font-semibold text-slate-800 bg-[#fffdfa] hover:bg-white sketch-button whitespace-nowrap"
        >
          <Camera className="w-4 h-4 text-slate-700" />
          <span>Copy Notes</span>
        </button>
        <button
          onClick={onReset}
          title="Reset experiment to default clean state"
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-hand font-bold text-white bg-amber-600 hover:bg-amber-500 sketch-button whitespace-nowrap"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Page</span>
        </button>
      </div>
    </header>
  );
};
