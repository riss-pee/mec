# Design Engineering Guidelines: Emil Kowalski & Taste Standard

This project adheres to high-craft interaction design and anti-slop frontend standards:

## 1. Motion & Physics (Emil Kowalski Craft)
- Use physics-informed spring animations via `motion` (or `motion/react`) instead of rigid linear transitions.
- Standard spring curve for UI controls: `{ type: "spring", stiffness: 350, damping: 25, mass: 0.8 }`.
- Entrance transitions: Snappy spring `{ type: "spring", stiffness: 300, damping: 30 }`.
- Micro-interactions on buttons and interactive cards:
  - `whileHover={{ scale: 1.02 }}`
  - `whileTap={{ scale: 0.96 }}`
- Respect user preference for reduced motion: `prefers-reduced-motion`.

## 2. Anti-AI-Slop & Visual Hierarchy (Taste Skill)
- Never use generic low-contrast gray gradients or repetitive boring cards.
- Embrace bold, intentional typography: Space Grotesk for crisp headings, Plus Jakarta Sans for UI readability, JetBrains Mono for coordinates & formulas, and Fraunces for distinctive accents.
- Tactile borders: `border border-white/10` or refined dark-mode sub-borders `1px solid rgba(0,0,0,0.08)`.
- Use purposeful color accents per STEM subject (Fractions = Indigo/Emerald, Symmetry = Violet, Optics = Cyan/Amber, Artillery = Rose/Orange, Number Line = Sky/Blue).

## 3. Feedback & Micro-States
- Use Sonner (`toast`) for interactive achievements, copy-to-clipboard actions, and feedback.
- Explicit visual states for idle, hover, active, disabled, and keyboard focus rings.
- Tooltips and keyboard shortcut hints on all dock icons.
