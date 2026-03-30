# Mobile Distribution Research Summary

**Project:** Space Invaders Futurista Mobile  
**Research Scope:** 2026 standard mobile game stack for Play Store + Apple Store  
**Date:** 2026-03-23  
**Overall Confidence:** HIGH  

---

## Key Findings

### Stack Decision: Capacitor + Stores-Native IAP + Firebase

**Recommendation:** Wrap existing React web game with **Capacitor 6.x**, integrate **StoreKit 2 (iOS) + Google Play Billing v8 (Android)** for IAP, use **Firebase Analytics + Google AdMob** for telemetry/monetization, and automate distribution via **fastlane + GitHub Actions**.

**Why this stack:**
- ✓ Zero rewrite of existing React + Canvas game engine
- ✓ Both stores support Capacitor-wrapped apps (WebView standard)
- ✓ Native IAP mandatory by both stores (no workarounds)
- ✓ Firebase/AdMob are industry standard for casual games
- ✓ fastlane automates 95% of build/signing/submission hassle

**Rejection risks:** Minimal if you follow store guidelines (no direct payment processors, proper restoration of purchases, crash-free on launch).

---

## Requirements Before Launch

### Hard Blocking Requirements (Do These First)

1. **App Store Connect Entry**
   - Create App ID in Apple Developer Account
   - Set bundle ID: `com.example.spaceinvaders` (or your choice)
   - Generate provisioning profile (Xcode can auto-manage in 2026)
   - **Time: 20 minutes**

2. **Google Play Console Entry**
   - Register Google Play app (package name)
   - Configure signing keystore (local, generated once)
   - **Time: 15 minutes**

3. **In-App Purchase Setup**
   - Create StoreKit 2 products in App Store Connect (power-ups, cosmetics)
   - Create Google Play products (same SKU, different metadata)
   - Test IAP in sandbox environment **before** production
   - **Time: 45 minutes**

4. **Ad Network Registration**
   - Register AdMob account (links to Google Play Developer)
   - Create ad units (banner, interstitial, rewarded)
   - **Time: 10 minutes**

### Nice-to-Have Before Beta

1. **Analytics Integration:** Firebase + Adjust (set up in Week 4, not blocking)
2. **Crash Reporting:** Sentry (set up in Phase 5, not blocking)
3. **localization.md:** Plan key languages (optional for v1)

---

## Roadmap Implications

### Phase Ordering (Distribution Focus)

**Current phase focus should be:**

1. **Phase N: Mobile-Ready Polishing** (1–2 weeks)
   - Implement touch deadzone handling (not just mouse clicks)
   - Verify 60 FPS on mid-range device (Pixel 5a or iPhone SE)
   - Add app icon assets (1024x1024 for iOS, 512x512 for Android)
   - Verify IndexedDB persistence survives app backgrounding
   - **Deliverable:** Gameplay runs smoothly in iOS Simulator + Android Emulator
   - **Blocks:** Cannot submit to stores until this passes

2. **Phase N+1: Capacitor Integration** (1 week)
   - `npm install @capacitor/core`
   - `npx cap init` + `npx cap add ios` + `npx cap add android`
   - Build web app, sync assets, test in Xcode + Android Studio simulators
   - Verify game saves/loads via IndexedDB
   - **Deliverable:** App runs in native simulator with identical behavior to web version
   - **Blocks:** Distribution cannot begin without successful Capacitor integration

3. **Phase N+2: Store Accounts & Signing** (3–5 days)
   - Create App Store Connect + Google Play Console entries
   - Register for Apple Developer Program ($99)
   - Generate iOS provisioning profiles + Android keystore
   - Configure app metadata (description, rating, screenshots)
   - **Deliverable:** App entries visible in both console dashboards
   - **Blocks:** Cannot submit builds without these accounts

4. **Phase N+3: IAP & Ad Integration** (1–2 weeks)
   - Integrate `@capacitor-community/iap` plugin
   - Integrate Google AdMob SDK
   - Create test products in both stores
   - Test IAP flow in TestFlight sandbox + Play internal testing
   - **Deliverable:** Sandbox payments flow end-to-end; ad impressions logged
   - **Blocks:** Submission rejected if IAP not functional or ads placed at app launch

5. **Phase N+4: Build Automation** (3–5 days)
   - Install fastlane + set up iOS/Android lanes
   - Create GitHub Actions workflow for automated builds
   - Test tag-to-build-to-submission flow
   - Configure Slack notification on completion
   - **Deliverable:** Single command (`git tag v1.0.0`) triggers end-to-end release
   - **Blocks:** Manual submission process is error-prone; automate before launch series

6. **Phase N+5: TestFlight + Beta** (2+ weeks)
   - Submit to TestFlight for internal Apple review
   - Submit to Play Store internal testing track
   - Gather feedback from testers on real devices
   - Fix critical crashes/ANRs (device-specific performance issues)
   - **Deliverable:** App passes initial store review; runs crash-free on diverse device set
   - **Blocks:** Cannot move to production without beta validation

---

## Feature Decisions (Distribution Neutral)

These decisions are **independent of mobile packaging** but affect what you can launch:

| Feature | Decision | Rationale | Timeline |
|---------|----------|-----------|----------|
| **Cosmetic IAP** | ✓ Go (power-ups, skins) | Expected; low friction; improves monetization | Phase N+3 |
| **Energy/Stamina system** | ✗ Do NOT | #1 retention killer for arcade; monetizes poorly; players churn | Never |
| **Rewarded ads** | ✓ Go (optional bonus on level complete) | Player-initiated; no frustration; $5–12 eCPM | Phase N+3 |
| **Forced interstitial ads** | ⚠ Conditional (only on natural breaks: level end, game over) | Acceptable if not on app launch or respawn; players expect it | Phase N+3 |
| **Multiplayer** | ✗ Out of Scope (v1) | Complex backend; can launch v1 with single-player, add later | Phase X (future) |
| **Social/Leaderboard** | ✓ Optional (Firebase leaderboard) | Free tier; existing endpoint compatible | Phase N+4 |

---

## Risk Map: Distribution Specific

| Risk | Severity | Mitigation | Ownership |
|------|----------|------------|-----------|
| **App Store rejection** | Medium | Test guideline 3.1.1 (purchase restoration) before submit; avoid private APIs | Pre-flight QA |
| **Performance on Android 7 mid-range** | Medium | Profile on Pixel 2 / Snapdragon 835 minimum; reduce particle effects if needed | Dev + device testing |
| **Signing certificate expiration (iOS)** | Low | Xcode auto-renews since 2021; set annual reminder for manual verify | CI/CD owner |
| **Android keystore loss** | High | **Backup keystore.jks offline; it's non-recoverable.** Lost keystore = cannot release updates without new app ID | Dev ops |
| **TestFlight sandbox timeout** | Low | IAP sandbox tokens expire after 5 minutes; refresh token in flow; expected behavior | Monetization integration |
| **AdMob policy violation (ads at app launch)** | Low | Never show ads before user action; banner only after level ends | Integration checklist |

---

## Estimated Timeline

| Phase | Duration | Start | Delivered |
|-------|----------|-------|-----------|
| Phase N (Mobile Polish) | 1–2 weeks | Week 1 | Smooth 60 FPS, touch controls, asset bundle |
| Phase N+1 (Capacitor) | 1 week | Week 2 | Native iOS/Android builds from web app |
| Phase N+2 (Accounts) | 3–5 days | Week 3 | App Store + Play Store console entries |
| Phase N+3 (Monetization) | 1–2 weeks | Week 3.5 | IAP + ads functional in sandbox |
| Phase N+4 (Automation) | 3–5 days | Week 5 | fastlane + GitHub Actions automated release |
| Phase N+5 (Beta) | 2+ weeks | Week 5.5 | TestFlight + Play internal testing open |
| **Production Launch** | 1 week | Week 7+ | App Store + Play Store live after review |

**Total:** ~8 weeks from decision to app stores.

---

## Cost Summary

| Expense | Amount | When |
|---------|--------|------|
| Apple Developer Program | $99 | One-time |
| Google Play Developer | $25 | One-time |
| App Store/Play Store (included) | – | – |
| GitHub Actions (free tier) | – | – |
| Firebase (free tier) | – | – |
| Signing/certs (all free) | – | – |
| **Total to Launch** | **$124** | Upfront |
| Ongoing revenue share | 30% (both stores) | Per transaction |

**Break-even:** Approximately 150–300 cosmetic purchases @ $0.99 each (depending on store fees).

---

## Downstream Roadmap Integration

**Pass this research to roadmap creator with these flags:**

1. **Ordering dependency:** Phases N, N+1, N+2 must be sequential; N+3 onward can parallelize
2. **Store checklist:** Each phase has a corresponding store compliance task (non-refundable)
3. **Device testing trigger:** Phase N+5 requires BrowserStack or Firebase Test Lab access
4. **CI/CD readiness:** Phase N+4 assumes GitHub Actions familiarity; may need training

---

## References

- [MOBILE_DISTRIBUTION_STACK.md](MOBILE_DISTRIBUTION_STACK.md) — Detailed technology choices
- [Apple StoreKit 2 Overview](https://developer.apple.com/in-app-purchase/) (verified 2026-03-23)
- [Google Play Billing v8](https://developer.android.com/google/play/billing/integrate) (verified 2026-03)
- [fastlane Docs](https://docs.fastlane.tools/) (51M+ hours saved)

---

*Research complete. Ready for roadmap planning.*
