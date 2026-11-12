export interface ModuleInfo {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  grade: string;
  category: 'fractions' | 'geometry' | 'arithmetic' | 'physics';
  categoryLabel: string;
  badge: string;
  description: string;
  iconName: string;
  colorScheme: {
    primary: string;
    headerBg: string;
    badgeBg: string;
    badgeText: string;
    border: string;
  };
  features: string[];
  shortcut: string;
}

export const MODULES_REGISTRY: ModuleInfo[] = [
  {
    id: 'fraction-zirna',
    number: '01',
    title: 'Fraction Zirna Playground',
    subtitle: 'Visual Pie Slices & Comparisons',
    grade: 'Grades 2-6',
    category: 'fractions',
    categoryLabel: 'Fractions & Division',
    badge: 'Elementary STEM',
    description: 'Master fractions visually through dynamic pie cutters, slice comparisons, fraction additions, and real-world pizza level challenges.',
    iconName: 'PieChart',
    colorScheme: {
      primary: '#FFD166',
      headerBg: 'bg-[#FFD166]',
      badgeBg: 'bg-[#FFD166]',
      badgeText: 'text-black',
      border: 'border-black',
    },
    features: ['Interactive Slice Maker', 'Pie & Bar Comparisons', 'Everyday Pizza Challenges', 'Addition Visualizer'],
    shortcut: '1',
  },
  {
    id: 'fraction-grid',
    number: '02',
    title: 'Fraction Grid Game MIZO',
    subtitle: 'Decimals, Percentages & Ratios',
    grade: 'Grades 3-8',
    category: 'fractions',
    categoryLabel: 'Fractions & Division',
    badge: 'Bilingual (Mizo / Eng)',
    description: 'Customize grid dimensions (up to 10x10), shade target fractional parts, and master conversions between fractions, decimals, and percentages.',
    iconName: 'Grid3X3',
    colorScheme: {
      primary: '#06D6A0',
      headerBg: 'bg-[#06D6A0]',
      badgeBg: 'bg-[#06D6A0]',
      badgeText: 'text-black',
      border: 'border-black',
    },
    features: ['Custom Grid Dimensions', 'Mizo Audio & Voice Feedback', 'Real-time Decimals & %', 'Progressive Challenge Deck'],
    shortcut: '2',
  },
  {
    id: 'symmetry-match',
    number: '03',
    title: 'Symmetry Mirror Match',
    subtitle: 'Reflections & Transformations',
    grade: 'Grades 5-9',
    category: 'geometry',
    categoryLabel: 'Geometry & Spatial',
    badge: '30 Levels + Sandbox',
    description: 'Explore geometric axial reflections across horizontal, vertical, and diagonal symmetry axes with 30 progressive puzzles and an interactive drawing sandbox.',
    iconName: 'FlipHorizontal2',
    colorScheme: {
      primary: '#C4B5FD',
      headerBg: 'bg-[#C4B5FD]',
      badgeBg: 'bg-[#C4B5FD]',
      badgeText: 'text-black',
      border: 'border-black',
    },
    features: ['30 Syllabus Levels', 'Diagonal & Axial Reflections', 'Snapping Line Sandbox', 'Bilingual UI (Mizo / Eng)'],
    shortcut: '3',
  },
  {
    id: 'abacus-math',
    number: '04',
    title: 'Interactive Abacus Studio',
    subtitle: 'Place Value & Mental Math',
    grade: 'All Grades',
    category: 'arithmetic',
    categoryLabel: 'Arithmetic & Place Value',
    badge: 'Classical Soroban',
    description: 'Hands-on Japanese Soroban and vertical place-value abacus with real-time value counters, tactile bead audio, and step-by-step arithmetic challenges.',
    iconName: 'Calculator',
    colorScheme: {
      primary: '#FB923C',
      headerBg: 'bg-[#FB923C]',
      badgeBg: 'bg-[#FB923C]',
      badgeText: 'text-black',
      border: 'border-black',
    },
    features: ['4-Bead Japanese Soroban', 'Vertical Counter Mode', 'Synthesized Audio Beads', 'Number-to-Words Engine'],
    shortcut: '4',
  },
  {
    id: 'coordinate-defense',
    number: '05',
    title: 'Coordinate Cannon Defense',
    subtitle: 'Cartesian Vector STEM Game',
    grade: 'Grades 6-10',
    category: 'geometry',
    categoryLabel: 'Geometry & Spatial',
    badge: 'Artillery Physics',
    description: 'Defend the math academy against vector attacks by inputting accurate (X,Y) coordinates, quadrant rules, and projectile linear trajectories.',
    iconName: 'Crosshair',
    colorScheme: {
      primary: '#F87171',
      headerBg: 'bg-[#F87171]',
      badgeBg: 'bg-[#F87171]',
      badgeText: 'text-black',
      border: 'border-black',
    },
    features: ['Cartesian 4-Quadrant Plane', 'Linear Trajectory Physics', 'Teacher Mission Editor', 'Flight Blackbox Recorder'],
    shortcut: '5',
  },
  {
    id: 'optics-lab',
    number: '07',
    title: 'Ray Tracing Optics Lab',
    subtitle: 'Lenses, Mirrors & Real Rays',
    grade: 'Grades 8-12',
    category: 'physics',
    categoryLabel: 'Physics & Optics',
    badge: 'STEM Laboratory',
    description: 'Realistic mirror and lens optics laboratory featuring interactive ray tracing, adjustable focal lengths, movable torch light, and physics presets.',
    iconName: 'Sun',
    colorScheme: {
      primary: '#38BDF8',
      headerBg: 'bg-[#38BDF8]',
      badgeBg: 'bg-[#38BDF8]',
      badgeText: 'text-black',
      border: 'border-black',
    },
    features: ['Convex & Concave Lenses', 'Curved Mirrors & Prisms', 'Focal Point Manipulation', 'Notebook Graph Grid Theme'],
    shortcut: '6',
  },
  {
    id: 'number-line-cruiser',
    number: '08',
    title: 'Number Line Cruiser',
    subtitle: 'Integer Motion Math Car Game',
    grade: 'Grades 3-7',
    category: 'arithmetic',
    categoryLabel: 'Arithmetic & Place Value',
    badge: 'Interactive Car Game',
    description: 'Drive cars forward and reverse along the integer number line to physically understand positive and negative additions and subtractions.',
    iconName: 'Car',
    colorScheme: {
      primary: '#FBBF24',
      headerBg: 'bg-[#FBBF24]',
      badgeBg: 'bg-[#FBBF24]',
      badgeText: 'text-black',
      border: 'border-black',
    },
    features: ['Car Direction & Movement', 'Integer Addition & Subtraction', 'Custom Vehicles (Rover, Coupe)', 'Celebration Star Confetti'],
    shortcut: '7',
  },
];
