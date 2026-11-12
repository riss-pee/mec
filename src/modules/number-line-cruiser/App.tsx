/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { FacingDirection, MotionType, VehicleModel, MoveStep } from './types';
import { MISSIONS } from './data/missions';
import { sound } from './utils/sound';
import { triggerConfetti } from './utils/confetti';
import { NumberLineRoad } from './components/NumberLineRoad';
import { ControlsDeck } from './components/ControlsDeck';
import { MissionsPanel } from './components/MissionsPanel';
import { ClassroomRulesCard } from './components/ClassroomRulesCard';
import { VEHICLE_OPTIONS } from './components/CarGraphic';
import {
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Car,
  Compass,
  GraduationCap,
  Sparkles,
} from 'lucide-react';

export default function App() {
  // Navigation tab
  const [activeTab, setActiveTab] = useState<'sandbox' | 'missions' | 'classroom'>('sandbox');

  // Car State
  const [currentPos, setCurrentPos] = useState<number>(0);
  const [facing, setFacing] = useState<FacingDirection>(1); // +1 = Forward / +ve, -1 = Rear / -ve
  const [motion, setMotion] = useState<MotionType>('forward'); // 'forward' = Addition +, 'backward' = Subtraction -
  const [stepCount, setStepCount] = useState<number>(3);
  const [vehicleModel, setVehicleModel] = useState<VehicleModel>('red_rocket');

  // Animation & Audio State
  const [isDriving, setIsDriving] = useState<boolean>(false);
  const [isReversing, setIsReversing] = useState<boolean>(false);
  const [isTurning, setIsTurning] = useState<boolean>(false);
  const [stepByStep, setStepByStep] = useState<boolean>(true);
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  // Range Configuration: Fits -10 to +10 natively in 1 window
  const [rangeMode, setRangeMode] = useState<number>(10);
  const minRange = -rangeMode;
  const maxRange = rangeMode;

  // Missions State
  const [currentMissionIndex, setCurrentMissionIndex] = useState<number>(0);
  const [completedMissionIds, setCompletedMissionIds] = useState<number[]>([]);
  const [celebrationBanner, setCelebrationBanner] = useState<{ title: string; subtitle: string } | null>(null);

  // Teacher Custom Goals & Position in Mission Mode
  const [customTargetPos, setCustomTargetPos] = useState<number | null>(null);

  // Move Arc & History
  const [lastMoveArc, setLastMoveArc] = useState<{ start: number; end: number; delta: number } | null>(null);
  const [history, setHistory] = useState<MoveStep[]>([]);

  // Active Target Position for Missions
  const targetPos =
    activeTab === 'missions'
      ? customTargetPos !== null
        ? customTargetPos
        : MISSIONS[currentMissionIndex].targetPos
      : null;

  // Modal for Vehicle Customization
  const [showVehiclePicker, setShowVehiclePicker] = useState<boolean>(false);

  // Sound ref lock
  const drivingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (drivingIntervalRef.current) {
        clearInterval(drivingIntervalRef.current);
      }
    };
  }, []);

  const setupMission = (index: number) => {
    const mission = MISSIONS[index];
    setCurrentMissionIndex(index);
    setCustomTargetPos(null); // Reset custom override on preset mission switch
    setCurrentPos(mission.startPos);
    setFacing(mission.initialDirection);
    if (mission.suggestedSteps) {
      setStepCount(mission.suggestedSteps);
    }
    setLastMoveArc(null);
  };

  const handleTabChange = (tab: 'sandbox' | 'missions' | 'classroom') => {
    sound.playClick();
    setActiveTab(tab);
    if (tab === 'missions') {
      setupMission(currentMissionIndex);
    }
  };

  // Turn car orientation
  const handleFacingChange = (newFacing: FacingDirection) => {
    if (isDriving || facing === newFacing) return;
    sound.playTurn();
    setIsTurning(true);
    setFacing(newFacing);
    setTimeout(() => setIsTurning(false), 250);
  };

  // Motion selection (Drive Forward vs Drive Backward)
  const handleMotionChange = (newMotion: MotionType) => {
    if (isDriving) return;
    sound.playClick();
    setMotion(newMotion);
  };

  // Step count change
  const handleStepCountChange = (count: number) => {
    if (isDriving) return;
    sound.playClick();
    setStepCount(Math.max(1, Math.min(10, count)));
  };

  // Toggle Sound
  const handleToggleSound = () => {
    const muted = sound.toggleMute();
    setSoundMuted(muted);
    if (!muted) sound.playHonk();
  };

  // Toggle Fullscreen
  const handleToggleFullscreen = () => {
    sound.playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Honk Horn
  const handleHonk = () => {
    sound.playHonk();
  };

  // Reset to 0 (Origin)
  const handleReset = () => {
    if (isDriving) return;
    sound.playClick();
    setCurrentPos(0);
    setLastMoveArc(null);
  };

  // Coordinate click on number line
  const handleSelectCoordinate = (coord: number) => {
    if (isDriving) return;
    sound.playClick();
    setCurrentPos(coord);
  };

  // Teacher handlers for setting custom target goal or starting vehicle coordinate
  const handleUpdateTargetPos = (newTarget: number) => {
    sound.playClick();
    setCustomTargetPos(newTarget);
    if (Math.abs(newTarget) > rangeMode) {
      setRangeMode(15);
    }
  };

  const handleUpdateVehiclePos = (newPos: number) => {
    sound.playClick();
    setCurrentPos(newPos);
    setLastMoveArc(null);
    if (Math.abs(newPos) > rangeMode) {
      setRangeMode(15);
    }
  };

  // Primary Drive Action Handler
  const handleDrive = () => {
    if (isDriving) return;

    const start = currentPos;
    const motionSign = motion === 'forward' ? 1 : -1;
    const netDelta = facing * motionSign * stepCount;
    const destination = start + netDelta;

    if (Math.abs(destination) > rangeMode) {
      if (Math.abs(destination) <= 15) {
        setRangeMode(15);
      } else {
        setRangeMode(20);
      }
    }

    setIsDriving(true);
    setIsReversing(motion === 'backward');

    let equation = '';
    let explanation = '';
    if (facing === 1) {
      if (motion === 'forward') {
        equation = `${start} + (+${stepCount}) = ${destination}`;
        explanation = 'Facing Forward (+) & Driving Forward (+)';
      } else {
        equation = `${start} - (+${stepCount}) = ${destination}`;
        explanation = 'Facing Forward (+) & Driving Backward (−)';
      }
    } else {
      if (motion === 'forward') {
        equation = `${start} + (-${stepCount}) = ${destination}`;
        explanation = 'Facing Rear (−) & Driving Forward (+)';
      } else {
        equation = `${start} - (-${stepCount}) = ${start} + ${stepCount} = ${destination}`;
        explanation = 'Facing Rear (−) & Driving Backward (−) [Double Negative!]';
      }
    }

    if (stepByStep) {
      const unitStep = netDelta > 0 ? 1 : -1;
      let currentStepVal = start;
      const totalUnits = Math.abs(netDelta);
      let stepsTaken = 0;

      if (motion === 'backward') {
        sound.playReverseBeep();
      } else {
        sound.playEngineRev();
      }

      drivingIntervalRef.current = setInterval(() => {
        if (stepsTaken < totalUnits) {
          currentStepVal += unitStep;
          stepsTaken++;
          setCurrentPos(currentStepVal);
          sound.playStepTick(currentStepVal);
          if (motion === 'backward' && stepsTaken % 2 === 0) {
            sound.playReverseBeep();
          }
        } else {
          if (drivingIntervalRef.current) {
            clearInterval(drivingIntervalRef.current);
            drivingIntervalRef.current = null;
          }
          finishDrive(start, destination, netDelta, equation, explanation);
        }
      }, 250);
    } else {
      sound.playEngineRev();
      setCurrentPos(destination);
      setTimeout(() => {
        finishDrive(start, destination, netDelta, equation, explanation);
      }, 300);
    }
  };

  const finishDrive = (
    start: number,
    destination: number,
    netDelta: number,
    equation: string,
    explanation: string
  ) => {
    setIsDriving(false);
    setIsReversing(false);

    setLastMoveArc({
      start,
      end: destination,
      delta: netDelta,
    });

    const newStep: MoveStep = {
      id: `${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      startPos: start,
      direction: facing,
      motion,
      stepCount,
      netDelta,
      endPos: destination,
      equation,
      ruleExplanation: explanation,
    };
    setHistory((prev) => [newStep, ...prev.slice(0, 19)]);

    if (activeTab === 'missions') {
      const mission = MISSIONS[currentMissionIndex];
      const activeGoal = customTargetPos !== null ? customTargetPos : mission.targetPos;

      if (destination === activeGoal) {
        sound.playSuccess();
        triggerConfetti();

        if (customTargetPos === null && !completedMissionIds.includes(mission.id)) {
          setCompletedMissionIds((prev) => [...prev, mission.id]);
        }

        setCelebrationBanner({
          title: `Goal Reached! 🎉`,
          subtitle: `Destination ${destination > 0 ? `+${destination}` : destination} reached! Great job!`,
        });

        setTimeout(() => {
          setCelebrationBanner(null);
        }, 4000);
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if typing inside an input field
      if (document.activeElement?.tagName === 'INPUT') return;
      if (isDriving) return;

      if (e.key === 'ArrowRight') {
        handleFacingChange(1);
      } else if (e.key === 'ArrowLeft') {
        handleFacingChange(-1);
      } else if (e.key === 'ArrowUp') {
        handleMotionChange('forward');
      } else if (e.key === 'ArrowDown') {
        handleMotionChange('backward');
      } else if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleDrive();
      } else if (e.key.toLowerCase() === 'h') {
        handleHonk();
      } else if (e.key >= '1' && e.key <= '9') {
        handleStepCountChange(parseInt(e.key, 10));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDriving, facing, motion, stepCount, currentPos]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-slate-100 text-slate-800 flex flex-col font-sans">
      {/* Celebration Notification Toast */}
      {celebrationBanner && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 text-amber-950 px-5 py-2.5 rounded-2xl shadow-xl border-2 border-yellow-100 flex items-center gap-3">
            <span className="text-2xl">⭐</span>
            <div>
              <h4 className="font-black text-sm md:text-base">{celebrationBanner.title}</h4>
              <p className="text-xs font-bold text-amber-900">{celebrationBanner.subtitle}</p>
            </div>
            <button
              onClick={() => setCelebrationBanner(null)}
              className="ml-2 text-amber-950/70 hover:text-amber-950 text-sm font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header Bar */}
      <header className="shrink-0 flex items-center justify-between px-3 sm:px-5 py-2 border-b border-slate-200 bg-white shadow-2xs z-40">
        <div className="flex items-center gap-2">
          <span className="text-lg">🚗</span>
          <span className="text-base sm:text-lg font-black tracking-tight text-slate-900">
            Number Line Cruiser
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 p-0.5 bg-slate-100 rounded-lg border border-slate-200">
          <button
            type="button"
            onClick={() => handleTabChange('sandbox')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'sandbox'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Sandbox</span>
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('missions')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'missions'
                ? 'bg-amber-400 text-amber-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Missions</span>
            {completedMissionIds.length > 0 && (
              <span className="text-[9px] px-1 py-0.1 bg-amber-100 text-amber-900 rounded-full font-bold border border-amber-300">
                {completedMissionIds.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => handleTabChange('classroom')}
            className={`px-2.5 py-1 text-xs font-bold rounded-md transition-colors flex items-center gap-1 cursor-pointer ${
              activeTab === 'classroom'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Rules</span>
          </button>
        </nav>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowVehiclePicker(!showVehiclePicker)}
            className="px-2.5 py-1 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            title="Choose Car"
          >
            <Car className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">Garage</span>
          </button>

          <button
            type="button"
            onClick={handleToggleSound}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-200 cursor-pointer"
            title={soundMuted ? 'Unmute' : 'Mute'}
          >
            {soundMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-600" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
          </button>

          <button
            type="button"
            onClick={handleToggleFullscreen}
            className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300 hover:bg-slate-200 cursor-pointer"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* Vehicle Picker Drawer / Modal */}
      {showVehiclePicker && (
        <div className="shrink-0 bg-white border-b border-slate-200 px-4 py-2 animate-fadeIn z-30 shadow-sm">
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-800">Choose Vehicle:</span>
            <div className="flex items-center gap-2 overflow-x-auto">
              {VEHICLE_OPTIONS.map((car) => (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => {
                    setVehicleModel(car.id);
                    sound.playClick();
                    setShowVehiclePicker(false);
                  }}
                  className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                    vehicleModel === car.id
                      ? 'bg-indigo-50 border-indigo-400 text-indigo-900 font-extrabold shadow-2xs'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-sm">{car.emoji}</span>
                  <span className="text-xs">{car.name}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowVehiclePicker(false)}
              className="text-xs text-slate-500 hover:text-slate-800 font-bold p-1 cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Single-Window Fit Container */}
      <main className="flex-1 min-h-0 w-full max-w-5xl mx-auto px-3 sm:px-4 py-2 flex flex-col justify-start gap-2 overflow-y-auto custom-scrollbar">
        {/* Top Section: Range Selector & Number Line Road */}
        <section className="shrink-0 flex flex-col gap-1">
          <div className="flex items-center justify-between text-[11px] text-slate-600 px-1">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-700">Range:</span>
              <div className="flex items-center gap-1 bg-white p-0.5 rounded-lg border border-slate-200 shadow-2xs">
                {[10, 15].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      setRangeMode(r);
                      sound.playClick();
                    }}
                    className={`px-2 py-0.2 rounded text-[10px] font-mono transition-colors cursor-pointer ${
                      rangeMode === r
                        ? 'bg-slate-700 text-white font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    -{r} to +{r}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[10px] text-slate-500 font-medium">
              Click any coordinate number below to position car
            </div>
          </div>

          <NumberLineRoad
            currentPos={currentPos}
            minRange={minRange}
            maxRange={maxRange}
            direction={facing}
            vehicleModel={vehicleModel}
            isDriving={isDriving}
            isReversing={isReversing}
            isTurning={isTurning}
            targetPos={targetPos}
            lastMoveArc={lastMoveArc}
            onSelectCoordinate={handleSelectCoordinate}
          />
        </section>

        {/* Tab Panel: Missions or Classroom Rules (Compact) */}
        {activeTab === 'missions' && (
          <section className="shrink-0">
            <MissionsPanel
              missions={MISSIONS}
              currentMissionIndex={currentMissionIndex}
              completedMissionIds={completedMissionIds}
              isMissionCompleted={currentPos === (customTargetPos !== null ? customTargetPos : MISSIONS[currentMissionIndex].targetPos)}
              customTargetPos={customTargetPos}
              currentPos={currentPos}
              minRange={minRange}
              maxRange={maxRange}
              onSelectMission={(idx) => setupMission(idx)}
              onNextMission={() => {
                if (currentMissionIndex < MISSIONS.length - 1) {
                  setupMission(currentMissionIndex + 1);
                }
              }}
              onRestartMission={() => {
                setupMission(currentMissionIndex);
              }}
              onUpdateTargetPos={handleUpdateTargetPos}
              onUpdateVehiclePos={handleUpdateVehiclePos}
            />
          </section>
        )}

        {activeTab === 'classroom' && (
          <section className="shrink-0 max-h-40 overflow-y-auto">
            <ClassroomRulesCard
              history={history}
              onClearHistory={() => {
                sound.playClick();
                setHistory([]);
              }}
            />
          </section>
        )}

        {/* Interactive Controls Deck (Car Direction, Gear/Motion, Steps, Gauge) */}
        <section className="shrink-0">
          <ControlsDeck
            currentPos={currentPos}
            facing={facing}
            motion={motion}
            stepCount={stepCount}
            isDriving={isDriving}
            stepByStep={stepByStep}
            soundMuted={soundMuted}
            onFacingChange={handleFacingChange}
            onMotionChange={handleMotionChange}
            onStepCountChange={handleStepCountChange}
            onToggleStepByStep={() => {
              sound.playClick();
              setStepByStep(!stepByStep);
            }}
            onToggleSound={handleToggleSound}
            onDrive={handleDrive}
            onHonk={handleHonk}
            onReset={handleReset}
          />
        </section>
      </main>

      {/* Slim Footer */}
      <footer className="shrink-0 border-t border-slate-200 bg-white py-1.5 px-4 text-center text-[10px] text-slate-500">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span className="font-semibold text-slate-600">Number Line Cruiser · Integer Addition & Subtraction</span>
          <span>Keyboard: ←/→ Face · ↑/↓ Gear · Space Drive · 1-6 Steps</span>
        </div>
      </footer>
    </div>
  );
}
