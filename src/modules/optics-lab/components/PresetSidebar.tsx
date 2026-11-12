/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { OpticalPreset } from '../types/optics';
import { OPTICAL_PRESETS } from '../data/presets';
import { BookOpen, Search, ArrowRight, Check } from 'lucide-react';

interface PresetSidebarProps {
  currentPresetId: string | null;
  onSelectPreset: (preset: OpticalPreset) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const PresetSidebar: React.FC<PresetSidebarProps> = ({
  currentPresetId,
  onSelectPreset,
  isOpen,
  onToggle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Lenses', 'Mirrors', 'Prisms & Dispersion'];

  const filteredPresets = OPTICAL_PRESETS.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesQuery =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.keyLearning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <aside
      className={`flex flex-col bg-[#faf6eb] border-l-2 border-slate-700/80 transition-all duration-300 z-30 shrink-0 font-hand ${
        isOpen ? 'w-80 sm:w-88' : 'w-0 overflow-hidden border-none'
      }`}
    >
      {/* Sidebar Header (Notebook Index Tab) */}
      <div className="flex items-center justify-between p-4 border-b-2 border-slate-700/60 bg-[#f4eee0]">
        <div className="flex items-center gap-2">
          <span className="text-xl">📑</span>
          <h2 className="text-xl font-bold font-caveat text-slate-900 tracking-wide">
            Lab Experiment Library
          </h2>
        </div>
        <span className="text-xs font-hand text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-300">
          {OPTICAL_PRESETS.length} Setups
        </span>
      </div>

      {/* Search Input (Notebook ruled search box) */}
      <div className="p-3 border-b border-slate-300 bg-[#fbf8ee]">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-slate-400 rounded pl-9 pr-3 py-1.5 text-sm font-hand text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-600 shadow-inner"
          />
        </div>

        {/* Category Tabs (Like sticky notebook page tabs) */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-0.5 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs font-hand font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-yellow-200 text-slate-900 border border-amber-500 shadow-[1px_2px_0px_rgba(180,83,9,0.25)]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Preset List (Notebook index cards) */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredPresets.map((preset) => {
          const isSelected = currentPresetId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`cursor-pointer group rounded p-3 transition-all ${
                isSelected
                  ? 'bg-amber-100 border-2 border-amber-600 shadow-[2px_3px_0px_rgba(180,83,9,0.25)]'
                  : 'bg-white hover:bg-[#fffdf7] border-2 border-slate-300 hover:border-slate-500 shadow-[2px_2px_0px_rgba(51,65,85,0.1)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="text-base font-bold font-caveat text-slate-900 group-hover:text-blue-900 transition-colors leading-tight">
                  {preset.title}
                </h3>
                {isSelected ? (
                  <span className="flex items-center gap-0.5 text-xs font-hand font-bold text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded border border-amber-400">
                    <Check className="w-3 h-3" />
                    Loaded
                  </span>
                ) : (
                  <span className="text-xs font-hand text-slate-500">
                    {preset.category}
                  </span>
                )}
              </div>

              <p className="text-xs font-hand text-slate-600 line-clamp-2 leading-relaxed mb-2">
                {preset.description}
              </p>

              {/* Clean metadata strip */}
              <div className="flex items-center justify-between text-xs font-hand text-slate-600 pt-1.5 border-t border-slate-200">
                <span className="font-sketch font-bold text-blue-900">
                  f = {preset.element.type === 'plane-mirror' ? '∞' : `${preset.element.focalLength}cm`}
                </span>
                <span className="text-amber-800 font-bold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  Load Notebook Setup <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}

        {filteredPresets.length === 0 && (
          <div className="text-center py-8 text-sm text-slate-500 font-hand">
            No experiments found matching your filter.
          </div>
        )}
      </div>

      {/* Preset Footer Student Tip (Yellow sticky note) */}
      <div className="p-3 border-t-2 border-slate-300 bg-[#fefce8] text-xs text-amber-950 font-hand">
        <div className="flex items-center gap-1.5 font-bold font-caveat text-base text-amber-900 mb-0.5">
          <span>💡</span>
          <span>Student Tip</span>
        </div>
        <p className="leading-snug text-slate-700">
          Try grabbing the blue focal diamond marker directly on the optical axis to observe real vs virtual image flipping in real time!
        </p>
      </div>
    </aside>
  );
};
