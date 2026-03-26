---
phase: 2
slug: boss-encounters
status: in-progress
nyquist_compliant: false
wave_0_complete: true
created: 2026-03-24
updated: 2026-03-26
---

# Phase 2 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| Framework | vitest + playwright |
| Config file | frontend/vitest.config.ts; frontend/playwright.config.ts |
| Quick run command | npm --prefix frontend run test -- tests/unit/us2-boss-phase-detection.test.ts tests/integration/us2-phase-transition-difficulty.test.tsx |
| Full suite command | npm --prefix frontend run validate |
| Estimated runtime | ~180 seconds |

---

## Sampling Rate

- After every task commit: run the target task command from Per-Task Verification Map.
- After every plan wave: run npm --prefix frontend run typecheck plus focused regression tests.
- Before /gsd-verify-work: full validate + required e2e suites must be green.
- Max feedback latency: 240 seconds.

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Automated Command | Status |
|---------|------|------|-------------|-------------------|--------|
| 02-01-00 | 01 | 1 | CAMP-02 | rg -n "nyquist_compliant|Per-Task Verification Map|Sampling Rate" .planning/phases/02-boss-encounters/02-VALIDATION.md | done |
| 02-01-01 | 01 | 1 | CAMP-02 | npm --prefix frontend run typecheck | pending |
| 02-01-02 | 01 | 1 | CAMP-02 | npm --prefix frontend run test -- tests/unit/us2-boss-phase-detection.test.ts tests/integration/us2-phase-transition-difficulty.test.tsx | pending |
| 02-02-01 | 02 | 2 | CAMP-02, CORE-04 | npm --prefix frontend run test -- tests/unit/us3-telemetry-consent.test.ts tests/unit/us2-boss-encounter-telemetry.test.ts | pending |
| 02-02-02 | 02 | 2 | CORE-04 | npm --prefix frontend run test -- tests/integration/us2-boss-healthbar-sync.test.tsx tests/integration/us2-boss-outcome-feedback.test.tsx | pending |
| 02-02-03 | 02 | 2 | CAMP-02, CORE-04 | npm --prefix frontend run typecheck | pending |
| 02-03-01 | 03 | 3 | CAMP-02 | npm --prefix frontend run test -- tests/unit/us2-phase-difficulty-monotonic.test.ts | pending |
| 02-03-02 | 03 | 3 | CAMP-02, CORE-04 | npm --prefix frontend run test -- tests/integration/us2-offensive-pressure-scaling.test.tsx tests/integration/us2-progression-shop.test.tsx | pending |
| 02-03-03 | 03 | 3 | CAMP-02, CORE-04 | npm --prefix frontend run validate && npm --prefix frontend run test:e2e -- tests/e2e/us2-boss-defeat-transition.spec.ts tests/e2e/us2-boss-encounter-outcomes.spec.ts | pending |

---

## Validation Sign-Off

- [x] Per-task automated verification map is defined for wave 1/2/3.
- [x] Sampling rate is explicit and reproducible.
- [ ] Wave 1 checks fully green.
- [ ] Wave 2 checks fully green.
- [ ] Wave 3 checks fully green.
- [ ] nyquist_compliant set to true only after final gate.

Approval: pending
