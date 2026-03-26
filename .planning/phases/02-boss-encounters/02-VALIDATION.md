---
phase: 2
slug: boss-encounters
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest + playwright |
| **Config file** | frontend/vitest.config.ts; frontend/playwright.config.ts |
| **Quick run command** | `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx` |
| **Full suite command** | `npm --prefix frontend run validate` |
| **Estimated runtime** | ~180 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx`
- **After every plan wave:** Run `npm --prefix frontend run validate`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 240 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 02-01-01 | 01 | 1 | CAMP-02 | integration | `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx` | ✅ | ⬜ pending |
| 02-01-02 | 01 | 1 | CAMP-02 | unit/integration | `npm --prefix frontend run test -- tests/unit/**/boss*.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-03 | 01 | 1 | CAMP-02 | integration | `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx` | ✅ | ⬜ pending |
| 02-02-01 | 02 | 2 | CORE-04 | integration | `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx` | ✅ | ⬜ pending |
| 02-02-02 | 02 | 2 | CAMP-02, CORE-04 | unit/integration | `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx` | ✅ | ⬜ pending |
| 02-02-03 | 02 | 2 | CAMP-02 | e2e | `npm --prefix frontend run test:e2e -- tests/e2e/us1-boss-phase10.spec.ts` | ✅ | ⬜ pending |
| 02-03-01 | 03 | 3 | CAMP-02 | integration | `npm --prefix frontend run test -- tests/integration/us1-boss-stage-flow.test.tsx` | ✅ | ⬜ pending |
| 02-03-02 | 03 | 3 | CAMP-02, CORE-04 | e2e | `npm --prefix frontend run test:e2e -- tests/e2e/us2-boss-defeat-transition.spec.ts` | ✅ | ⬜ pending |
| 02-03-03 | 03 | 3 | CAMP-02, CORE-04 | full | `npm --prefix frontend run validate` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `frontend/tests/unit/game/bossProfiles.test.ts` — stubs para CAMP-02
- [ ] `frontend/tests/unit/services/telemetryBossEvents.test.ts` — stubs para CAMP-02/CORE-04
- [ ] `frontend/tests/integration/us2-boss-telemetry-feedback.test.tsx` — cenário integrado de feedback + telemetria

*If none: "Existing infrastructure covers all phase requirements."*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Clareza audiovisual de vitória/derrota de boss em dispositivo real | CORE-04 | percepção visual/áudio/háptico depende de hardware | Rodar build local em dispositivo alvo, completar e perder encontro de boss, registrar se feedback é imediatamente perceptível e consistente |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 240s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
