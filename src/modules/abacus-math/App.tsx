import React, { useState, useMemo, useRef, useEffect } from 'react';
import { PLACE_VALUES, CHALLENGES, EDUCATIONAL_LESSONS } from './data/abacusData';
import { GameMode, AbacusType } from './types';
import { AbacusClassic } from './components/AbacusClassic';
import { AbacusVertical } from './components/AbacusVertical';
import { Lessons } from './components/Lessons';
import { Challenges } from './components/Challenges';
import { numberToWords } from './utils/numberToWords';
import { setAudioMuted } from './utils/audio';
import { 
  Sliders, 
  BookOpen, 
  Award, 
  Settings2, 
  Trash2, 
  Shuffle, 
  Volume2, 
  VolumeX, 
  ArrowRight,
  Sparkles,
  Layers,
  ChevronUp,
  ChevronDown,
  Maximize2,
  Minimize2
} from 'lucide-react';

export default function App() {
  // State variables
  const [gameMode, setGameMode] = useState<GameMode>('free_play');
  const [abacusType, setAbacusType] = useState<AbacusType>('vertical');
  const [rowCountInput, setRowCountInput] = useState<number>(4); // Default to 4 rows (Ones, Tens, Hundreds, Thousands)
  const [beadTheme, setBeadTheme] = useState<string>('candy'); // candy, wooden, cosmic
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Custom bead states (key is exponent, value is active beads count 0-10)
  const [beadStates, setBeadStates] = useState<{ [exponent: number]: number }>({
    0: 3, // 3 ones
    1: 5, // 5 tens
    2: 2, // 2 hundreds
    3: 1, // 1 thousand
  });

  // Navigation states for sub-tabs
  const [currentLessonId, setCurrentLessonId] = useState<string>(EDUCATIONAL_LESSONS[0].id);
  const [currentChallengeId, setCurrentChallengeId] = useState<string>(CHALLENGES[0].id);

  // Sync sound settings with audio engine
  useEffect(() => {
    setAudioMuted(!soundEnabled);
  }, [soundEnabled]);

  // Fullscreen toggle handler with browser API + in-app fallback
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (document.documentElement.requestFullscreen) {
          await document.documentElement.requestFullscreen();
        }
        setIsFullscreen(true);
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
        setIsFullscreen(false);
      }
    } catch {
      // In case iframe sandboxing restricts native fullscreen, toggle in-app fullscreen mode seamlessly
      setIsFullscreen((prev) => !prev);
    }
  };

  // Listen to fullscreen changes & keyboard shortcut 'F' / 'Escape'
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNative = Boolean(document.fullscreenElement);
      if (isNative) {
        setIsFullscreen(true);
      } else if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === 'f' || e.key === 'F') &&
        !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === 'Escape' && isFullscreen) {
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        setIsFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);

  // Parse and validate row count
  const rowCount = useMemo(() => {
    const val = Math.max(1, Math.min(10, rowCountInput));
    return val;
  }, [rowCountInput]);

  // Retrieve active place value configurations based on row count
  const activePlaceValues = useMemo(() => {
    // Return first 'rowCount' place values (0 to rowCount-1)
    return PLACE_VALUES.slice(0, rowCount);
  }, [rowCount]);

  // Calculate the total real-time value represented on the abacus
  const totalValue = useMemo(() => {
    let sum = 0;
    activePlaceValues.forEach((row) => {
      const active = beadStates[row.exponent] || 0;
      sum += active * Math.pow(10, row.exponent);
    });
    return sum;
  }, [beadStates, activePlaceValues]);

  // Handle setting bead values
  const handleBeadChange = (exponent: number, activeCount: number) => {
    setBeadStates((prev) => ({
      ...prev,
      [exponent]: activeCount,
    }));
  };

  // Set number of rows with input field
  const handleRowCountInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseInt(e.target.value, 10);
    if (!isNaN(parsed)) {
      setRowCountInput(parsed);
    } else {
      setRowCountInput(0); // Allow clearing input temporary, but fall back gracefully
    }
  };

  // Increment/Decrement row buttons for fast touch control
  const adjustRowCount = (amount: number) => {
    setRowCountInput((prev) => Math.max(1, Math.min(10, prev + amount)));
  };

  // Apply a lesson preset or challenge preset
  const applyPreset = (preset: { [exponent: number]: number }) => {
    // Determine the max exponent in the preset to expand the abacus rows if needed
    const exponents = Object.keys(preset).map(Number);
    if (exponents.length > 0) {
      const maxExp = Math.max(...exponents);
      if (maxExp >= rowCount) {
        setRowCountInput(maxExp + 1);
      }
    }

    // Set bead values
    const newStates: { [exponent: number]: number } = {};
    // Zero out all active rows first
    activePlaceValues.forEach(pv => {
      newStates[pv.exponent] = 0;
    });
    // Load preset values
    Object.entries(preset).forEach(([expStr, val]) => {
      newStates[Number(expStr)] = val;
    });
    setBeadStates(newStates);
  };

  // Clear all active beads
  const handleClearAll = () => {
    const newStates = { ...beadStates };
    activePlaceValues.forEach((row) => {
      newStates[row.exponent] = 0;
    });
    setBeadStates(newStates);
  };

  // Randomize all active beads for exploration
  const handleRandomize = () => {
    const newStates = { ...beadStates };
    activePlaceValues.forEach((row) => {
      // 0 to 10 random beads
      newStates[row.exponent] = Math.floor(Math.random() * 11);
    });
    setBeadStates(newStates);
  };

  // Split digits of the total value to align with place values
  const digitRepresentation = useMemo(() => {
    const sorted = [...activePlaceValues].sort((a, b) => b.exponent - a.exponent);
    return sorted.map((row) => {
      const active = beadStates[row.exponent] || 0;
      return {
        row,
        digit: active,
        placeValueText: row.name,
        expandedValue: active * Math.pow(10, row.exponent)
      };
    });
  }, [beadStates, activePlaceValues]);

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors duration-300 ${
        isFullscreen ? 'fixed inset-0 z-50 h-screen max-h-screen overflow-hidden p-2 bg-stone-950 text-stone-100 flex flex-col justify-between' : ''
      }`}
    >
      {/* FULLSCREEN TOP BAR: Unified ultra-compact single-row navigation */}
      {isFullscreen ? (
        <header className="bg-stone-900 border border-stone-800 rounded-2xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 shadow-md shrink-0">
          {/* Logo & Mode */}
          <div className="flex items-center gap-2">
            <span className="text-base font-bold">🧮</span>
            <span className="font-black text-sm text-white tracking-tight">Interactive Abacus</span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Full Screen
            </span>
          </div>

          {/* Quick Mode Switcher & Controls */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Mode Navigator */}
            <div className="bg-stone-950 p-0.5 rounded-xl border border-stone-800 flex items-center gap-0.5">
              <button
                onClick={() => setGameMode('free_play')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                  gameMode === 'free_play' ? 'bg-stone-800 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                }`}
                id="fs-mode-free-play"
              >
                Practice
              </button>
              <button
                onClick={() => setGameMode('lessons')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                  gameMode === 'lessons' ? 'bg-stone-800 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                }`}
                id="fs-mode-lessons"
              >
                Lessons
              </button>
              <button
                onClick={() => setGameMode('challenges')}
                className={`px-2.5 py-1 rounded-lg font-bold text-xs transition-all ${
                  gameMode === 'challenges' ? 'bg-stone-800 text-white shadow-xs' : 'text-stone-400 hover:text-stone-200'
                }`}
                id="fs-mode-challenges"
              >
                Quizzes
              </button>
            </div>

            {/* Row Count Pill */}
            <div className="flex items-center bg-stone-950 border border-stone-800 rounded-xl p-0.5">
              <span className="text-[10px] text-stone-400 font-bold px-1.5 uppercase">Rows:</span>
              <button
                type="button"
                onClick={() => adjustRowCount(-1)}
                className="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center"
              >
                <ChevronDown className="w-3 h-3" />
              </button>
              <span className="w-6 text-center font-mono font-bold text-xs text-white">{rowCount}</span>
              <button
                type="button"
                onClick={() => adjustRowCount(1)}
                className="w-5 h-5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 flex items-center justify-center"
              >
                <ChevronUp className="w-3 h-3" />
              </button>
            </div>

            {/* Orientation */}
            <div className="bg-stone-950 p-0.5 rounded-xl border border-stone-800 flex">
              <button
                onClick={() => setAbacusType('vertical')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                  abacusType === 'vertical' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Cols
              </button>
              <button
                onClick={() => setAbacusType('horizontal')}
                className={`px-2 py-0.5 rounded-lg text-xs font-bold ${
                  abacusType === 'horizontal' ? 'bg-amber-600 text-white' : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                Rows
              </button>
            </div>

            {/* Theme */}
            <div className="bg-stone-950 p-0.5 rounded-xl border border-stone-800 flex">
              {['candy', 'wooden', 'cosmic'].map((theme) => (
                <button
                  key={theme}
                  onClick={() => setBeadTheme(theme)}
                  className={`px-2 py-0.5 rounded-lg text-xs font-bold capitalize ${
                    beadTheme === theme ? 'bg-stone-700 text-white' : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-lg bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-300"
              title={soundEnabled ? "Disable sound" : "Enable sound"}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-400" /> : <VolumeX className="w-3.5 h-3.5 text-stone-500" />}
            </button>
            <button
              onClick={handleRandomize}
              className="px-2 py-1 bg-stone-950 hover:bg-stone-800 text-stone-200 rounded-lg text-xs font-semibold flex items-center gap-1 border border-stone-800"
              title="Randomize beads"
            >
              <Shuffle className="w-3 h-3 text-amber-400" />
              <span>Random</span>
            </button>
            <button
              onClick={handleClearAll}
              className="px-2 py-1 bg-stone-950 hover:bg-red-950/40 text-stone-200 hover:text-red-300 rounded-lg text-xs font-semibold flex items-center gap-1 border border-stone-800"
              title="Reset to 0"
            >
              <Trash2 className="w-3 h-3 text-red-400" />
              <span>Reset</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm"
              title="Exit Full Screen (Esc)"
              id="fullscreen-banner-exit-btn"
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Exit (Esc)</span>
            </button>
          </div>
        </header>
      ) : (
        /* STANDARD HEADER: Compact single-row navbar */
        <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shadow-xs py-2.5 px-4 md:px-6 shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2.5">
            
            {/* Logo & Educational Title */}
            <div className="flex items-center gap-2.5">
              <div className="bg-amber-600 dark:bg-amber-700 text-white p-1.5 rounded-xl shadow-xs flex items-center justify-center font-mono text-base">
                🧮
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 id="app-title" className="text-base md:text-lg font-black text-stone-900 dark:text-white tracking-tight leading-none">
                    Interactive Abacus
                  </h1>
                  <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                    Base-10
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 leading-tight">
                  Place values, decimals, and interactive bead addition
                </p>
              </div>
            </div>

            {/* Quick controls toolbar */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Audio Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-xl border transition-all ${
                  soundEnabled 
                    ? 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/40 text-amber-600 dark:text-amber-400 hover:bg-amber-100'
                    : 'bg-stone-50 border-stone-200 dark:bg-stone-950 dark:border-stone-800 text-stone-400 hover:bg-stone-100'
                }`}
                title={soundEnabled ? "Disable click sounds" : "Enable click sounds"}
                id="sound-toggle-btn"
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Fullscreen Mode Toggle */}
              <button
                onClick={toggleFullscreen}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-xs bg-stone-50 border-stone-200 dark:bg-stone-950 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                title="Enter Fullscreen Mode (F)"
                id="header-fullscreen-toggle-btn"
              >
                <Maximize2 className="w-3.5 h-3.5 text-amber-500" />
                <span>Full Screen</span>
                <kbd className="hidden lg:inline-block px-1 py-0.2 text-[8px] font-mono font-semibold bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-300 dark:border-stone-700 rounded">F</kbd>
              </button>

              {/* Mode Navigator */}
              <div className="bg-stone-100 dark:bg-stone-950 p-0.5 rounded-xl border border-stone-200 dark:border-stone-800 flex items-center gap-0.5">
                <button
                  onClick={() => setGameMode('free_play')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    gameMode === 'free_play'
                      ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                  id="mode-free-play"
                >
                  <Sliders className="w-3 h-3 text-amber-500" />
                  Practice
                </button>

                <button
                  onClick={() => setGameMode('lessons')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    gameMode === 'lessons'
                      ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                  id="mode-lessons"
                >
                  <BookOpen className="w-3 h-3 text-emerald-500" />
                  Lessons
                </button>

                <button
                  onClick={() => setGameMode('challenges')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    gameMode === 'challenges'
                      ? 'bg-white dark:bg-stone-900 text-stone-950 dark:text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                  id="mode-challenges"
                >
                  <Award className="w-3 h-3 text-amber-500" />
                  Quizzes
                </button>
              </div>

            </div>

          </div>
        </header>
      )}

      {/* Main Educational Arena */}
      <main className={`w-full mx-auto flex flex-col justify-between ${
        isFullscreen ? 'h-full flex-grow p-1.5 md:p-2 gap-2 overflow-hidden' : 'max-w-7xl p-3 md:p-4 gap-3 flex-grow'
      }`}>

        {/* Top Controls Ribbon (Rendered in standard mode) */}
        {!isFullscreen && (
          <section className="bg-white dark:bg-stone-900 rounded-2xl p-2 sm:p-2.5 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
            {/* 1. Rows Counter */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-amber-500" />
                Rows:
              </span>
              <div className="flex items-center bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl p-0.5">
                <button
                  type="button"
                  onClick={() => adjustRowCount(-1)}
                  className="w-6 h-6 rounded-lg bg-white dark:bg-stone-900 hover:bg-stone-200 text-stone-700 dark:text-stone-300 flex items-center justify-center shadow-xs"
                  title="Decrease rows"
                >
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={rowCountInput}
                  onChange={handleRowCountInputChange}
                  className="w-7 text-center font-mono font-bold text-xs focus:outline-none dark:text-white bg-transparent"
                  id="row-count-input-field"
                />
                <button
                  type="button"
                  onClick={() => adjustRowCount(1)}
                  className="w-6 h-6 rounded-lg bg-white dark:bg-stone-900 hover:bg-stone-200 text-stone-700 dark:text-stone-300 flex items-center justify-center shadow-xs"
                  title="Increase rows"
                >
                  <ChevronUp className="w-3.5 h-3.5" />
                </button>
              </div>
              <span className="text-[10px] text-stone-400 font-mono">(1-10)</span>
            </div>

            {/* 2. Orientation Tabs */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Settings2 className="w-3.5 h-3.5 text-emerald-500" />
                Frame:
              </span>
              <div className="bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-0.5 rounded-xl flex">
                <button
                  onClick={() => setAbacusType('vertical')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    abacusType === 'vertical'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                  id="layout-vertical-rods"
                >
                  Columns
                </button>
                <button
                  onClick={() => setAbacusType('horizontal')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    abacusType === 'horizontal'
                      ? 'bg-amber-600 text-white shadow-xs'
                      : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
                  }`}
                  id="layout-horizontal-wires"
                >
                  Rows
                </button>
              </div>
            </div>

            {/* 3. Theme Tabs */}
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Theme:
              </span>
              <div className="bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 p-0.5 rounded-xl flex gap-0.5">
                {['candy', 'wooden', 'cosmic'].map((theme) => (
                  <button
                    key={theme}
                    onClick={() => setBeadTheme(theme)}
                    className={`px-2 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      beadTheme === theme
                        ? 'bg-stone-800 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xs'
                        : 'text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200'
                    }`}
                    id={`theme-btn-${theme}`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Practice/Free Play Layout: Interactive Abacus Cabinet & Live Calculation board */}
        <section className={`flex flex-col flex-grow justify-between ${isFullscreen ? 'h-full overflow-hidden' : ''}`}>
          <div className={`bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between flex-grow ${
            isFullscreen ? 'p-2 sm:p-2.5 gap-2' : 'p-3 sm:p-4 gap-2.5'
          }`}>
            
            {/* Header of Active Abacus (in standard mode) */}
            {!isFullscreen && (
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-stone-100 dark:border-stone-800 shrink-0">
                <div>
                  <h2 className="text-sm font-bold text-stone-800 dark:text-stone-100 flex items-center gap-1.5">
                    <span>🎮 Playable Counting Frame</span>
                    <span className="text-[10px] font-mono font-medium text-stone-400">({rowCount} active place values)</span>
                  </h2>
                </div>

                {/* Action Toolkit */}
                <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
                  <button
                    onClick={toggleFullscreen}
                    className="flex-1 sm:flex-initial bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs px-2.5 py-1 rounded-xl transition-all flex items-center justify-center gap-1"
                    title="Expand Abacus to Full Screen Mode (F)"
                    id="abacus-fullscreen-action-btn"
                  >
                    <Maximize2 className="w-3 h-3 text-amber-500" />
                    <span>Full Screen</span>
                  </button>
                  <button
                    onClick={handleRandomize}
                    className="flex-1 sm:flex-initial bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-xs px-2.5 py-1 rounded-xl transition-all flex items-center justify-center gap-1"
                    title="Randomize beads"
                    id="randomize-beads-btn"
                  >
                    <Shuffle className="w-3 h-3" />
                    <span>Randomize</span>
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="flex-1 sm:flex-initial bg-stone-100 hover:bg-red-50 dark:bg-stone-800 dark:hover:bg-red-950/20 border border-stone-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:text-red-600 dark:hover:text-red-400 font-semibold text-xs px-2.5 py-1 rounded-xl transition-all flex items-center justify-center gap-1"
                    title="Clear all beads to zero"
                    id="clear-beads-btn"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}

            {/* Dynamic rendering based on layout configuration */}
            <div className="w-full flex justify-center items-center flex-grow py-0.5">
              {abacusType === 'vertical' ? (
                <AbacusVertical
                  columns={activePlaceValues}
                  beadStates={beadStates}
                  onBeadChange={handleBeadChange}
                  beadTheme={beadTheme}
                  isCompact={isFullscreen || rowCount > 6}
                />
              ) : (
                <AbacusClassic
                  rows={activePlaceValues}
                  beadStates={beadStates}
                  onBeadChange={handleBeadChange}
                  beadTheme={beadTheme}
                  isCompact={isFullscreen || rowCount > 5}
                />
              )}
            </div>

            {/* REAL-TIME ALIGNED PLACE VALUE DIGIT BOARD & CONSOLIDATED BOTTOM RESULTS */}
            <div className="pt-2.5 border-t border-stone-100 dark:border-stone-800 flex flex-col gap-2.5 shrink-0">
              
              {/* Digit Cells aligned side-by-side representing base-10 layout */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
                {digitRepresentation.map(({ row, digit, placeValueText, expandedValue }) => {
                  return (
                    <div 
                      key={row.exponent} 
                      className="bg-stone-50 dark:bg-stone-950 border-2 border-stone-200/90 dark:border-stone-800/90 rounded-2xl px-3.5 py-2 sm:px-4 sm:py-2.5 flex items-center gap-2.5 sm:gap-3 shadow-sm hover:border-amber-500/50 transition-all"
                    >
                      {/* Color marker tag */}
                      <div className={`w-3.5 h-3.5 rounded-full bg-gradient-to-br ${row.color} shrink-0 shadow-xs`} />
                      
                      {/* Large digit - depicted with doubled font size */}
                      <span className="text-2xl sm:text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-100 font-mono leading-none tracking-tight">
                        {digit}
                      </span>

                      {/* Power placeholder / full number name */}
                      <div className="flex flex-col leading-tight">
                        <span className="text-xs sm:text-sm md:text-base font-extrabold text-stone-700 dark:text-stone-200 font-mono leading-none">
                          {row.shortName}
                        </span>
                        <span className="text-[10px] sm:text-xs text-stone-400 font-mono leading-none mt-0.5">
                          10<sup>{row.exponent}</sup>
                        </span>
                      </div>

                      {/* Value contribution - depicted with doubled font size */}
                      <span className="text-xs sm:text-sm md:text-base font-black text-emerald-600 dark:text-emerald-400 font-mono leading-none pl-1 border-l-2 border-stone-200 dark:border-stone-800">
                        + {expandedValue.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Grand Total Equation + Total in Words + Total Tally in ONE Consolidated Bar */}
              <div className="bg-stone-50 dark:bg-stone-950 border-2 border-stone-200 dark:border-stone-800 p-2.5 sm:p-3.5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-3 shadow-sm">
                
                {/* Left: Math Equation & Total in Words */}
                <div className="flex flex-col gap-1.5 min-w-0 flex-grow text-center sm:text-left w-full sm:w-auto">
                  {/* Math Equation Formula - Doubled font size */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm md:text-base font-mono text-stone-600 dark:text-stone-300 font-bold">
                    <span className="font-black text-amber-600 dark:text-amber-400 uppercase text-xs sm:text-sm tracking-wider">Formula:</span>
                    <span className="truncate max-w-2xl font-mono">
                      {digitRepresentation
                        .map(({ digit, row }) => `(${digit} × 10${row.exponent > 0 ? `^${row.exponent}` : ''})`)
                        .reverse()
                        .join(' + ') || '0'}
                    </span>
                  </div>
                  
                  {/* Total in Words - Doubled font size */}
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                    <span className="text-xs sm:text-sm uppercase font-black text-stone-400 tracking-wider shrink-0">Words:</span>
                    <span className="text-base sm:text-xl md:text-2xl font-black text-stone-900 dark:text-stone-100 capitalize italic truncate" id="total-in-words">
                      {numberToWords(totalValue)}
                    </span>
                  </div>
                </div>

                {/* Right: Final Total Tally Badge - Prominent large font */}
                <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-stone-100 py-2 px-5 rounded-2xl shadow-md border-b-4 border-amber-800 flex items-center gap-3 shrink-0">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-200">TOTAL</span>
                  <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight font-mono leading-none" id="abacus-total-value">
                    {totalValue.toLocaleString()}
                  </span>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* Render Lessons Mode or Quizzes Mode based on active Mode Tab */}
        {gameMode === 'lessons' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Lessons
              currentLessonId={currentLessonId}
              onSelectLesson={setCurrentLessonId}
              onApplyPreset={applyPreset}
            />
          </section>
        )}

        {gameMode === 'challenges' && (
          <section className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Challenges
              currentChallengeId={currentChallengeId}
              onSelectChallenge={setCurrentChallengeId}
              currentAbacusValue={totalValue}
              onApplyPreset={applyPreset}
            />
          </section>
        )}

      </main>

      {/* Footer explaining educational details (only in standard mode) */}
      {!isFullscreen && (
        <footer className="bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-3 px-4 md:px-6 mt-auto shrink-0">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400">
            <div>
              © 2026 Interactive Abacus Game. Base-10 STEM curriculum.
            </div>
            <div className="flex gap-3">
              <span>Place Values</span>
              <span>•</span>
              <span>Decimal System</span>
              <span>•</span>
              <span>Soroban</span>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
