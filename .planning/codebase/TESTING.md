# Testing Patterns

**Analysis Date:** 2026-03-09

## Test Framework

**Runner:**
- Vitest 2.x
- Config: `frontend/vitest.config.ts`

**Assertion Library:**
- Vitest `expect` + Testing Library matchers from `@testing-library/jest-dom` in `frontend/src/test/setup.ts`

**Run Commands:**
```bash
npm run test              # Run all unit/integration tests
npm run test:watch        # Watch mode
npm run test:e2e          # Playwright E2E suite
```

## Test File Organization

**Location:**
- Separate test tree under `frontend/tests/` with `unit`, `integration`, and `e2e`

**Naming:**
- Unit/integration: `*.test.ts` or `*.test.tsx`
- E2E: `*.spec.ts`

**Structure:**
```text
frontend/tests/
  unit/
  integration/
  e2e/
  fixtures/
  helpers/
```

## Test Structure

**Suite Organization:**
```typescript
describe('US3 drop lifecycle', () => {
  it('coleta drop ao colidir com jogador e remove da lista', () => {
    // arrange
    // act
    // assert
  })
})
```

**Patterns:**
- Setup pattern: deterministic fixtures from `frontend/tests/fixtures/*.ts`
- Teardown pattern: mock reset in `beforeEach` (`frontend/tests/integration/us2-shop-persistence.test.ts`)
- Assertion pattern: explicit state transitions with `toBe`, `toEqual`, `toHaveLength`, `toBeVisible`

## Mocking

**Framework:** Vitest mocking (`vi.mock`, `vi.fn`, `vi.hoisted`)

**Patterns:**
```typescript
vi.mock('../../src/lib/indexedDb', () => ({
  getRecord: getRecordMock,
  putRecord: putRecordMock
}))
```

**What to Mock:**
- I/O boundaries: IndexedDB and service adapters in integration tests (`frontend/tests/integration/us2-shop-persistence.test.ts`)

**What NOT to Mock:**
- Core gameplay math/rules in systems (`frontend/src/game/systems/*`) tested directly in unit tests

## Fixtures and Factories

**Test Data:**
```typescript
// Deterministic seeds and cycle helpers
import { runCycle } from '../helpers/run-cycle'
import { dropFixtures } from '../fixtures/drop-fixtures'
```

**Location:**
- `frontend/tests/fixtures/` and `frontend/tests/helpers/`

## Coverage

**Requirements:** None enforced in config (no threshold settings detected)

**View Coverage:**
```bash
npx vitest run --coverage
```

## Test Types

**Unit Tests:**
- Validate isolated rules and type-safe behavior (`frontend/tests/unit/us1-boss-phase-detection.test.ts`, `frontend/tests/unit/us3-drop-rarity-roll.test.ts`)

**Integration Tests:**
- Validate cross-module flows (progression, persistence, collision + UI sync) in `frontend/tests/integration/*.test.tsx`

**E2E Tests:**
- Playwright browser scenarios in `frontend/tests/e2e/*.spec.ts`

## Common Patterns

**Async Testing:**
```typescript
it('carrega upgrades persistidos', async () => {
  getRecordMock.mockResolvedValue({ id: 'owned-upgrades', upgradeLevels: { 'upgrade-speed': 2 } })
  const upgrades = await getPersistedUpgrades()
  expect(upgrades).toEqual(['upgrade-speed'])
})
```

**Error Testing:**
```typescript
await expect(fetchLeaderboard('http://invalid')).rejects.toThrow()
```

---

*Testing analysis: 2026-03-09*
