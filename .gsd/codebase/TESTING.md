# Testing Patterns

**Analysis Date:** 2026-03-09

## Test Framework

**Runner:**
- Vitest 2.1.8 via `frontend/package.json` and `frontend/vitest.config.ts`.
- Config: `frontend/vitest.config.ts`.
- Environment: `jsdom` with globals enabled and shared setup file `frontend/src/test/setup.ts`.

**Assertion Library:**
- Vitest built-in `expect` plus DOM matchers from `@testing-library/jest-dom/vitest` loaded in `frontend/src/test/setup.ts`.

**Run Commands:**
```bash
npm run test        # Run unit and integration tests with Vitest
npm run test:watch  # Watch mode with Vitest
npm run test:e2e    # Run Playwright E2E tests
npm run validate    # Typecheck + lint + Vitest run
```

## Test File Organization

**Location:**
- Tests are separated by intent under `frontend/tests/unit/`, `frontend/tests/integration/`, `frontend/tests/e2e/`, `frontend/tests/fixtures/`, and `frontend/tests/helpers/`.
- Vitest includes `tests/**/*.test.ts` and `tests/**/*.test.tsx`; Playwright uses `frontend/tests/e2e/` via `frontend/playwright.config.ts`.

**Naming:**
- Unit and integration files use kebab-case scenario names with a user-story prefix, such as `us1-core-gameplay.test.ts`, `us3-settings-panel.test.tsx`, and `us3-upgrade-level-persistence.test.ts`.
- E2E files use `.spec.ts`, for example `us1-round.spec.ts` and `us3-inputs-a11y.spec.ts`.
- Fixtures and helpers use descriptive kebab-case names such as `boss-fixtures.ts`, `drop-fixtures.ts`, `run-cycle.ts`, and `run-seed.ts`.

**Structure:**
```text
frontend/tests/
├── unit/
├── integration/
├── e2e/
├── fixtures/
└── helpers/
```

## Test Structure

**Suite Organization:**
```typescript
import { describe, expect, it } from 'vitest'

describe('US1 core gameplay', () => {
  it('move player dentro dos limites e dispara com cooldown', () => {
    // arrange
    // act
    // assert
  })
})
```

**Patterns:**
- Tests are behavior-first and title suites by user story or feature slice, as seen across `frontend/tests/unit/` and `frontend/tests/integration/`.
- Arrange data inline for unit tests when fixtures would be overkill, as in `frontend/tests/unit/us1-core-gameplay.test.ts`.
- Use React Testing Library for UI/component integration and assert through visible text, role, label, heading, and test id, as in `frontend/tests/integration/us1-round-flow.test.tsx` and `frontend/tests/integration/us3-settings-panel.test.tsx`.
- Prefer direct assertions on returned domain objects for system and service tests, especially under `frontend/tests/unit/`.

## Mocking

**Framework:**
- Vitest `vi` mocking API.

**Patterns:**
```typescript
const { getRecordMock, putRecordMock } = vi.hoisted(() => ({
  getRecordMock: vi.fn(),
  putRecordMock: vi.fn()
}))

vi.mock('../../src/lib/indexedDb', () => ({
  getRecord: getRecordMock,
  putRecord: putRecordMock
}))
```

**What to Mock:**
- Mock persistence boundaries like `frontend/src/lib/indexedDb.ts` when testing service behavior in isolation, as in `frontend/tests/integration/us3-upgrade-level-persistence.test.ts`, `frontend/tests/integration/us2-shop-persistence.test.ts`, and `frontend/tests/unit/us3-telemetry-consent.test.ts`.
- Mock at module boundaries, not internal functions inside the same unit under test.

**What NOT to Mock:**
- Do not mock pure game systems when verifying domain rules; unit tests usually exercise the real implementation directly.
- Do not mock DOM queries in component tests; use rendered output and accessible selectors.

## Fixtures and Factories

**Test Data:**
```typescript
export function makeBossFixture(partial: Partial<BossEntity> = {}): BossEntity {
  return {
    id: 'boss-stage-1',
    stage: 1,
    x: 320,
    y: 64,
    width: 96,
    height: 56,
    health: 18,
    maxHealth: 18,
    points: 300,
    attackCooldownSeconds: 1,
    attackTimer: 0,
    patternIds: ['burst-3'],
    patternCursor: 0,
    ...partial
  }
}
```

**Location:**
- Shared factories live in `frontend/tests/fixtures/`.
- Derived scenario builders live in `frontend/tests/helpers/`, for example `frontend/tests/helpers/run-cycle.ts`.

## Coverage

**Requirements:**
- No explicit coverage threshold or `coverage` script is configured in `frontend/package.json`.
- Coverage is policy-by-pattern rather than tool-enforced: unit tests cover pure systems, integration tests cover UI/domain interaction, and Playwright covers smoke and user-flow scenarios.

**View Coverage:**
```bash
Not configured in package scripts
```

## Test Types

**Unit Tests:**
- Focus on pure entities, systems, config rules, and service functions with deterministic inputs.
- Examples: `frontend/tests/unit/us1-core-gameplay.test.ts`, `frontend/tests/unit/us2-phase-difficulty-monotonic.test.ts`, and `frontend/tests/unit/us3-random-special-shot.test.ts`.

**Integration Tests:**
- Cover component behavior, service persistence flows, and multi-module domain interactions.
- Examples: `frontend/tests/integration/us1-round-flow.test.tsx`, `frontend/tests/integration/us3-settings-panel.test.tsx`, `frontend/tests/integration/us3-upgrade-level-persistence.test.ts`, and `frontend/tests/integration/us2-phase-transition-difficulty.test.tsx`.

**E2E Tests:**
- Use Playwright 1.53.2 through `frontend/playwright.config.ts`.
- Launch the built app through `npm run build && npm run preview -- --host 127.0.0.1 --port 4173` and run against `http://127.0.0.1:4173`.
- Examples: `frontend/tests/e2e/us1-round.spec.ts`, `frontend/tests/e2e/us1-boss-phase10.spec.ts`, `frontend/tests/e2e/us2-powerups-lifecycle.spec.ts`, and `frontend/tests/e2e/us3-inputs-a11y.spec.ts`.

## Common Patterns

**Async Testing:**
```typescript
it('permite log quando consentimento está ativo', async () => {
  putRecordMock.mockResolvedValue(undefined)
  setTelemetryConsent(true)

  const result = await logTelemetryEvent('game_over', { score: 100 })

  expect(result).toBe(true)
})
```
- Await service calls directly in unit and integration tests.
- In Playwright, await user actions and subsequent expectations rather than inserting sleeps.

**Error Testing:**
```typescript
it('bloqueia log sem consentimento explícito', async () => {
  setTelemetryConsent(false)
  const result = await logTelemetryEvent('game_start')

  expect(result).toBe(false)
  expect(putRecordMock).not.toHaveBeenCalled()
})
```
- Negative-path tests usually assert returned failure states or absence of side effects.
- Service APIs that throw, such as `frontend/src/services/leaderboardApi.ts`, should be tested with rejection assertions if new tests are added.

## UI and Accessibility Assertions

- Prefer `screen.getByRole`, `screen.getByLabelText`, and `screen.getByText` in Testing Library tests.
- Prefer `page.getByRole`, `page.getByLabel`, and visible text assertions in Playwright.
- Existing tests validate accessibility-adjacent behavior, for example `frontend/tests/e2e/us3-inputs-a11y.spec.ts` checking labeled controls and high-contrast toggling.

## E2E-Specific Conventions

- E2E tests are intentionally pragmatic and may interact with internal test seams exposed on `window`, as seen in `frontend/src/App.tsx` and consumed by `frontend/tests/e2e/us1-boss-phase10.spec.ts`.
- This pattern is used to fast-forward game state without simulating long gameplay loops.
- Keep those seams narrow and only for stable state manipulation needed by tests.

---

*Testing analysis: 2026-03-09*
