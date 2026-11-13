# 📐 Zirna STEM Studio (Fraction Zirna & Interactive STEM Suite)

An advanced, interactive educational platform connecting 7 hands-on STEM and mathematics modules into a single, cohesive, high-craft web application.

---

## [v0.1.0]

### Added
- Role-based navigation headers: `PublicNavigation`, `StudentNavigation`, `TeacherNavigation`, and `AdminNavigation`.
- Role-specific workspace Hubs: `PublicHub`, `StudentHub`, `TeacherHub`, and `AdminHub`.
- Role-adapted footers: `StudentFooter`, `TeacherFooter`, and `AdminFooter` alongside `SiteFooter`.
- Authentication system with role-based authorization for Student, Teacher, and Administrator accounts.
- Zero-email student account provisioning workflow with 4-digit PIN access and printable/copyable login slips.
- Dedicated Administrator Gateway (`#/admin/login`) with role validation and security logging.
- Classroom multiplayer arena view (`ClassroomArenaView`) and live session services (`classroomService`).
- Student Dashboard and Teacher Dashboard with cohort roster, team battle monitors, and curriculum progress tracking.
- Pixel-art avatar library with category grouping and avatar customization modal.
- Bilingual localization engine (`useTranslation`) supporting English and Mizo (`EN` / `MIZO`) across public and workspace interfaces.
- Legal, privacy, and compliance views: Privacy Policy, Terms of Service, About MEC, Contact, and Cookie Preferences modal.
- Supabase schema migrations for users, profiles, classrooms, sessions, and Row Level Security (RLS) policies.

### Changed
- Refactored `src/Hub.tsx` into a centralized role-routing controller that conditionally renders workspace interfaces based on authentication role.
- Redesigned public navigation to focus on discovery: removed `Launcher`, `Classroom`, and `Dashboard` from unauthenticated views; unified into a single `Sign In` action.
- Modularized public homepage components into `src/features/hub/pages/PublicHub.tsx`.
- Updated Sonner `Toaster` positioning to `bottom-right` to prevent blocking top-right navigation buttons (language switcher, profile menu).
- Enhanced symmetry challenge mode in `src/modules/symmetry-match/components/ChallengeMode.tsx`.

### Fixed
- Fixed bilingual toggle so language switching applies across all public and authenticated workspace components.
- Fixed Sonner toast pointer-event interception on top-right navbar controls.
- Corrected responsive navigation layout for mobile screens with animated drawer.
- Fixed module category filtering and search synchronization on the public workshops deck.

---

## 🎮 The 7 Integrated Learning Modules

| # | Module | Topic | Grade Level | Features |
|---|---|---|---|---|
| **01** | **Fraction Zirna Playground** | Fractions & Division | Grades 2–6 | Interactive pie cutter, slice comparisons, addition visualizer, pizza level challenges |
| **02** | **Fraction Grid Game MIZO** | Decimals, % & Ratios | Grades 3–8 | Dynamic grid dimensions (up to 10×10), cell shading, bilingual Mizo/English audio |
| **03** | **Symmetry Mirror Match** | Geometric Reflections | Grades 5–9 | 30 curriculum levels, axial/diagonal mirrors, snapping line & block sandbox |
| **04** | **Interactive Abacus Studio** | Place Value & Arithmetic | All Grades | Classical Japanese 4-bead Soroban, vertical counter, bead audio, number-to-words |
| **05** | **Coordinate Cannon Defense** | Cartesian (X,Y) Geometry | Grades 6–10 | 4-quadrant plane, trajectory physics, teacher mission editor, flight blackbox |
| **07** | **Ray Tracing Optics Lab** | Physics & Lenses | Grades 8–12 | Real-time ray tracing, convex/concave lenses & mirrors, focal length controls |
| **08** | **Number Line Cruiser** | Integers & Signed Motion | Grades 3–7 | Math car driving game, number line steps, celebration star confetti |

---

## 🎨 Design & Craft Standards

### 1. Emil Kowalski Interaction Craft
- **Spring Physics**: Natural, non-linear easing transitions via `motion` (`{ type: "spring", stiffness: 350, damping: 25 }`).
- **Tactile Micro-Interactions**: Subtle button shrink on tap (`scale: 0.96`), tactile hover elevation (`scale: 1.02`), and smooth tooltips.
- **Floating Tactical Dock**: Fixed neo-brutalist dock with active keycap indicators and keyboard shortcut badges.
- **Sonner Notifications**: Smooth toast alerts for module switching, shortcuts, and gameplay achievements.

### 2. Taste Skill (Anti-Slop Standard)
- **Distinctive Typography**: Space Grotesk (headings), Plus Jakarta Sans (body UI), JetBrains Mono (math/coordinates), and Fraunces/Patrick Hand (accents).
- **Warm Neo-Brutalist Aesthetic**: Paper background `#F5F5F0`, 3px solid black borders, hard drop shadows (`4px 4px 0 #000`), graph-paper grids, and bold accent badges.
- **Mizoram Education Centre Layout**: Exact 9-section hub architecture mirroring `mizorameducationcentre.com`.
- **Quick Command Palette (`⌘K` / `Ctrl+K`)**: Instant fuzzy search across all games, topics, and levels.

### 3. Verification & Tooling
- **Playwright Test Suite**: End-to-end tests verifying Hub rendering, dock navigation, search, and module switching (`npm run test:e2e`).
- **Figma MCP Integration**: Direct sync with Figma design systems and design token inspection.

---

## 🚀 Quick Start

### 1. Development Server
```bash
npm run dev
```
Opens the master hub at `http://localhost:3000`.

### 2. Build for Production
```bash
npm run build
```
Creates an optimized, tree-shaken build in `dist/` with lazy-loaded chunks per module.

### 3. Run Playwright End-to-End Tests
```bash
npm run test:e2e
```
Or run with interactive UI mode:
```bash
npm run test:e2e:ui
```

---

## ⌨️ Keyboard Shortcuts

- `Esc` : Return to Main Hub Overview
- `1` – `7` : Jump directly to Module 1–7
- `⌘K` or `Ctrl+K` : Open Command Palette
- `F` or Fullscreen button : Toggle classroom projection mode

---

## 📁 Clean Project Architecture

```
fraction-zirna-game/
├── .agents/
│   ├── skills/              # Installed project skills (Taste, Emil Kowalski, Impeccable)
│   ├── rules/               # Design engineering, Figma MCP, and Playwright rules
│   └── mcp_config.json      # MCP integration configuration
├── e2e/
│   ├── suite.spec.ts        # Playwright automated test suite
│   └── screenshot.spec.ts   # Visual QA snapshot runner
├── src/
│   ├── main.tsx             # Application bootstrap & Sonner toaster
│   ├── App.tsx              # Hash router & keyboard shortcuts
│   ├── Hub.tsx              # Master MEC-layout hub & module launcher
│   ├── index.css            # Tailwind v4 theme & retro neo-brutalist utility layers
│   ├── components/
│   │   ├── NavigationDock.tsx   # Floating tactile keycap dock
│   │   ├── ModuleWrapper.tsx    # Header bar with back/switcher/audio/fullscreen
│   │   └── CommandPalette.tsx   # Fuzzy search modal (⌘K)
│   ├── data/
│   │   └── modulesRegistry.ts   # Metadata registry for all 7 modules
│   └── modules/                 # Self-contained modules
│       ├── fraction-zirna/      # Module 1 (Fractions & Pizza Slices)
│       ├── fraction-grid/       # Module 2 (Grid Shading, Decimals, % & Mizo Audio)
│       ├── symmetry-match/      # Module 3 (30 Levels Geometric Reflections)
│       ├── abacus-math/         # Module 4 (Soroban & Vertical Abacus)
│       ├── coordinate-defense/  # Module 5 (Cartesian Plane Vector Defense)
│       ├── optics-lab/          # Module 7 (Ray Tracing Optics Simulator v3)
│       └── number-line-cruiser/ # Module 8 (Integer Math Driving Game)
├── index.html
├── package.json
├── playwright.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## 🛠️ Making Changes or Adding New Features

- **To update an existing module**: Edit components directly in `src/modules/<module-name>/`.
- **To add a new module**:
  1. Create a new folder under `src/modules/<new-module>/`.
  2. Register its metadata, icon, and route in `src/data/modulesRegistry.ts`.
  3. Add its lazy import to `src/App.tsx`.
- **To run visual QA**: Run `npm run test:e2e` or use Playwright to verify interactions.
