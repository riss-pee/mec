import { useState, useEffect } from 'react';
import { GameMode, Language } from './types';
import FractionGrid from './components/FractionGrid';
import MathDisplay from './components/MathDisplay';
import ChallengePanel from './components/ChallengePanel';
import { translations } from './utils/translations';
import { 
  setMute, 
  getMuteState, 
  playClickSound 
} from './utils/audio';
import { 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Settings, 
  Grid3X3,
  Hash,
  Sparkles,
  Shuffle,
  Trash2,
  Maximize2,
  BookOpen,
  Languages
} from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState<GameMode>('explore');
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('fraction_game_lang');
    return (saved === 'mizo' || saved === 'en') ? saved : 'en';
  });

  const t = translations[lang];

  useEffect(() => {
    localStorage.setItem('fraction_game_lang', lang);
  }, [lang]);
  
  // Explore Mode Grid State (Sandbox)
  const [exploreRows, setExploreRows] = useState(5);
  const [exploreCols, setExploreCols] = useState(5);
  const [exploreShaded, setExploreShaded] = useState<boolean[]>(() => Array(25).fill(false));

  // Challenge Mode Grid State (Shade Quest / Guess Shade)
  const [challengeRows, setChallengeRows] = useState(5);
  const [challengeCols, setChallengeCols] = useState(5);
  const [challengeShaded, setChallengeShaded] = useState<boolean[]>(() => Array(25).fill(false));

  const isExplore = mode === 'explore';

  const rows = isExplore ? exploreRows : challengeRows;
  const cols = isExplore ? exploreCols : challengeCols;
  const shaded = isExplore ? exploreShaded : challengeShaded;

  const setRows = (r: number) => {
    if (isExplore) {
      setExploreRows(r);
    } else {
      setChallengeRows(r);
    }
  };

  const setCols = (c: number) => {
    if (isExplore) {
      setExploreCols(c);
    } else {
      setChallengeCols(c);
    }
  };

  const setShaded = (newShaded: boolean[] | ((prev: boolean[]) => boolean[])) => {
    if (isExplore) {
      setExploreShaded(newShaded);
    } else {
      setChallengeShaded(newShaded);
    }
  };

  const [showNumbers, setShowNumbers] = useState(true);
  const [muted, setMuted] = useState(() => getMuteState());

  // Count shaded squares
  const shadedCount = shaded.filter(Boolean).length;
  const totalSquares = rows * cols;

  // Toggle sound
  const handleToggleMute = () => {
    const nextMute = !muted;
    setMuted(nextMute);
    setMute(nextMute);
    // Play a short sound to confirm unmuting
    if (!nextMute) {
      setTimeout(() => {
        playClickSound();
      }, 50);
    }
  };

  // Helper to change dimensions while preserving cell states where they overlap
  const handleDimensionChange = (newRows: number, newCols: number) => {
    const r = Math.max(2, Math.min(100, newRows));
    const c = Math.max(2, Math.min(100, newCols));

    const newShaded = Array(r * c).fill(false);
    // Copy overlapping cells
    for (let i = 0; i < Math.min(r, rows); i++) {
      for (let j = 0; j < Math.min(c, cols); j++) {
        newShaded[i * c + j] = shaded[i * cols + j];
      }
    }
    setRows(r);
    setCols(c);
    setShaded(newShaded);
  };

  // Action: Clear All Shading
  const handleClearAll = () => {
    playClickSound();
    setShaded(Array(rows * cols).fill(false));
  };

  // Action: Fill All Squares
  const handleFillAll = () => {
    playClickSound();
    setShaded(Array(rows * cols).fill(true));
  };

  // Action: Invert Selection
  const handleInvert = () => {
    playClickSound();
    setShaded(shaded.map(val => !val));
  };

  // Action: Randomize Shading
  const handleRandomize = () => {
    playClickSound();
    const ratio = Math.random(); // random fraction
    const newShaded = shaded.map(() => Math.random() < ratio);
    setShaded(newShaded);
  };

  // Callback to set up a specific challenge dimensions & shaded array
  const handleNewChallengeSetup = (targetRows: number, targetCols: number, fillShaded?: boolean[]) => {
    setRows(targetRows);
    setCols(targetCols);
    if (fillShaded) {
      setShaded(fillShaded);
    } else {
      setShaded(Array(targetRows * targetCols).fill(false));
    }
  };

  return (
    <div id="game-container" className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-amber-100 pb-12">
      
      {/* HEADER SECTION */}
      <header id="main-header" className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-amber-500 to-yellow-400 rounded-xl text-white shadow-md shadow-amber-100">
              <Grid3X3 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                {lang === 'mizo' ? 'Fraction Grid Game (Mizo)' : 'Fraction Grid Game'}
              </h1>
              <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:block">
                {t.appSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Switcher */}
            <div id="language-switcher" className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200" title={t.languageLabel}>
              <Languages className="w-4 h-4 text-slate-500 ml-1.5 mr-1" />
              <button
                id="lang-btn-en"
                onClick={() => { playClickSound(); setLang('en'); }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  lang === 'en'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                English
              </button>
              <button
                id="lang-btn-mizo"
                onClick={() => { playClickSound(); setLang('mizo'); }}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  lang === 'mizo'
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Mizo
              </button>
            </div>

            {/* Sound toggle button */}
            <button
              id="sound-toggle-btn"
              onClick={handleToggleMute}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 text-xs font-bold cursor-pointer ${
                muted 
                  ? 'bg-slate-100 border-slate-200 text-slate-400' 
                  : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
              }`}
              title={muted ? "Unmute Sounds" : "Mute Sounds"}
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-bounce-slow" />}
              <span className="hidden md:inline">{muted ? t.soundMuted : t.soundOn}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN GAME BOARD */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 mt-6 space-y-6">
        
        {/* DYNAMIC MODE CONTROLLER & SCOREBOARD - TOP MOST OF MAIN WINDOW */}
        <ChallengePanel
          mode={mode}
          onModeChange={setMode}
          rows={rows}
          cols={cols}
          setRows={setRows}
          setCols={setCols}
          shadedCount={shadedCount}
          totalSquares={totalSquares}
          setShaded={setShaded}
          onNewChallengeSetup={handleNewChallengeSetup}
          lang={lang}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* LEFT COLUMN: THE INTERACTIVE GRID CANVAS & QUICK PRESETS */}
          <div id="grid-interactive-section" className="lg:col-span-5 space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Grid3X3 className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-slate-700 text-sm uppercase tracking-wider">
                    {t.canvasTitle}
                  </span>
                </div>
                <span className="text-xs bg-slate-100 px-2 py-0.5 rounded-md font-mono text-slate-500 font-bold">
                  {shadedCount} / {totalSquares} {t.squaresUnit}
                </span>
              </div>

              {/* Render canvas-based performance-optimized grid */}
              <FractionGrid
                rows={rows}
                cols={cols}
                shaded={shaded}
                onChange={setShaded}
                showNumbers={showNumbers}
                interactive={mode !== 'guess'} // Grid is read-only in Guess Mode
              />

              {/* Grid Interactive Hints */}
              <div className="text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-2">
                {mode === 'guess' ? (
                  <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded">
                    {t.gridHintGuessMode}
                  </span>
                ) : (
                  <>
                    <span className="bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded font-bold">{t.gridHintClickDrag}</span> 
                    <span>{t.gridHintToShade}</span>
                  </>
                )}
              </div>

              {/* BOARD ACTIONS BAR */}
              {mode !== 'guess' && (
                <div id="board-quick-actions" className="grid grid-cols-4 gap-2 pt-1 border-t border-slate-100">
                  <button
                    id="action-clear"
                    onClick={handleClearAll}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-[10px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    {t.clearAll}
                  </button>
                  <button
                    id="action-fill"
                    onClick={handleFillAll}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-[10px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <Maximize2 className="w-4 h-4 text-blue-500" />
                    {t.fillAll}
                  </button>
                  <button
                    id="action-invert"
                    onClick={handleInvert}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-[10px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <Hash className="w-4 h-4 text-purple-500" />
                    {t.invert}
                  </button>
                  <button
                    id="action-random"
                    onClick={handleRandomize}
                    className="flex flex-col items-center gap-1 p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors text-[10px] font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                  >
                    <Shuffle className="w-4 h-4 text-amber-500" />
                    {t.random}
                  </button>
                </div>
              )}
            </div>

            {/* GRID DIMENSION CONFIGURATION */}
            {mode === 'explore' && (
              <div id="grid-dimensions-panel" className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Settings className="w-4 h-4 text-slate-400" />
                  <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider">
                    {t.sandboxTitle}
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Columns Control */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500">{t.colsLabel}</label>
                      <span className="font-mono text-xs font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        {cols}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        id="input-cols-slider"
                        type="range"
                        min={2}
                        max={100}
                        value={cols}
                        onChange={(e) => handleDimensionChange(rows, parseInt(e.target.value, 10))}
                        className="flex-1 accent-amber-500 h-1 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <input
                        id="input-cols-number"
                        type="number"
                        min={2}
                        max={100}
                        value={cols}
                        onChange={(e) => handleDimensionChange(rows, parseInt(e.target.value, 10) || 5)}
                        className="w-14 text-center border border-slate-200 rounded-lg text-xs py-1 font-bold font-mono text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-300"
                      />
                    </div>
                  </div>

                  {/* Rows Control */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-slate-500">{t.rowsLabel}</label>
                      <span className="font-mono text-xs font-extrabold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                        {rows}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        id="input-rows-slider"
                        type="range"
                        min={2}
                        max={100}
                        value={rows}
                        onChange={(e) => handleDimensionChange(parseInt(e.target.value, 10), cols)}
                        className="flex-1 accent-amber-500 h-1 bg-slate-200 rounded-lg cursor-pointer"
                      />
                      <input
                        id="input-rows-number"
                        type="number"
                        min={2}
                        max={100}
                        value={rows}
                        onChange={(e) => handleDimensionChange(parseInt(e.target.value, 10) || 5, cols)}
                        className="w-14 text-center border border-slate-200 rounded-lg text-xs py-1 font-bold font-mono text-slate-700 bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-amber-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Toggles (e.g. Show numbers toggle) */}
                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-slate-400" />
                    {t.showNumbersLabel} (1 - {rows * cols})
                  </span>
                  <button
                    id="toggle-cell-numbers"
                    onClick={() => { playClickSound(); setShowNumbers(!showNumbers); }}
                    className={`w-9 h-5 rounded-full transition-all relative cursor-pointer ${
                      showNumbers ? 'bg-amber-500' : 'bg-slate-200'
                    }`}
                  >
                    <div 
                      className={`w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                        showNumbers ? 'left-5' : 'left-0.5'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: CONTROLS, CURRENT VALUES & MATH CONTEXT */}
          <div id="controls-stats-section" className="lg:col-span-7 space-y-6">
            
            {/* MATH METRICS DISPLAY (Live visual representation) */}
            {mode !== 'guess' && (
              <MathDisplay
                total={totalSquares}
                shaded={shadedCount}
                lang={lang}
              />
            )}

            {/* GUESS MODE EDUCATIONAL REFERENCE SHEET */}
            {mode === 'guess' && (
              <div id="guess-educational-guide" className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5 animate-fade-in text-slate-700 text-left">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">
                    {t.cheatSheetTitle}
                  </h3>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.cheatSheetDesc}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Conversions column */}
                  <div className="space-y-2 text-left">
                    <h4 className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                      {t.commonProportions}
                    </h4>
                    <div className="space-y-1.5 font-mono text-xs">
                      <div className="flex justify-between bg-slate-50 px-2 py-1 rounded">
                        <span className="font-bold">{t.half}</span>
                        <span className="text-indigo-600">0.50 = 50%</span>
                      </div>
                      <div className="flex justify-between bg-slate-50 px-2 py-1 rounded">
                        <span className="font-bold">{t.quarter}</span>
                        <span className="text-indigo-600">0.25 = 25%</span>
                      </div>
                      <div className="flex justify-between bg-slate-50 px-2 py-1 rounded">
                        <span className="font-bold">{t.threeQuarters}</span>
                        <span className="text-indigo-600">0.75 = 75%</span>
                      </div>
                      <div className="flex justify-between bg-slate-50 px-2 py-1 rounded">
                        <span className="font-bold">{t.fifth}</span>
                        <span className="text-indigo-600">0.20 = 20%</span>
                      </div>
                      <div className="flex justify-between bg-slate-50 px-2 py-1 rounded">
                        <span className="font-bold">{t.tenth}</span>
                        <span className="text-indigo-600">0.10 = 10%</span>
                      </div>
                    </div>
                  </div>

                  {/* Formulas Column */}
                  <div className="space-y-2 text-left">
                    <h4 className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                      {t.howToCalculate}
                    </h4>
                    <ul className="text-xs space-y-2 text-slate-600 list-disc list-inside">
                      <li>
                        <strong className="text-slate-800">Fraction:</strong> {t.calcFractionDesc} <span className="font-mono bg-slate-50 px-1 rounded">12/25</span>.
                      </li>
                      <li>
                        <strong className="text-slate-800">Decimal:</strong> {t.calcDecimalDesc} <span className="font-mono bg-slate-50 px-1 rounded">12 ÷ 25 = 0.48</span>.
                      </li>
                      <li>
                        <strong className="text-slate-800">Percentage:</strong> {t.calcPercentageDesc} <span className="font-mono bg-slate-50 px-1 rounded">0.48 = 48%</span>.
                      </li>
                      <li>
                        <strong className="text-slate-800">Ratio:</strong> {t.calcRatioDesc}
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-3 text-[11px] text-indigo-800 leading-relaxed">
                  💡 <strong className="font-bold">{t.proTipTitle}</strong> {lang === 'mizo' ? (
                    <>Tunah hian grid lian zawng chu <span className="font-mono font-bold bg-white/80 px-1 py-0.5 rounded border border-indigo-200">{rows} × {cols} ({rows * cols} bawm)</span> a ni. Veilama bawm rawng hnawih zat chhiar la, a vai zat khan sem rawh le!</>
                  ) : (
                    <>The grid size is currently <span className="font-mono font-bold bg-white/80 px-1 py-0.5 rounded border border-indigo-200">{rows} × {cols} ({rows * cols} squares)</span>. {t.proTipText}</>
                  )}
                </div>
              </div>
            )}

          </div>

        </div>

      </main>
    </div>
  );
}
