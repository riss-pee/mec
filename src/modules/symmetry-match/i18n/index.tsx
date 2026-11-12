import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'mizo';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const STORAGE_KEY = 'symmetry_mirror_match_language_v1';

export const DICTIONARY = {
  en: {
    // Header
    appTitle: 'SYMMETRY LAB',
    appSubtitle: 'GEOMETRIC TRANSFORMATIONS v2.5',
    experiencePoints: 'Experience Points',
    guideManual: 'Guide Manual',
    langName: 'English',
    langSwitchLabel: 'Language',
    mathTermsNotice: 'Standard mathematical terms preserved',

    // Subheader / Navigation
    backToMenu: '← Back to Main Menu',
    streak: 'Streak',
    resetData: 'Reset Data',
    resetConfirm: 'Are you sure you want to reset your score, levels progress, and custom saved designs?',

    // Lobby
    lobbyBadge: 'Interactive Mathematics Lab',
    lobbyHeroTitle: 'Choose Your Symmetry Arena',
    lobbyHeroDesc: 'Discover the elegant rules of coordinate reflections, point translations, and axial symmetry. Learn by playing levels or drawing freehand mirror patterns!',
    
    // Lobby Challenge Card
    trophyChallenge: 'Trophy Challenge',
    levelChallengesTitle: 'Level Challenges',
    levelChallengesDesc: 'Test your geometric reflection skills over progressive levels! Examine coordinates and symmetry lines (vertical, horizontal, diagonal) to choose the correct reflection option from multiple choices.',
    levelsDesignedTag: '30 Pre-designed Levels',
    streaksTag: 'Streaks & XP Tracking',
    progressSavedTag: 'Progress Saved Locally',
    levelsFinishedCount: '{count} Levels Finished',
    notStartedYet: 'Not Started Yet',
    playLevelsBtn: 'Play Levels',

    // Lobby Sandbox Card
    interactiveDrawTag: 'Interactive Draw',
    sandboxCardTitle: 'Mirror Draw Sandbox',
    sandboxCardDesc: 'Draw your own figures using snappy line segments or cell blocks. Enable Auto-Mirror to instantly reflect your handiwork across complex lines, or try to solve your own custom reflection puzzles!',
    lineDrawerTag: 'Snapping Line Drawer',
    blockPainterTag: 'Cell Block Painter',
    localGalleryTag: 'Custom Local Gallery',
    savedCreationsCount: '{count} Saved Creations',
    noSavedDesigns: '0 Saved Designs',
    startDrawingBtn: 'Start Drawing',

    // Lobby Stats Bar
    totalPoints: 'Total Points',
    activeStreak: 'Active Streak',
    highestStreak: 'Highest Streak',
    daysSuffix: 'Days',
    maxSuffix: 'Max',

    // Guide Modal
    guideModalTitle: 'Symmetry & Mirror Reflections',
    guideModalSubtitle: 'Your student masterclass guide to mathematical reflections!',
    guideModalIntro: 'Welcome! In this simulator, you will discover the mathematical rules of geometric symmetry and coordinate reflections. Here is how coordinates transform:',
    guideVerticalTitle: '↕ Vertical Axis',
    guideVerticalDesc: 'Flips elements horizontally. Heights (Y) stay identical.',
    guideHorizontalTitle: '↔ Horizontal Axis',
    guideHorizontalDesc: 'Flips elements vertically. Columns (X) stay identical.',
    guideDiagonalTitle: '⤪ Diagonal Line',
    guideDiagonalDesc: 'Flips across y = x diagonal. Coordinate keys swap.',
    howToNavigateTitle: 'How to Navigate:',
    guideNavChallenge: 'Level Challenges: Examine reference coordinates and click Option A, B, C or D. Look out for false diagonal flips and rotations!',
    guideNavSandbox: 'Creative Sandbox: Paint custom tiles. Use Auto-Mirror to draw together or Reflection Puzzle to manually solve patterns!',
    startLabBtn: 'Start Lab',

    // Challenge Mode - Level Selector
    syllabusBadge: 'Symmetry Syllabus & Curriculum',
    selectLevelTitle: 'Select Your Challenge Level',
    selectLevelDesc: 'Practice spatial translations and axial reflections. Each level introduces unique symmetry lines and grid dimensions.',
    progressLabel: 'Progress',
    completeBadge: 'COMPLETE 🎉',
    solvedFraction: '{solved} / {total} Solved',
    resumeChallengeBtn: 'Resume Challenge',
    startChallengeBtn: 'Start Challenge',
    infiniteCardTitle: 'Infinite Playground',
    infiniteCardDesc: 'Unlock endless, procedurally generated symmetry puzzles! Adapts continuously to test your mastery of axial mappings on-the-fly.',
    launchInfiniteBtn: 'Launch Infinite',
    didYouKnowTitle: 'Did you know?',
    didYouKnowDesc: 'Symmetry is one of the most foundational principles of linear geometry. An axis of reflection acts as a perpendicular bisector to any segment connecting a point and its reflected counterpart.',

    // Challenge Mode - Gameplay Board
    backToSyllabus: '← Back to Syllabus Levels',
    challengeCounter: 'Challenge {current} of {total}',
    infiniteModeActive: 'Procedural Infinite Mode',
    refModelLabel: 'Reference Model',
    mathGridTab: 'Math Grid',
    realLifeTab: 'Real-Life',
    selectMirrorImageBadge: 'Select Mirror Image',
    selectPrompt: 'Which illustration represents the perfect mathematical reflection of the reference figure across the red dashed mirror axis?',
    
    // Challenge Mode - Feedback
    feedbackCorrectTitle: 'Excellent! Pure Mathematical Symmetry',
    feedbackIncorrectTitle: 'Incorrect Mapping',
    transformationPrincipleTitle: 'Transformation Principle:',
    transformationPrincipleDesc: 'A mirror reflection preserves collinearity and distances. The distance from any point on the original side to the mirror axis must be identical on the opposite side.',
    unlockNextLevelBtn: 'Unlock Next Level',
    proceedNextChallengeBtn: 'Proceed to Next Challenge',
    symmetryTipHeader: 'Symmetry Tip',

    // Challenge Mode - Sandbox Banner
    sandboxBannerTitle: 'Symmetry Sandbox',
    sandboxBannerDesc: 'Want to draw custom patterns? Draw with snapping lines or block tiles with auto-reflection in real-time.',
    launchSandboxBtn: 'Launch Sandbox',

    // Sandbox Controls
    sandboxControlsTitle: 'Sandbox Controls',
    sandboxControlsDesc: 'Select your reflection axis and interact mode below to test geometric mirror mappings.',
    autoMirrorModeBtn: 'Real-time Mirror',
    puzzleModeBtn: 'Reflection Puzzle',
    gridScaleLabel: 'Grid Scale:',
    mirrorAxisLabel: 'Mirror Axis Line:',
    drawingToolPaletteTitle: 'Drawing Tool & Palette',
    toolLineDrawer: 'Line Drawer',
    toolBlockPainter: 'Block Painter',
    symmetryGalleryTitle: 'Symmetry Gallery',
    linesCount: '{count} lines',
    blocksCount: '{count} blocks',

    // Sandbox Canvas Area
    autoMirrorBanner: 'Auto-Mirror Mode',
    solverBanner: 'Symmetry Puzzle Solver',
    autoMirrorLineInst: 'Click on the snapping dots to draw lines. Symmetrical reflected line segments are generated instantly!',
    autoMirrorBlockInst: 'Click on grid boxes to paint tiles. Symmetrical reflected tiles are generated instantly!',
    solverLineInst: 'Click "Generate Pattern" to set a reference line structure. Draw the reflected lines on Side B and verify!',
    solverBlockInst: 'Click "Generate Pattern" to set a reference tile structure. Paint the reflected blocks on Side B and verify!',
    generatePatternBtn: 'Generate Pattern',
    clearBtn: 'Clear',
    lineDrawingSandbox: 'Line Drawing Sandbox',
    blockDrawingSandbox: 'Block Drawing Sandbox',
    lineSymmetrySolver: 'Line Symmetry Solver',
    blockSymmetrySolver: 'Block Symmetry Solver',
    autoReflectingBadge: 'Auto-Reflecting',
    symmetryQuizBadge: 'Symmetry Quiz',
    perfectSymmetryTitle: 'Perfect Symmetry! (+150 XP)',
    perfectLineSymmetryDesc: 'You correctly plotted the mirror images of all line segments! Superb spatial coordination.',
    perfectBlockSymmetryDesc: 'You correctly plotted the mirror images of all blocks! You have a great eye for spatial geometry.',
    tryAgainTitle: 'Try Again!',
    tryAgainLineDesc: 'Some drawn lines on Side B don\'t match the exact reflected coordinates of Side A. Check each segment!',
    tryAgainBlockDesc: 'Some blocks on Side B don\'t match the exact mirrored coordinate of Side A. Check cell distances from the mirror line.',
    snappingLineHelp: 'Click dots to draw. Clicking again starts a new line. (Vertex limits: 0 to {gridSize})',
    blockCoordHelp: 'Active coordinates: (X goes 0 to {max}, Y goes 0 to {max})',
    saveGalleryBtn: 'Save Gallery',
    verifySymmetryBtn: 'Verify Symmetry!',
    alertDrawReferenceLines: 'Draw some lines on the reference side first!',
    alertDrawReferenceBlocks: 'Draw some blocks on the reference side first!',
    alertEmptyGrid: 'Can\'t save an empty grid!',
    alertEmptyLine: 'Can\'t save an empty line drawing!',
    alertSavedGallery: 'Symmetry pattern saved to your local gallery successfully!',

    // Global Footer
    footerLine1: 'Symmetry Mirror Match — An educational spatial-reasoning game for Middle School Students.',
    footerLine2: 'Built using coordinate reflections & geometric transforms (X/Y reflections and diagonal coordinates).',
  },

  mizo: {
    // Header - Standard math terms ('SYMMETRY LAB', 'GEOMETRIC TRANSFORMATIONS', 'XP') kept untranslated
    appTitle: 'SYMMETRY LAB',
    appSubtitle: 'GEOMETRIC TRANSFORMATIONS v2.5',
    experiencePoints: 'Experience Points (XP)',
    guideManual: 'Kaihhruaina Bu',
    langName: 'Mizo',
    langSwitchLabel: 'Ṭawng',
    mathTermsNotice: 'Mathematical terms te hi standard form-a vawn a ni',

    // Subheader / Navigation
    backToMenu: '← Menu lian zawka kir lehna',
    streak: 'Streak',
    resetData: 'Data reset rawh',
    resetConfirm: 'I score, levels hmasawnna, leh custom designs vawnṭhat te nuaibo i duh tak zet em?',

    // Lobby
    lobbyBadge: 'Interactive Mathematics Lab',
    lobbyHeroTitle: 'I Symmetry Arena Thlang Rawh',
    lobbyHeroDesc: 'Coordinate reflections, point translations, leh axial symmetry dan mawitak te hi zir rawh. Level-te khelh hmangin emaw mahnia mirror patterns duang chhuakin zir rawh le!',

    // Lobby Challenge Card
    trophyChallenge: 'Trophy Chona',
    levelChallengesTitle: 'Level Challenges',
    levelChallengesDesc: 'Level hrang hrang kal chhohah i geometric reflection thiamna fiah rawh! Coordinates leh symmetry lines (vertical, horizontal, diagonal) te uluk takin thlir la, multiple choice zing aṭangin reflection dik ber thlang rawh le.',
    levelsDesignedTag: 'Level 30 duan sa te',
    streaksTag: 'Streaks & XP Tracking',
    progressSavedTag: 'Hmasawnna khawlah vawnṭhat a ni',
    levelsFinishedCount: 'Level {count} zawh tawh',
    notStartedYet: 'Bul ṭan a la ni lo',
    playLevelsBtn: 'Level-te Khel Rawh',

    // Lobby Sandbox Card
    interactiveDrawTag: 'Mahnia Rinna Hmun',
    sandboxCardTitle: 'Mirror Draw Sandbox',
    sandboxCardDesc: 'Line segments emaw cell blocks hmangin i duh ang figure ziak rawh. Auto-Mirror on la, lines hrang hrang karah rang takin reflect nghal rawh, emaw mahni reflection puzzles siamin fiah rawh le!',
    lineDrawerTag: 'Snapping Line Drawer',
    blockPainterTag: 'Cell Block Painter',
    localGalleryTag: 'Mahni Pual Gallery',
    savedCreationsCount: 'Kutchhuak {count} vawnṭhat a ni',
    noSavedDesigns: 'Design vawnṭhat a la awm lo',
    startDrawingBtn: 'Ziak Ṭan Rawh',

    // Lobby Stats Bar
    totalPoints: 'Points zawng zawng',
    activeStreak: 'Streak kalpui mek',
    highestStreak: 'Streak sang ber',
    daysSuffix: 'Ni',
    maxSuffix: 'Max',

    // Guide Modal
    guideModalTitle: 'Symmetry & Mirror Reflections',
    guideModalSubtitle: 'Zirlai tana mathematical reflections zirchianna kaihhruaina!',
    guideModalIntro: 'Chibai le! He simulator-ah hian geometric symmetry leh coordinate reflections mathematical dan te i zir dawn a ni. Coordinates an in-transform dan chu hetiang hi a ni:',
    guideVerticalTitle: '↕ Vertical Axis',
    guideVerticalDesc: 'Elements te horizontally a flip. Heights (Y) chu a ngai reng ang.',
    guideHorizontalTitle: '↔ Horizontal Axis',
    guideHorizontalDesc: 'Elements te vertically a flip. Columns (X) chu a ngai reng ang.',
    guideDiagonalTitle: '⤪ Diagonal Line',
    guideDiagonalDesc: 'y = x diagonal kânin a flip. Coordinate keys te an inthlak thleng.',
    howToNavigateTitle: 'Kalphung leh Hman dan:',
    guideNavChallenge: 'Level Challenges: Reference coordinates te uluk takin bih la, Option A, B, C emaw D thlang rawh. False diagonal flips leh rotations lakah fimkhur ang che!',
    guideNavSandbox: 'Creative Sandbox: Tiles duh ang rawng hnawih rawh. A rualin Auto-Mirror hmang rawh emaw patterns chinfel nan Reflection Puzzle hmang rawh!',
    startLabBtn: 'Bul Ṭan Rawh',

    // Challenge Mode - Level Selector
    syllabusBadge: 'Symmetry Syllabus & Curriculum',
    selectLevelTitle: 'I Chona Level Thlang Rawh',
    selectLevelDesc: 'Spatial translations leh axial reflections te zir rawh. Level tin hian symmetry lines leh grid dimensions danglam bik an nei vek a ni.',
    progressLabel: 'Hmasawnna',
    completeBadge: 'ZO TAWH 🎉',
    solvedFraction: '{solved} / {total} Chinfel tawh',
    resumeChallengeBtn: 'Chhunzawm Leh Rawh',
    startChallengeBtn: 'Chona Ṭan Rawh',
    infiniteCardTitle: 'Infinite Playground',
    infiniteCardDesc: 'Tawp nei lo, procedurally generated symmetry puzzles te hawng rawh! Axial mappings i thiam tawh zia fiah nan a inthlak chho reng ang.',
    launchInfiniteBtn: 'Infinite Ṭan Rawh',
    didYouKnowTitle: 'I hria em?',
    didYouKnowDesc: 'Symmetry hi linear geometry-a bulṭhut pawimawh berte zinga mi a ni. Axis of reflection hian point leh a reflected counterpart thlunzawmtu segment chu perpendicular bisector angin a phel hlawm a ni.',

    // Challenge Mode - Gameplay Board
    backToSyllabus: '← Syllabus Levels-ah Kir Leh Rawh',
    challengeCounter: 'Challenge {current} of {total}',
    infiniteModeActive: 'Procedural Infinite Mode',
    refModelLabel: 'Reference Model',
    mathGridTab: 'Math Grid',
    realLifeTab: 'Tak Tak (Real-Life)',
    selectMirrorImageBadge: 'Mirror Image Thlang Rawh',
    selectPrompt: 'Eng lem ber hian nge red dashed mirror axis kânin reference figure mathematical reflection dik ber tarlang?',

    // Challenge Mode - Feedback
    feedbackCorrectTitle: 'A ṭha lutuk! Pure Mathematical Symmetry',
    feedbackIncorrectTitle: 'Mapping A Dik Lo',
    transformationPrincipleTitle: 'Transformation Principle:',
    transformationPrincipleDesc: 'Mirror reflection hian collinearity leh distances a vawnghim ṭhin. Original side aṭanga point awmna leh mirror axis inkar hlat zawng chu opposite side-ah a inang chiah tur a ni.',
    unlockNextLevelBtn: 'Level Dawtleh Hawng Rawh',
    proceedNextChallengeBtn: 'Challenge Dawtleha Kal Rawh',
    symmetryTipHeader: 'Symmetry Tip',

    // Challenge Mode - Sandbox Banner
    sandboxBannerTitle: 'Symmetry Sandbox',
    sandboxBannerDesc: 'Custom patterns siam i duh em? Snapping lines emaw blocks hmangin real-time auto-reflection nen duang rawh.',
    launchSandboxBtn: 'Sandbox Hawng Rawh',

    // Sandbox Controls
    sandboxControlsTitle: 'Sandbox Controls',
    sandboxControlsDesc: 'Geometric mirror mappings fiah nan i reflection axis leh interact mode thlang rawh.',
    autoMirrorModeBtn: 'Real-time Mirror',
    puzzleModeBtn: 'Reflection Puzzle',
    gridScaleLabel: 'Grid Scale:',
    mirrorAxisLabel: 'Mirror Axis Line:',
    drawingToolPaletteTitle: 'Drawing Tool & Palette',
    toolLineDrawer: 'Line Drawer',
    toolBlockPainter: 'Block Painter',
    symmetryGalleryTitle: 'Symmetry Gallery',
    linesCount: '{count} lines',
    blocksCount: '{count} blocks',

    // Sandbox Canvas Area
    autoMirrorBanner: 'Auto-Mirror Mode',
    solverBanner: 'Symmetry Puzzle Solver',
    autoMirrorLineInst: 'Line ziak turin snapping dots hmet rawh. Symmetrical reflected line segments te rang takin an lo chhuak nghal ang!',
    autoMirrorBlockInst: 'Tiles rawng hnawih turin grid boxes hmet rawh. Symmetrical reflected tiles te rang takin an lo chhuak nghal ang!',
    solverLineInst: 'Reference line structure siam turin "Generate Pattern" hmet rawh. Side B-ah reflected lines ziak la, enfiah rawh le!',
    solverBlockInst: 'Reference tile structure siam turin "Generate Pattern" hmet rawh. Side B-ah reflected blocks rawng hnawih la, enfiah rawh le!',
    generatePatternBtn: 'Pattern Siam Rawh',
    clearBtn: 'Tifai Rawh',
    lineDrawingSandbox: 'Line Drawing Sandbox',
    blockDrawingSandbox: 'Block Drawing Sandbox',
    lineSymmetrySolver: 'Line Symmetry Solver',
    blockSymmetrySolver: 'Block Symmetry Solver',
    autoReflectingBadge: 'Auto-Reflecting',
    symmetryQuizBadge: 'Symmetry Quiz',
    perfectSymmetryTitle: 'Perfect Symmetry! (+150 XP)',
    perfectLineSymmetryDesc: 'Line segments zawng zawng mirror images dik takin i plot vek e! Spatial coordination ṭha tak a ni.',
    perfectBlockSymmetryDesc: 'Blocks zawng zawng mirror images dik takin i plot vek e! Spatial geometry lamah mit fing tak i nei e.',
    tryAgainTitle: 'Han Ti Nawn Leh Teh!',
    tryAgainLineDesc: 'Side B a line ṭhenkhat hi Side A reflected coordinates dik tak nen an inmil lo. Segment tin uluk takin enfiah rawh!',
    tryAgainBlockDesc: 'Side B a blocks ṭhenkhat hi Side A mirrored coordinate dik tak nen an inmil lo. Mirror line aṭanga cell hlat zawng enfiah rawh.',
    snappingLineHelp: 'Dots hmet la line ziak rawh. Hmeh lehna chuan line thar a ṭan ang. (Vertex limits: 0 to {gridSize})',
    blockCoordHelp: 'Active coordinates: (X goes 0 to {max}, Y goes 0 to {max})',
    saveGalleryBtn: 'Gallery-ah Vawngṭha Rawh',
    verifySymmetryBtn: 'Symmetry Enfiah Rawh!',
    alertDrawReferenceLines: 'Reference side-ah lines ziak hmasa phawt rawh le!',
    alertDrawReferenceBlocks: 'Reference side-ah blocks rawng hnawih hmasa phawt rawh le!',
    alertEmptyGrid: 'Grid ruak chu vawnṭhat theih a ni lo!',
    alertEmptyLine: 'Line drawing ruak chu vawnṭhat theih a ni lo!',
    alertSavedGallery: 'Symmetry pattern chu i local gallery-ah hlawhtling taka vawnṭhat a ni e!',

    // Global Footer
    footerLine1: 'Symmetry Mirror Match — Zirlai naupangte tana spatial-reasoning zirna game hlu tak.',
    footerLine2: 'Coordinate reflections & geometric transforms (X/Y reflections leh diagonal coordinates) hmanga siam a ni.',
  },
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  toggleLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === 'mizo' ? 'mizo' : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  };

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mizo' : 'en');
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const dict = DICTIONARY[language] as Record<string, string>;
    let text = dict[key] || (DICTIONARY.en as Record<string, string>)[key] || key;
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
