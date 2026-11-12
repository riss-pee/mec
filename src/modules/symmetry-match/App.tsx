import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Trophy,
  PenTool,
  Info,
  X,
  Flame,
  Languages,
} from 'lucide-react';
import { PlayerStats } from './types';
import ChallengeMode from './components/ChallengeMode';
import SymmetrySandbox from './components/SymmetrySandbox';
import { LanguageProvider, useLanguage } from './i18n';

const STORAGE_KEY = 'symmetry_mirror_match_stats_v1';

const DEFAULT_STATS: PlayerStats = {
  score: 0,
  streak: 0,
  highestStreak: 0,
  completedChallenges: [],
  sandboxSaves: [],
};

function AppContent() {
  const { language, setLanguage, t } = useLanguage();

  // Navigation: 'lobby' | 'challenge' | 'sandbox'
  const [activeScreen, setActiveScreen] = useState<'lobby' | 'challenge' | 'sandbox'>('lobby');

  // Interactive guide / onboarding popup
  const [showGuide, setShowGuide] = useState<boolean>(true);

  // Player progress stats (persisted)
  const [stats, setStats] = useState<PlayerStats>(DEFAULT_STATS);

  // Load stats on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setStats({
          score: typeof parsed.score === 'number' ? parsed.score : 0,
          streak: typeof parsed.streak === 'number' ? parsed.streak : 0,
          highestStreak: typeof parsed.highestStreak === 'number' ? parsed.highestStreak : 0,
          completedChallenges: Array.isArray(parsed.completedChallenges) ? parsed.completedChallenges : [],
          sandboxSaves: Array.isArray(parsed.sandboxSaves) ? parsed.sandboxSaves : [],
        });
      } catch (e) {
        console.error('Error parsing stored stats:', e);
      }
    }
  }, []);

  // Sync stats helper
  const updateStats = (updater: (prev: PlayerStats) => PlayerStats) => {
    setStats((prev) => {
      const updated = updater(prev);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  // Reset progress stats helper
  const handleResetProgress = () => {
    if (confirm(t('resetConfirm'))) {
      updateStats(() => DEFAULT_STATS);
      setActiveScreen('lobby');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col selection:bg-indigo-100 selection:text-indigo-900">
      {/* GLOBAL HEADER BAR - Sleek Theme */}
      <header className="h-20 bg-white border-b border-slate-200 sticky top-0 z-40 flex items-center justify-between px-4 sm:px-10 shadow-sm shrink-0 select-none">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveScreen('lobby')}>
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-md shadow-indigo-100/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12h20M12 2v20"/>
              <path d="m15 16 4-4-4-4"/>
              <path d="m9 8-4 4 4 4"/>
            </svg>
          </div>
          <div>
            <h1 className="font-display text-xl font-extrabold text-slate-800 tracking-tight leading-none">
              {t('appTitle')}
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {t('appSubtitle')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* Language Selector: English / Mizo toggle with math retention reminder */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              id="btn-lang-en"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                language === 'en'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="English (standard terms)"
            >
              English
            </button>
            <button
              id="btn-lang-mizo"
              onClick={() => setLanguage('mizo')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 ${
                language === 'mizo'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Mizo ṭawng (Standard mathematical terms are retained in English)"
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Mizo</span>
            </button>
          </div>

          {/* Guide Manual & Accuracy stats */}
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{t('experiencePoints')}</span>
            <span className="text-xl font-mono font-black text-indigo-600">{stats.score} XP</span>
          </div>

          <div className="hidden lg:block h-10 w-px bg-slate-200"></div>

          <button
            id="btn-nav-guide"
            onClick={() => setShowGuide(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all bg-white shadow-sm"
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span className="hidden sm:inline">{t('guideManual')}</span>
          </button>
        </div>
      </header>

      {/* Mizo Mode Notice banner: informing student that math terms remain standard */}
      {language === 'mizo' && (
        <div className="bg-indigo-50/70 border-b border-indigo-100 py-1.5 px-4 text-center select-none">
          <p className="text-[11px] font-medium text-indigo-900 flex items-center justify-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block"></span>
            <strong>Mizo Mode:</strong> {t('mathTermsNotice')} (e.g. <em>reflection, axis, coordinates, symmetry, diagonal</em>).
          </p>
        </div>
      )}

      {/* CONDITIONAL SUB-HEADER NAVIGATION BAR WHEN INSIDE A CHOSEN MODE */}
      {activeScreen !== 'lobby' && (
        <div className="bg-white border-b border-slate-200 py-3 shadow-xs select-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <button
              id="btn-back-to-menu"
              onClick={() => setActiveScreen('lobby')}
              className="flex items-center gap-2 py-2 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 font-display font-bold text-xs uppercase tracking-wider text-slate-600 transition-all shadow-xs"
            >
              <span>{t('backToMenu')}</span>
            </button>

            <div className="flex items-center gap-3">
              {stats.streak > 0 && (
                <div className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-rose-600 bg-rose-50 px-3 py-1 rounded-full border border-rose-100/50">
                  <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>{t('streak')}: {stats.streak}</span>
                </div>
              )}
              <span className="lg:hidden text-xs font-mono font-black text-indigo-600">{stats.score} XP</span>
              <button
                id="btn-reset-stats"
                onClick={handleResetProgress}
                className="text-[10px] text-slate-400 hover:text-rose-600 font-bold uppercase tracking-widest transition-all ml-2"
              >
                {t('resetData')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT PORTAL */}
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col justify-center">
        {activeScreen === 'lobby' ? (
          <motion.div
            id="lobby-container"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="w-full max-w-5xl mx-auto py-6 sm:py-12 flex flex-col items-center"
          >
            {/* LOBBY HERO GREETING */}
            <div className="text-center max-w-2xl mb-12 sm:mb-16 select-none">
              <span className="font-mono text-[10px] font-bold tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full uppercase">
                {t('lobbyBadge')}
              </span>
              <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-800 uppercase tracking-tight mt-4">
                {t('lobbyHeroTitle')}
              </h2>
              <p className="text-sm text-slate-500 mt-3 leading-relaxed">
                {t('lobbyHeroDesc')}
              </p>
            </div>

            {/* THE TWO ARENA CHOOSE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              {/* CARD 1: LEVEL CHALLENGES */}
              <motion.div
                id="lobby-card-challenge"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveScreen('challenge')}
                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-md hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Visual mathematical grid decor in background */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none transform translate-x-8 -translate-y-8">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="2" />
                    <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="2" />
                    <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <Trophy className="w-7 h-7" />
                    </div>
                    <span className="font-mono text-[10px] font-bold px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-md uppercase tracking-wider">
                      {t('trophyChallenge')}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-xl text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                    {t('levelChallengesTitle')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                    {t('levelChallengesDesc')}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-200 rounded px-2.5 py-1">
                      {t('levelsDesignedTag')}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-200 rounded px-2.5 py-1">
                      {t('streaksTag')}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-200 rounded px-2.5 py-1">
                      {t('progressSavedTag')}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-indigo-500 transition-all uppercase tracking-wider">
                    {stats.completedChallenges.length > 0 
                      ? t('levelsFinishedCount', { count: stats.completedChallenges.length })
                      : t('notStartedYet')}
                  </span>
                  <button className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-display font-bold text-[11px] uppercase tracking-wider shadow-sm group-hover:shadow-md transition-all">
                    {t('playLevelsBtn')}
                  </button>
                </div>
              </motion.div>

              {/* CARD 2: MIRROR DRAW (CREATIVE SANDBOX) */}
              <motion.div
                id="lobby-card-sandbox"
                whileHover={{ scale: 1.02, y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveScreen('sandbox')}
                className="bg-white rounded-3xl border border-slate-200 p-8 shadow-md hover:shadow-xl hover:border-indigo-200 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
              >
                {/* Visual line design decor in background */}
                <div className="absolute top-0 right-0 w-32 h-32 opacity-5 pointer-events-none transform translate-x-8 -translate-y-8">
                  <svg width="100%" height="100%" viewBox="0 0 100 100">
                    <path d="M 10,10 L 90,90 M 10,90 L 90,10" stroke="currentColor" strokeWidth="2" />
                    <rect x="25" y="25" width="50" height="50" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      <PenTool className="w-7 h-7" />
                    </div>
                    <span className="font-mono text-[10px] font-bold px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md uppercase tracking-wider">
                      {t('interactiveDrawTag')}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-xl text-slate-800 uppercase tracking-tight group-hover:text-indigo-600 transition-colors">
                    {t('sandboxCardTitle')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2.5 leading-relaxed">
                    {t('sandboxCardDesc')}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-200 rounded px-2.5 py-1">
                      {t('lineDrawerTag')}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-200 rounded px-2.5 py-1">
                      {t('blockPainterTag')}
                    </span>
                    <span className="text-[10px] font-semibold bg-slate-50 text-slate-500 border border-slate-200 rounded px-2.5 py-1">
                      {t('localGalleryTag')}
                    </span>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400 group-hover:text-indigo-500 transition-all uppercase tracking-wider">
                    {stats.sandboxSaves.length > 0 
                      ? t('savedCreationsCount', { count: stats.sandboxSaves.length })
                      : t('noSavedDesigns')}
                  </span>
                  <button className="py-2.5 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-display font-bold text-[11px] uppercase tracking-wider shadow-sm group-hover:shadow-md transition-all">
                    {t('startDrawingBtn')}
                  </button>
                </div>
              </motion.div>
            </div>

            {/* QUICK STATS WRAPPER ON LOBBY SCREEN */}
            <div className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 w-full max-w-lg flex items-center justify-around text-center shadow-xs select-none">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('totalPoints')}</span>
                <span className="text-xl font-mono font-black text-indigo-600 mt-0.5 block">{stats.score} XP</span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('activeStreak')}</span>
                <span className="text-xl font-mono font-black text-rose-600 mt-0.5 block flex items-center gap-1 justify-center">
                  <Flame className="w-4 h-4 fill-rose-500 text-rose-500 inline-block -mt-1" />
                  {stats.streak} {t('daysSuffix')}
                </span>
              </div>
              <div className="w-px h-8 bg-slate-200"></div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{t('highestStreak')}</span>
                <span className="text-xl font-mono font-black text-slate-700 mt-0.5 block">{stats.highestStreak} {t('maxSuffix')}</span>
              </div>
            </div>
          </motion.div>
        ) : activeScreen === 'challenge' ? (
          <ChallengeMode
            stats={stats}
            updateStats={updateStats}
            onNavigateToSandbox={() => setActiveScreen('sandbox')}
          />
        ) : (
          <SymmetrySandbox stats={stats} updateStats={updateStats} />
        )}
      </main>

      {/* GLOBAL FOOTER */}
      <footer className="bg-white border-t border-gray-100 py-6 text-center select-none mt-12">
        <div className="max-w-7xl mx-auto px-4 text-xs text-gray-400">
          <p className="font-medium">
            {t('footerLine1')}
          </p>
          <p className="mt-1">
            {t('footerLine2')}
          </p>
        </div>
      </footer>

      {/* ONBOARDING MANUAL OVERLAY GUIDE */}
      <AnimatePresence>
        {showGuide && (
          <div
            id="guide-modal-overlay"
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto"
            onClick={() => setShowGuide(false)}
          >
            <motion.div
              id="guide-modal-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-slate-200 shadow-xl flex flex-col gap-6 relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                id="btn-close-guide"
                onClick={() => setShowGuide(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-indigo-600 flex items-center justify-center shrink-0">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-display font-extrabold text-lg text-slate-900 uppercase tracking-tight">
                    {t('guideModalTitle')}
                  </h2>
                  <p className="text-xs text-slate-400 font-medium">
                    {t('guideModalSubtitle')}
                  </p>
                </div>
              </div>

              {/* CORE EDUCATIONAL LESSONS - Mathematical formulas and axis terms preserved */}
              <div className="flex flex-col gap-4 text-slate-700 leading-relaxed text-sm">
                <p className="text-slate-500 text-xs">
                  {t('guideModalIntro')}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-1.5">
                    <span className="font-display font-black text-[10px] text-slate-800 uppercase tracking-wider">
                      {t('guideVerticalTitle')}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      {t('guideVerticalDesc')}
                      <br />
                      <strong className="font-mono text-indigo-600 mt-2 block text-[10px]">
                        (x, y) ➔ (W - 1 - x, y)
                      </strong>
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-1.5">
                    <span className="font-display font-black text-[10px] text-slate-800 uppercase tracking-wider">
                      {t('guideHorizontalTitle')}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      {t('guideHorizontalDesc')}
                      <br />
                      <strong className="font-mono text-indigo-600 mt-2 block text-[10px]">
                        (x, y) ➔ (x, H - 1 - y)
                      </strong>
                    </p>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex flex-col gap-1.5">
                    <span className="font-display font-black text-[10px] text-slate-800 uppercase tracking-wider">
                      {t('guideDiagonalTitle')}
                    </span>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      {t('guideDiagonalDesc')}
                      <br />
                      <strong className="font-mono text-indigo-600 mt-2 block text-[10px]">
                        (x, y) ➔ (y, x)
                      </strong>
                    </p>
                  </div>
                </div>

                <div className="mt-2 p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-3">
                  <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-display font-bold text-xs text-slate-800 mb-1 uppercase tracking-wider">
                      {t('howToNavigateTitle')}
                    </h4>
                    <ul className="list-disc pl-4 text-xs text-slate-500 flex flex-col gap-1.5">
                      <li>
                        {t('guideNavChallenge')}
                      </li>
                      <li>
                        {t('guideNavSandbox')}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200">
                <button
                  id="btn-start-playing-guide"
                  onClick={() => setShowGuide(false)}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-display font-bold text-xs uppercase tracking-widest text-white shadow-md shadow-indigo-100 transition-all text-center"
                >
                  {t('startLabBtn')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
