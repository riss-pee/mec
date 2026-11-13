# ZIRNA STEM STUDIO — Collaborative Learning, Multiplayer Arena & Student Dashboard Guide

## 1. System Overview

ZIRNA STEM STUDIO has evolved into a collaborative educational ecosystem bridging individual exploration, live classroom participation, and teacher oversight.

```
                               ┌──────────────────────────────────────────────────────────┐
                               │                 ZIRNA STEM STUDIO HUB                    │
                               └────────────┬─────────────────────────────┬───────────────┘
                                            │                             │
                     ┌──────────────────────▼─────────┐        ┌──────────▼─────────────────────┐
                     │         FOR INDIVIDUALS        │        │      FOR GROUPS & SCHOOLS      │
                     │  • Self-Paced Exploration      │        │  • Classroom Arena (Multiplayer)│
                     │  • Visual Proofs & Mini-Games  │        │  • Team Battles (4 Teams)      │
                     │  • Personal Learning Pathways  │        │  • Teacher Command Center      │
                     └────────────────────────────────┘        └────────────────────────────────┘
                                            │                             │
                               ┌────────────▼─────────────────────────────▼───────────────┐
                               │                    AUTHENTICATION & ROLES                │
                               │  • Student / Learner Profile (Pseudonymous XP & Streaks) │
                               │  • Teacher / Educator Control (Sessions & Roster)        │
                               │  • Guest Mode (100% Zero-barrier exploration)            │
                               └────────────────────────────┬─────────────────────────────┘
                                                            │
                     ┌──────────────────────────────────────▼───────────────────────────────────┐
                     │                   REUSABLE COLLABORATIVE MULTIPLAYER ENGINE              │
                     │  • Cross-Tab / Cross-Device Real-time BroadcastChannel Synchronization   │
                     │  • Supabase Realtime & PostgreSQL Database Schema with Strict RLS        │
                     │  • Live Collaborative Overlays on all 7 Existing STEM Modules           │
                     └──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Groups & Schools Features

### A. Classroom Arena (`#classroom`)
* **Live Join Code:** Projector-friendly codes (e.g. `ZIRNA-4821`).
* **Pseudonymous Onboarding:** Students enter join code, pick an avatar (`🚀`, `🦊`, `🦉`, `🌟`), choose nickname, and assign/randomize to one of four teams.
* **Synchronized Target Goal:** Entire class pools answers to hit a collective milestone (e.g. 20 lab challenges solved collectively).

### B. Team Battles (4 Balanced Teams)
1. **Team Alpha 🔴** (`#F87171`): Focus on fraction divisions & pizza geometry.
2. **Team Beta 🔵** (`#38BDF8`): Focus on ray-tracing optics and mirror reflections.
3. **Team Gamma 🟢** (`#06D6A0`): Focus on coordinate defense & Cartesian trajectories.
4. **Team Delta 🟡** (`#FFD166`): Focus on Soroban abacus & signed number races.
* **Scoring Rules:** Accuracy and peer collaboration bonuses prevent speed-only bias.

### C. Teacher Command Center (`#teacher`)
* **Session Manager:** Generate join codes, choose STEM module, set duration (5–45 min), and select difficulty (Standard MBSE/NCERT, Advanced, Olympiad).
* **Live Roster:** Monitor connected student devices and team distribution in real time.
* **Diagnostic Reports:** Real-time feedback on concept mastery and topics needing classroom reinforcement.

---

## 3. Seven Interactive Modules in Collaborative Mode

All seven original modules now feature a dual-mode switch in [ModuleWrapper.tsx](file:///c:/Users/rspac/Documents/project/fraction-zirna-game/src/components/ModuleWrapper.tsx):

| Module | Solo Mode | Collaborative Classroom Mode |
| :--- | :--- | :--- |
| **01. Fraction Zirna Playground** | Dynamic pie cutter & fraction comparator | **Fraction Pizza Relay:** Students divide 1 pizza equally among 4 students with peer reasoning. |
| **02. Fraction Grid Game MIZO** | Single player grid percentage shaper | **Collaborative Grid Challenge:** Teammates shade assigned cells together to hit 75% target. |
| **03. Symmetry Mirror Match** | Single player coordinate puzzles | **Team Symmetry Puzzle:** Partner 1 places pattern; Team completes mirror reflection. |
| **04. Interactive Abacus Studio** | Free Soroban counting sandbox | **Abacus Relay:** Multi-digit addition relay across Units, Tens, and Hundreds rods. |
| **05. Coordinate Cannon Defense** | Solo quadrant artillery defense | **Team Coordinate Defense:** Radar targeting mission with locked coordinates $(-4, +6)$. |
| **06. Ray Tracing Optics Lab** | Physics ray simulation bench | **Scientific Optics Prediction:** Students formulate hypothesis before laser reveals focal convergence. |
| **07. Number Line Cruiser** | Signed integer road driving | **Number Line Team Race:** Signed number calculations advance team vehicle along shared line. |

---

## 4. Personalized Student Dashboard (`#dashboard`)

* **Learning Streaks:** Non-punitive daily streaks with a 7-day weekly calendar (Sun–Sat).
* **My Pathways:**
  1. *School Mathematics Pathway* (Fractions, Grid, Symmetry)
  2. *Physics & Optics Pathway* (Optics Lab, Coordinate Cannon)
  3. *Mental Arithmetic Pathway* (Soroban Abacus, Number Line Cruiser)
* **Milestone Achievements:** 8 authentic badges (First Steps, Fraction Master, Geometry Explorer, Physics Investigator, Mental Math Champion, Seven-Day Streak, Team Player, Classroom Champion).
* **Recent Activity Feed:** Filterable by Today, This Week, This Month, and All Time.
* **Learning Analytics:** Subject accuracy percentages and weekly study time breakdown.

---

## 5. Supabase & Environment Configuration

### Step 1: Create a Supabase Project
1. Visit [supabase.com](https://supabase.com) and create a project.
2. In Project Settings > API, copy your `Project URL` and `anon public` key.

### Step 2: Configure Environment Variables
Create a `.env` file in the project root:
```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

### Step 3: Run Database Migrations
In the Supabase SQL Editor, run:
[supabase/migrations/20261113000000_classroom_multiplayer_auth.sql](file:///c:/Users/rspac/Documents/project/fraction-zirna-game/supabase/migrations/20261113000000_classroom_multiplayer_auth.sql)

*When Supabase is not configured, ZIRNA automatically operates in high-performance local broadcast mode with zero external dependencies.*
