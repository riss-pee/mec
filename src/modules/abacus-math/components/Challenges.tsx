import React, { useState, useEffect } from 'react';
import { CHALLENGES } from '../data/abacusData';
import { Challenge } from '../types';
import { playSuccessChime } from '../utils/audio';
import { Award, CheckCircle, HelpCircle, AlertCircle, RefreshCw, Trophy, Flame, Play } from 'lucide-react';

interface ChallengesProps {
  currentChallengeId: string;
  onSelectChallenge: (challengeId: string) => void;
  currentAbacusValue: number;
  onApplyPreset: (preset: { [exponent: number]: number }) => void;
}

export const Challenges: React.FC<ChallengesProps> = ({
  currentChallengeId,
  onSelectChallenge,
  currentAbacusValue,
  onApplyPreset,
}) => {
  const [userScore, setUserScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [identifyInput, setIdentifyInput] = useState<string>('');
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [hasSolved, setHasSolved] = useState<{ [id: string]: boolean }>({});

  const activeChallengeIndex = CHALLENGES.findIndex(c => c.id === currentChallengeId);
  const activeChallenge = CHALLENGES[activeChallengeIndex] || CHALLENGES[0];

  // Set up the initial state if the challenge dictates it (e.g., for identify or addition challenges)
  const setupChallengePreset = () => {
    setFeedback(null);
    setIdentifyInput('');

    if (activeChallenge.type === 'identify') {
      // Setup a random bead state corresponding to the target value
      const val = activeChallenge.targetValue;
      const setup: { [exponent: number]: number } = {};
      let remaining = val;
      for (let exp = 9; exp >= 0; exp--) {
        const divisor = Math.pow(10, exp);
        const digit = Math.floor(remaining / divisor);
        if (digit > 0 || Object.keys(setup).length > 0) {
          setup[exp] = digit;
          remaining %= divisor;
        }
      }
      onApplyPreset(setup);
    } else if (activeChallenge.type === 'addition') {
      // Setup the initial partial sum on the abacus
      // Challenge 6: Start with 15, then add 23 to get 38
      // Initial state is 15 -> { 1: 1, 0: 5 }
      const setup: { [exponent: number]: number } = { 1: 1, 0: 5 };
      onApplyPreset(setup);
    } else if (activeChallenge.type === 'represent') {
      // Clear abacus for representation challenge
      onApplyPreset({});
    }
  };

  useEffect(() => {
    setupChallengePreset();
  }, [currentChallengeId]);

  // Handle checking of standard representation or addition challenges
  const handleCheckBeads = () => {
    const isCorrect = currentAbacusValue === activeChallenge.targetValue;
    processAnswer(isCorrect);
  };

  // Handle checking of identification answers (text input)
  const handleCheckIdentify = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAns = parseInt(identifyInput.trim(), 10);
    const isCorrect = numericAns === activeChallenge.targetValue;
    processAnswer(isCorrect);
  };

  const processAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      playSuccessChime();
      setFeedback({
        isCorrect: true,
        text: `Fantastic! ${activeChallenge.explanation}`,
      });
      
      // Award points only once per challenge
      if (!hasSolved[activeChallenge.id]) {
        setUserScore(prev => prev + activeChallenge.points);
        setStreak(prev => prev + 1);
        setHasSolved(prev => ({ ...prev, [activeChallenge.id]: true }));
      }
    } else {
      setStreak(0);
      setFeedback({
        isCorrect: false,
        text: `Not quite! ${activeChallenge.hint}. Read the abacus values again.`,
      });
    }
  };

  const handleNextChallenge = () => {
    const nextIdx = (activeChallengeIndex + 1) % CHALLENGES.length;
    onSelectChallenge(CHALLENGES[nextIdx].id);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Challenges sidebar */}
      <div className="lg:col-span-1 bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col gap-4">
        
        {/* Score & Streak Board */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-4 rounded-xl shadow-sm flex flex-col relative overflow-hidden">
            <Trophy className="absolute right-2 bottom-2 w-12 h-12 text-white/10" />
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Total Score</span>
            <span className="text-2xl font-extrabold mt-1">{userScore} pts</span>
          </div>
          <div className="bg-gradient-to-br from-rose-500 to-red-600 text-white p-4 rounded-xl shadow-sm flex flex-col relative overflow-hidden">
            <Flame className="absolute right-2 bottom-2 w-12 h-12 text-white/10 animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Streak</span>
            <span className="text-2xl font-extrabold mt-1">{streak} 🔥</span>
          </div>
        </div>

        <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mt-2 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-500" />
          Quiz List ({CHALLENGES.filter(c => hasSolved[c.id]).length} / {CHALLENGES.length})
        </h3>

        <div className="flex flex-col gap-2 overflow-y-auto max-h-[300px] pr-1">
          {CHALLENGES.map((ch, idx) => {
            const isCurrent = ch.id === currentChallengeId;
            const isSolved = hasSolved[ch.id];
            
            return (
              <button
                key={ch.id}
                onClick={() => onSelectChallenge(ch.id)}
                className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all group ${
                  isCurrent
                    ? 'bg-amber-50 border-amber-300 dark:bg-amber-950/20 dark:border-amber-800 text-amber-900 dark:text-amber-100 font-medium'
                    : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-950 dark:hover:bg-stone-800 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isCurrent ? 'bg-amber-500 text-white' : 'bg-stone-200 dark:bg-stone-800 text-stone-500'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="text-xs font-semibold leading-tight pr-2">
                    {ch.type === 'represent' && 'Represent: '}
                    {ch.type === 'identify' && 'Identify: '}
                    {ch.type === 'addition' && 'Arithmetic: '}
                    {ch.targetValue.toLocaleString()}
                  </div>
                </div>

                {isSolved ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <HelpCircle className="w-4 h-4 text-stone-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Challenge Arena */}
      <div className="lg:col-span-2 bg-white dark:bg-stone-900 p-6 md:p-8 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col justify-between">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-widest bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-full w-fit">
            {activeChallenge.type === 'represent' && '🔴 Slider Challenge'}
            {activeChallenge.type === 'identify' && '👁️ Identification Challenge'}
            {activeChallenge.type === 'addition' && '➕ Summation Challenge'}
          </div>

          <h2 className="text-xl md:text-2xl font-extrabold text-stone-900 dark:text-stone-100">
            {activeChallenge.question}
          </h2>

          {/* Prompt specific helper elements */}
          {activeChallenge.type === 'addition' && (
            <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800 px-4 py-3 rounded-xl text-sm text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 shrink-0 text-emerald-500" />
              <span>We pre-loaded <strong>15</strong> on the abacus for you. Slide the beads to add <strong>23</strong>!</span>
            </div>
          )}

          {activeChallenge.type === 'identify' && (
            <div className="bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800 px-4 py-3 rounded-xl text-sm text-sky-800 dark:text-sky-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-sky-500" />
              <span>Look at the active beads on the abacus right now. Type the complete digit representation in the box below!</span>
            </div>
          )}

          {/* Interactive Input Form for Identification Tasks */}
          {activeChallenge.type === 'identify' ? (
            <form onSubmit={handleCheckIdentify} className="flex flex-col sm:flex-row gap-3 mt-4">
              <input
                type="number"
                placeholder="Enter the number..."
                value={identifyInput}
                onChange={(e) => setIdentifyInput(e.target.value)}
                className="bg-stone-50 dark:bg-stone-950 border-2 border-stone-200 dark:border-stone-800 rounded-xl px-4 py-3 font-mono text-lg focus:border-amber-500 focus:outline-none flex-grow dark:text-white"
                required
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow shadow-amber-500/20 transform active:scale-95 shrink-0"
              >
                Check My Answer
              </button>
            </form>
          ) : (
            /* Button-trigger evaluation for sliding tasks */
            <div className="flex flex-col sm:flex-row gap-4 mt-4 items-center justify-between p-4 bg-stone-50 dark:bg-stone-950 rounded-xl border border-stone-200/60 dark:border-stone-800">
              <div className="text-stone-600 dark:text-stone-400 text-sm">
                Current Abacus Value: <strong className="font-mono text-base text-stone-900 dark:text-stone-100 bg-stone-200 dark:bg-stone-800 px-2.5 py-1 rounded-md">{currentAbacusValue.toLocaleString()}</strong>
              </div>
              <button
                onClick={handleCheckBeads}
                className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow shadow-amber-500/20 transform active:scale-95"
              >
                Verify Representation
              </button>
            </div>
          )}

          {/* Educational Explanation Box */}
          {feedback && (
            <div className={`mt-5 p-4 rounded-xl border flex gap-3 items-start ${
              feedback.isCorrect
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-800 dark:text-emerald-200'
                : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/20 dark:border-rose-800 dark:text-rose-200'
            }`}>
              {feedback.isCorrect ? (
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              )}
              <div className="text-sm">
                <div className="font-bold mb-0.5">{feedback.isCorrect ? 'Splendid Job!' : 'Whoops, Try Again!'}</div>
                <p>{feedback.text}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row gap-3 justify-end items-center">
          <button
            onClick={setupChallengePreset}
            className="w-full sm:w-auto border-2 border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 font-semibold px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 transform active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Reset Challenge
          </button>
          
          <button
            onClick={handleNextChallenge}
            disabled={!feedback?.isCorrect}
            className={`w-full sm:w-auto font-bold px-6 py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 ${
              feedback?.isCorrect
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow shadow-amber-500/10'
                : 'bg-stone-200 dark:bg-stone-800 text-stone-400 dark:text-stone-600 cursor-not-allowed'
            }`}
          >
            Next Challenge
            <Play className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
