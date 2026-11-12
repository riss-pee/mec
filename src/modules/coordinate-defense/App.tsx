import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  GameMode,
  Target,
  ThemeMode,
  ShotResult,
  DiagnosticFeedback,
  DetonationMarker,
  TrajectoryTrace,
  WallBarrier,
  CannonType,
  LineRootsInfo,
} from './types/game';
import {
  LEVEL_CONFIGS,
  PRIMARY_TABS,
  generateTargetsForLevel,
  generateSingleTargetQ1,
  generateSingleTargetQ4,
  advanceWaveTargets,
  getDefaultWallsForLevel,
  getDefaultCannonPosition,
} from './utils/levelGenerator';
import {
  diagnoseShot,
  formatSlopeFraction,
  getLineEquation,
  getPointSlopeEquation,
  getLineRoots,
  isCollinearRay,
  getQuadraticCoefficients,
} from './utils/mathUtils';
import { soundManager } from './audio/soundManager';
import { CartesianCanvas } from './components/CartesianCanvas';
import { ControlDeck } from './components/ControlDeck';
import { TeacherEditor } from './components/TeacherEditor';
import { DiagnosticBanner } from './components/DiagnosticBanner';
import { AcademyModal } from './components/AcademyModal';
import { FlightRecorder } from './components/FlightRecorder';
import {
  Volume2,
  VolumeX,
  Sun,
  Moon,
  BookOpen,
  History,
  RotateCcw,
  ShieldAlert,
  Trophy,
  Target as TargetIcon,
  Triangle,
  Layers,
  Move,
  Sparkles,
  Maximize,
  Minimize,
  Crosshair,
} from 'lucide-react';

export default function App() {
  // Game & Mode State: 1 Quadrant (default), 4 Quadrants, Custom Quest
  const [level, setLevel] = useState<GameMode>('q1_mode');
  const [theme, setTheme] = useState<ThemeMode>('projector');
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [shields, setShields] = useState<number>(LEVEL_CONFIGS.q1_mode.initialShields);
  const [score, setScore] = useState<number>(0);
  const [waveTurn, setWaveTurn] = useState<number>(1);
  const [calculatedAim, setCalculatedAim] = useState<boolean>(false);
  const [targetsHitCount, setTargetsHitCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);

  // Artillery Cannon Coordinates (Base Origin on Cartesian Grid)
  const [cannonX, setCannonX] = useState<number>(0);
  const [cannonY, setCannonY] = useState<number>(0);

  // Artillery Cannon Selection: Linear vs Quadratic Mortar
  const [cannonType, setCannonType] = useState<CannonType>('linear');

  // Wall Barriers (blocking direct linear line-of-sight shots)
  const [wallBarriers, setWallBarriers] = useState<WallBarrier[]>(() => getDefaultWallsForLevel('q1_mode'));

  // Teacher Custom Quest storage (shared between Teacher Lab and Custom Mission level)
  const [teacherCustomTargets, setTeacherCustomTargets] = useState<Target[]>(() =>
    generateTargetsForLevel('custom_quest')
  );
  const [teacherCustomWalls, setTeacherCustomWalls] = useState<WallBarrier[]>(() =>
    getDefaultWallsForLevel('custom_quest')
  );
  const [teacherCustomCannonX, setTeacherCustomCannonX] = useState<number>(0);
  const [teacherCustomCannonY, setTeacherCustomCannonY] = useState<number>(0);
  const [teacherClickMode, setTeacherClickMode] = useState<'target' | 'cannon'>('target');

  // State for interactive cannon repositioning via grid click
  const [moveCannonOnClick, setMoveCannonOnClick] = useState<boolean>(false);

  // Targets & Projectiles (Single Target at a time in 1 Quadrant & 4 Quadrants)
  const [targets, setTargets] = useState<Target[]>(() => generateTargetsForLevel('q1_mode'));
  const [inputX, setInputX] = useState<number>(3);
  const [inputY, setInputY] = useState<number>(4);
  const [isFiring, setIsFiring] = useState<boolean>(false);

  // Diagnostic & Telemetry Feedback
  const [currentDiagnostic, setCurrentDiagnostic] = useState<DiagnosticFeedback | null>(null);
  const [lastDetonation, setLastDetonation] = useState<DetonationMarker | null>(null);
  const [lastTrace, setLastTrace] = useState<TrajectoryTrace | null>(null);
  const [lastShotResult, setLastShotResult] = useState<ShotResult | null>(null);
  const [invertedAlertTarget, setInvertedAlertTarget] = useState<Target | null>(null);
  const [shotHistory, setShotHistory] = useState<ShotResult[]>([]);

  // Toggles & Modals
  const [showSlopeTriangle, setShowSlopeTriangle] = useState<boolean>(true);
  const [showNumpad, setShowNumpad] = useState<boolean>(false);
  const [isAcademyOpen, setIsAcademyOpen] = useState<boolean>(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [levelWon, setLevelWon] = useState<boolean>(false);
  const [baseBreached, setBaseBreached] = useState<boolean>(false);

  // Fullscreen & Presentation Mode State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const rootContainerRef = useRef<HTMLDivElement | null>(null);

  // Sync fullscreen state with document fullscreenchange event
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = useCallback(async () => {
    soundManager.playClick();
    const elem = rootContainerRef.current || document.documentElement;

    if (!isFullscreen) {
      try {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if ((elem as any).webkitRequestFullscreen) {
          await (elem as any).webkitRequestFullscreen();
        } else if ((elem as any).msRequestFullscreen) {
          await (elem as any).msRequestFullscreen();
        }
        setIsFullscreen(true);
      } catch {
        // Fallback for iframe environments or restrictive permissions:
        // Toggle simulated full-viewport theater mode
        setIsFullscreen(true);
      }
    } else {
      try {
        if (document.exitFullscreen && document.fullscreenElement) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen && (document as any).webkitFullscreenElement) {
          await (document as any).webkitExitFullscreen();
        }
      } catch {
        // Ignore exit error
      }
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  // Pending detonation info during projectile flight
  const pendingShotRef = useRef<{
    cannonX: number;
    cannonY: number;
    enteredX: number;
    enteredY: number;
    hitTargets: Target[];
    diagnostic: DiagnosticFeedback;
    slopeInfo: { fractionStr: string };
    equationStr: string;
    pointSlope: string;
    roots: LineRootsInfo;
    calculatedAim?: boolean;
    multiplier?: number;
  } | null>(null);

  // Switch Level
  const handleSelectLevel = (newMode: GameMode) => {
    soundManager.playClick();
    setLevel(newMode);

    if (newMode === 'custom_quest' || newMode === 'custom_mission' || newMode === 'teacher_editor') {
      setTargets([...teacherCustomTargets]);
      setWallBarriers([...teacherCustomWalls]);
      setCannonX(teacherCustomCannonX);
      setCannonY(teacherCustomCannonY);
      setInputX(5);
      setInputY(3);
      setCannonType('quadratic');
    } else if (newMode === 'q1_mode' || newMode === 'level1_q1') {
      setTargets([generateSingleTargetQ1()]);
      setWallBarriers([]);
      setCannonX(0);
      setCannonY(0);
      setInputX(3);
      setInputY(4);
      setCannonType('linear');
    } else {
      setTargets([generateSingleTargetQ4()]);
      setWallBarriers([]);
      setCannonX(0);
      setCannonY(0);
      setInputX(4);
      setInputY(5);
      setCannonType('linear');
    }

    setShields(LEVEL_CONFIGS[newMode].initialShields);
    setWaveTurn(1);
    setCurrentDiagnostic(null);
    setLastDetonation(null);
    setLastTrace(null);
    setLastShotResult(null);
    setInvertedAlertTarget(null);
    setLevelWon(false);
    setBaseBreached(false);
  };

  // Reset current level targets & state
  const handleResetCurrentLevel = () => {
    soundManager.playClick();
    if (level === 'custom_quest' || level === 'custom_mission' || level === 'teacher_editor') {
      setTargets([...teacherCustomTargets]);
      setWallBarriers([...teacherCustomWalls]);
      setCannonX(teacherCustomCannonX);
      setCannonY(teacherCustomCannonY);
    } else if (level === 'q1_mode' || level === 'level1_q1') {
      setTargets([generateSingleTargetQ1()]);
      setWallBarriers([]);
      setCannonX(0);
      setCannonY(0);
    } else {
      setTargets([generateSingleTargetQ4()]);
      setWallBarriers([]);
      setCannonX(0);
      setCannonY(0);
    }
    setShields(LEVEL_CONFIGS[level].initialShields);
    setWaveTurn(1);
    setCurrentDiagnostic(null);
    setLastDetonation(null);
    setLastTrace(null);
    setLastShotResult(null);
    setInvertedAlertTarget(null);
    setLevelWon(false);
    setBaseBreached(false);
    setIsFiring(false);
  };

  // Fire Cannon or Laser Action
  const handleFireWeapon = useCallback((weapon: CannonType = 'linear') => {
    if (isFiring || (inputX === cannonX && inputY === cannonY)) return;

    setCannonType(weapon);
    if (weapon === 'linear') {
      soundManager.playLinearLaser();
    } else {
      soundManager.playCannonFire();
    }
    setIsFiring(true);
    setCurrentDiagnostic(null);
    setInvertedAlertTarget(null);

    // Diagnostic evaluation of current shot
    const diag = diagnoseShot(inputX, inputY, targets, weapon, wallBarriers, cannonX, cannonY);
    const isBlocked = diag.type === 'wall_blocked';

    let hitTargets: Target[] = [];

    if (!isBlocked) {
      if (weapon === 'linear') {
        // Laser travels straight: engages collinear targets along ray or direct hit
        hitTargets = targets.filter((t) => isCollinearRay(inputX, inputY, t.x, t.y, cannonX, cannonY));
        if (hitTargets.length === 0) {
          const directHit = targets.find((t) => t.x === inputX && t.y === inputY);
          if (directHit) hitTargets = [directHit];
        }
      } else {
        // Quadratic mortar: direct coordinate hit or on parabolic arc
        const directHit = targets.find((t) => t.x === inputX && t.y === inputY);
        if (directHit) {
          hitTargets = [directHit];
        } else {
          const quad = getQuadraticCoefficients(inputX, inputY, cannonX, cannonY);
          const arcHits = targets.filter((t) => {
            const expY = quad.a * t.x * t.x + quad.b * t.x + quad.c;
            const forward = (inputX > cannonX && t.x >= cannonX) || (inputX < cannonX && t.x <= cannonX);
            return forward && Math.abs(expY - t.y) < 0.35;
          });
          if (arcHits.length > 0) hitTargets = arcHits;
        }
      }
    }

    // Trajectory trace visual and algebraic telemetry
    const slopeInfo = formatSlopeFraction(inputX - cannonX, inputY - cannonY);
    const eq = getLineEquation(inputX, inputY, cannonX, cannonY);
    const pointSlope = getPointSlopeEquation(inputX, inputY, cannonX, cannonY);
    const quad = getQuadraticCoefficients(inputX, inputY, cannonX, cannonY);
    const lineRoots = weapon === 'quadratic' ? quad.roots : getLineRoots(inputX, inputY, cannonX, cannonY);

    const isHit = hitTargets.length > 0;
    const firstHit = isHit ? hitTargets[0] : null;

    // Grid boundary limits for beyond path
    const isQ1 = level === 'q1_mode' || level === 'level1_q1';
    const minG = isQ1 ? 0 : -10;
    const maxG = isQ1 ? 8 : 10;
    let beyondX = inputX;
    let beyondY = inputY;

    if (weapon === 'linear') {
      const dx = inputX - cannonX;
      const dy = inputY - cannonY;
      if (dx !== 0 || dy !== 0) {
        let tExit = 15;
        if (dx > 0) tExit = Math.min(tExit, (maxG - cannonX) / dx);
        if (dx < 0) tExit = Math.min(tExit, (minG - cannonX) / dx);
        if (dy > 0) tExit = Math.min(tExit, (maxG - cannonY) / dy);
        if (dy < 0) tExit = Math.min(tExit, (minG - cannonY) / dy);
        beyondX = Math.round((cannonX + tExit * dx) * 10) / 10;
        beyondY = Math.round((cannonY + tExit * dy) * 10) / 10;
      }
    } else {
      const stepDir = inputX >= cannonX ? 1 : -1;
      let curX = inputX;
      while ((stepDir > 0 ? curX <= maxG : curX >= minG)) {
        const curY = quad.a * curX * curX + quad.b * curX + quad.c;
        if (curY < minG || curY > maxG + 3) break;
        curX += stepDir * 0.5;
      }
      beyondX = Math.min(maxG, Math.max(minG, curX));
      beyondY = Math.round((quad.a * beyondX * beyondX + quad.b * beyondX + quad.c) * 10) / 10;
    }

    pendingShotRef.current = {
      cannonX,
      cannonY,
      enteredX: inputX,
      enteredY: inputY,
      hitTargets,
      diagnostic: diag,
      slopeInfo,
      equationStr: weapon === 'quadratic' ? quad.equationStr : eq,
      pointSlope,
      roots: lineRoots,
      multiplier: 1,
    };

    setLastTrace({
      startX: cannonX,
      startY: cannonY,
      endX: isHit ? firstHit!.x : inputX,
      endY: isHit ? firstHit!.y : inputY,
      equation: weapon === 'quadratic' ? quad.equationStr : eq,
      pointSlopeEquation: pointSlope,
      slopeFraction: slopeInfo.fractionStr,
      roots: lineRoots,
      timestamp: Date.now(),
      color: isBlocked ? '#F59E0B' : isHit ? '#10B981' : weapon === 'linear' ? '#38BDF8' : '#F59E0B',
      cannonType: weapon,
      quadraticA: quad.a,
      quadraticB: quad.b,
      quadraticC: quad.c,
      hitTarget: firstHit ? { x: firstHit.x, y: firstHit.y } : null,
      beyondX,
      beyondY,
    });
  }, [isFiring, inputX, inputY, cannonX, cannonY, level, targets, wallBarriers]);

  const handleFireCannon = useCallback(
    (weapon?: CannonType) => handleFireWeapon(weapon || cannonType),
    [handleFireWeapon, cannonType]
  );

  // Handle Shell Detonation Completion (called by CartesianCanvas)
  const handleDetonationComplete = useCallback(() => {
    setIsFiring(false);
    const pending = pendingShotRef.current;
    if (!pending) return;

    const {
      cannonX: shotCX,
      cannonY: shotCY,
      enteredX,
      enteredY,
      hitTargets,
      diagnostic,
      equationStr,
      slopeInfo,
      pointSlope,
      roots,
      multiplier = 1,
      calculatedAim: shotCalculatedAim = false,
    } = pending;
    const isHit = hitTargets.length > 0;
    const isBlocked = diagnostic.type === 'wall_blocked';

    // Set detonation marker on canvas
    setLastDetonation({
      gridX: enteredX,
      gridY: enteredY,
      cannonX: shotCX,
      cannonY: shotCY,
      canvasX: 0,
      canvasY: 0,
      hit: isHit,
      progress: 1,
      equation: equationStr,
      rootsInfo: roots,
      createdAt: Date.now(),
      blockedByWall: isBlocked,
    });

    setCurrentDiagnostic(diagnostic);

    // Play specific pedagogical audio feedback
    if (isHit) {
      soundManager.playHit();
      const points = hitTargets.length * 150 * multiplier;
      setScore((s) => s + points);
      setTargetsHitCount((prev) => prev + 1);
      setStreak((prev) => prev + 1);

      if (level === 'q1_mode' || level === 'level1_q1') {
        // Continuous single target replacement for 1 Quadrant tab!
        const hitTarget = hitTargets[0];
        const nextTarget = generateSingleTargetQ1(hitTarget ? { x: hitTarget.x, y: hitTarget.y } : undefined);
        setTargets([nextTarget]);
      } else if (level === 'q4_mode' || level === 'level2_quadrants') {
        // Continuous single target replacement across all 4 Quadrants!
        const hitTarget = hitTargets[0];
        const nextTarget = generateSingleTargetQ4(hitTarget ? { x: hitTarget.x, y: hitTarget.y } : undefined);
        setTargets([nextTarget]);
      } else {
        // Custom Quest
        const remaining = targets.filter((t) => !hitTargets.some((ht) => ht.id === t.id));
        setTargets(remaining);

        // Check victory
        if (remaining.length === 0 && level !== 'teacher_editor') {
          soundManager.playVictory();
          setLevelWon(true);
        }
      }
    } else {
      setStreak(0);
      if (diagnostic.type === 'inverted') {
        soundManager.playInvertedAlert();
        if (diagnostic.targetRef) {
          const invT = targets.find(
            (t) => t.x === diagnostic.targetRef?.x && t.y === diagnostic.targetRef?.y
          );
          if (invT) setInvertedAlertTarget(invT);
        }
      } else {
        soundManager.playMissDiagnostic();
      }

      // In Level 3 (Wave Defense), missing advances the wave inward!
      if (level === 'level3_wave') {
        const { updatedTargets, breached } = advanceWaveTargets(targets);
        setTargets(updatedTargets);
        setWaveTurn((w) => w + 1);

        if (breached) {
          setShields((prev) => {
            const nextShields = prev - 1;
            if (nextShields <= 0) {
              setBaseBreached(true);
            }
            return Math.max(0, nextShields);
          });
        }
      }
    }

    // Append to flight recorder
    const shotRecord: ShotResult = {
      x: enteredX,
      y: enteredY,
      cannonX: shotCX,
      cannonY: shotCY,
      timestamp: Date.now(),
      hit: isHit,
      targetsHit: hitTargets,
      diagnostic,
      slopeStr: slopeInfo.fractionStr,
      equationStr,
      pointSlopeStr: pointSlope,
      roots,
      cannonType,
      calculatedAim: shotCalculatedAim,
      multiplier,
    };

    setShotHistory((prev) => [shotRecord, ...prev]);
    setLastShotResult(shotRecord);
    pendingShotRef.current = null;
  }, [targets, level, cannonType]);

  // Click on Canvas Grid (Used for custom target placement or cannon repositioning)
  const handleGridClick = (gx: number, gy: number) => {
    if (isFiring) return;

    // Relocate cannon battery if moveCannonOnClick mode is active
    if (moveCannonOnClick && (level === 'level5_mobile' || level === 'custom_mission' || level === 'sandbox')) {
      soundManager.playClick();
      setCannonX(gx);
      setCannonY(gy);
      setMoveCannonOnClick(false);
      return;
    }

    if (level === 'teacher_editor') {
      if (teacherClickMode === 'cannon') {
        soundManager.playClick();
        setTeacherCustomCannonX(gx);
        setTeacherCustomCannonY(gy);
        setCannonX(gx);
        setCannonY(gy);
        return;
      }

      const existing = teacherCustomTargets.find((t) => t.x === gx && t.y === gy);
      if (existing) {
        const next = teacherCustomTargets.filter((t) => t.id !== existing.id);
        setTeacherCustomTargets(next);
        setTargets(next);
      } else {
        const nextLetter = String.fromCharCode(65 + (teacherCustomTargets.length % 26));
        const newTarget: Target = {
          id: `custom-t-${Date.now()}`,
          name: `Target ${nextLetter}`,
          x: gx,
          y: gy,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: gx > 0 && gy > 0 ? 1 : gx < 0 && gy > 0 ? 2 : gx < 0 && gy < 0 ? 3 : 4,
        };
        const next = [...teacherCustomTargets, newTarget];
        setTeacherCustomTargets(next);
        setTargets(next);
      }
      return;
    }

    // In sandbox mode, clicking allows custom target placement
    if (level === 'sandbox') {
      const existing = targets.find((t) => t.x === gx && t.y === gy);
      if (existing) {
        setTargets((prev) => prev.filter((t) => t.id !== existing.id));
      } else {
        const nextLetter = String.fromCharCode(65 + (targets.length % 26));
        const newTarget: Target = {
          id: `sb-${Date.now()}`,
          name: `Target ${nextLetter}`,
          x: gx,
          y: gy,
          hp: 1,
          maxHp: 1,
          type: 'drone',
          quadrant: 1,
        };
        setTargets((prev) => [...prev, newTarget]);
      }
    }
  };

  // Keyboard Shortcuts (Enter to fire, Tab to switch, arrows to nudge, F for fullscreen)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAcademyOpen || isHistoryOpen) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        handleFireCannon();
        return;
      }

      // F key shortcut for instant presentation / fullscreen mode (unless user is typing in an input)
      if ((e.key === 'f' || e.key === 'F') && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeTag = (document.activeElement?.tagName || '').toLowerCase();
        if (activeTag !== 'input' && activeTag !== 'textarea' && activeTag !== 'select') {
          e.preventDefault();
          toggleFullscreen();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFireCannon, isAcademyOpen, isHistoryOpen, toggleFullscreen]);

  const isDark = theme === 'tactical';
  const currentConfig = LEVEL_CONFIGS[level];

  return (
    <div
      ref={rootContainerRef}
      className={`h-screen max-h-screen w-full flex flex-col font-sans transition-colors overflow-hidden ${
        isFullscreen ? 'fixed inset-0 z-50 shadow-2xl' : ''
      } ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* 1. Top Header Bar (Clean 3-Zone Top Bar Contract) */}
      <header
        className={`flex items-center justify-between px-4 sm:px-6 py-2.5 border-b shrink-0 z-20 transition-colors ${
          isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-slate-200/90 shadow-2xs'
        }`}
      >
        {/* Zone 1: Title & Icon (Single Text Element Wordmark) */}
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded-lg ${isDark ? 'bg-sky-500/10 text-sky-400' : 'bg-sky-50 text-sky-600'}`}>
            <TargetIcon className="w-5 h-5 shrink-0" />
          </div>
          <div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-inherit whitespace-nowrap">
              Coordinate Cannon
            </h1>
          </div>
        </div>

        {/* Zone 2: Navigation Links / Mode Selector Tabs */}
        <nav className={`hidden lg:flex items-center gap-1.5 p-1 rounded-xl border transition-all ${
          isDark ? 'bg-slate-950/60 border-slate-800/80' : 'bg-slate-100/80 border-slate-200/80'
        }`}>
          {PRIMARY_TABS.map((modeKey) => {
            const config = LEVEL_CONFIGS[modeKey];
            const isActive =
              level === modeKey ||
              (modeKey === 'q1_mode' && level === 'level1_q1') ||
              (modeKey === 'q4_mode' && level === 'level2_quadrants') ||
              (modeKey === 'custom_quest' && level === 'custom_mission');
            const isTeacher = modeKey === 'teacher_editor';
            const isCustom = modeKey === 'custom_quest';
            return (
              <button
                key={modeKey}
                onClick={() => handleSelectLevel(modeKey)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? isTeacher
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : isCustom
                      ? 'bg-amber-600 text-white shadow-xs'
                      : isDark
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                    : isDark
                    ? 'text-slate-400 hover:text-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {isTeacher && <Layers className="w-3.5 h-3.5" />}
                {isCustom && <ShieldAlert className="w-3.5 h-3.5" />}
                <span>{config.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Sound, Theme, Academy, Flight Log) */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Sound Mute */}
          <button
            onClick={() => {
              const muted = soundManager.toggleMute();
              setIsMuted(muted);
            }}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-2xs hover:bg-slate-50'
            }`}
            title={isMuted ? 'Unmute Sound FX' : 'Mute Sound FX'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
          </button>

          {/* Theme Toggle (Tactical Radar vs Classroom Light) */}
          <button
            onClick={() => setTheme((t) => (t === 'tactical' ? 'projector' : 'tactical'))}
            className={`p-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-2xs hover:bg-slate-50'
            }`}
            title="Toggle Light Whiteboard / Tactical Dark Radar"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* Academy Modal Trigger */}
          <button
            onClick={() => setIsAcademyOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-2xs hover:bg-slate-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-sky-600" />
            <span className="hidden sm:inline">Manual</span>
          </button>

          {/* Flight Recorder Log */}
          <button
            onClick={() => setIsHistoryOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer ${
              isDark
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-2xs hover:bg-slate-50'
            }`}
          >
            <History className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Telemetry</span>
          </button>

          {/* Fullscreen / Presentation Mode Toggle */}
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              isFullscreen
                ? 'border-sky-500 bg-sky-500/15 text-sky-400 shadow-2xs ring-1 ring-sky-500/40'
                : isDark
                ? 'border-slate-800 bg-slate-900 text-slate-300 hover:text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-2xs hover:bg-slate-50'
            }`}
            title={isFullscreen ? 'Exit Fullscreen (Esc or F)' : 'Fullscreen / Projector Mode (F)'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4 text-sky-500" /> : <Maximize className="w-4 h-4 text-slate-600" />}
          </button>
        </div>
      </header>

      {/* Sub-Header: Mission Brief & Assists */}
      <div
        className={`px-4 sm:px-6 py-2.5 border-b flex items-center justify-between text-sm shrink-0 ${
          isDark ? 'bg-slate-900/40 border-slate-800 text-slate-400' : 'bg-slate-50/90 border-slate-200 text-slate-600'
        }`}
      >
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className={`font-mono text-xs font-bold px-2 py-0.5 rounded-md border ${
            isDark ? 'bg-sky-950/80 border-sky-800 text-sky-400' : 'bg-sky-50 border-sky-200 text-sky-700'
          }`}>
            {currentConfig.badge}
          </span>
          <span aria-hidden="true" className="text-slate-400">·</span>
          <span className="font-bold text-sm text-slate-800">{currentConfig.name}</span>
          <span aria-hidden="true" className="hidden md:inline text-slate-400">·</span>
          <span className="hidden md:inline text-xs text-slate-500 font-medium">{currentConfig.description}</span>
        </div>

        {/* Level & Assist Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white/80 border border-slate-200/80 px-2.5 py-1 rounded-lg shadow-2xs">
            <span className="text-slate-400 uppercase text-[10px] tracking-wider">Guide:</span>
            <span className="font-mono text-sky-700 font-bold">X = Run (↔)</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono text-amber-700 font-bold">Y = Rise (↕)</span>
          </div>

          {/* Slope Triangle Toggle */}
          <button
            onClick={() => setShowSlopeTriangle(!showSlopeTriangle)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
              showSlopeTriangle
                ? isDark ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-800 shadow-2xs'
                : isDark ? 'border-transparent text-slate-400 hover:text-slate-200' : 'border-slate-200 bg-white text-slate-600 hover:text-slate-900 shadow-2xs'
            }`}
            title="Toggle Rise/Run Slope Triangle"
          >
            <Triangle className={`w-3.5 h-3.5 ${showSlopeTriangle ? 'text-amber-600 fill-amber-500/20' : 'text-slate-400'}`} />
            <span>Slope Triangle</span>
          </button>

          {/* Mobile Level Dropdown for small screens */}
          <div className="lg:hidden">
            <select
              value={level}
              onChange={(e) => handleSelectLevel(e.target.value as GameMode)}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-xs font-bold text-slate-800 shadow-2xs"
            >
              {PRIMARY_TABS.map((modeKey) => (
                <option key={modeKey} value={modeKey}>
                  {LEVEL_CONFIGS[modeKey].name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Game Stage & Layout */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 min-w-0 overflow-y-auto lg:overflow-hidden p-3 sm:p-4 gap-3.5">
        {/* Left / Center Zone: Cartesian Canvas Stage (65% presence) */}
        <div className={`flex-1 flex flex-col min-h-[280px] lg:min-h-0 min-w-0 relative rounded-2xl border transition-all ${
          isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-200/90 bg-white shadow-xs'
        } overflow-hidden`}>
          {/* Interactive Canvas */}
          <CartesianCanvas
            targets={targets}
            aimX={inputX}
            aimY={inputY}
            cannonX={cannonX}
            cannonY={cannonY}
            firing={isFiring}
            theme={theme}
            level={level}
            showSlopeTriangle={showSlopeTriangle}
            lastDetonation={lastDetonation}
            lastTrace={lastTrace}
            invertedAlertTarget={invertedAlertTarget}
            walls={wallBarriers}
            cannonType={cannonType}
            allowRepositionCannon={level === 'custom_quest' || level === 'custom_mission' || level === 'level5_mobile' || level === 'sandbox'}
            clickMode={level === 'teacher_editor' ? teacherClickMode : undefined}
            calculatedAim={calculatedAim}
            onGridClick={handleGridClick}
            onDetonationComplete={handleDetonationComplete}
          />

          {/* HUD Overlay: Targets count, Score & Shields & Battery */}
          <div className="absolute top-3.5 left-3.5 flex items-center gap-2 pointer-events-none flex-wrap">
            {level === 'q1_mode' || level === 'q4_mode' || level === 'level1_q1' || level === 'level2_quadrants' ? (
              <>
                <div className={`px-3.5 py-1.5 rounded-xl text-sm font-mono font-bold border backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
                  isDark ? 'bg-slate-950/85 border-slate-700 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-800'
                }`}>
                  <span className="text-slate-400 font-sans text-xs">Target:</span>
                  <span className="text-rose-600 font-black text-sm sm:text-base">
                    {targets[0] ? `(${targets[0].x}, ${targets[0].y})` : 'Neutralized'}
                  </span>
                </div>

                <div className={`px-3.5 py-1.5 rounded-xl text-sm font-mono font-bold border backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
                  isDark ? 'bg-slate-950/85 border-slate-700 text-emerald-400' : 'bg-white/95 border-slate-200 text-emerald-700'
                }`}>
                  <span className="text-slate-400 font-sans text-xs">Cleared:</span>
                  <span className="font-extrabold text-sm sm:text-base">{targetsHitCount}</span>
                  {streak >= 2 && <span className="text-amber-500 font-black text-xs">({streak}🔥)</span>}
                </div>
              </>
            ) : (
              <div className={`px-3.5 py-1.5 rounded-xl text-sm font-mono font-bold border backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
                isDark ? 'bg-slate-950/85 border-slate-700 text-slate-200' : 'bg-white/95 border-slate-200 text-slate-800'
              }`}>
                <span>Targets:</span> <span className="text-rose-600 font-extrabold text-base">{targets.length}</span>
              </div>
            )}

            {(cannonX !== 0 || cannonY !== 0) && (
              <div className={`px-3.5 py-1.5 rounded-xl text-sm font-mono font-bold border backdrop-blur-md shadow-xs ${
                isDark ? 'bg-slate-950/85 border-emerald-800 text-emerald-300' : 'bg-emerald-50/95 border-emerald-200 text-emerald-800'
              }`}>
                Battery: ({cannonX}, {cannonY})
              </div>
            )}

            {wallBarriers.length > 0 && (
              <div className={`px-3.5 py-1.5 rounded-xl text-sm font-mono font-bold border backdrop-blur-md shadow-xs ${
                isDark ? 'bg-slate-950/85 border-amber-800 text-amber-300' : 'bg-amber-50/95 border-amber-200 text-amber-800'
              }`}>
                Walls: {wallBarriers.length}
              </div>
            )}

            <div className={`px-3.5 py-1.5 rounded-xl text-sm font-mono font-bold border backdrop-blur-md shadow-xs flex items-center gap-1.5 ${
              isDark ? 'bg-slate-950/85 border-slate-700 text-amber-300' : 'bg-white/95 border-slate-200 text-amber-800'
            }`}>
              <span>Score:</span> <span className="font-extrabold text-amber-600">{score}</span>
            </div>
          </div>

          {/* Top-Right Canvas Actions: Relocate Battery & Reset Level */}
          <div className="absolute top-3.5 right-3.5 flex items-center gap-2">
            {(level === 'q1_mode' || level === 'q4_mode' || level === 'level1_q1' || level === 'level2_quadrants') && (
              <button
                onClick={() => {
                  soundManager.playClick();
                  const nextTarget = (level === 'q1_mode' || level === 'level1_q1')
                    ? generateSingleTargetQ1(targets[0])
                    : generateSingleTargetQ4(targets[0]);
                  setTargets([nextTarget]);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border backdrop-blur-md flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  isDark
                    ? 'bg-slate-950/85 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                    : 'bg-white/95 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                }`}
                title="Spawn a new random target coordinate"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Next Target</span>
              </button>
            )}

            {level === 'custom_quest' && (
              <button
                onClick={() => handleSelectLevel('teacher_editor')}
                className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border backdrop-blur-md flex items-center gap-1.5 transition-all shadow-xs cursor-pointer bg-amber-600 hover:bg-amber-500 text-white border-amber-500"
                title="Open Teacher Studio to configure quest targets and barriers"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Edit Quest</span>
              </button>
            )}

            {level === 'teacher_editor' && (
              <button
                onClick={() => handleSelectLevel('custom_quest')}
                className="px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border backdrop-blur-md flex items-center gap-1.5 transition-all shadow-xs cursor-pointer bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500"
                title="Launch and play this mission as a student"
              >
                <Crosshair className="w-3.5 h-3.5" />
                <span>Play Quest</span>
              </button>
            )}

            {(level === 'custom_quest' || level === 'custom_mission' || level === 'sandbox') && (
              <button
                onClick={() => setMoveCannonOnClick((prev) => !prev)}
                className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border backdrop-blur-md flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
                  moveCannonOnClick
                    ? 'bg-emerald-600 text-white border-emerald-500 animate-pulse shadow-sm'
                    : isDark
                    ? 'bg-slate-950/85 border-slate-700 text-emerald-300 hover:text-white hover:border-emerald-500'
                    : 'bg-white/95 border-slate-200 text-emerald-800 hover:text-emerald-950 hover:bg-emerald-50'
                }`}
                title="Click anywhere on the Cartesian grid to place your artillery battery"
              >
                <Move className="w-4 h-4" />
                <span>{moveCannonOnClick ? 'Click Grid to Relocate' : 'Move Cannon'}</span>
              </button>
            )}

            <button
              onClick={handleResetCurrentLevel}
              className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-bold border backdrop-blur-md flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer ${
                isDark
                  ? 'bg-slate-950/85 border-slate-700 text-slate-300 hover:text-white hover:border-slate-500'
                  : 'bg-white/95 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50'
              }`}
              title="Reset targets and defenses"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>

          {/* In-Canvas Diagnostic Alert Callout */}
          {currentDiagnostic && (
            <div className="absolute bottom-3 left-3 right-3 max-w-2xl mx-auto z-10">
              <DiagnosticBanner
                diagnostic={currentDiagnostic}
                onDismiss={() => setCurrentDiagnostic(null)}
                isProjector={!isDark}
              />
            </div>
          )}

          {/* Victory Modal Overlay */}
          {levelWon && (
            <div className={`absolute inset-0 z-30 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in ${
              isDark ? 'bg-slate-950/80' : 'bg-slate-900/30'
            }`}>
              <div className={`p-6 rounded-2xl border text-center max-w-md shadow-2xl ${
                isDark ? 'border-emerald-500/40 bg-slate-900 text-slate-100' : 'border-emerald-300 bg-white text-slate-900 shadow-xl'
              }`}>
                <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center mb-3">
                  <Trophy className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-emerald-600 mb-1">Perimeter Secured!</h3>
                <p className={`text-xs mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  All hostile targets eliminated with precise Cartesian coordinate calculations. Excellent targeting!
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    onClick={handleResetCurrentLevel}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                    }`}
                  >
                    Replay Level
                  </button>
                  <button
                    onClick={() => {
                      if (level === 'level1_q1') handleSelectLevel('level2_quadrants');
                      else if (level === 'level2_quadrants') handleSelectLevel('level3_wave');
                      else if (level === 'level3_wave') handleSelectLevel('level4_linear');
                      else if (level === 'level4_linear') handleSelectLevel('level5_mobile');
                      else if (level === 'level5_mobile') handleSelectLevel('custom_mission');
                      else handleSelectLevel('teacher_editor');
                    }}
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm cursor-pointer"
                  >
                    Next Mission ➔
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Base Breached Modal Overlay */}
          {baseBreached && (
            <div className={`absolute inset-0 z-30 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in ${
              isDark ? 'bg-slate-950/80' : 'bg-slate-900/30'
            }`}>
              <div className={`p-6 rounded-2xl border text-center max-w-md shadow-2xl ${
                isDark ? 'border-rose-500/40 bg-slate-900 text-slate-100' : 'border-rose-300 bg-white text-slate-900 shadow-xl'
              }`}>
                <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/20 text-rose-600 flex items-center justify-center mb-3">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-rose-600 mb-1">Defense Perimeter Breached!</h3>
                <p className={`text-xs mb-4 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                  Hostile invaders reached within distance 1 of the origin (0, 0). Recalibrate your vectors and defend the base!
                </p>
                <button
                  onClick={handleResetCurrentLevel}
                  className="px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-sm cursor-pointer"
                >
                  Restart Wave Defense
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right / Bottom Zone: Control Deck OR Teacher Editor */}
        <div className="w-full lg:w-[380px] xl:w-[410px] flex flex-col shrink-0 gap-3 overflow-y-auto max-h-full pr-1 pb-1">
          {level === 'teacher_editor' ? (
            <TeacherEditor
              targets={teacherCustomTargets}
              setTargets={(val) => {
                setTeacherCustomTargets(val);
                setTargets(val);
              }}
              walls={teacherCustomWalls}
              setWalls={(val) => {
                setTeacherCustomWalls(val);
                setWallBarriers(val);
              }}
              cannonX={teacherCustomCannonX}
              cannonY={teacherCustomCannonY}
              setCannonX={(val) => {
                setTeacherCustomCannonX(val);
                setCannonX(val);
              }}
              setCannonY={(val) => {
                setTeacherCustomCannonY(val);
                setCannonY(val);
              }}
              clickMode={teacherClickMode}
              setClickMode={setTeacherClickMode}
              onLaunchCustomMission={() => handleSelectLevel('custom_quest')}
              theme={theme}
            />
          ) : (
            <>
              <ControlDeck
                inputX={inputX}
                inputY={inputY}
                setInputX={setInputX}
                setInputY={setInputY}
                onFire={handleFireCannon}
                isFiring={isFiring}
                theme={theme}
                level={level}
                targets={targets}
                showNumpad={showNumpad}
                setShowNumpad={setShowNumpad}
                cannonType={cannonType}
                setCannonType={setCannonType}
                hasWalls={wallBarriers.length > 0}
                cannonX={cannonX}
                cannonY={cannonY}
                setCannonX={setCannonX}
                setCannonY={setCannonY}
                allowRepositionCannon={level === 'custom_quest' || level === 'custom_mission' || level === 'level5_mobile' || level === 'sandbox'}
                lastShotResult={lastShotResult}
                calculatedAim={calculatedAim}
                setCalculatedAim={setCalculatedAim}
              />

              {/* Quick Guide Card: Quadrant Quick Signs Matrix */}
              <div
                className={`border rounded-xl p-3.5 text-sm transition-all ${
                  isDark ? 'bg-slate-900/70 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                }`}
              >
                <div className="font-bold mb-2 flex items-center justify-between">
                  <span className={isDark ? 'text-sky-400 font-extrabold text-sm' : 'text-slate-900 font-extrabold text-sm'}>
                    Quadrant Signs Reference
                  </span>
                  <span className="text-xs font-mono text-slate-500 font-semibold">(X, Y)</span>
                </div>

                <div className="grid grid-cols-2 gap-2 font-mono text-xs sm:text-sm">
                  <div className={`p-2.5 rounded-lg border flex justify-between items-center ${
                    isDark ? 'bg-slate-800/40 border-slate-700/40' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-slate-600 font-sans text-xs font-medium">Q1: Top-Right</span>
                    <strong className="text-emerald-600 font-extrabold text-sm">(+ , +)</strong>
                  </div>
                  <div className={`p-2.5 rounded-lg border flex justify-between items-center ${
                    isDark ? 'bg-slate-800/40 border-slate-700/40' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-slate-600 font-sans text-xs font-medium">Q2: Top-Left</span>
                    <strong className="text-sky-600 font-extrabold text-sm">(- , +)</strong>
                  </div>
                  <div className={`p-2.5 rounded-lg border flex justify-between items-center ${
                    isDark ? 'bg-slate-800/40 border-slate-700/40' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-slate-600 font-sans text-xs font-medium">Q3: Btm-Left</span>
                    <strong className="text-amber-600 font-extrabold text-sm">(- , -)</strong>
                  </div>
                  <div className={`p-2.5 rounded-lg border flex justify-between items-center ${
                    isDark ? 'bg-slate-800/40 border-slate-700/40' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <span className="text-slate-600 font-sans text-xs font-medium">Q4: Btm-Right</span>
                    <strong className="text-purple-600 font-extrabold text-sm">(+ , -)</strong>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Cheatsheet / Academy Modal */}
      <AcademyModal isOpen={isAcademyOpen} onClose={() => setIsAcademyOpen(false)} theme={theme} />

      {/* Flight History Log Modal */}
      <FlightRecorder
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        shots={shotHistory}
        onClear={() => setShotHistory([])}
        theme={theme}
      />
    </div>
  );
}
