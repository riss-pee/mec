import { PlaceValueConfig, Challenge, LessonPage } from '../types';

export const PLACE_VALUES: PlaceValueConfig[] = [
  {
    exponent: 0,
    name: 'Ones',
    shortName: '1',
    color: 'from-rose-500 to-rose-600',
    beadColor: 'bg-rose-500 border-rose-700 shadow-rose-300/50',
  },
  {
    exponent: 1,
    name: 'Tens',
    shortName: '10',
    color: 'from-orange-500 to-orange-600',
    beadColor: 'bg-orange-500 border-orange-700 shadow-orange-300/50',
  },
  {
    exponent: 2,
    name: 'Hundreds',
    shortName: '100',
    color: 'from-amber-500 to-amber-600',
    beadColor: 'bg-amber-500 border-amber-700 shadow-amber-300/50',
  },
  {
    exponent: 3,
    name: 'Thousands',
    shortName: '1,000',
    color: 'from-emerald-500 to-emerald-600',
    beadColor: 'bg-emerald-500 border-emerald-700 shadow-emerald-300/50',
  },
  {
    exponent: 4,
    name: 'Ten Thousands',
    shortName: '10,000',
    color: 'from-teal-500 to-teal-600',
    beadColor: 'bg-teal-500 border-teal-700 shadow-teal-300/50',
  },
  {
    exponent: 5,
    name: 'Hundred Thousands',
    shortName: '100,000',
    color: 'from-sky-500 to-sky-600',
    beadColor: 'bg-sky-500 border-sky-700 shadow-sky-300/50',
  },
  {
    exponent: 6,
    name: 'Millions',
    shortName: '1,000,000',
    color: 'from-indigo-500 to-indigo-600',
    beadColor: 'bg-indigo-500 border-indigo-700 shadow-indigo-300/50',
  },
  {
    exponent: 7,
    name: 'Ten Millions',
    shortName: '10,000,000',
    color: 'from-purple-500 to-purple-600',
    beadColor: 'bg-purple-500 border-purple-700 shadow-purple-300/50',
  },
  {
    exponent: 8,
    name: 'Hundred Millions',
    shortName: '100,000,000',
    color: 'from-pink-500 to-pink-600',
    beadColor: 'bg-pink-500 border-pink-700 shadow-pink-300/50',
  },
  {
    exponent: 9,
    name: 'Billions',
    shortName: '1,000,000,000',
    color: 'from-violet-600 to-violet-700',
    beadColor: 'bg-violet-600 border-violet-800 shadow-violet-300/50',
  }
];

export const EDUCATIONAL_LESSONS: LessonPage[] = [
  {
    id: 'intro',
    title: 'Welcome to the Abacus!',
    content: 'An abacus is one of the oldest counting calculators in human history. Developed thousands of years ago, it remains an elegant and powerful way to visualize math and understand place value.',
    instruction: 'Slide any bead on the bottom row (Ones) to the right. Watch how the total tally changes instantly at the bottom!',
    abacusSetup: { 0: 3 }
  },
  {
    id: 'ones-tens',
    title: 'The Magic of Ten (Base-10)',
    content: 'Our number system is "Base-10". That means once we count up to 10 on one level, we group them together into 1 on the next higher level! Notice how 10 beads on the bottom row (Ones) have the exact same value as just 1 bead on the second row (Tens).',
    instruction: 'Set the Ones row (bottom) to 10 beads. Notice that the total value is 10. Now, reset the Ones row to 0 and slide just 1 bead on the Tens row (second from bottom) to the right. Both show the number 10, but the second row does it with 1 bead!',
    abacusSetup: { 0: 10 }
  },
  {
    id: 'place-value',
    title: 'Decoding Multi-digit Numbers',
    content: 'Every row on this abacus represents a place value. The bottom row is 1s, the next is 10s, then 100s, 1k (Thousands), and so on. To represent a number like 235, we slide 2 beads in Hundreds, 3 beads in Tens, and 5 beads in Ones!',
    instruction: 'Try creating the number 235 on the abacus now. Push 2 on Hundreds, 3 on Tens, and 5 on Ones. Observe how the final number lines up perfectly at the bottom with each row!',
    abacusSetup: { 2: 2, 1: 3, 0: 5 }
  },
  {
    id: 'zero-concept',
    title: 'The Concept of Zero',
    content: 'What happens if a place value has no beads? In our modern writing system, we write a "0" as a placeholder. On an abacus, we simply leave that row completely on the left! For example, 104 is 1 bead in Hundreds, 0 beads in Tens, and 4 beads in Ones.',
    instruction: 'Slide 1 bead on Hundreds and 4 beads on Ones. Keep Tens at 0. Check the aligned digit board at the bottom to see how 104 is represented with a 0 placeholder!',
    abacusSetup: { 2: 1, 1: 0, 0: 4 }
  }
];

export const CHALLENGES: Challenge[] = [
  {
    id: 'ch1',
    type: 'represent',
    question: 'Can you represent the number 6 on the abacus?',
    targetValue: 6,
    hint: 'Slide 6 beads on the bottom row (Ones) to the active right-hand side.',
    explanation: '6 ones is represented by sliding exactly 6 beads in the Ones (bottom) row.',
    points: 10
  },
  {
    id: 'ch2',
    type: 'represent',
    question: 'Show the number 42 on your abacus.',
    targetValue: 42,
    hint: 'Slide 4 beads on the Tens row ($10^1$) and 2 beads on the Ones row ($10^0$).',
    explanation: '42 consists of 4 Tens ($40$) and 2 Ones ($2$). Thus, 4 beads on Tens, 2 beads on Ones.',
    points: 15
  },
  {
    id: 'ch3',
    type: 'represent',
    question: 'Represent 305 on the abacus. Be careful with the Tens place!',
    targetValue: 305,
    hint: 'Slide 3 beads in the Hundreds row, leave the Tens row completely empty (0), and slide 5 beads in the Ones row.',
    explanation: '305 is 3 Hundreds ($300$), 0 Tens ($0$), and 5 Ones ($5$). The Tens wire must have all beads on the left (inactive).',
    points: 20
  },
  {
    id: 'ch4',
    type: 'represent',
    question: 'Create the number 1,284 on the abacus. You will need 4 rows active!',
    targetValue: 1284,
    hint: 'Push 1 on Thousands ($10^3$), 2 on Hundreds ($10^2$), 8 on Tens ($10^1$), and 4 on Ones ($10^0$).',
    explanation: '1,284 is composed of 1 Thousand + 2 Hundreds + 8 Tens + 4 Ones. Ensure the input row count is at least 4!',
    points: 25
  },
  {
    id: 'ch5',
    type: 'identify',
    question: 'What is the most efficient way to represent 10 on the abacus?',
    targetValue: 10,
    hint: 'Look at the Tens row. You can slide just 1 bead there instead of 10 beads on the Ones row!',
    explanation: 'While 10 beads on the Ones row equals 10, the proper place value representation of ten uses 1 bead on the Tens row and 0 on the Ones row. This represents 1 Ten ($10^1$).',
    points: 15
  },
  {
    id: 'ch6',
    type: 'addition',
    question: 'First, make the number 15. Then, add 23 to it. What is the final represented sum?',
    targetValue: 38,
    hint: 'Start with 1 in Tens and 5 in Ones (15). Then push 2 more in Tens and 3 more in Ones. Read the final abacus!',
    explanation: 'Starting with 15 ($1$ Ten, $5$ Ones), adding 23 means pushing 2 more beads in Tens (making $1+2=3$) and 3 more in Ones (making $5+3=8$), resulting in 38.',
    points: 30
  },
  {
    id: 'ch7',
    type: 'represent',
    question: 'Let’s make a giant number! Represent 7,420 on the abacus.',
    targetValue: 7420,
    hint: '7 Thousands, 4 Hundreds, 2 Tens, and 0 Ones.',
    explanation: '7,420 uses 7 beads on the 4th row (Thousands), 4 on the 3rd row (Hundreds), 2 on the 2nd row (Tens), and 0 on the bottom row (Ones).',
    points: 30
  }
];
