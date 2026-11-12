import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { MODULES_REGISTRY, ModuleInfo } from '../data/modulesRegistry';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectModule: (id: string | null) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectModule,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = MODULES_REGISTRY.filter((mod) => {
    const q = query.toLowerCase();
    return (
      mod.title.toLowerCase().includes(q) ||
      mod.subtitle.toLowerCase().includes(q) ||
      mod.description.toLowerCase().includes(q) ||
      mod.features.some((f) => f.toLowerCase().includes(q))
    );
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs"
        />

        {/* Retro Window Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ type: 'spring', stiffness: 450, damping: 30 }}
          className="relative w-full max-w-xl bg-[#FFFDF5] border-3 border-black rounded-xl brutal-shadow-xl overflow-hidden z-10"
        >
          {/* Retro Window Titlebar */}
          <div className="bg-[#FFD166] border-b-2 border-black px-4 py-2 flex items-center justify-between font-mono font-bold text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-400 border border-black inline-block" />
              <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black inline-block" />
              <span className="w-3 h-3 rounded-full bg-green-400 border border-black inline-block" />
              <span className="ml-2 uppercase tracking-wider text-black">Zirna Quick Launcher</span>
            </div>
            <button
              onClick={onClose}
              className="p-0.5 rounded text-black hover:bg-black/10"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Search Input Bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b-2 border-black/15 bg-white">
            <Search className="w-5 h-5 text-black shrink-0 stroke-[2.5]" />
            <input
              autoFocus
              type="text"
              placeholder="Search games, concepts, topics (e.g. fractions, rays, symmetry)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm font-mono text-black placeholder:text-slate-500 focus:outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded text-black hover:bg-black/10"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-block text-[11px] bg-black text-white px-1.5 py-0.5 rounded font-mono">
              ESC
            </kbd>
          </div>

          {/* Results List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1.5">
            <button
              onClick={() => {
                onSelectModule(null);
                onClose();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border-2 border-transparent hover:border-black hover:bg-[#FFF9E6] text-left text-xs transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-[#FFD166] border-2 border-black flex items-center justify-center text-black">
                  <Layers className="w-4 h-4 stroke-[2.5]" />
                </div>
                <div>
                  <div className="font-bold font-sans text-black group-hover:text-black">
                    Main Hub Overview
                  </div>
                  <div className="text-slate-600 text-[11px] font-mono">
                    Return to dashboard and module directory
                  </div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
            </button>

            {filtered.map((mod) => (
              <button
                key={mod.id}
                onClick={() => {
                  onSelectModule(mod.id);
                  onClose();
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border-2 border-transparent hover:border-black hover:bg-[#FFF9E6] text-left text-xs transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-md border-2 border-black flex items-center justify-center font-mono font-black text-xs text-black"
                    style={{
                      backgroundColor: mod.colorScheme.primary,
                    }}
                  >
                    {mod.number}
                  </div>
                  <div>
                    <div className="font-bold font-sans text-black flex items-center gap-2">
                      <span>{mod.title}</span>
                      <span className="text-[10px] font-mono text-slate-600 font-normal">
                        ({mod.grade})
                      </span>
                    </div>
                    <div className="text-slate-600 text-[11px] font-mono">
                      {mod.subtitle}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono font-bold bg-black text-white px-1.5 py-0.5 rounded-xs">
                    Key [{mod.shortcut}]
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-black group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="py-8 text-center text-slate-600 font-mono text-xs">
                No workshops match "{query}". Try searching "fraction", "abacus", or "optics".
              </div>
            )}
          </div>

          {/* Footer Guide */}
          <div className="px-4 py-2 bg-[#F5F5F0] border-t-2 border-black/15 flex items-center justify-between text-[11px] text-slate-700 font-mono font-bold">
            <span>Tip: Press 1-7 anywhere to jump directly</span>
            <span>STEM Studio v1.0</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
