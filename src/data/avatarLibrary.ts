export interface PixelAvatar {
  id: string;
  name: string;
  category: 'students' | 'scientists' | 'astronauts' | 'math' | 'animals' | 'robots';
  emoji: string;
  bg: string;
  border: string;
  description: string;
}

export const AVATAR_CATEGORIES = [
  { id: 'all', label: 'All Avatars' },
  { id: 'students', label: 'Students' },
  { id: 'scientists', label: 'Scientists' },
  { id: 'astronauts', label: 'Astronauts' },
  { id: 'math', label: 'Math & Geometry' },
  { id: 'animals', label: 'Mascots & Wildlife' },
  { id: 'robots', label: 'Robots & Tech' },
] as const;

export const PIXEL_AVATARS: PixelAvatar[] = [
  // Students
  {
    id: 'avatar-student-boy-1',
    name: 'Mizo STEM Explorer',
    category: 'students',
    emoji: '👦🏽',
    bg: 'bg-amber-100',
    border: 'border-amber-500',
    description: 'Curious problem solver from Aizawl',
  },
  {
    id: 'avatar-student-girl-1',
    name: 'Math Prodigy',
    category: 'students',
    emoji: '👧🏼',
    bg: 'bg-emerald-100',
    border: 'border-emerald-500',
    description: 'Fraction puzzle master and team captain',
  },
  {
    id: 'avatar-student-child-1',
    name: 'Curious Learner',
    category: 'students',
    emoji: '🧒🏿',
    bg: 'bg-cyan-100',
    border: 'border-cyan-500',
    description: 'Tactile Soroban abacus enthusiast',
  },
  {
    id: 'avatar-student-scholar',
    name: 'Young Scholar',
    category: 'students',
    emoji: '🎒',
    bg: 'bg-purple-100',
    border: 'border-purple-500',
    description: 'Dedicated student always ready for daily streaks',
  },

  // Scientists
  {
    id: 'avatar-scientist-microscope',
    name: 'Microscopist',
    category: 'scientists',
    emoji: '🔬',
    bg: 'bg-blue-100',
    border: 'border-blue-500',
    description: 'Biology and optics researcher',
  },
  {
    id: 'avatar-scientist-chemist',
    name: 'Chemist',
    category: 'scientists',
    emoji: '🧪',
    bg: 'bg-teal-100',
    border: 'border-teal-500',
    description: 'Master of chemical reactions and laboratory tools',
  },
  {
    id: 'avatar-scientist-physicist',
    name: 'Quantum Physicist',
    category: 'scientists',
    emoji: '⚛️',
    bg: 'bg-indigo-100',
    border: 'border-indigo-500',
    description: 'Investigating light rays and refractive lenses',
  },
  {
    id: 'avatar-scientist-astronomer',
    name: 'Astronomer',
    category: 'scientists',
    emoji: '🔭',
    bg: 'bg-violet-100',
    border: 'border-violet-500',
    description: 'Stargazer charting Cartesian coordinate vectors',
  },

  // Astronauts
  {
    id: 'avatar-astro-rocket',
    name: 'Orbit Rocket',
    category: 'astronauts',
    emoji: '🚀',
    bg: 'bg-amber-200',
    border: 'border-amber-600',
    description: 'Speedy cruiser traveling along the signed integer line',
  },
  {
    id: 'avatar-astro-cosmonaut',
    name: 'Cosmonaut',
    category: 'astronauts',
    emoji: '👨‍🚀',
    bg: 'bg-slate-200',
    border: 'border-slate-600',
    description: 'Deep-space pioneer exploring gravity and mirrors',
  },
  {
    id: 'avatar-astro-satellite',
    name: 'Orbital Probe',
    category: 'astronauts',
    emoji: '🛰️',
    bg: 'bg-cyan-200',
    border: 'border-cyan-600',
    description: 'Satellite relaying real-time classroom telemetry',
  },
  {
    id: 'avatar-astro-planet',
    name: 'Ringed Planet',
    category: 'astronauts',
    emoji: '🪐',
    bg: 'bg-rose-100',
    border: 'border-rose-400',
    description: 'Geometric sphere with concentric elliptical rings',
  },

  // Math & Geometry
  {
    id: 'avatar-math-pizza',
    name: 'Pizza Slicer',
    category: 'math',
    emoji: '🍕',
    bg: 'bg-amber-100',
    border: 'border-amber-500',
    description: 'Visualizing equivalent fractions and equal division',
  },
  {
    id: 'avatar-math-triangles',
    name: 'Protractor & Ruler',
    category: 'math',
    emoji: '📐',
    bg: 'bg-emerald-100',
    border: 'border-emerald-500',
    description: 'Measuring angles, coordinates, and symmetry axes',
  },
  {
    id: 'avatar-math-infinity',
    name: 'Infinity Loop',
    category: 'math',
    emoji: '♾️',
    bg: 'bg-purple-100',
    border: 'border-purple-500',
    description: 'Limitless potential in mathematical thinking',
  },
  {
    id: 'avatar-math-soroban',
    name: 'Soroban Frame',
    category: 'math',
    emoji: '🧮',
    bg: 'bg-orange-100',
    border: 'border-orange-500',
    description: 'Traditional Japanese beads for high-speed mental math',
  },

  // Animals & Mascots
  {
    id: 'avatar-animal-fox',
    name: 'Clever Fox',
    category: 'animals',
    emoji: '🦊',
    bg: 'bg-amber-100',
    border: 'border-orange-500',
    description: 'Quick-witted team strategist',
  },
  {
    id: 'avatar-animal-owl',
    name: 'Wise Owl',
    category: 'animals',
    emoji: '🦉',
    bg: 'bg-stone-200',
    border: 'border-stone-500',
    description: 'Patient mentor guiding classroom discussions',
  },
  {
    id: 'avatar-animal-lion',
    name: 'Brave Lion',
    category: 'animals',
    emoji: '🦁',
    bg: 'bg-yellow-100',
    border: 'border-yellow-600',
    description: 'Fierce competitor leading Team Alpha in battles',
  },
  {
    id: 'avatar-animal-dolphin',
    name: 'Agile Dolphin',
    category: 'animals',
    emoji: '🐬',
    bg: 'bg-sky-100',
    border: 'border-sky-500',
    description: 'Playful learner finding creative solutions',
  },

  // Robots & Tech
  {
    id: 'avatar-robot-bot',
    name: 'Logic Bot',
    category: 'robots',
    emoji: '🤖',
    bg: 'bg-slate-200',
    border: 'border-slate-500',
    description: 'Algorithmically precise calculation companion',
  },
  {
    id: 'avatar-robot-chip',
    name: 'Silicon Core',
    category: 'robots',
    emoji: '💻',
    bg: 'bg-cyan-100',
    border: 'border-cyan-500',
    description: 'Binary processing and computational logic',
  },
  {
    id: 'avatar-robot-spark',
    name: 'Kinetic Spark',
    category: 'robots',
    emoji: '⚡',
    bg: 'bg-amber-100',
    border: 'border-amber-500',
    description: 'High-energy spark for speed challenges',
  },
  {
    id: 'avatar-robot-gear',
    name: 'Mechanical Gear',
    category: 'robots',
    emoji: '⚙️',
    bg: 'bg-zinc-200',
    border: 'border-zinc-500',
    description: 'Synchronized mechanisms powering team relay solutions',
  },
];

export const getAvatarById = (id?: string): PixelAvatar => {
  return PIXEL_AVATARS.find((a) => a.id === id || a.emoji === id) || PIXEL_AVATARS[0];
};

export const AVATAR_LIBRARY = PIXEL_AVATARS;
