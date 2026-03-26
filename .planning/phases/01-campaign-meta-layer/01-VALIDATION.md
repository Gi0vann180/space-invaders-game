---
phase: 01
slug: campaign-meta-layer
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-24
---

# Phase 01 - Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest |
| **Config file** | frontend/vitest.config.ts |
| **Quick run command** | `npm run test` |
| **Full suite command** | `npm run validate` |
| **Estimated runtime** | ~60-120 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test`
- **After every plan wave:** Run `npm run validate`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 120 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 01-01-01 | 01 | 1 | CAMP-05, CORE-03 | unit/integration | `npm run test -- frontend/tests/integration/us1-boss-stage-flow.test.tsx` | ✅ | ⬜ pending |
| 01-01-02 | 01 | 1 | CORE-02 | integration | `npm run test -- frontend/tests/integration/us1-boss-stage-flow.test.tsx` | ✅ | ⬜ pending |
| 01-02-01 | 02 | 2 | CAMP-01 | integration/e2e | `npm run test && npm run test:e2e -- --grep "campaign|stage"` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] Existing infrastructure covers all phase requirements.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Campaign map readability and visual hierarchy | CAMP-01 | Visual quality check | Run app and verify map node states and lock hints match UI-SPEC |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 120s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
