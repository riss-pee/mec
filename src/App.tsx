import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Hub } from './Hub';
import { NavigationDock } from './components/NavigationDock';
import { ModuleWrapper } from './components/ModuleWrapper';
import { CommandPalette } from './components/CommandPalette';
import { MODULES_REGISTRY, ModuleInfo } from './data/modulesRegistry';
import { toast } from 'sonner';

// Lazy load each module for optimal performance
const FractionZirnaApp = lazy(() => import('./modules/fraction-zirna/App'));
const FractionGridApp = lazy(() => import('./modules/fraction-grid/App'));
const SymmetryApp = lazy(() => import('./modules/symmetry-match/App'));
const AbacusApp = lazy(() => import('./modules/abacus-math/App'));
const CoordinateDefenseApp = lazy(() => import('./modules/coordinate-defense/App'));
const OpticsLabApp = lazy(() => import('./modules/optics-lab/App'));
const NumberLineCruiserApp = lazy(() => import('./modules/number-line-cruiser/App'));

const MODULE_COMPONENTS: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {
  'fraction-zirna': FractionZirnaApp,
  'fraction-grid': FractionGridApp,
  'symmetry-match': SymmetryApp,
  'abacus-math': AbacusApp,
  'coordinate-defense': CoordinateDefenseApp,
  'optics-lab': OpticsLabApp,
  'number-line-cruiser': NumberLineCruiserApp,
};

export default function App() {
  const [activeModuleId, setActiveModuleId] = useState<string | null>(() => {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && MODULES_REGISTRY.some((m) => m.id === hash)) {
      return hash;
    }
    return null;
  });

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Sync hash with activeModuleId
  useEffect(() => {
    if (activeModuleId) {
      window.location.hash = activeModuleId;
    } else {
      history.pushState('', document.title, window.location.pathname + window.location.search);
    }
  }, [activeModuleId]);

  // Listen for hash changes (e.g. browser back/forward buttons)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && MODULES_REGISTRY.some((m) => m.id === hash)) {
        setActiveModuleId(hash);
      } else {
        setActiveModuleId(null);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is actively typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Escape key returns to Hub
      if (e.key === 'Escape') {
        if (activeModuleId !== null) {
          setActiveModuleId(null);
          toast.info('Returned to Hub Overview');
        }
        return;
      }

      // Number keys 1-7 jump directly to modules
      if (['1', '2', '3', '4', '5', '6', '7'].includes(e.key) && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const found = MODULES_REGISTRY.find((m) => m.shortcut === e.key);
        if (found) {
          setActiveModuleId(found.id);
          toast.success(`Launched ${found.title}`);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModuleId]);

  const activeModule = MODULES_REGISTRY.find((m) => m.id === activeModuleId) || null;
  const ActiveComponent = activeModuleId ? MODULE_COMPONENTS[activeModuleId] : null;

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-slate-900 flex flex-col font-sans selection:bg-[#FFD166] selection:text-black">
      <AnimatePresence mode="wait">
        {activeModuleId && activeModule && ActiveComponent ? (
          <motion.div
            key={activeModuleId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="flex-1 flex flex-col"
          >
            <ModuleWrapper
              module={activeModule}
              onBackToHub={() => setActiveModuleId(null)}
              onSwitchModule={(id) => setActiveModuleId(id)}
            >
              <Suspense
                fallback={
                  <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-3 border-black border-t-[#FFD166] rounded-full animate-spin" />
                      <div className="text-xs font-mono font-bold text-black">Opening {activeModule.title}...</div>
                    </div>
                  </div>
                }
              >
                <ActiveComponent />
              </Suspense>
            </ModuleWrapper>
          </motion.div>
        ) : (
          <motion.div
            key="hub"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="flex-1"
          >
            <Hub
              onSelectModule={(id) => setActiveModuleId(id)}
              onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Retro Tactical Navigation Dock */}
      <NavigationDock
        activeModule={activeModuleId}
        onSelectModule={(id) => setActiveModuleId(id)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectModule={(id) => setActiveModuleId(id)}
      />
    </div>
  );
}
