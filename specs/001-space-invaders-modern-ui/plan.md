# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: [e.g., Python 3.11, Swift 5.9, Rust 1.75 or NEEDS CLARIFICATION]  
**Primary Dependencies**: [e.g., FastAPI, UIKit, LLVM or NEEDS CLARIFICATION]  
**Storage**: [if applicable, e.g., PostgreSQL, CoreData, files or N/A]  
**Testing**: [e.g., pytest, XCTest, cargo test or NEEDS CLARIFICATION]  
**Target Platform**: [e.g., Linux server, iOS 15+, WASM or NEEDS CLARIFICATION]
**Project Type**: [single/web/mobile - determines source structure]  
**Performance Goals**: [domain-specific, e.g., 1000 req/s, 10k lines/sec, 60 fps or NEEDS CLARIFICATION]  
**Constraints**: [domain-specific, e.g., <200ms p95, <100MB memory, offline-capable or NEEDS CLARIFICATION]  
**Scale/Scope**: [domain-specific, e.g., 10k users, 1M LOC, 50 screens or NEEDS CLARIFICATION]

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

This project follows the repository constitution. Every plan MUST declare how it satisfies the
applicable principles below (non-negotiable gates):

- TypeScript enabled and type-check strategy defined (or justification for legacy JS).
- Linting/formatting config present (ESLint + Prettier) and the plan includes enforcement steps.
- Testing strategy: unit tests for game logic, component tests for critical UI, E2E plan for main journeys.
- Accessibility considerations included for UI/menus and keyboard controls.
- Performance targets and measurement approach (target 60 FPS typical gameplay) with mitigation steps.

Each item above MUST be mapped to concrete tasks in `tasks.md` and verified during the Phase 0/1 checkpoints.

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
# [REMOVE IF UNUSED] Option 1: Single project (DEFAULT)
src/
├── models/
├── services/
├── cli/
└── lib/

tests/
```markdown
# Implementation Plan: Space Invaders — Modern UI

**Branch**: `001-space-invaders-modern-ui` | **Date**: 2026-02-05 | **Spec**: ../spec.md
**Input**: Feature specification from `/specs/001-space-invaders-modern-ui/spec.md`

## Summary

Deliver a small, responsive browser game inspired by Space Invaders with a modern UI built as a single-page React app. MVP focuses on core gameplay (move, shoot, collisions, scoring, lives, basic waves, local highscore) with a Canvas renderer for performance and Tailwind-based HUD overlays.

## Technical Context

**Language/Version**: TypeScript (target ES2020+)
**Primary Dependencies**: React 18+, Vite, Tailwind CSS, optional Zustand for session state
**Storage**: Local persistence (localStorage) for highscores and session settings; optional remote leaderboard via simple REST API
**Testing**: Vitest + React Testing Library for unit/component tests; Playwright for E2E smoke tests
**Target Platform**: Modern browsers (desktop + mobile)
**Project Type**: Web frontend (single-page app) with isolated game renderer
**Performance Goals**: Maintain 60 FPS during typical gameplay on representative devices; measure via dev telemetry and local FPS probe
**Constraints**: Responsive design for mobile; offline-capable for core play and local highscore; bundle size modest for web delivery
**Scale/Scope**: Small indie game scope — single-frontend codebase, limited backend (optional leaderboard)

## Constitution Check

Gate mapping and how the plan satisfies each requirement:

- TypeScript: Project template and CI will run `tsc --noEmit` as part of checks. (Mapped to tasks: `setup:types`, `ci:typecheck`)
- Linting/formatting: ESLint + Prettier configs included in project bootstrap; pre-commit hook (husky) added in tasks. (Mapped to tasks: `ci:lint`, `dev:format`)
- Testing strategy: Unit tests for collision/game logic and component tests for HUD/settings; E2E Playwright scenarios: start game, play until wave end, pause, game over. (Mapped to tasks: `test:unit`, `test:e2e`)
- Accessibility: Keyboard-first controls, ARIA on menus/overlays, high-contrast mode documented in UI tasks. (Mapped to tasks: `a11y:keyboard`, `a11y:contrast`)
- Performance: Instrument a simple FPS probe in dev build; define mitigation tasks for dropping below 55 FPS (reduce particle effects, lower enemy count). (Mapped to tasks: `perf:probe`, `perf:mitigate`)

All items above will be represented as concrete tasks in `tasks.md` (Phase 2).

## Project Structure

Documentation (this feature)

``text
specs/001-space-invaders-modern-ui/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── leaderboard-openapi.yaml
└── tasks.md (created in Phase 2)
```

Source layout (frontend-only):

``text
frontend/
├── src/
│   ├── game/            # game loop, renderer, engine code (canvas)
│   ├── components/      # HUD, menus, settings
│   ├── hooks/           # input, useGameLoop, useAudio
  │   ├── assets/          # images, audio
  │   └── index.tsx
└── tests/
    ├── unit/
    └── e2e/
```

**Structure Decision**: Single frontend app with an isolated `game/` module for deterministic game logic and renderer; React manages overlays and settings.

## Complexity Tracking

No constitution violations detected that require formal justification. All mandatory gates are addressed by the plan and will be translated to tasks.

## Phase 0: Research (summary)

- Renderer approach: Canvas 2D controlled by an isolated renderer (decision documented in `research.md`).
- State: `useReducer` or Zustand for session/state; game logic receives time deltas for deterministic updates.
- Audio: Web Audio API (Howler.js option documented).
- Persistence: localStorage for highscores; optional REST endpoints defined in `contracts/`.

## Phase 1: Design outputs (created)

- `data-model.md` created with entity definitions.
- `contracts/leaderboard-openapi.yaml` created for optional remote leaderboard.
- `quickstart.md` created with bootstrap steps for Vite + Tailwind.

```
