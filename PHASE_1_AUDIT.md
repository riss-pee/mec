# Phase 1 — Repository & Architecture Audit

**Project:** ZIRNA STEM Studio / MEC  
**Audit target:** `riss-pee/mec`  
**Audited branch:** `ver`  
**Audit work branch:** `audit/phase-1`  
**Baseline commit:** `d63f022c9c0deca606fb932614bdbee91ce4b4b0`  
**Date:** 2026-11-25  
**Deployment protection:** No changes have been made to `ver` or the deployed branch. All audit artifacts and subsequent remediation are isolated on `audit/phase-1`.

## Executive summary

The `ver` branch is a substantial React 19 + TypeScript + Vite application with seven learning modules, role-specific workspaces, Supabase integration, classroom features, and Playwright tests. Its feature breadth is materially greater than `main`.

The largest architectural concern is that the repository currently mixes production-facing Supabase integration with extensive browser-local mock/demo implementations. Several services appear to use localStorage as their source of truth even though Supabase is imported. This creates a risk that UI actions appear successful while changes are not persisted centrally or shared across users/devices.

This is a source inspection audit. A local install, production build, browser session, database connection, and Playwright execution have **not** been run in this environment. Findings below are limited to evidence visible in the audited source.

## Phase 1 findings

| ID | Severity | Area | Finding | Evidence / impact |
|---|---|---|---|---|
| P1-01 | High | TypeScript quality gates | TypeScript strict mode is disabled. | `tsconfig.json` has `"strict": false`. This weakens nullability and type-safety checks across a large application. |
| P1-02 | Critical | Authentication architecture | The auth service contains seeded demo identities and localStorage-backed user records, including plaintext temporary PIN values in client-side profile data. | `src/features/auth/services/authService.ts` defines `INITIAL_DEMO_USERS`, `temporaryPin`, and `zirna_mock_users_db_v1`. Anyone with browser access can inspect and alter local storage. This must not be treated as production authentication or credential storage. |
| P1-03 | High | Admin data architecture | Admin service reads and writes platform users, roles, module settings, classrooms, sessions, privacy requests, audit logs, and settings through localStorage helper functions and seeded fixtures. | `src/features/admin/services/adminService.ts` defines localStorage getters/setters and `INITIAL_*` datasets. Admin changes may be device-local rather than authoritative server-side changes. |
| P1-04 | High | Classroom architecture | Classroom sessions are stored in localStorage and synchronized with BroadcastChannel. Session creation injects fixed demo participants and seeded scores. | `src/features/classroom/services/classroomService.ts`. BroadcastChannel only coordinates same-origin browser contexts; it is not a cross-device multiplayer transport or trusted server state. |
| P1-05 | High | Authorization boundary | The client application derives workspace access from the profile role and route state. This is not a security boundary by itself. | `src/App.tsx` and `src/features/auth/AuthContext.tsx`. Every sensitive operation must be independently authorized by database RLS or trusted server-side functions. |
| P1-06 | High | Documentation accuracy | The privacy audit document describes a no-account, no-credential, local-only product, while the current `ver` README and source include authentication, teacher applications, student provisioning, cloud profiles, and Supabase migrations. | `PRIVACY_AUDIT.md` is materially stale relative to the current architecture. Do not use its prior conclusions as current compliance evidence. |
| P1-07 | Medium | Test coverage | The visible E2E suite covers public hub rendering, category/search, module navigation, and command palette only. | `e2e/suite.spec.ts`. It does not currently demonstrate coverage of sign-in, student provisioning, role isolation, teacher/admin workflows, classroom joining, or data persistence. |
| P1-08 | Medium | Compiler configuration | `noUnusedLocals` and `noUnusedParameters` are disabled. | `tsconfig.json`. Dead imports/parameters and incomplete refactors may pass the type-check script. |
| P1-09 | Medium | Runtime verification | The Playwright config targets Chromium at a local Vite server and has no configured CI retry/report artifact strategy beyond the list reporter. | `playwright.config.ts`. Cross-browser, mobile viewport, accessibility, and CI behavior remain unverified. |

## Architecture snapshot

- **Frontend:** React 19, TypeScript, Vite 6, Tailwind CSS 4.
- **State / UI:** React context and component state; Motion; Sonner.
- **Backend client:** Supabase JS v2.
- **Persistence patterns found:** Supabase client plus browser localStorage fixtures and demo stores.
- **Learning modules:** Fraction Zirna, Fraction Grid, Symmetry Match, Abacus Math, Coordinate Defense, Optics Lab, Number Line Cruiser.
- **Tests:** Playwright E2E suite.
- **Build scripts:** `npm run build`; type check via `npm run lint`; E2E via `npm run test:e2e`.

## Phase 1 remediation decisions

1. Keep all remediation on `audit/phase-1`; do not push commits to `ver` or alter deployment configuration.
2. Do not attempt a blanket `strict: true` switch yet. First establish the current TypeScript error baseline, then enable stricter compiler options incrementally.
3. Treat seeded demo users, temporary PIN fixtures, localStorage admin data, and fake classroom participants as development/demo-only until Phase 2/3 verifies and replaces production paths.
4. Do not delete or migrate existing browser storage during this audit. Existing user data may be present in deployed browsers.
5. Supersede stale privacy/compliance claims only after a fresh data-flow inventory and legal review. Do not make new compliance guarantees from source inspection alone.

## Required follow-up

- Phase 2: inspect every auth operation, admin operation, RLS policy, and SQL security-definer function. Confirm whether the deployed build is configured for Supabase and whether any demo fallback can be reached by ordinary users.
- Phase 3: map every service to its real persistence layer; move authoritative writes behind RLS-protected database operations or trusted Edge Functions.
- Phase 4: build an end-to-end role and persistence matrix.
- Phase 7: run clean install, type-check, production build, dependency audit, and browser tests from a reproducible checkout.

## Verification status

- Repository tree and source files inspected on `ver`.
- Branch `audit/phase-1` created from the audited `ver` baseline.
- No application source code or deployment settings changed in this phase.
- Build, lint, Playwright, Supabase integration, and live-site smoke tests: **not run**.
