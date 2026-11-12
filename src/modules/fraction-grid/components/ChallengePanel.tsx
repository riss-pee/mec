import React, { useState, useEffect } from 'react';
import { GameMode, Challenge, ParseResult, Language } from '../types';
import { generateChallenge, parseMathInput, simplifyFraction } from '../utils/mathUtils';
import { playSuccessSound, playFailSound, playClickSound, playLevelUpSound } from '../utils/audio';
import { translations, getInstructionText, getShadeFeedbackText } from '../utils/translations';
import { 
  Trophy, 
  Flame, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  ArrowRight,
  BookOpen,
  HelpCircle as QuestionIcon
} from 'lucide-react';

interface ChallengePanelProps {
  mode: GameMode;
  onModeChange: (newMode: GameMode) => void;
  rows: number;
  cols: number;
  setRows: (r: number) => void;
  setCols: (c: number) => void;
  shadedCount: number;
  totalSquares: number;
  setShaded: (arr: boolean[]) => void;
  onNewChallengeSetup: (targetRows: number, targetCols: number, fillShaded?: boolean[]) => void;
  lang?: Language;
}

export default function ChallengePanel({
  mode,
  onModeChange,
  rows,
  cols,
  setRows,
  setCols,
  shadedCount,
  totalSquares,
  setShaded,
  onNewChallengeSetup,
  lang = 'en',
}: ChallengePanelProps) {
  const t = translations[lang];

  // Scoreboard state (persisted in local storage or session)
  const [score, setScore] = useState<number>(() => {
    const saved = localStorage.getItem('fraction_game_score');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [streak, setStreak] = useState<number>(() => {
    const saved = localStorage.getItem('fraction_game_streak');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  // Input value for math validation
  const [inputValue, setInputValue] = useState('');
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  // Current active challenge for 'shade' and 'guess' modes
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [guessChecked, setGuessChecked] = useState(false);
  const [guessIsCorrect, setGuessIsCorrect] = useState(false);

  const [prevMode, setPrevMode] = useState(mode);

  // Render-phase state reset to prevent brief flickering of stale states during transition
  if (mode !== prevMode) {
    setPrevMode(mode);
    setInputValue('');
    setParseResult(null);
    setShowFeedback(false);
    setActiveChallenge(null);
    setGuessChecked(false);
    setGuessIsCorrect(false);
  }

  // Sync score and streak to local storage
  useEffect(() => {
    localStorage.setItem('fraction_game_score', score.toString());
  }, [score]);

  useEffect(() => {
    localStorage.setItem('fraction_game_streak', streak.toString());
  }, [streak]);

  // Load new challenge on mode or difficulty change
  useEffect(() => {
    if (mode === 'shade' || mode === 'guess') {
      startNewChallenge();
    } else {
      setParseResult(null);
      setShowFeedback(false);
    }
  }, [mode, difficulty]);

  // Start/Generate a new challenge
  const startNewChallenge = () => {
    playClickSound();
    const challenge = generateChallenge(difficulty);
    setActiveChallenge(challenge);
    setInputValue('');
    setParseResult(null);
    setShowFeedback(false);
    setGuessChecked(false);
    setGuessIsCorrect(false);

    if (mode === 'shade') {
      // For shade mode: setup an empty grid of the challenge dimensions
      onNewChallengeSetup(challenge.rows, challenge.cols, Array(challenge.rows * challenge.cols).fill(false));
    } else if (mode === 'guess') {
      // For guess mode: configure a pre-shaded grid matching targetValue
      const totalCells = challenge.rows * challenge.cols;
      
      // Determine exactly how many cells to shade to match the target value
      const cellsToShade = Math.round(challenge.targetValue * totalCells);
      
      // Generate randomized indices to shade
      const shadedArr = Array(totalCells).fill(false);
      let shadedCount = 0;
      
      // Simple random placement
      while (shadedCount < cellsToShade) {
        const randIndex = Math.floor(Math.random() * totalCells);
        if (!shadedArr[randIndex]) {
          shadedArr[randIndex] = true;
          shadedCount++;
        }
      }
      
      onNewChallengeSetup(challenge.rows, challenge.cols, shadedArr);
    }
  };

  // Check the submission for Explore Mode
  const handleCheckExploreInput = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const result = parseMathInput(inputValue, totalSquares, shadedCount, lang);
    setParseResult(result);
    setShowFeedback(true);

    if (result.isValid) {
      playSuccessSound();
      setScore(s => s + 5);
      setStreak(st => st + 1);
    } else {
      playFailSound();
      setStreak(0);
    }
  };

  // Submit Answer for Shade Quest (Grid Validation)
  const handleCheckShadeQuest = () => {
    if (!activeChallenge) return;

    const currentRatio = shadedCount / totalSquares;
    const isCorrect = Math.abs(currentRatio - activeChallenge.targetValue) < 0.001;

    setGuessChecked(true);
    setGuessIsCorrect(isCorrect);

    if (isCorrect) {
      playSuccessSound();
      const points = difficulty === 'easy' ? 10 : difficulty === 'medium' ? 20 : 35;
      setScore(s => s + points);
      setStreak(st => st + 1);
      
      // Level up celebration every 5 streak points
      if ((streak + 1) % 5 === 0) {
        setTimeout(() => {
          playLevelUpSound();
        }, 500);
      }
    } else {
      playFailSound();
      setStreak(0);
    }
  };

  // Submit Answer for Guess the Shade (Math Text Input Validation)
  const handleCheckGuessValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeChallenge || !inputValue.trim()) return;

    const result = parseMathInput(inputValue, totalSquares, shadedCount, lang);
    setParseResult(result);
    setGuessChecked(true);
    setGuessIsCorrect(result.isValid);

    if (result.isValid) {
      playSuccessSound();
      const points = difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 40;
      setScore(s => s + points);
      setStreak(st => st + 1);

      if ((streak + 1) % 5 === 0) {
        setTimeout(() => {
          playLevelUpSound();
        }, 500);
      }
    } else {
      playFailSound();
      setStreak(0);
    }
  };

  // Reset the high scores
  const handleResetScores = () => {
    playClickSound();
    if (confirm(t.resetConfirm)) {
      setScore(0);
      setStreak(0);
    }
  };

  return (
    <div id="challenge-panel-root" className="bg-slate-50 border border-slate-200 rounded-2xl p-5 shadow-sm space-y-6">
      
      {/* 1. HEADER & MODE SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            {t.activityMode}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">{t.modeSelectDesc}</p>
        </div>
        <div className="flex bg-slate-200 p-1 rounded-xl">
          <button
            id="mode-btn-explore"
            onClick={() => { playClickSound(); onModeChange('explore'); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'explore'
                ? 'bg-white text-slate-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.modeExplore}
          </button>
          <button
            id="mode-btn-shade"
            onClick={() => { playClickSound(); onModeChange('shade'); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'shade'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.modeShadeQuest}
          </button>
          <button
            id="mode-btn-guess"
            onClick={() => { playClickSound(); onModeChange('guess'); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              mode === 'guess'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.modeGuessShade}
          </button>
        </div>
      </div>

      {/* 2. STATS BAR */}
      <div className="grid grid-cols-3 gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 justify-center border-r border-slate-100">
          <Trophy className="w-5 h-5 text-amber-500" />
          <div className="text-center sm:text-left">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{t.score}</div>
            <div className="text-sm sm:text-base font-black text-slate-700 font-mono">{score}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 justify-center border-r border-slate-100">
          <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-500 animate-pulse' : 'text-slate-300'}`} />
          <div className="text-center sm:text-left">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">{t.streak}</div>
            <div className="text-sm sm:text-base font-black text-slate-700 font-mono">{streak}</div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button 
            id="btn-reset-score"
            onClick={handleResetScores}
            className="p-1 text-slate-400 hover:text-slate-600 transition-colors flex flex-col items-center justify-center gap-1 cursor-pointer"
            title="Reset high score"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="text-[9px] uppercase font-bold tracking-wider">{t.reset}</span>
          </button>
        </div>
      </div>

      {/* 3. MODE SPECIFIC PANELS */}
      
      {/* --- EXPLORE MODE PANEL --- */}
      {mode === 'explore' && (
        <div id="explore-mode-panel" className="space-y-4">
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 flex gap-3">
            <BookOpen className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-amber-800">{t.sandboxInfoTitle}</h4>
              <p className="text-xs text-amber-700 leading-relaxed">
                {t.sandboxInfoText}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* --- SHADE QUEST MODE PANEL (GRID CHALLENGE) --- */}
      {mode === 'shade' && activeChallenge && (
        <div id="shade-quest-panel" className="space-y-4">
          
          {/* Difficulty selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.difficulty}</span>
            <div className="flex gap-1.5">
              {(['easy', 'medium', 'hard'] as const).map((diff) => {
                const diffLabel = diff === 'easy' ? t.diffEasy : diff === 'medium' ? t.diffMedium : t.diffHard;
                return (
                  <button
                    key={diff}
                    onClick={() => { playClickSound(); setDifficulty(diff); }}
                    className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider transition-all cursor-pointer ${
                      difficulty === diff
                        ? diff === 'easy' ? 'bg-green-500 text-white' : diff === 'medium' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {diffLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border-2 border-amber-400 shadow-sm space-y-4 text-center">
            <div className="inline-block bg-amber-100 text-amber-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
              {t.questChallenge}
            </div>
            
            <h3 className="text-2xl font-black text-slate-800 tracking-tight leading-snug">
              {getInstructionText(activeChallenge, lang)}
            </h3>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 inline-flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-600 font-medium">
              <span>{t.gridSize}</span>
              <strong className="text-slate-800 font-mono">{activeChallenge.rows} × {activeChallenge.cols}</strong>
              <span className="text-slate-300">|</span>
              <span>{t.totalSquares}</span>
              <strong className="text-slate-800 font-mono">{activeChallenge.rows * activeChallenge.cols}</strong>
            </div>

            <div className="pt-2">
              <button
                id="shade-quest-check-btn"
                onClick={handleCheckShadeQuest}
                disabled={guessChecked}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-extrabold py-3 px-6 rounded-xl shadow-md shadow-amber-200 transition-all text-sm uppercase tracking-wider cursor-pointer"
              >
                {t.submitShadedGrid}
              </button>
            </div>
          </div>

          {guessChecked && (
            <div 
              id="shade-quest-feedback"
              className={`p-4 rounded-xl border-2 flex gap-3 animate-fade-in ${
                guessIsCorrect 
                  ? 'bg-green-50 border-green-400 text-green-800' 
                  : 'bg-red-50 border-red-300 text-red-800'
              }`}
            >
              {guessIsCorrect ? (
                <CheckCircle2 className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1.5 flex-1">
                <h4 className="text-sm font-black">
                  {guessIsCorrect ? t.successTitle : t.incorrectTitle}
                </h4>
                <p className="text-xs leading-relaxed">
                  {getShadeFeedbackText(guessIsCorrect, activeChallenge, shadedCount, totalSquares, lang)}
                </p>
                <div className="pt-1">
                  <button
                    id="shade-quest-next-btn"
                    onClick={startNewChallenge}
                    className={`flex items-center gap-1.5 font-bold text-xs py-1.5 px-3.5 rounded-lg shadow-sm transition-all cursor-pointer ${
                      guessIsCorrect 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-slate-700 hover:bg-slate-800 text-white'
                    }`}
                  >
                    {guessIsCorrect ? t.nextChallenge : t.retryOrSkip}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* --- GUESS THE SHADE MODE PANEL (TEXT GUESS CHALLENGE) --- */}
      {mode === 'guess' && activeChallenge && (
        <div id="guess-mode-panel" className="space-y-4">
          
          {/* Difficulty selector */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t.difficulty}</span>
            <div className="flex gap-1.5">
              {(['easy', 'medium', 'hard'] as const).map((diff) => {
                const diffLabel = diff === 'easy' ? t.diffEasy : diff === 'medium' ? t.diffMedium : t.diffHard;
                return (
                  <button
                    key={diff}
                    onClick={() => { playClickSound(); setDifficulty(diff); }}
                    className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider transition-all cursor-pointer ${
                      difficulty === diff
                        ? diff === 'easy' ? 'bg-green-500 text-white' : diff === 'medium' ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                        : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                    }`}
                  >
                    {diffLabel}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border-2 border-indigo-500 shadow-sm space-y-3">
            <div className="text-center">
              <span className="inline-block bg-indigo-100 text-indigo-800 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest">
                {t.guessingChallenge}
              </span>
              <p className="text-xs text-slate-500 mt-1">
                {t.guessDesc}
              </p>
            </div>

            {!guessChecked ? (
              <form onSubmit={handleCheckGuessValue} className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label htmlFor="guess-input" className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider text-left">
                    {t.enterGuessLabel}
                  </label>
                  <input
                    id="guess-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={t.guessPlaceholder}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-center"
                    required
                    autoFocus
                  />
                  <p className="text-[10px] text-slate-400 text-center italic mt-1">
                    {t.guessFormatHint}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    id="guess-submit-btn"
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-2.5 px-3 rounded-xl shadow-md shadow-indigo-100 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {t.checkGuess}
                  </button>
                  <button
                    id="guess-reveal-btn"
                    type="button"
                    onClick={() => {
                      playClickSound();
                      setGuessChecked(true);
                      setGuessIsCorrect(false);
                      setParseResult(null);
                      setStreak(0);
                    }}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-extrabold py-2.5 px-3 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-500" />
                    {t.giveUp}
                  </button>
                </div>
              </form>
            ) : (
              <div 
                id="guess-feedback-panel"
                className={`p-4 rounded-xl border-2 flex gap-3 animate-fade-in text-xs text-left ${
                  guessIsCorrect 
                    ? 'bg-green-50 border-green-400 text-green-800' 
                    : 'bg-red-50 border-red-300 text-red-800'
                }`}
              >
                {guessIsCorrect ? (
                  <CheckCircle2 className="w-5.5 h-5.5 text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5.5 h-5.5 text-red-500 shrink-0 mt-0.5" />
                )}
                <div className="space-y-2 flex-1">
                  <h4 className="text-sm font-black">
                    {guessIsCorrect 
                      ? `${t.brilliantGuess} (+${difficulty === 'easy' ? 15 : difficulty === 'medium' ? 25 : 40} ${t.ptsEarned})` 
                      : inputValue.trim() 
                        ? (lang === 'mizo' ? 'A la dik lo deuh!' : 'Not quite right!')
                        : t.answerRevealed}
                  </h4>
                  
                  {inputValue.trim() && (
                    <p className="text-[11px] leading-relaxed">
                      {t.yourGuess} <strong className="font-mono bg-white/60 px-1.5 py-0.5 rounded border border-slate-200 text-slate-800">{inputValue}</strong>.
                    </p>
                  )}

                  {!guessIsCorrect && parseResult?.error && (
                    <p className="text-[11px] font-medium text-red-600 bg-red-100/50 p-2 rounded-lg border border-red-200">
                      {parseResult.error}
                    </p>
                  )}

                  <div className="space-y-1 bg-white/40 p-2.5 rounded-xl border border-slate-200/50">
                    <p className="text-[11px] leading-relaxed">
                      {lang === 'mizo' ? (
                        <>Grid-a rawng hnawih zat chu <strong className="font-mono text-slate-900">{shadedCount} / {totalSquares}</strong> a ni a, chu chu grid a za zela <strong className="font-mono text-indigo-900">{((shadedCount/totalSquares)*100).toFixed(1)}%</strong> a ni.</>
                      ) : (
                        <>{t.preShadedPropText} <strong className="font-mono text-slate-900">{shadedCount} / {totalSquares}</strong>, which represents exactly <strong className="font-mono text-indigo-900">{((shadedCount/totalSquares)*100).toFixed(1)}%</strong> of the grid.</>
                      )}
                    </p>
                    <p className="text-[11px] leading-relaxed">
                      {t.simplifiedFractionLabel} <strong className="font-mono text-indigo-900">{simplifyFraction(shadedCount, totalSquares).numerator}/{simplifyFraction(shadedCount, totalSquares).denominator}</strong> | {t.decimalValueLabel} <strong className="font-mono text-indigo-900">{(shadedCount/totalSquares).toFixed(3)}</strong>
                    </p>
                  </div>

                  <div className="pt-1">
                    <button
                      id="guess-next-challenge-btn"
                      onClick={startNewChallenge}
                      className={`flex items-center gap-1.5 font-bold text-[11px] py-2 px-4 rounded-lg shadow-sm transition-all cursor-pointer ${
                        guessIsCorrect 
                          ? 'bg-green-600 hover:bg-green-700 text-white' 
                          : 'bg-slate-700 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {t.nextChallenge}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
