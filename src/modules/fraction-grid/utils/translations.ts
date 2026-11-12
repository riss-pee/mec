import { Challenge } from '../types';

export type Language = 'en' | 'mizo';

export interface Translations {
  // Header
  appTitle: string;
  appSubtitle: string;
  soundOn: string;
  soundMuted: string;
  languageLabel: string;

  // Mode Selector
  activityMode: string;
  modeSelectDesc: string;
  modeExplore: string;
  modeShadeQuest: string;
  modeGuessShade: string;

  // Stats
  score: string;
  streak: string;
  reset: string;
  resetConfirm: string;

  // Canvas & Board
  canvasTitle: string;
  squaresUnit: string;
  gridHintClickDrag: string;
  gridHintOr: string;
  gridHintToShade: string;
  gridHintGuessMode: string;
  clearAll: string;
  fillAll: string;
  invert: string;
  random: string;

  // Sandbox Customizer
  sandboxTitle: string;
  colsLabel: string;
  rowsLabel: string;
  showNumbersLabel: string;

  // Bento Math Display
  fractionTitle: string;
  outOf: string;
  simplifiedAlready: string;
  simplifiedForm: string;
  decimalTitle: string;
  calculatedAs: string;
  decimalAreaValue: string;
  percentageTitle: string;
  partsOfTotal: string;
  ratioTitle: string;
  wholeRatio: string;
  partRatio: string;
  ratioComparison: string;

  // Sandbox Info Box
  sandboxInfoTitle: string;
  sandboxInfoText: string;

  // Shade Quest Mode
  difficulty: string;
  diffEasy: string;
  diffMedium: string;
  diffHard: string;
  questChallenge: string;
  gridSize: string;
  totalSquares: string;
  submitShadedGrid: string;
  successTitle: string;
  incorrectTitle: string;
  nextChallenge: string;
  retryOrSkip: string;

  // Guess Mode
  guessingChallenge: string;
  guessDesc: string;
  enterGuessLabel: string;
  guessPlaceholder: string;
  guessFormatHint: string;
  checkGuess: string;
  giveUp: string;
  brilliantGuess: string;
  ptsEarned: string;
  answerRevealed: string;
  yourGuess: string;
  preShadedPropText: string;
  simplifiedFractionLabel: string;
  decimalValueLabel: string;

  // Cheat Sheet
  cheatSheetTitle: string;
  cheatSheetDesc: string;
  commonProportions: string;
  half: string;
  quarter: string;
  threeQuarters: string;
  fifth: string;
  tenth: string;
  howToCalculate: string;
  calcFractionDesc: string;
  calcDecimalDesc: string;
  calcPercentageDesc: string;
  calcRatioDesc: string;
  proTipTitle: string;
  proTipText: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    // Header
    appTitle: 'Fraction Grid Game',
    appSubtitle: 'Visualizing Fractions, Decimals, Percentages & Ratios',
    soundOn: 'Sound On',
    soundMuted: 'Muted',
    languageLabel: 'Language',

    // Mode Selector
    activityMode: 'Activity Mode',
    modeSelectDesc: 'Select a mode to learn or test your fraction skills',
    modeExplore: 'Explore',
    modeShadeQuest: 'Shade Quest',
    modeGuessShade: 'Guess Shade',

    // Stats
    score: 'Score',
    streak: 'Streak',
    reset: 'Reset',
    resetConfirm: 'Are you sure you want to reset your score and streak?',

    // Canvas & Board
    canvasTitle: 'Interactive Canvas Board',
    squaresUnit: 'squares',
    gridHintClickDrag: 'Click or Drag over cells',
    gridHintOr: 'or',
    gridHintToShade: 'to shade & unshade',
    gridHintGuessMode: 'Grid is read-only in Guess Mode! Submit your guess below.',
    clearAll: 'Clear All',
    fillAll: 'Fill All',
    invert: 'Invert',
    random: 'Random',

    // Sandbox Customizer
    sandboxTitle: 'Grid Customizer Sandbox',
    colsLabel: 'Columns (Width)',
    rowsLabel: 'Rows (Height)',
    showNumbersLabel: 'Show cell numbers',

    // Bento Math Display
    fractionTitle: 'Fraction',
    outOf: 'out of',
    simplifiedAlready: 'Already fully simplified',
    simplifiedForm: 'Simplified form',
    decimalTitle: 'Decimal',
    calculatedAs: 'Calculated as',
    decimalAreaValue: 'Value of the shaded area',
    percentageTitle: 'Percentage',
    partsOfTotal: 'parts of total',
    ratioTitle: 'Ratio',
    wholeRatio: 'Whole:',
    partRatio: 'Part:',
    ratioComparison: 'Shaded to Total vs. Unshaded',

    // Sandbox Info Box
    sandboxInfoTitle: 'Freeplay Sandbox',
    sandboxInfoText: 'Set grid dimensions below, paint squares on the left grid, and watch standard math notations update in real time in the display below. Try to represent different visual proportions!',

    // Shade Quest Mode
    difficulty: 'Difficulty:',
    diffEasy: 'Easy',
    diffMedium: 'Medium',
    diffHard: 'Hard',
    questChallenge: 'Quest Challenge',
    gridSize: 'Grid Size:',
    totalSquares: 'Total Squares:',
    submitShadedGrid: 'Submit Shaded Grid',
    successTitle: 'Splendid! You got it right!',
    incorrectTitle: 'Not quite right yet',
    nextChallenge: 'Next Challenge',
    retryOrSkip: 'Retry / Skip',

    // Guess Mode
    guessingChallenge: 'Guessing Challenge',
    guessDesc: 'Analyze the pre-shaded grid on the left. Think of its fraction, percentage, decimal value, or ratio!',
    enterGuessLabel: 'Enter your guess:',
    guessPlaceholder: 'e.g., 3/5, 60%, 0.6, or 3:5',
    guessFormatHint: 'Accepts fractions (3/5), decimals (0.6), percentages (60%), or ratios (3:5 or 3to5)',
    checkGuess: 'Check Guess',
    giveUp: 'Give Up',
    brilliantGuess: 'Brilliant! Correct Guess!',
    ptsEarned: 'pts',
    answerRevealed: 'Answer Revealed',
    yourGuess: 'Your guess:',
    preShadedPropText: 'The pre-shaded proportion is',
    simplifiedFractionLabel: 'Simplified Fraction:',
    decimalValueLabel: 'Decimal Value:',

    // Cheat Sheet
    cheatSheetTitle: 'Guessing & Conversion Cheat Sheet',
    cheatSheetDesc: 'Stuck? Here are some simple guidelines and common visual proportions to help you identify the shaded region on the grid:',
    commonProportions: 'Common Proportions',
    half: '1 / 2 (Half)',
    quarter: '1 / 4 (Quarter)',
    threeQuarters: '3 / 4 (Three Quarters)',
    fifth: '1 / 5 (Fifth)',
    tenth: '1 / 10 (Tenth)',
    howToCalculate: 'How to Calculate',
    calcFractionDesc: 'Fraction: Count the shaded squares over the total grid size, e.g.,',
    calcDecimalDesc: 'Decimal: Divide shaded count by total count, e.g.,',
    calcPercentageDesc: 'Percentage: Multiply your decimal by 100, e.g.,',
    calcRatioDesc: 'Ratio: Part-to-Whole is shaded:total. Part-to-Part is shaded:unshaded.',
    proTipTitle: 'Pro-tip:',
    proTipText: 'Count the shaded squares on the canvas, divide by the total, and type your answer!'
  },
  mizo: {
    // Header
    appTitle: 'Fraction Grid Game',
    appSubtitle: 'Fractions, Decimal, Za Zela Zat leh Ratio Zirna',
    soundOn: 'Ri On',
    soundMuted: 'Ri Tihtawp',
    languageLabel: 'Tawng (Language)',

    // Mode Selector
    activityMode: 'Zir Dan Kalhmang',
    modeSelectDesc: 'Fractions zir nan emaw i thiam zawng enchhin nan thlang rawh',
    modeExplore: 'Enchhinna (Explore)',
    modeShadeQuest: 'Rawng Hnawih Zawnna',
    modeGuessShade: 'A Zat Rin (Guess)',

    // Stats
    score: 'Score',
    streak: 'A Zawn',
    reset: 'Siam Tha',
    resetConfirm: 'I score leh streak te hi siam that (reset) i duh tak tak em?',

    // Canvas & Board
    canvasTitle: 'Bawm Rawng Hnawihna',
    squaresUnit: 'bawm',
    gridHintClickDrag: 'Hmet la (click) emaw hnuk kualin (drag)',
    gridHintOr: 'emaw',
    gridHintToShade: 'rawng hnawih & thai bo rawh',
    gridHintGuessMode: 'Guess Mode-ah chuan a en theih chauh! A hnuaiah hian i chhanna chhu lut rawh.',
    clearAll: 'Ti Fai Vek',
    fillAll: 'Hnawih Khat',
    invert: 'Lettling',
    random: 'Random',

    // Sandbox Customizer
    sandboxTitle: 'Grid Duhdan a Siamna',
    colsLabel: 'A Ding (A Vang)',
    rowsLabel: 'A Phei (A Dung)',
    showNumbersLabel: 'Bawm tin number tilang',

    // Bento Math Display
    fractionTitle: 'Fraction',
    outOf: 'a vai atangin',
    simplifiedAlready: 'Tih tlem ngai tawh lo',
    simplifiedForm: 'Tih tlem (Simplified)',
    decimalTitle: 'Decimal',
    calculatedAs: 'Chhut chhuah dan',
    decimalAreaValue: 'Rawng hnawih hlutna',
    percentageTitle: 'Za Zela Zat (%)',
    partsOfTotal: 'a vai zela zat',
    ratioTitle: 'Inlaichinna (Ratio)',
    wholeRatio: 'A Vaiin:',
    partRatio: 'A Dangin:',
    ratioComparison: 'A Vai Lakah leh A Var Lakah',

    // Sandbox Info Box
    sandboxInfoTitle: 'Mahni a Zirna (Sandbox)',
    sandboxInfoText: 'A hnuaiah hian grid lian zawng thlang la, veilam bawmah hian rawng hnawih rawh. Math chhinchhiahna hrang hrang a inthlak dan i hmu thei ang!',

    // Shade Quest Mode
    difficulty: 'A Har Zawng:',
    diffEasy: 'Awlsam',
    diffMedium: 'Laihawl',
    diffHard: 'Harsa',
    questChallenge: 'Inelna (Quest)',
    gridSize: 'Grid Lian Zawng:',
    totalSquares: 'Bawm Zawng Zawng:',
    submitShadedGrid: 'Chhanna Thehlut Rawh',
    successTitle: 'A va tha em! I chhang dik chiah e!',
    incorrectTitle: 'A la dik chiah lo deuh',
    nextChallenge: 'Inelna Dawtleh',
    retryOrSkip: 'Enchhin leh / Kalpel',

    // Guess Mode
    guessingChallenge: 'A Zat Rin Chawp',
    guessDesc: 'Veilama grid rawng hnawih sa hi en la, a fraction, percentage, decimal, emaw ratio chhut chhuak rawh!',
    enterGuessLabel: 'I rin zat chhu lut rawh:',
    guessPlaceholder: 'Entirnan: 3/5, 60%, 0.6, emaw 3:5',
    guessFormatHint: 'Fraction (3/5), decimal (0.6), percentage (60%), emaw ratio (3:5) te a hman theih',
    checkGuess: 'Enfiah Rawh',
    giveUp: 'Chhanna En',
    brilliantGuess: 'I ti tha lutuk! I chhang dik e!',
    ptsEarned: 'mark',
    answerRevealed: 'Chhanna Dik Chu',
    yourGuess: 'I chhanna:',
    preShadedPropText: 'Rawng hnawih zat chu',
    simplifiedFractionLabel: 'Fraction tlem ber:',
    decimalValueLabel: 'Decimal hlutna:',

    // Cheat Sheet
    cheatSheetTitle: 'Rin Dan Leh Chhinchhiahna Puihtu',
    cheatSheetDesc: 'I hrethiam chiah lo em? A hnuaia hriattirna leh fractions tlanglawn te hian a pui thei ang che:',
    commonProportions: 'Fractions Tlanglawn Te',
    half: '1 / 2 (A chanve)',
    quarter: '1 / 4 (Hmun lia then hmun khat)',
    threeQuarters: '3 / 4 (Hmun lia then hmun thum)',
    fifth: '1 / 5 (Hmun ngaa then hmun khat)',
    tenth: '1 / 10 (Hmun sawma then hmun khat)',
    howToCalculate: 'Chhut Chhuah Dan',
    calcFractionDesc: 'Fraction: Bawm rawng hnawih zat kha a vai zat chungah dah rawh, e.g.,',
    calcDecimalDesc: 'Decimal: Rawng hnawih zat kha a vai zat khan sem rawh, e.g.,',
    calcPercentageDesc: 'Percentage: I decimal chhut kha 100 in puntir rawh, e.g.,',
    calcRatioDesc: 'Ratio: A pum lakah (shaded:total) emaw a var lakah (shaded:unshaded).',
    proTipTitle: 'Hriat atan:',
    proTipText: 'Veilama bawm rawng hnawih zat chhiar la, a vai zat khan sem rawh le!'
  }
};

export function getInstructionText(challenge: Challenge, lang: Language): string {
  if (lang === 'mizo') {
    switch (challenge.type) {
      case 'fraction':
        return `Grid-ah hian hmun ${challenge.targetString} rawng hnawih rawh.`;
      case 'decimal':
        return `Grid-ah hian ${challenge.targetString} (decimal angin) rawng hnawih rawh.`;
      case 'percentage':
        return `Grid-ah hian ${challenge.targetString} rawng hnawih rawh.`;
      case 'ratio':
        return `Grid-ah hian ratio ${challenge.targetString} (rawng hnawih leh a vai zat) rawng hnawih rawh.`;
    }
  }
  return challenge.instruction;
}

export function getShadeFeedbackText(
  isCorrect: boolean,
  challenge: Challenge,
  shadedCount: number,
  totalSquares: number,
  lang: Language
): string {
  if (lang === 'mizo') {
    if (isCorrect) {
      return `Bawm ${totalSquares} awmah ${shadedCount} rawng i hnawih chiah a. Chu chu ${challenge.targetString} nen a inang chiah a ni! I ti tha hle mai!`;
    } else {
      const currentPercent = ((shadedCount / totalSquares) * 100).toFixed(1);
      const targetPercent = (challenge.targetValue * 100).toFixed(1);
      return `I rawng hnawih zat chu ${shadedCount}/${totalSquares} (${currentPercent}%) a ni a. Kan mamawh zawk chu ${challenge.targetString} (${targetPercent}%) a ni. Han bei tha leh deuh teh le!`;
    }
  }

  if (isCorrect) {
    return `You shaded exactly ${shadedCount} of the ${totalSquares} squares. That represents ${challenge.targetString} perfectly! Excellent mathematics!`;
  } else {
    return `Your current shading represents a ratio of ${shadedCount}/${totalSquares} (${((shadedCount / totalSquares) * 100).toFixed(1)}%). We needed you to shade ${challenge.targetString} (${(challenge.targetValue * 100).toFixed(1)}%). Keep refining it!`;
  }
}
