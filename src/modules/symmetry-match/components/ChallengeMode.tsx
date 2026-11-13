import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Trophy,
  CheckCircle,
  XCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  Zap,
  Lightbulb,
} from 'lucide-react';
import { Challenge, Option, PlayerStats } from '../types';
import { ALL_CHALLENGES, LEVELS, generateRandomChallenge } from '../challenges';
import SymmetryGrid from './SymmetryGrid';
import { useLanguage } from '../i18n';

interface ChallengeModeProps {
  stats: PlayerStats;
  updateStats: (updater: (prev: PlayerStats) => PlayerStats) => void;
  onNavigateToSandbox: () => void;
}

export default function ChallengeMode({
  stats,
  updateStats,
  onNavigateToSandbox,
}: ChallengeModeProps) {
  const { language, t } = useLanguage();

  // Game state: 'select' = select difficulty levels, 'playing' = active challenge gameplay
  const [gameState, setGameState] = useState<'select' | 'playing'>('select');
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number>(0);
  const [selectedOptionId, setSelectedOptionId] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [infiniteMode, setInfiniteMode] = useState<boolean>(false);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(null);
  const [leftPanelTab, setLeftPanelTab] = useState<'grid' | 'reallife'>('grid');

  // Helper to compute stats for each syllabus level
  const getLevelProgress = (lvlNum: number) => {
    const challenges = ALL_CHALLENGES.filter((c) => c.level === lvlNum);
    const solved = challenges.filter((ch) => stats.completedChallenges.includes(ch.id)).length;
    const total = challenges.length;
    const percent = total > 0 ? Math.min(100, (solved / total) * 100) : 0;
    return { solved, total, percent };
  };

  // Load level challenges or generate dynamic ones
  const levelChallenges = ALL_CHALLENGES.filter((c) => c.level === currentLevel);

  // Initialize or fetch challenge
  useEffect(() => {
    if (infiniteMode) {
      setActiveChallenge(generateRandomChallenge(currentLevel));
    } else {
      if (levelChallenges.length > 0) {
        const index = currentChallengeIndex % levelChallenges.length;
        setActiveChallenge(levelChallenges[index]);
      } else {
        // Fallback generator
        setActiveChallenge(generateRandomChallenge(currentLevel));
      }
    }
    // Reset answers
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(null);
    setShowExplanation(false);
    setLeftPanelTab('grid');
  }, [currentLevel, currentChallengeIndex, infiniteMode]);

  if (!activeChallenge) return null;

  const currentLevelInfo = LEVELS.find((l) => l.levelNum === currentLevel) || LEVELS[0];

  const handleSelectOption = (option: Option) => {
    if (isAnswered) return; // Prevent double answering

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    const isCorrectChoice = option.type === 'correct';
    setIsCorrect(isCorrectChoice);
    setShowExplanation(true);

    // Update global player metrics
    updateStats((prev) => {
      let newScore = prev.score;
      let newStreak = prev.streak;
      let newHighestStreak = prev.highestStreak;
      let newCompleted = [...prev.completedChallenges];

      if (isCorrectChoice) {
        // Correct answer points
        const multiplier = currentLevel; // higher levels yield more points
        newScore += 100 * multiplier + (newStreak >= 3 ? 25 : 0); // streak bonus
        newStreak += 1;
        if (newStreak > newHighestStreak) {
          newHighestStreak = newStreak;
        }
        if (!newCompleted.includes(activeChallenge.id)) {
          newCompleted.push(activeChallenge.id);
        }
      } else {
        // Reset streak on wrong answer
        newStreak = 0;
      }

      return {
        ...prev,
        score: newScore,
        streak: newStreak,
        highestStreak: newHighestStreak,
        completedChallenges: newCompleted,
      };
    });
  };

  const handleNextChallenge = () => {
    if (infiniteMode) {
      setCurrentChallengeIndex((prev) => prev + 1);
    } else {
      if (currentChallengeIndex + 1 < levelChallenges.length) {
        setCurrentChallengeIndex((prev) => prev + 1);
      } else {
        // Completed all hand-designed puzzles of the level! Give choice to advance
        if (currentLevel < 5) {
          setCurrentLevel((prev) => prev + 1);
          setCurrentChallengeIndex(0);
          setGameState('select');
        } else {
          setInfiniteMode(true);
          setCurrentChallengeIndex(0);
        }
      }
    }
  };

  const handleStartLevel = (lvlNum: number) => {
    setCurrentLevel(lvlNum);
    setCurrentChallengeIndex(0);
    setInfiniteMode(false);
    setGameState('playing');
  };

  const handleStartInfinite = () => {
    setInfiniteMode(true);
    setCurrentChallengeIndex(0);
    setGameState('playing');
  };

  // Get active selected option info
  const selectedOptionInfo = activeChallenge.options.find((o) => o.id === selectedOptionId);

  // Symmetry tips based on current level axis (Standard math terms preserved in Mizo mode)
  const getSymmetryTips = () => {
    if (language === 'mizo') {
      switch (activeChallenge.mirrorAxis.type) {
        case 'vertical':
          return 'Tip: Vertical lines hian horizontally a reflect ṭhin. Far-left a points te chu far-right lamah an flip ang. Y coordinates (height) erawh a ngai reng ang!';
        case 'horizontal':
          return 'Tip: Horizontal lines hian vertically a reflect ṭhin. A chunga elements te chu a hnuai lamah an flip ang. X coordinates (left/right) erawh a ngai reng ang!';
        case 'diagonal-up':
          return 'Tip: Diagonal y = x lines hian corner kânin elements a reflect ṭhin. Point (3, 1) a awm chu (1, 3)-ah a flip ang. X leh Y coordinates thlak thleng tawp a ni mai!';
        case 'diagonal-down':
          return 'Tip: Diagonal-down lines hian secondary diagonal hmangin elements a reflect ṭhin. Columns te chu rows-ah an chang a, grid borders nena inmilin an flip a ni.';
        default:
          return 'Red dashed mirror axis aṭanga blocks emaw corners hlat zawng uluk takin chhut la, reflected distance chu a inmil thlap tur a ni!';
      }
    }
    switch (activeChallenge.mirrorAxis.type) {
      case 'vertical':
        return 'Tip: Vertical lines reflect horizontally. Points on the far-left flip to the far-right. The Y coordinates (height) stay exactly the same!';
      case 'horizontal':
        return 'Tip: Horizontal lines reflect vertically. Elements at the top flip to the bottom. The X coordinates (left/right) stay exactly the same!';
      case 'diagonal-up':
        return 'Tip: Diagonal y = x lines reflect elements across the corner. A point at (3, 1) flips to (1, 3). Simply swap the X and Y coordinates!';
      case 'diagonal-down':
        return 'Tip: Diagonal-down lines reflect elements through the secondary diagonal. Columns become rows, flipped relative to the grid borders.';
      default:
        return 'Analyze the distance of each corner or block to the red dashed mirror. The mirrored distance must match perfectly!';
    }
  };

  // 1. RENDER LEVEL SELECTION SCREEN
  if (gameState === 'select') {
    return (
      <motion.div
        id="level-selector-screen"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        className="w-full max-w-5xl mx-auto"
      >
        {/* Banner header */}
        <div className="text-center max-w-2xl mx-auto mb-10 select-none">
          <span className="font-mono text-[10px] font-bold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">
            {t('syllabusBadge')}
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-800 uppercase tracking-tight mt-3">
            {t('selectLevelTitle')}
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            {t('selectLevelDesc')}
          </p>
        </div>

        {/* Level selection grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {LEVELS.map((level) => {
            const { solved, total, percent } = getLevelProgress(level.levelNum);
            const isCompleted = solved === total && total > 0;
            const levelName = language === 'mizo' && level.nameMizo ? level.nameMizo : level.name;
            const levelDiff = language === 'mizo' && level.difficultyMizo ? level.difficultyMizo : level.difficulty;
            const levelDesc = language === 'mizo' && level.descriptionMizo ? level.descriptionMizo : level.description;

            return (
              <motion.div
                key={level.levelNum}
                id={`level-card-${level.levelNum}`}
                whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)' }}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between transition-all relative overflow-hidden group"
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-display font-black text-xs">
                      {level.levelNum}
                    </span>
                    <span
                      className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest ${
                        level.difficulty === 'Easy'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : level.difficulty === 'Medium'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/50'
                          : level.difficulty === 'Hard'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200/50'
                          : 'bg-purple-50 text-purple-700 border border-purple-200/50'
                      }`}
                    >
                      {levelDiff}
                    </span>
                  </div>

                  {/* Card Title & Desc */}
                  <h3 className="font-display font-bold text-sm text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                    {levelName}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                    {levelDesc}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mb-1.5 uppercase font-mono">
                    <span>{t('progressLabel')}</span>
                    <span className={isCompleted ? 'text-emerald-600 font-bold' : 'text-slate-600'}>
                      {isCompleted ? t('completeBadge') : t('solvedFraction', { solved, total })}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  <button
                    id={`btn-start-level-${level.levelNum}`}
                    onClick={() => handleStartLevel(level.levelNum)}
                    className="w-full mt-4 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-display font-bold text-[11px] uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1"
                  >
                    <span>{solved > 0 ? t('resumeChallengeBtn') : t('startChallengeBtn')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* INFINITE PLAYGROUND CARD */}
          <motion.div
            id="level-card-infinite"
            whileHover={{ y: -4 }}
            className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group border border-slate-800"
          >
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-display font-black text-xs">
                  ★
                </span>
                <span className="text-[9px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20 uppercase tracking-widest animate-pulse">
                  Infinite
                </span>
              </div>

              <h3 className="font-display font-bold text-sm uppercase tracking-tight text-white group-hover:text-indigo-400 transition-colors">
                {t('infiniteCardTitle')}
              </h3>
              <p className="text-[11px] text-slate-400 mt-2 leading-relaxed">
                {t('infiniteCardDesc')}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                id="btn-start-infinite"
                onClick={handleStartInfinite}
                className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-black text-[11px] uppercase tracking-wider transition-all rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-slate-950" />
                <span>{t('launchInfiniteBtn')}</span>
              </button>
            </div>
          </motion.div>
        </div>

        {/* QUICK BOTTOM TRIVIA / TIPS */}
        <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 flex items-center gap-4 select-none shadow-xs max-w-xl mx-auto">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 border border-indigo-100">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-wide">
              {t('didYouKnowTitle')}
            </h4>
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              {t('didYouKnowDesc')}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  // Active challenge strings in selected language
  const activeTitle = language === 'mizo' && activeChallenge.titleMizo ? activeChallenge.titleMizo : activeChallenge.title;
  const activeDesc = language === 'mizo' && activeChallenge.descriptionMizo ? activeChallenge.descriptionMizo : activeChallenge.description;
  const activeRealWorldTitle = language === 'mizo' && activeChallenge.realWorldTitleMizo ? activeChallenge.realWorldTitleMizo : activeChallenge.realWorldTitle;
  const activeRealWorldDesc = language === 'mizo' && activeChallenge.realWorldDescriptionMizo ? activeChallenge.realWorldDescriptionMizo : activeChallenge.realWorldDescription;

  // 2. RENDER GAME BOARD SCREEN (PLAYING INDIVIDUAL PUZZLE)
  return (
    <motion.div
      id="gameplay-board-screen"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-5xl mx-auto flex flex-col gap-5"
    >
      {/* Back button to level selector */}
      <div className="flex items-center justify-between">
        <button
          id="btn-back-to-selector"
          onClick={() => setGameState('select')}
          className="inline-flex items-center gap-2 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl font-display font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
        >
          <span>{t('backToSyllabus')}</span>
        </button>

        <span className="font-mono text-[10px] font-black uppercase text-indigo-600 tracking-wider bg-indigo-50 border border-indigo-100/50 px-3 py-1 rounded-full">
          Level {currentLevel}: {language === 'mizo' && currentLevelInfo.nameMizo ? currentLevelInfo.nameMizo : currentLevelInfo.name}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT COLUMN: ACTIVE PUZZLE WORKSPACE */}
        <div id="puzzle-workspace-panel" className="lg:col-span-8 flex flex-col gap-6">
          {/* HEADER BAR FOR PUZZLE */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4 select-none">
            <div className="flex items-center gap-3.5">
              <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-display font-black text-sm">
                {currentLevel}
              </span>
              <div>
                <h1 className="font-display font-extrabold text-sm sm:text-base text-slate-800 uppercase tracking-tight">
                  {activeTitle}
                </h1>
                <p className="text-[11px] text-slate-400 font-medium">
                  {infiniteMode
                    ? t('infiniteModeActive')
                    : t('challengeCounter', { current: currentChallengeIndex + 1, total: levelChallenges.length })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full text-xs font-bold font-mono">
                <Trophy className="w-3.5 h-3.5 text-indigo-600" />
                <span>{stats.score} XP</span>
              </div>
            </div>
          </div>

          {/* SPLIT SCREEN WORKSPACE: FIGURE vs. OPTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            {/* LEFT: REFERENCE FIGURE */}
            <div className="md:col-span-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                {/* Tab switcher */}
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-2.5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 font-sans">
                    {t('refModelLabel')}
                  </span>
                  {activeChallenge.realWorldImage && (
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200/50">
                      <button
                        onClick={() => setLeftPanelTab('grid')}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                          leftPanelTab === 'grid'
                            ? 'bg-white text-indigo-600 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {t('mathGridTab')}
                      </button>
                      <button
                        onClick={() => setLeftPanelTab('reallife')}
                        className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all flex items-center gap-1 ${
                          leftPanelTab === 'reallife'
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        <Sparkles className="w-3 h-3 fill-amber-300 stroke-amber-400 text-amber-100" />
                        {t('realLifeTab')}
                      </button>
                    </div>
                  )}
                </div>

                {leftPanelTab === 'grid' ? (
                  <>
                    <p className="text-[11px] text-slate-500 mb-4 leading-relaxed">
                      {activeDesc}
                    </p>

                    <div className="flex items-center justify-center py-4 bg-slate-50/50 rounded-xl border border-slate-100">
                      <SymmetryGrid
                        id="original-figure-grid"
                        gridSize={activeChallenge.gridSize}
                        blocks={activeChallenge.blocks}
                        polygonPoints={activeChallenge.polygonPoints}
                        polygonColor={activeChallenge.polygonColor}
                        mirrorAxis={activeChallenge.mirrorAxis}
                        title="Figure & Mirror Line"
                        badge={activeChallenge.mirrorAxis.label}
                      />
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-3"
                  >
                    <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-square w-full bg-slate-900 flex items-center justify-center">
                      <img
                        src={activeChallenge.realWorldImage}
                        alt={activeRealWorldTitle}
                        className="object-cover w-full h-full opacity-90 select-none pointer-events-none"
                        referrerPolicy="no-referrer"
                      />
                      {/* Symmetrical Axis Overlay line */}
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                        <svg className="w-full h-full absolute inset-0">
                          {activeChallenge.mirrorAxis.type === 'vertical' && (
                            <line
                              x1="50%"
                              y1="0"
                              x2="50%"
                              y2="100%"
                              stroke="#ef4444"
                              strokeWidth="3.5"
                              strokeDasharray="6,6"
                              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                            />
                          )}
                          {activeChallenge.mirrorAxis.type === 'horizontal' && (
                            <line
                              x1="0"
                              y1="50%"
                              x2="100%"
                              y2="50%"
                              stroke="#ef4444"
                              strokeWidth="3.5"
                              strokeDasharray="6,6"
                              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                            />
                          )}
                          {activeChallenge.mirrorAxis.type === 'diagonal-up' && (
                            <line
                              x1="0"
                              y1="100%"
                              x2="100%"
                              y2="0"
                              stroke="#ef4444"
                              strokeWidth="3.5"
                              strokeDasharray="6,6"
                              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                            />
                          )}
                          {activeChallenge.mirrorAxis.type === 'diagonal-down' && (
                            <line
                              x1="0"
                              y1="0"
                              x2="100%"
                              y2="100%"
                              stroke="#ef4444"
                              strokeWidth="3.5"
                              strokeDasharray="6,6"
                              className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                            />
                          )}
                        </svg>
                        <span className="absolute bottom-3 bg-red-600/95 backdrop-blur-xs text-white text-[9px] px-3 py-1 font-black rounded-full font-mono uppercase tracking-wider shadow-md border border-red-500/20">
                          {activeChallenge.mirrorAxis.label}
                        </span>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                      <h4 className="font-display font-extrabold text-xs text-slate-800 uppercase tracking-tight flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                        {activeRealWorldTitle}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                        {activeRealWorldDesc}
                      </p>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* RIGHT: SELECTIONS */}
            <div className="md:col-span-6 flex flex-col justify-between">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                    {t('selectMirrorImageBadge')}
                  </span>
                  <p className="text-[11px] text-slate-500 mt-1.5 mb-4 leading-relaxed">
                    {t('selectPrompt')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  {activeChallenge.options.map((opt) => {
                    const isSelected = selectedOptionId === opt.id;
                    let cardBorder = 'border-slate-200 hover:border-indigo-400 hover:shadow-xs';
                    let badgeBg = 'bg-slate-100 text-slate-600 border border-slate-200';

                    if (isAnswered) {
                      if (opt.type === 'correct') {
                        cardBorder = 'border-emerald-500 bg-emerald-50/10 shadow-xs';
                        badgeBg = 'bg-emerald-600 text-white border-emerald-700';
                      } else if (isSelected) {
                        cardBorder = 'border-rose-500 bg-rose-50/10 shadow-xs';
                        badgeBg = 'bg-rose-600 text-white border-rose-700';
                      } else {
                        cardBorder = 'opacity-50 border-slate-100';
                      }
                    } else if (isSelected) {
                      cardBorder = 'border-indigo-600 bg-indigo-50/10 ring-1 ring-indigo-600/20';
                      badgeBg = 'bg-indigo-600 text-white border-indigo-700';
                    }

                    return (
                      <button
                        key={opt.id}
                        id={`btn-select-option-${opt.id}`}
                        disabled={isAnswered}
                        onClick={() => handleSelectOption(opt)}
                        className={`relative flex flex-col items-center p-2 rounded-xl border text-left bg-white transition-all duration-300 ${cardBorder}`}
                      >
                        {/* Option Label Badge */}
                        <span className={`absolute top-2 left-2 flex items-center justify-center w-5.5 h-5.5 rounded-lg font-display font-black text-[11px] shadow-xs z-10 ${badgeBg}`}>
                          {opt.id}
                        </span>

                        <div className="w-full scale-[0.80] origin-center py-1.5 flex items-center justify-center">
                          <SymmetryGrid
                            id={`option-grid-${opt.id}`}
                            gridSize={activeChallenge.gridSize}
                            blocks={opt.blocks}
                            polygonPoints={opt.polygonPoints}
                            polygonColor={activeChallenge.polygonColor}
                            showCoordinates={false}
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* FEEDBACK POPUP SECTION */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                id="answer-feedback-card"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className={`p-5 rounded-2xl border ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : 'border-rose-200 bg-rose-50/20'
                } shadow-sm flex flex-col gap-4`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3">
                    {isCorrect ? (
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                        <CheckCircle className="w-5.5 h-5.5" />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                        <XCircle className="w-5.5 h-5.5" />
                      </div>
                    )}
                    <div>
                      <h3 className={`font-display font-extrabold text-sm uppercase tracking-tight ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                        {isCorrect ? t('feedbackCorrectTitle') : t('feedbackIncorrectTitle')}
                      </h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {language === 'mizo' && selectedOptionInfo?.explanationMizo
                          ? selectedOptionInfo.explanationMizo
                          : selectedOptionInfo?.explanation}
                      </p>
                    </div>
                  </div>

                  {isCorrect && (
                    <div className="flex items-center gap-1 bg-emerald-600 text-white px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest font-mono shrink-0 shadow-sm shadow-emerald-200">
                      <Sparkles className="w-3 h-3" />
                      <span>+{100 * currentLevel} XP</span>
                    </div>
                  )}
                </div>

                {!isCorrect && (
                  <div className="p-3.5 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 mt-0.5 shrink-0">
                      <BookOpen className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <h4 className="font-display font-extrabold text-[10px] text-slate-800 uppercase tracking-wider">
                        {t('transformationPrincipleTitle')}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed mt-0.5">
                        {t('transformationPrincipleDesc')}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-3 border-t border-slate-200/50">
                  <button
                    id="btn-next-puzzle"
                    onClick={handleNextChallenge}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-5 rounded-xl font-display font-bold text-xs uppercase tracking-wider text-white shadow-sm hover:shadow-md transition-all ${
                      isCorrect
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                    }`}
                  >
                    <span>
                      {currentChallengeIndex + 1 === levelChallenges.length && !infiniteMode
                        ? t('unlockNextLevelBtn')
                        : t('proceedNextChallengeBtn')}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: CO-ORDINATE HINTS & LAUNCH SANDBOX */}
        <div className="lg:col-span-4 flex flex-col gap-5 select-none">
          {/* STUDY TIP BOX */}
          <div id="study-tip-box" className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
            <div className="flex items-center gap-2 mb-2.5 text-slate-800 font-display font-extrabold text-xs uppercase tracking-widest">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              {t('symmetryTipHeader')}
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              {getSymmetryTips()}
            </p>
          </div>

          {/* SANDBOX AD BANNER */}
          <div id="sandbox-banner-ad" className="bg-slate-900 text-white rounded-2xl p-5 shadow-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <h3 className="font-display font-extrabold text-[10px] uppercase tracking-widest mb-1 text-indigo-400">
                {t('sandboxBannerTitle')}
              </h3>
              <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
                {t('sandboxBannerDesc')}
              </p>
            </div>
            <button
              id="btn-goto-sandbox-banner"
              onClick={onNavigateToSandbox}
              className="w-full flex items-center justify-center gap-1 py-2.5 px-4 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 font-display font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              <span>{t('launchSandboxBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
