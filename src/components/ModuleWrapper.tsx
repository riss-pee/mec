import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  ChevronDown, 
  Volume2, 
  VolumeX, 
  Maximize2, 
  Minimize2,
  Layers,
  Sparkles,
  Users
} from 'lucide-react';
import { MODULES_REGISTRY, ModuleInfo } from '../data/modulesRegistry';
import { LegalViewId } from '../types/legal';
import { SiteFooter } from './common/SiteFooter';
import { TeamScoreStrip } from '../features/multiplayer/components/TeamScoreStrip';
import { FractionTeamChallenge } from '../features/multiplayer/modules/FractionTeamChallenge';
import { CollaborativeGridChallenge } from '../features/multiplayer/modules/CollaborativeGridChallenge';
import { TeamSymmetryChallenge } from '../features/multiplayer/modules/TeamSymmetryChallenge';
import { AbacusRelayChallenge } from '../features/multiplayer/modules/AbacusRelayChallenge';
import { CoordinateDefenseChallenge } from '../features/multiplayer/modules/CoordinateDefenseChallenge';
import { OpticsPredictionChallenge } from '../features/multiplayer/modules/OpticsPredictionChallenge';
import { NumberLineRaceChallenge } from '../features/multiplayer/modules/NumberLineRaceChallenge';
import { toast } from 'sonner';

interface ModuleWrapperProps {
  module: ModuleInfo;
  onBackToHub: () => void;
  onSwitchModule: (id: string) => void;
  onNavigateLegal?: (id: LegalViewId) => void;
  onOpenStoragePreferences?: () => void;
  children: React.ReactNode;
}

export const ModuleWrapper: React.FC<ModuleWrapperProps> = ({
  module,
  onBackToHub,
  onSwitchModule,
  onNavigateLegal = () => {},
  onOpenStoragePreferences = () => {},
  children,
}) => {
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTeamMode, setIsTeamMode] = useState(true); // Default to team mode active for classroom discovery

  const toggleSound = () => {
    setIsMuted(!isMuted);
    toast.info(!isMuted ? 'Audio muted across modules' : 'Audio unmuted');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
      toast.success('Entered fullscreen view');
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
      toast.info('Exited fullscreen view');
    }
  };

  const getChallengeMetadata = () => {
    switch (module.id) {
      case 'fraction-zirna':
        return {
          title: 'Classroom Pizza Relay',
          target: 'Divide 1 whole pizza equally among 4 students (1/4 each)',
          component: <FractionTeamChallenge />,
        };
      case 'fraction-grid':
        return {
          title: 'Collaborative Grid Shading',
          target: 'Shade exactly 75% (15/20 cells) on the shared grid',
          component: <CollaborativeGridChallenge />,
        };
      case 'symmetry-match':
        return {
          title: 'Team Symmetry Reflection',
          target: 'Reflect partner pattern across central vertical mirror axis',
          component: <TeamSymmetryChallenge />,
        };
      case 'abacus-math':
        return {
          title: 'Soroban Arithmetic Relay',
          target: 'Solve 348 + 275 step-by-step on beads (Sum = 623)',
          component: <AbacusRelayChallenge />,
        };
      case 'coordinate-defense':
        return {
          title: 'Quadrant II Artillery Mission',
          target: 'Lock and discharge defense vector at (-4, +6)',
          component: <CoordinateDefenseChallenge />,
        };
      case 'optics-lab':
        return {
          title: 'Scientific Optics Prediction',
          target: 'Predict real inverted image distance v for 2f object distance',
          component: <OpticsPredictionChallenge />,
        };
      case 'number-line-cruiser':
        return {
          title: 'Signed Integer Team Race',
          target: 'Navigate cruiser vehicle: -3 + 8 - 4 = +1 milestone',
          component: <NumberLineRaceChallenge />,
        };
      default:
        return {
          title: 'Classroom STEM Mission',
          target: 'Complete module challenge with team members',
          component: null,
        };
    }
  };

  const challengeData = getChallengeMetadata();

  return (
    <div className="min-h-screen flex flex-col bg-[#F5F5F0] text-slate-900 relative">
      {/* Retro Persistent Header Bar */}
      <header className="sticky top-0 z-40 h-14 bg-[#FFFDF5] border-b-3 border-black px-4 flex items-center justify-between select-none shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToHub}
            className="retro-btn flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white hover:bg-[#FFF9E6] border-2 border-black text-xs font-mono font-bold text-black shadow-[2px_2px_0px_#000] cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Hub Overview</span>
            <kbd className="hidden sm:inline-block ml-1 text-[10px] bg-black text-white px-1.5 py-0.5 rounded font-mono">
              Esc
            </kbd>
          </button>

          <div className="h-5 w-0.5 bg-black/20 mx-1 hidden sm:block" />

          {/* Module Title & Switcher dropdown trigger */}
          <div className="relative">
            <button
              onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-md hover:bg-black/5 transition-colors text-left border border-transparent hover:border-black/30 cursor-pointer"
            >
              <span className="text-xs font-mono font-black bg-black text-white px-2 py-0.5 rounded-xs">
                MOD {module.number}
              </span>
              <span className="text-sm font-black text-black tracking-tight font-sans">
                {module.title}
              </span>
              <ChevronDown className={`w-4 h-4 text-black transition-transform duration-200 ${isSwitcherOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Quick Switcher Dropdown */}
            <AnimatePresence>
              {isSwitcherOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsSwitcherOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    className="absolute top-full left-0 mt-2 w-80 rounded-xl bg-[#FFFDF5] border-3 border-black p-2 brutal-shadow-lg z-40"
                  >
                    <div className="text-[11px] font-mono font-black uppercase tracking-wider text-black bg-[#FFD166] px-2 py-1.5 rounded-md border border-black flex items-center justify-between mb-2">
                      <span>Switch Workshop</span>
                      <Layers className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-1 max-h-80 overflow-y-auto">
                      {MODULES_REGISTRY.map((m) => {
                        const isCurrent = m.id === module.id;
                        return (
                          <button
                            key={m.id}
                            onClick={() => {
                              onSwitchModule(m.id);
                              setIsSwitcherOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-left transition-all text-xs font-mono cursor-pointer ${
                              isCurrent
                                ? 'bg-black text-white font-bold shadow-[2px_2px_0px_#000]'
                                : 'text-slate-800 hover:bg-[#FFF9E6] hover:text-black border border-transparent hover:border-black'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className={`font-mono text-[10px] px-1 py-0.2 rounded-xs font-bold ${isCurrent ? 'bg-white text-black' : 'bg-slate-200 text-slate-800'}`}>
                                {m.number}
                              </span>
                              <span className="font-sans font-bold">{m.title}</span>
                            </div>
                            <span className="text-[10px] font-mono">
                              [{m.shortcut}]
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right actions: Audio, Fullscreen & Mode Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsTeamMode(!isTeamMode)}
            className={`retro-btn px-2.5 py-1.5 rounded-md border-2 border-black font-mono font-bold text-xs shadow-[2px_2px_0px_#000] flex items-center gap-1.5 cursor-pointer ${
              isTeamMode ? 'bg-[#FFD166] text-black' : 'bg-white text-slate-700 hover:text-black'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isTeamMode ? 'Classroom Mode' : 'Solo Mode'}</span>
          </button>

          <button
            onClick={toggleSound}
            className="retro-btn p-1.5 rounded-md bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000] cursor-pointer"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-600 stroke-[2.5]" /> : <Volume2 className="w-4 h-4 stroke-[2.5]" />}
          </button>

          <button
            onClick={toggleFullscreen}
            className="retro-btn p-1.5 rounded-md bg-white border-2 border-black text-black shadow-[2px_2px_0px_#000] cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 stroke-[2.5]" /> : <Maximize2 className="w-4 h-4 stroke-[2.5]" />}
          </button>
        </div>
      </header>

      {/* Persistent Team Score Strip */}
      <TeamScoreStrip
        moduleId={module.id}
        moduleTitle={module.title}
        challengeTitle={challengeData.title}
        targetGoal={challengeData.target}
        isSolo={!isTeamMode}
        onToggleMode={() => setIsTeamMode(!isTeamMode)}
      />

      {/* Module Content Area */}
      <main className="flex-1 relative pb-12">
        {/* Collaborative Challenge Live Overlay when in Team Mode */}
        {isTeamMode && challengeData.component && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
            {challengeData.component}
          </div>
        )}

        {/* Existing Interactive Module Sandbox */}
        <div className="relative">
          {children}
        </div>
      </main>

      {/* Comprehensive Site Footer for all modules */}
      <SiteFooter
        onSelectModule={onSwitchModule}
        onNavigateLegal={onNavigateLegal}
        onOpenStoragePreferences={onOpenStoragePreferences}
      />
    </div>
  );
};
