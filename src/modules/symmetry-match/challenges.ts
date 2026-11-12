import { Challenge, LevelInfo } from './types';
import {
  reflectBlock,
  reflectPoint,
  rotateBlock180,
  rotatePoint180,
  reflectBlockWrongAxis,
  reflectPointWrongAxis,
  skewBlocks,
  skewPoints,
} from './utils/geometry';

export const LEVELS: LevelInfo[] = [
  {
    levelNum: 1,
    name: 'Mirror Basics',
    nameMizo: 'Mirror Basics',
    difficulty: 'Easy',
    difficultyMizo: 'Awlsam',
    description: 'Learn simple reflections across a vertical mirror line using grid blocks.',
    descriptionMizo: 'Grid blocks hmangin vertical mirror line kânin reflections awlsam te zir rawh.',
    badgeColor: 'bg-emerald-500 text-white',
  },
  {
    levelNum: 2,
    name: 'Geometric Reflection',
    nameMizo: 'Geometric Reflection',
    difficulty: 'Easy',
    difficultyMizo: 'Awlsam',
    description: 'Detect coordinates and reflect simple shapes like triangles and arrows.',
    descriptionMizo: 'Coordinates bih la, triangles leh arrows ang shape te reflect rawh.',
    badgeColor: 'bg-teal-500 text-white',
  },
  {
    levelNum: 3,
    name: 'Color Mosaics',
    nameMizo: 'Color Mosaics',
    difficulty: 'Medium',
    difficultyMizo: 'A Laihawl',
    description: 'Reflect multi-colored blocks horizontally and check for color correspondence.',
    descriptionMizo: 'Rawng chi hrang hrang blocks te horizontally reflect la, an color correspondence enfiah rawh.',
    badgeColor: 'bg-indigo-500 text-white',
  },
  {
    levelNum: 4,
    name: 'Off-Center Axis',
    nameMizo: 'Off-Center Axis',
    difficulty: 'Hard',
    difficultyMizo: 'Harsa Deuh',
    description: 'Practice reflecting when the mirror is not centered in the middle of the grid.',
    descriptionMizo: 'Grid lailung bika mirror line awm loh hunah reflection practice rawh.',
    badgeColor: 'bg-amber-500 text-white',
  },
  {
    levelNum: 5,
    name: 'Diagonal Mastery',
    nameMizo: 'Diagonal Mastery',
    difficulty: 'Expert',
    difficultyMizo: 'Siamtu Thiam',
    description: 'Reflect diagonally across y = x. The ultimate test of spatial transformation!',
    descriptionMizo: 'y = x kânin diagonally reflect rawh. Spatial transformation fiahna sang ber a ni!',
    badgeColor: 'bg-purple-500 text-white',
  },
];

export const STATIC_CHALLENGES: Challenge[] = [
  // --- LEVEL 1: Mirror Basics (Grid size 6, Vertical Mirror in the middle) ---
  {
    id: 'l1_c1',
    level: 1,
    title: 'Taj Mahal Gateway',
    titleMizo: 'Taj Mahal Gateway',
    description: 'The Taj Mahal is famous for its perfect vertical reflection symmetry. Reflect the central arch silhouette across the vertical mirror axis.',
    descriptionMizo: 'Taj Mahal hi a vertical reflection symmetry famkim avangin a lar hle. Central arch silhouette hi vertical mirror axis kânin reflect rawh le.',
    shapeType: 'block',
    gridSize: 6,
    mirrorAxis: {
      type: 'vertical',
      coordinateValue: 2.5, // Between index 2 and 3 (0, 1, 2 | 3, 4, 5)
      label: 'Vertical Mirror (Center)',
    },
    blocks: [
      { x: 1, y: 1, color: '#3b82f6' }, // Blue
      { x: 1, y: 2, color: '#3b82f6' },
      { x: 1, y: 3, color: '#3b82f6' },
      { x: 1, y: 4, color: '#3b82f6' },
      { x: 2, y: 1, color: '#3b82f6' },
      { x: 2, y: 3, color: '#3b82f6' },
    ],
    options: [], // populated below helper
    realWorldImage: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=600&h=600&q=80',
    realWorldTitle: 'Taj Mahal Gateway',
    realWorldTitleMizo: 'Taj Mahal Gateway',
    realWorldDescription: 'The Taj Mahal in Agra, India, is a world-renowned masterpiece of bilateral symmetry. Its main dome, vaulted arches, and surrounding minarets mirror each other perfectly across a central vertical line.',
    realWorldDescriptionMizo: 'Agra, India-a Taj Mahal hi bilateral symmetry kuthnuai ropui tak a ni. A main dome, vaulted arches, leh minarets te hian central vertical line kânin an in-mirror thlap a ni.',
  },
  {
    id: 'l1_c2',
    title: 'Monarch Butterfly',
    titleMizo: 'Monarch Butterfly',
    level: 1,
    description: 'Nature exhibits beautiful bilateral symmetry. Reflect the wing pattern outline across the vertical axis.',
    descriptionMizo: 'Nature hian bilateral symmetry mawi tak a tarlang ṭhin. Wing pattern hi vertical axis kânin reflect rawh le.',
    shapeType: 'block',
    gridSize: 6,
    mirrorAxis: {
      type: 'vertical',
      coordinateValue: 2.5,
      label: 'Vertical Mirror (Center)',
    },
    blocks: [
      { x: 0, y: 2, color: '#ec4899' }, // Pink
      { x: 1, y: 1, color: '#ec4899' },
      { x: 1, y: 2, color: '#ec4899' },
      { x: 1, y: 3, color: '#ec4899' },
      { x: 2, y: 2, color: '#ec4899' },
    ],
    options: [],
    realWorldImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=600&h=600&q=80',
    realWorldTitle: 'Monarch Butterfly',
    realWorldTitleMizo: 'Monarch Butterfly',
    realWorldDescription: 'Monarch butterflies exhibit near-perfect bilateral symmetry in the color, cell structure, and borders of their wings. This precise symmetrical balance is crucial for stable aerodynamic flight.',
    realWorldDescriptionMizo: 'Monarch butterflies te hian an thla rawng, cell structure, leh borders-ah bilateral symmetry famkim deuhthaw an lantir. He symmetrical balance hian thlawh ngil theih nan a pui a ni.',
  },

  // --- LEVEL 2: Geometric Reflection (Grid size 8, Polygon points, Vertical/Horizontal) ---
  {
    id: 'l2_c1',
    level: 2,
    title: 'Symmetric Warning Road Sign',
    titleMizo: 'Symmetric Warning Road Sign',
    description: 'Reflect the triangular road safety shape across the vertical line x = 4. Notice the distance of the vertices from the axis!',
    descriptionMizo: 'Triangular road safety shape hi vertical line x = 4 kânin reflect rawh. Axis laka vertices hlat zawng uluk takin chhinchhiah rawh!',
    shapeType: 'polygon',
    gridSize: 8,
    polygonColor: '#10b981', // Emerald
    mirrorAxis: {
      type: 'vertical',
      coordinateValue: 4,
      label: 'Vertical Axis (x = 4)',
    },
    polygonPoints: [
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 3, y: 6 },
    ],
    options: [],
    realWorldImage: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&h=600&q=80',
    realWorldTitle: 'Triangular Yield Sign',
    realWorldTitleMizo: 'Triangular Yield Sign',
    realWorldDescription: 'Triangles and other symmetric polygons are standard in global signage. Their reflectional balance makes them instantly recognizable and legible from distances.',
    realWorldDescriptionMizo: 'Triangles leh symmetric polygons dangte hi kawngpui chhinchhiahnaah hman lar an ni. An reflectional balance avangin hla tak aṭang pawhin an hmuh fiah theih hle.',
  },
  {
    id: 'l2_c2',
    level: 2,
    title: 'Traditional Diamond Kite',
    titleMizo: 'Traditional Diamond Kite',
    description: 'Reflect the kite outline across the horizontal mirror axis y = 4.',
    descriptionMizo: 'Kite outline hi horizontal mirror axis y = 4 kânin reflect rawh.',
    shapeType: 'polygon',
    gridSize: 8,
    polygonColor: '#f59e0b', // Amber
    mirrorAxis: {
      type: 'horizontal',
      coordinateValue: 4,
      label: 'Horizontal Axis (y = 4)',
    },
    polygonPoints: [
      { x: 2, y: 1 },
      { x: 4, y: 2 },
      { x: 2, y: 3 },
      { x: 1, y: 2 },
    ],
    options: [],
    realWorldImage: 'https://images.unsplash.com/photo-1507034589631-9433cc6bc453?auto=format&fit=crop&w=600&h=600&q=80',
    realWorldTitle: 'Diamond Kite',
    realWorldTitleMizo: 'Diamond Kite',
    realWorldDescription: 'Traditional diamond kites are designed with rigid lateral symmetry. The balanced left and right surface areas split wind resistance evenly, preventing aerodynamic spins.',
    realWorldDescriptionMizo: 'Traditional diamond kites te hi lateral symmetry nghet tak neiin duan an ni. Vei leh dinglam inbuk tawk chiah avangin thli thawt dan an insem rual a ni.',
  },

  // --- LEVEL 3: Color Mosaics (Grid size 8, Block pattern, Horizontal/Vertical mirror, Multi-colored) ---
  {
    id: 'l3_c1',
    level: 3,
    title: 'Royal Crown Emblem',
    titleMizo: 'Royal Crown Emblem',
    description: 'Reflect the stylized sovereign crown across the horizontal mirror line. Ensure both shape and colors match perfectly!',
    descriptionMizo: 'Lal lukhum hi horizontal mirror line kânin reflect rawh. Shape leh colors an inmil thlap em tih enfiah ang che!',
    shapeType: 'block',
    gridSize: 8,
    mirrorAxis: {
      type: 'horizontal',
      coordinateValue: 3.5, // Between 3 and 4
      label: 'Horizontal Mirror (Center)',
    },
    blocks: [
      { x: 2, y: 1, color: '#8b5cf6' }, // Violet
      { x: 4, y: 1, color: '#8b5cf6' },
      { x: 5, y: 1, color: '#8b5cf6' },
      { x: 2, y: 2, color: '#3b82f6' }, // Blue
      { x: 3, y: 2, color: '#3b82f6' },
      { x: 4, y: 2, color: '#3b82f6' },
      { x: 5, y: 2, color: '#3b82f6' },
    ],
    options: [],
    realWorldImage: 'https://images.unsplash.com/photo-1590212151175-e58edd96185b?auto=format&fit=crop&w=600&h=600&q=80',
    realWorldTitle: 'State Crown Jewels',
    realWorldTitleMizo: 'State Crown Jewels',
    realWorldDescription: 'Imperial crowns are crafted with absolute bilateral and rotational symmetry. The symmetrical arrangement of velvet, arches, and precious gemstones represents order, harmony, and structural balance.',
    realWorldDescriptionMizo: 'Lal lukhumte hi bilateral leh rotational symmetry nei tura siam an ni. Velvet, arches, leh lungmawi te symmetrical taka rem hian inremna leh structural balance a entir.',
  },
  {
    id: 'l3_c2',
    level: 3,
    title: 'Parisian Eiffel Tower',
    titleMizo: 'Parisian Eiffel Tower',
    description: 'Reflect the stylized structural tower skeleton across the vertical mirror axis. Notice how coordinates swap horizontally.',
    descriptionMizo: 'Tower structural skeleton hi vertical mirror axis kânin reflect rawh. Coordinates te horizontally an in-swap dan chhinchhiah rawh.',
    shapeType: 'block',
    gridSize: 8,
    mirrorAxis: {
      type: 'vertical',
      coordinateValue: 3.5,
      label: 'Vertical Mirror (Center)',
    },
    blocks: [
      { x: 1, y: 2, color: '#f43f5e' }, // Rose
      { x: 2, y: 2, color: '#f59e0b' }, // Amber
      { x: 2, y: 3, color: '#f43f5e' },
      { x: 3, y: 3, color: '#10b981' }, // Emerald
      { x: 2, y: 4, color: '#f43f5e' },
      { x: 1, y: 5, color: '#3b82f6' }, // Blue
    ],
    options: [],
    realWorldImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&h=600&q=80',
    realWorldTitle: 'Eiffel Tower, Paris',
    realWorldTitleMizo: 'Eiffel Tower, Paris',
    realWorldDescription: 'The Eiffel Tower is a landmark of vertical structural symmetry. The mirror-image structure distributes the tower\'s 10,100 tonnes of steel evenly across its four foundations, preventing bending from high winds.',
    realWorldDescriptionMizo: 'Eiffel Tower hi vertical structural symmetry tarlangtu lian tak a ni. Mirror-image structure hian steel tonnes 10,100 te chu foundations paliah inbuk tawk takin a sem darh a ni.',
  },

  // --- LEVEL 4: Off-Center Axis (Grid size 8 or 10, mirror is shifted) ---
  {
    id: 'l4_c1',
    level: 4,
    title: 'High-tech Solar Array',
    titleMizo: 'High-tech Solar Array',
    description: 'Reflect the solar panel row across the off-center vertical line x = 5. Keep track of the panel gap!',
    descriptionMizo: 'Solar panel row hi off-center vertical line x = 5 kânin reflect rawh. Panel gap awm dan uluk la!',
    shapeType: 'block',
    gridSize: 8,
    mirrorAxis: {
      type: 'vertical',
      coordinateValue: 4.5, // Between 4 and 5
      label: 'Off-Center Axis (x = 5)',
    },
    blocks: [
      { x: 1, y: 2, color: '#06b6d4' }, // Cyan
      { x: 1, y: 3, color: '#06b6d4' },
      { x: 1, y: 4, color: '#06b6d4' },
      { x: 2, y: 4, color: '#06b6d4' },
    ],
    options: [],
    realWorldImage: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=600&h=600&q=80',
    realWorldTitle: 'Photovoltaic Solar Farm',
    realWorldTitleMizo: 'Photovoltaic Solar Farm',
    realWorldDescription: 'Solar power farms arrange panel arrays in strict, neat grids with reflectional symmetry. This layout maximizes spatial coverage, optimizes wiring runs, and ensures even solar incidence.',
    realWorldDescriptionMizo: 'Solar power farms te hian panels te chu reflectional symmetry hmangin grid fel fai takin an rem khawm ṭhin. Layout hian spatial coverage a tipung a ni.',
  },
  {
    id: 'l4_c2',
    level: 4,
    title: 'Observation Ferris Wheel',
    titleMizo: 'Observation Ferris Wheel',
    description: 'Reflect the passenger cabins across the off-center horizontal axis y = 3.',
    descriptionMizo: 'Passenger cabins te hi off-center horizontal axis y = 3 kânin reflect rawh.',
    shapeType: 'polygon',
    gridSize: 8,
    polygonColor: '#eab308', // Yellow
    mirrorAxis: {
      type: 'horizontal',
      coordinateValue: 3,
      label: 'Off-Center Axis (y = 3)',
    },
    polygonPoints: [
      { x: 1, y: 1 },
      { x: 3, y: 1 },
      { x: 2, y: 2 },
      { x: 4, y: 2 },
    ],
    options: [],
    realWorldImage: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=600&h=600&q=80',
    realWorldTitle: 'Observation Giant Wheel',
    realWorldTitleMizo: 'Observation Giant Wheel',
    realWorldDescription: 'A giant ferris wheel is a perfect example of circle/radial symmetry. Its spokes have dozens of reflection lines, which distributes radial tension and passenger cabin weight evenly during rotation.',
    realWorldDescriptionMizo: 'Ferris wheel lian hi radial symmetry entirna ṭha tak a ni. Spokes te hian reflection lines tam tak an nei a, rotation laiin passenger cabin rihna an insem rual ṭhin.',
  },

  // --- LEVEL 5: Diagonal Mastery (Grid size 8, y = x or y = N - 1 - x) ---
  {
    id: 'l5_c1',
    level: 5,
    title: 'Symmetric Spiral Stairwell',
    titleMizo: 'Symmetric Spiral Stairwell',
    description: 'Reflect the stairs diagonally across the mirror line. For y = x, a cell at (x, y) reflects to (y, x) — they swap places!',
    descriptionMizo: 'Kailingte hi mirror line kânin diagonally reflect rawh. y = x atan, (x, y) a cell chu (y, x)-ah a reflect ang — an awmna an inthlak thleng a ni!',
    shapeType: 'block',
    gridSize: 8,
    mirrorAxis: {
      type: 'diagonal-up',
      coordinateValue: 0, // unused for pure diagonal swap
      label: 'Diagonal Line (y = x)',
    },
    blocks: [
      { x: 1, y: 0, color: '#ec4899' }, // Pink
      { x: 2, y: 0, color: '#8b5cf6' }, // Violet
      { x: 2, y: 1, color: '#8b5cf6' },
      { x: 3, y: 1, color: '#3b82f6' }, // Blue
    ],
    options: [],
    realWorldImage: 'https://images.unsplash.com/photo-1563206767-5b18f218e8de?auto=format&fit=crop&w=600&h=600&q=80',
    realWorldTitle: 'Spiral Staircase Symmetries',
    realWorldTitleMizo: 'Spiral Staircase Symmetries',
    realWorldDescription: 'Looking straight down a spiral staircase reveals diagonal and helical symmetries. Architects use these mathematically derived curves to fit elegant vertical pathways inside narrow cylindrical layouts.',
    realWorldDescriptionMizo: 'Kailing vir chhuk thlir hian diagonal leh helical symmetries a hmuh theih. Architects te hian cylindrical layout-ah vertical pathway mawi tak siam nan heng curves te hi an hmang.',
  },
  {
    id: 'l5_c2',
    level: 5,
    title: 'Marine Starfish Reef',
    titleMizo: 'Marine Starfish Reef',
    description: 'Reflect the starfish arm across the diagonal line y = x. Pay close attention to how the angle coordinates shift!',
    descriptionMizo: 'Starfish ban hi diagonal line y = x kânin reflect rawh. Angle coordinates inthlak dan uluk takin thlir ang che!',
    shapeType: 'polygon',
    gridSize: 8,
    polygonColor: '#14b8a6', // Teal
    mirrorAxis: {
      type: 'diagonal-up',
      coordinateValue: 0,
      label: 'Diagonal Line (y = x)',
    },
    polygonPoints: [
      { x: 1, y: 4 },
      { x: 3, y: 4 },
      { x: 4, y: 5 },
      { x: 2, y: 5 },
    ],
    options: [],
    realWorldImage: 'https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=600&h=600&q=80',
    realWorldTitle: 'Five-Point Radial Starfish',
    realWorldTitleMizo: 'Five-Point Radial Starfish',
    realWorldDescription: 'Starfish belong to a group of animals that exhibit penta-radial symmetry. By splitting their bodies into five equal sectors, starfish can move, sense, and catch food equally well from any heading on the ocean floor.',
    realWorldDescriptionMizo: 'Starfish te hian penta-radial symmetry an nei. An taksa chu five equal sectors ah ṭhenin ocean floor-ah chaw an zawng thei a ni.',
  },
];

// Helper to construct distractors statically and dynamically
export function populateChallengeOptions(ch: Challenge): Challenge {
  const { shapeType, blocks, polygonPoints, mirrorAxis, gridSize } = ch;
  const { type: axis, coordinateValue: val } = mirrorAxis;

  // 1. Correct Reflection
  let correctBlocks: any[] | undefined;
  let correctPoints: any[] | undefined;

  if (shapeType === 'block' && blocks) {
    correctBlocks = blocks.map((b) => reflectBlock(b, axis, val, gridSize));
  } else if (shapeType === 'polygon' && polygonPoints) {
    correctPoints = polygonPoints.map((p) => reflectPoint(p, axis, val, gridSize));
  }

  // 2. Rotated 180 (Misconception: kids confuse reflection and 180deg rotation)
  let rotBlocks: any[] | undefined;
  let rotPoints: any[] | undefined;
  if (shapeType === 'block' && blocks) {
    rotBlocks = blocks.map((b) => rotateBlock180(b, gridSize));
  } else if (shapeType === 'polygon' && polygonPoints) {
    rotPoints = polygonPoints.map((p) => rotatePoint180(p, gridSize));
  }

  // 3. Wrong Axis Reflection (Reflected on the perpendicular axis)
  let wrongAxisBlocks: any[] | undefined;
  let wrongAxisPoints: any[] | undefined;
  if (shapeType === 'block' && blocks) {
    wrongAxisBlocks = blocks.map((b) => reflectBlockWrongAxis(b, axis, val, gridSize));
  } else if (shapeType === 'polygon' && polygonPoints) {
    wrongAxisPoints = polygonPoints.map((p) => reflectPointWrongAxis(p, axis, gridSize));
  }

  // 4. Skewed / Deformed reflection
  let skewedBlocks: any[] | undefined;
  let skewedPoints: any[] | undefined;
  if (shapeType === 'block' && correctBlocks) {
    skewedBlocks = skewBlocks(correctBlocks, gridSize);
  } else if (shapeType === 'polygon' && correctPoints) {
    skewedPoints = skewPoints(correctPoints, gridSize);
  }

  // Set up options with clear educational explanations
  const optionsList: any[] = [
    {
      id: 'A',
      blocks: correctBlocks,
      polygonPoints: correctPoints,
      type: 'correct',
      explanation: `Correct! Every point maintains the exact same perpendicular distance to the mirror line but on the opposite side. Colors and coordinates match perfectly.`,
      explanationMizo: `A dik e! Point tin hian mirror line laka perpendicular distance ngai chiah opposite side-ah an vawng a ni. Colors leh coordinates an inmil thlap e.`,
    },
    {
      id: 'B',
      blocks: rotBlocks,
      polygonPoints: rotPoints,
      type: 'rotated-180',
      explanation: `Incorrect. This is a 180° rotation, not a mirror reflection. Notice how the shape has spun around rather than mirroring.`,
      explanationMizo: `A dik lo. Hei hi 180° rotation a ni a, mirror reflection a ni lo. Mirror aiah shape chu a in-spin kual a nih hi.`,
    },
    {
      id: 'C',
      blocks: wrongAxisBlocks,
      polygonPoints: wrongAxisPoints,
      type: 'wrong-axis',
      explanation: `Incorrect. This shape is reflected across the wrong axis (reflected ${
        axis === 'vertical' ? 'horizontally' : 'vertically'
      } instead of ${axis === 'vertical' ? 'vertically' : 'horizontally'}).`,
      explanationMizo: `A dik lo. He shape hi axis dik lo zawk kânin a reflect a ni (${
        axis === 'vertical' ? 'horizontally' : 'vertically'
      } aia ${axis === 'vertical' ? 'vertically' : 'horizontally'} a reflect a ni).`,
    },
    {
      id: 'D',
      blocks: skewedBlocks,
      polygonPoints: skewedPoints,
      type: 'skewed',
      explanation: `Incorrect. This is close, but there's a subtle error! One or more coordinates or colors do not align perfectly with the mirror symmetry rules.`,
      explanationMizo: `A dik lo. A hnai viau nan dik lohna te takte a awm! Coordinates emaw colors pakhat emaw a aia tam mirror symmetry rules nen an inmil lo chiah chiah a ni.`,
    },
  ];

  // Shuffle option letters but make sure they are mapped A, B, C, D
  const shuffled = [...optionsList].sort(() => Math.random() - 0.5);

  ch.options = shuffled.map((opt, index) => {
    const letter = ['A', 'B', 'C', 'D'][index] as 'A' | 'B' | 'C' | 'D';
    return {
      ...opt,
      id: letter,
    };
  });

  return ch;
}

// Generate all fully populated challenges
export const ALL_CHALLENGES = STATIC_CHALLENGES.map((ch) => populateChallengeOptions(ch));

// Procedural challenge generator for endless play!
export function generateRandomChallenge(levelNum: number): Challenge {
  const levelInfo = LEVELS.find((l) => l.levelNum === levelNum) || LEVELS[0];
  const gridSize = levelNum === 1 ? 6 : levelNum === 3 ? 8 : 8;
  const isBlock = Math.random() > 0.4 || levelNum === 1 || levelNum === 3;
  const id = `dynamic_l${levelNum}_${Date.now()}`;

  // Pick axis based on level difficulty
  let type: 'vertical' | 'horizontal' | 'diagonal-up' | 'diagonal-down' = 'vertical';
  let coordinateValue = (gridSize - 1) / 2;
  let label = 'Vertical Axis';

  if (levelNum === 2) {
    type = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    coordinateValue = gridSize / 2;
    label = type === 'vertical' ? `Vertical Axis (x = ${coordinateValue})` : `Horizontal Axis (y = ${coordinateValue})`;
  } else if (levelNum === 3) {
    type = 'horizontal';
    coordinateValue = (gridSize - 1) / 2;
    label = 'Horizontal Mirror';
  } else if (levelNum === 4) {
    // Off-center
    type = Math.random() > 0.5 ? 'vertical' : 'horizontal';
    coordinateValue = type === 'vertical' ? 2.5 : 5.5; // asymmetric
    label = type === 'vertical' ? `Off-Center (x = ${coordinateValue + 0.5})` : `Off-Center (y = ${coordinateValue + 0.5})`;
  } else if (levelNum === 5) {
    type = Math.random() > 0.5 ? 'diagonal-up' : 'diagonal-down';
    coordinateValue = 0;
    label = type === 'diagonal-up' ? 'Diagonal (y = x)' : 'Diagonal (y = -x)';
  }

  const colors = ['#3b82f6', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#14b8a6'];

  if (isBlock) {
    // Generate 3 to 5 random blocks on one half of the grid
    const blocks: any[] = [];
    const count = 3 + Math.floor(Math.random() * 3);
    const used = new Set<string>();

    for (let i = 0; i < count; i++) {
      let x = 0;
      let y = 0;
      // Keep on one half depending on axis
      if (type === 'vertical') {
        x = Math.floor(Math.random() * Math.floor(coordinateValue));
        y = Math.floor(Math.random() * gridSize);
      } else if (type === 'horizontal') {
        x = Math.floor(Math.random() * gridSize);
        y = Math.floor(Math.random() * Math.floor(coordinateValue));
      } else if (type === 'diagonal-up' || type === 'diagonal-down') {
        // Keep in the lower triangle
        x = Math.floor(Math.random() * (gridSize - 2)) + 1;
        y = Math.floor(Math.random() * x);
      }

      const key = `${x},${y}`;
      if (!used.has(key)) {
        used.add(key);
        blocks.push({
          x,
          y,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    const ch: Challenge = {
      id,
      level: levelNum,
      title: `Procedural Block Puzzle`,
      titleMizo: `Procedural Block Puzzle`,
      description: `Test your spatial reflection skills. Mirror the custom block pattern perfectly across the specified line!`,
      descriptionMizo: `I spatial reflection thiamna fiah rawh. Custom block pattern hi line tarlan kânin reflect dik chiah rawh le!`,
      shapeType: 'block',
      gridSize,
      mirrorAxis: { type, coordinateValue, label },
      blocks,
      options: [],
    };

    return populateChallengeOptions(ch);
  } else {
    // Polygon shape
    const polygonPoints: any[] = [];
    const polyColor = colors[Math.floor(Math.random() * colors.length)];

    // Construct simple 3 or 4 vertex polygon on one side
    if (type === 'vertical') {
      polygonPoints.push({ x: 1, y: 1 });
      polygonPoints.push({ x: Math.floor(coordinateValue) - 1, y: 2 });
      polygonPoints.push({ x: 2, y: 5 });
    } else if (type === 'horizontal') {
      polygonPoints.push({ x: 1, y: 1 });
      polygonPoints.push({ x: 5, y: 2 });
      polygonPoints.push({ x: 3, y: Math.floor(coordinateValue) - 1 });
    } else {
      polygonPoints.push({ x: 1, y: 5 });
      polygonPoints.push({ x: 2, y: 6 });
      polygonPoints.push({ x: 1, y: 7 });
    }

    const ch: Challenge = {
      id,
      level: levelNum,
      title: `Procedural Polygon Puzzle`,
      titleMizo: `Procedural Polygon Puzzle`,
      description: `Identify the correct coordinate reflection of this shape. Look closely at vertex distances!`,
      descriptionMizo: `He shape coordinate reflection dik hi zawng chhuak rawh. Vertex distances uluk takin bih rawh!`,
      shapeType: 'polygon',
      gridSize,
      polygonColor: polyColor,
      mirrorAxis: { type, coordinateValue, label },
      polygonPoints,
      options: [],
    };

    return populateChallengeOptions(ch);
  }
}
