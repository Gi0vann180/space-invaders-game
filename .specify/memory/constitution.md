<!--
Sync Impact Report

- Version change: [unreleased] -> 1.0.0
- Modified principles:
	- (new) Clean Code & Architecture
	- (new) Component-Driven UI & Separation of Concerns
	- (new) Predictable State & Game Loop
	- (new) Testing, CI & Quality Gates
	- (new) Accessibility, Performance & Observability
- Added sections: Technology Constraints, Development Workflow
- Removed sections: none
- Templates requiring updates:
	- .specify/templates/plan-template.md ✅ updated
	- .specify/templates/spec-template.md ✅ updated
	- .specify/templates/tasks-template.md ✅ updated
	- .specify/templates/agent-file-template.md ⚠ pending (informational)
- Follow-up TODOs:
	- RATIFICATION_DATE must be confirmed and replaced (TODO(RATIFICATION_DATE))
-->

# Space Invaders (React Browser Game) Constitution

## Core Principles

### 1. Clean Code & Architecture
All code MUST be written with clarity, small functions, explicit intent, and single responsibility.
 - Naming MUST be descriptive; avoid abbreviations and magic numbers.
 - Prefer composition over inheritance; prefer pure functions for game logic.
 - Files and modules MUST have a single responsibility and clear public surface.
 - TypeScript MUST be used for new modules; `any` is permitted only with a TODO and justification.

### 2. Component-Driven UI & Separation of Concerns
UI MUST be implemented as small, testable components with a clear separation between presentation, state, and side-effects.
 - Presentational components MUST be pure and receive data via props.
 - Business/game logic and rendering loop MUST be isolated from React render functions.
 - For the game canvas, prefer a single rendering surface (Canvas/WebGL) managed by an isolated renderer; React controls UI overlays.

### 3. Predictable State & Game Loop
State management for game logic MUST be explicit and deterministic.
 - Use `useReducer`, Zustand, or equivalent predictable state container for core game state.
 - Game updates MUST be driven by a single source of truth (game loop using `requestAnimationFrame`).
 - Timing and physics MUST be deterministic and testable (avoid coupling to wall clock inside logic; inject time deltas in tests).

### 4. Testing, CI & Quality Gates
Testing is mandatory for all non-trivial logic and public component behavior.
 - Unit tests for game rules, scoring, collisions, and state transitions are REQUIRED.
 - Component tests (React Testing Library / Vitest/Jest) REQUIRED for UI behavior and accessibility-critical interactions.
 - E2E tests (Playwright) SHOULD cover main user journeys: start game, pause, player input, game over.
 - CI pipeline MUST run lint, typecheck, unit tests, and E2E smoke checks on PRs.

### 5. Accessibility, Performance & Observability
The game MUST be accessible and performant for broad browser support.
 - Keyboard controls MUST be available and documented; ARIA roles used where appropriate for overlays/menus.
 - Performance target: maintain 60 FPS during typical gameplay; measure with simple FPS telemetry in dev builds.
 - Add structured logging for critical runtime errors; non-sensitive telemetry MAY be collected behind an opt-in flag.

## Technology Constraints
This project targets a modern browser React frontend and enforces a minimal, opinionated stack to ensure consistency.
 - Core: React (v18+) + TypeScript
 - Tooling: Vite for dev/build, Node 18+ compatible package manager (npm or pnpm)
 - Linting/Formatting: ESLint + Prettier with shared config
 - Testing: Vitest or Jest + React Testing Library for unit/component tests; Playwright for E2E
 - State: `useReducer` or lightweight state library (Zustand) for predictable state; avoid heavy frameworks unless justified
 - CI: GitHub Actions or equivalent; pre-commit hooks via Husky

## Development Workflow
Branching and PR rules:
 - Branches: `feature/<short-desc>`, `fix/<short-desc>`, `chore/<short-desc>`
 - Pull Requests MUST include: description, related issue/spec link, testing notes, and a checklist that the PR passes lint/type/tests.
 - Reviews: at least one approving review from a maintainer; for architecture changes, two approvals recommended.
 - Merges: Use squash or rebase policy consistent with repository conventions.

## Governance
Amendments to this constitution MUST follow the process below:
 - Propose change via a Pull Request against `.specify/memory/constitution.md` with a clear rationale and migration notes.
 - Changes that add or modify principles (non-trivial scope) REQUIRE approval from at least two maintainers and a minor or major version bump as appropriate.
 - Versioning policy for the constitution follows semantic versioning:
	 - MAJOR: Backward-incompatible principle removals or redefinitions.
	 - MINOR: New principle/section added or materially expanded guidance.
	 - PATCH: Clarifications, wording, typos, or non-semantic refinements.
 - Compliance: All feature plans and PRs MUST reference this constitution and indicate how they satisfy applicable principles (see `Constitution Check` in plan templates).

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE) | **Last Amended**: 2026-02-02
