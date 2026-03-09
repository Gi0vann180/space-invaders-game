# Technology Stack

**Project:** Space Invaders browser game -> Android-first mobile release
**Researched:** 2026-03-09
**Scope:** Stack dimension only, for upgrading the existing web game instead of rewriting it
**Overall recommendation:** Keep the current web game architecture and ship it inside a native Android container with Capacitor. Publish as an Android App Bundle through Google Play. Add only the native layers that materially improve a mobile game: app lifecycle, haptics, splash/loading, status/system UI handling, crash reporting, signing, and Play testing/release tooling.

## Recommended Stack

### Keep From Current Repo

| Technology | Keep? | Purpose | Why it fits this repo | Confidence |
|------------|-------|---------|-----------------------|------------|
| React UI shell | Yes | Menus, HUD, settings, overlays | Already present and sufficient for a canvas-led arcade game. No value in replacing it for Android-first shipping. | HIGH |
| TypeScript | Yes | Game/domain safety | Important for a solo developer maintaining gameplay, progression, and mobile edge cases over time. | HIGH |
| Vite build pipeline | Yes | Fast builds for web bundle feeding native shell | Capacitor's workflow explicitly expects a built web bundle and works cleanly with Vite-style build output. | HIGH |
| Canvas game engine | Yes | Core rendering/gameplay | This is the product. Rewriting into another engine is cost without immediate publication upside. | MEDIUM |
| IndexedDB persistence | Yes, behind an abstraction | Local progression/save data | For an offline-first single-player game with no backend, IndexedDB is enough initially. Keep it, but wrap it behind a persistence interface so migration is possible later. | MEDIUM |

### Add Now

| Technology | Version / Line | Purpose | Why | Confidence |
|------------|----------------|---------|-----|------------|
| Capacitor | Current major docs line: v8 | Native Android container for the existing web app | Standard low-rewrite path for shipping a modern web app as a Play Store app while keeping web tooling and adding native hooks only where needed. | HIGH |
| @capacitor/android | Match Capacitor major | Android platform target | Official Android runtime for Capacitor. Supports API 24+ and Android Studio workflow. | HIGH |
| @capacitor/cli | Match Capacitor major | Sync/build/open native project | Needed for `sync`, `run`, `open`, and native build workflow from the existing web app. | HIGH |
| Android Studio + Gradle | Current stable tooling | Native project management and signed release builds | Required in practice for release configuration, store signing, manifest/theme polish, emulator/device testing, and final AAB generation. | HIGH |
| @capacitor/app | Match Capacitor major | App lifecycle, Android back button, pause/resume | Mobile game shipping needs reliable lifecycle control for pause/resume, back handling, and restoring state. | HIGH |
| @capacitor/haptics | Match Capacitor major | Touch feedback | High value for mobile game feel with low implementation cost. | HIGH |
| @capacitor/splash-screen | Match Capacitor major | Native launch experience | Important for perceived polish and to hide web/canvas startup work. | HIGH |
| @capacitor/status-bar | Match Capacitor major | System UI integration | Needed for fullscreen/edge-to-edge behavior decisions on Android; docs also note Android 15+/16+ behavior changes that affect layout assumptions. | HIGH |
| Sentry for Capacitor + React | Current stable SDKs | Crash/error monitoring, release visibility, sourcemaps | Best low-cost observability addition for a solo developer shipping hybrid mobile. Helps catch Android-specific failures that browser-only testing will miss. | HIGH |
| Google Play App Bundle (AAB) | Required distribution format | Store-ready artifact | New Play apps publish with Android App Bundles; this is the standard release artifact. | HIGH |
| Play App Signing | Standard Play release setup | Key management and safer updates | Reduces key risk and is the normal Play release path for modern app bundle publishing. | HIGH |
| Play internal testing + closed testing + internal app sharing | Play Console tooling | Fast device distribution and release validation | Cheapest realistic way to validate install, performance, and edge devices before production. | HIGH |
| Play pre-review checks + pre-launch reporting | Play Console tooling | Catch store/release issues early | Good leverage for a solo mobile release without standing up a large QA pipeline. | HIGH |

### Add Later If Needed

| Technology | Add when | Why not now | Confidence |
|------------|-----------|-------------|------------|
| Play Asset Delivery | Only if app size or asset growth demands it | Premature for a canvas arcade game unless art/audio grows beyond comfortable AAB size. | HIGH |
| Play Billing | Only when monetization is product-critical | Official docs strongly recommend secure backend integration for purchase verification and entitlement handling. That conflicts with current low-backend constraint. | HIGH |
| Native Android plugin/custom code | Only if WebView limitations block a core requirement | Capacitor plugins cover the immediate needs. Native code should be exception-driven, not phase-1 scope. | MEDIUM |
| Cloud save / backend sync | Only after local progression loop is proven | Adds cost, policy/privacy burden, and support surface. Not needed for first Android release. | HIGH |
| iOS platform via Capacitor | After Android launch stabilizes | Capacitor makes this feasible later, but it should not shape the Android-first stack now. | HIGH |

## Prescriptive Recommendation

Use this stack:

1. Keep the existing React + TypeScript + Vite + Canvas web game as the source of truth.
2. Add Capacitor as the native shell for Android.
3. Build and distribute as an AAB through Play Console with Play App Signing enabled.
4. Integrate only the Capacitor plugins that materially improve a mobile game experience: App, Haptics, Splash Screen, and Status Bar.
5. Add Sentry for Capacitor + React with source map upload for release diagnostics.
6. Keep IndexedDB for local progression, but hide it behind a persistence service boundary.
7. Use Play internal testing, internal app sharing, and then closed testing before production rollout.

This is the standard 2026 low-rewrite stack for a web-origin arcade game that needs to become a real Android product without taking on a native-game-engine rewrite.

## Packaging And Distribution Options

### Primary Recommendation: Capacitor + Android App Bundle

**Use this.**

Why:
- Preserves the current web game and web deployment model.
- Gives direct access to Android app lifecycle, back button behavior, splash behavior, haptics, and native packaging.
- Produces standard Play-ready artifacts and fits modern Play signing/testing workflows.
- Keeps the door open for iOS later without committing to an iOS rewrite now.

### Secondary Option: Trusted Web Activity + Bubblewrap

**Use only as a fallback for the cheapest possible wrapper, not as the main plan.**

What it is:
- A full-screen browser-based Android wrapper for a PWA.
- Bubblewrap is the standard CLI used to generate/build the Android project around the PWA.

Why it is weaker for this repo:
- TWA content is rendered by the user's browser, not by your own embedded runtime.
- Official docs state the host app does not have direct access to web content state such as cookies/localStorage.
- It depends on Digital Asset Links verification and browser capability/fallback behavior.
- It is better for "ship my PWA in Play" than for "polish a touch-heavy game with predictable app lifecycle and native affordances."
- The official TWA docs surfaced here are older than the Capacitor and Play docs, so confidence is lower for treating it as the primary 2026 path.

Recommendation:
- Keep TWA/Bubblewrap as a contingency if the goal changes to "minimum wrapper with near-zero native behavior".
- Do not choose it as the main stack for this game release.

## What To Keep, Add, And Avoid

### Keep

| Keep | Why |
|------|-----|
| Existing Canvas gameplay/rendering | Lowest-risk path to mobile release. |
| Existing React shell | Good enough for menus/meta screens around the game canvas. |
| Existing TypeScript domain model | Helps prevent regressions while adding progression and mobile UX rules. |
| Existing IndexedDB data model | Fine for offline-first saves initially. |

### Add

| Add | Why |
|-----|-----|
| Capacitor Android shell | Native packaging with minimal rewrite. |
| App lifecycle integration | Required for pause/resume, restore, and back behavior. |
| Haptics | Immediate mobile feel improvement. |
| Native splash/loading sequence | Prevents rough startup and white-screen feel. |
| Status/system bar handling | Needed for a clean fullscreen Android presentation. |
| Sentry + sourcemaps | Essential operational visibility for solo shipping. |
| Play release workflow | Required to become a real store product. |

### Avoid

| Avoid | Why |
|------|-----|
| Cordova | Older path with less favorable modern recommendation than Capacitor for a web-first app. |
| Ionic UI layer | Adds app-shell UI abstraction you do not need for a full-screen arcade game. Capacitor alone is enough. |
| React Native rewrite | Throws away the existing canvas/web codebase and delays shipping. |
| Unity/Godot rewrite | Same issue, but with even higher migration cost. |
| SQLite migration now | Extra complexity without clear need for this offline single-player scope. |
| Play Billing in v1 if no backend exists | Billing docs recommend secure backend support for verification and entitlements. |
| Multiplayer/backend services now | Violates the project's low-cost and low-complexity constraint. |
| TWA as primary path | Too browser-dependent and too limited for the level of mobile polish you want. |

## Recommended Package Set

```bash
# Keep existing React/TS/Vite stack

# Add native Android shell
npm install @capacitor/core @capacitor/android @capacitor/app @capacitor/haptics @capacitor/splash-screen @capacitor/status-bar
npm install -D @capacitor/cli

# Add observability
npm install @sentry/capacitor @sentry/react
```

## Suggested Project Layout Direction

```text
frontend/
  src/
    game/
    services/
    platform/
      appLifecycle/
      haptics/
      systemUi/
      persistence/
  capacitor.config.ts
android/
```

Notes:
- Put all Capacitor/native-adapter calls behind `platform/` services.
- Keep game systems unaware of Capacitor directly.
- Treat IndexedDB as one implementation of a persistence port, not as a hardcoded global dependency.

## Release Baseline

| Area | Recommendation | Why | Confidence |
|------|----------------|-----|------------|
| Android target | Target Android 15 / API 35+ for new Play submission | Required by current Play policy for new apps. | HIGH |
| Android minimum | Min SDK 24+ | Matches Capacitor Android support baseline. | HIGH |
| Artifact | AAB | Standard Play release format. | HIGH |
| Signing | Play App Signing + separate upload key | Safer long-term updates and key recovery path. | HIGH |
| Testing flow | Internal app sharing -> internal test -> closed test -> production rollout | Best low-cost release discipline for solo shipping. | HIGH |
| Rollout style | Staged rollout | Reduces blast radius of launch bugs. | MEDIUM |

## Alternatives Considered

| Category | Recommended | Alternative | Why Not |
|----------|-------------|-------------|---------|
| Native wrapper | Capacitor | Trusted Web Activity + Bubblewrap | Less control over app/runtime behavior; better for simple PWA packaging than a polished mobile game. |
| Mobile stack | Keep web stack + Capacitor | React Native rewrite | Rebuild cost too high for current constraints. |
| Game engine path | Keep current Canvas engine | Phaser/Unity/Godot migration | Rewrite risk outweighs near-term shipping benefit. |
| Persistence | IndexedDB behind interface | SQLite now | Not needed yet for offline single-player saves. |
| Monetization | Defer | Immediate Play Billing integration | Adds backend/security overhead that current scope rejects. |

## Installation / Workflow

```bash
# web build
npm run build

# add android platform
npx cap add android

# sync web bundle into native shell
npx cap sync android

# open native project
npx cap open android

# local device/emulator run
npx cap run android

# CI or terminal build path for release artifacts
npx cap build android
```

## Sources

### Official / Authoritative
- Capacitor overview and Android docs: https://capacitorjs.com/docs
- Capacitor Android support/workflow: https://capacitorjs.com/docs/android
- Capacitor build/sync workflow: https://capacitorjs.com/docs/basics/workflow
- Capacitor App plugin: https://capacitorjs.com/docs/apis/app
- Capacitor Haptics plugin: https://capacitorjs.com/docs/apis/haptics
- Capacitor Splash Screen plugin: https://capacitorjs.com/docs/apis/splash-screen
- Capacitor Status Bar plugin: https://capacitorjs.com/docs/apis/status-bar
- Android App Bundle docs: https://developer.android.com/guide/app-bundle
- Android signing docs: https://developer.android.com/studio/publish/app-signing
- Play App Signing: https://support.google.com/googleplay/android-developer/answer/9842756
- Play release management: https://support.google.com/googleplay/android-developer/answer/9859348
- Play testing tracks: https://support.google.com/googleplay/android-developer/answer/9845334
- Play internal app sharing: https://support.google.com/googleplay/android-developer/answer/9844679
- Play target API requirements: https://support.google.com/googleplay/android-developer/answer/11926878
- Play pre-review checks: https://support.google.com/googleplay/android-developer/answer/14807773
- Google Play Billing overview: https://developer.android.com/google/play/billing
- Sentry React docs: https://docs.sentry.io/platforms/javascript/guides/react/
- Sentry Capacitor docs: https://docs.sentry.io/platforms/javascript/guides/capacitor/

### Lower-confidence secondary option sources
- Trusted Web Activity overview: https://developer.chrome.com/docs/android/trusted-web-activity/
- Trusted Web Activity quick start / Bubblewrap: https://developer.chrome.com/docs/android/trusted-web-activity/quick-start/
- Trusted Web Activity integration guide: https://developer.chrome.com/docs/android/trusted-web-activity/integration-guide/

## Confidence Notes

- **HIGH:** Capacitor as the primary Android wrapper, AAB + Play App Signing, Play testing/release workflow, Sentry addition.
- **MEDIUM:** Keeping IndexedDB long enough for first release, staged rollout recommendation, exact threshold for when Play Asset Delivery becomes necessary.
- **LOWER than primary path:** TWA/Bubblewrap as the main packaging strategy, because the official docs surfaced here are materially older and the model gives less runtime control for a game.
