# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

All commands run from the repo root and delegate to `frontend/` via `--prefix`:

```bash
npm run dev          # Vite dev server on :5173
npm run build        # Production build → frontend/dist
npm run typecheck    # tsc --noEmit (strict)
npm run lint         # ESLint with --max-warnings=0
npm run test         # Vitest (single run)
npm run test:e2e     # Playwright E2E (requires preview server on :4173)
npm run validate     # typecheck + lint + test — run this before every PR
npm run format:write # Prettier (apply formatting)
```

## Code Style

Prettier is enforced via `frontend/.prettierrc`:
- No semicolons
- Single quotes
- No trailing commas

ESLint uses `--max-warnings=0` — any warning is a failure.

## GSD Workflow

Before editing files, start work through a GSD command:
- `/gsd-quick` — small fixes, doc updates, ad-hoc tasks
- `/gsd-debug` — investigation and bug fixing
- `/gsd-execute-phase` — planned phase work

Project state and context live in `.gsd/` — see `.gsd/PROJECT.md` for current goals and active requirements.

## Branches

`feature/<name>` or `fix/<name>`

## Architecture

Canvas simulation loop (`frontend/src/game/engine.ts`) is strictly separated from React UI components (`frontend/src/components/`). Do not mix game logic into React components.

See @.gsd/codebase/ARCHITECTURE.md for the full layer breakdown.
