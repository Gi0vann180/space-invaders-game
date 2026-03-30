# Technology Stack

**Project:** Space Invaders Futurista Mobile  
**Market:** iOS/Android via App Store/Play Store, web fallback  
**Researched:** 2026-03-23  
**Status:** Existing stack validated; recommendations for mobile packaging only

## Current Stack (Validated)

| Layer | Technology | Version | Purpose | Status |
|-------|-----------|---------|---------|--------|
| **Frontend UI** | React | 18+ | UI framework (shop, settings, menus) | ✓ Existing |
| **Language** | TypeScript | 5.0+ | Type safety, code quality | ✓ Existing |
| **Game Engine** | Canvas 2D + custom loop | n/a | Simulation loop (update/render/tick separation) | ✓ Existing |
| **Persistence** | IndexedDB | native | Local high scores, settings, shop progress | ✓ Existing |
| **Testing** | Vitest + Playwright | latest | Unit, integration, e2e (strong coverage) | ✓ Existing |
| **Build** | Vite | 5.0+ | Fast HMR, optimized bundles | ✓ Existing |

## Additions for Mobile Release

| Layer | Technology | Version | Purpose | Why |
|-------|-----------|---------|---------|-----|
| **Android Packaging** | Capacitor | 6.0+ | WebView wrapper for Android | Bridges React web app → Play Store; handles OS intents, permissions, lifecycle |
| **iOS Packaging** | Capacitor | 6.0+ | WebView wrapper for iOS | Bridges React web app → App Store; same codebase as Android |
| **Alternative (if native needed)** | React Native | 0.73+ | Native iOS + Android from TS/React | Only if Capacitor WKWebView performance insufficient (unlikely for arcade) |
| **Performance Monitoring** | Sentry | latest | Crash reporting + performance tracking | Catch memory leaks on old devices; track FPS metrics |
| **Ad Network** | Google Mobile Ads (Admob) | latest | Ad delivery (interstitial only, death screen) | Standard for casual games; <50ms latency; ~$2-5 RPM for arcade |
| **Analytics** | Firebase Analytics | latest | User retention, funnel tracking | Free tier; tracks DAU, session length, feature usage |
| **Build Signing** | Gradle (Android) + Xcode (iOS) | latest | App signing for store distribution | Handled by CI/CD; one-time setup with certs |

## Installation & Setup

### Initial Setup (Week 1)

```bash
# Existing web project
npm install
npm run dev

# Add Capacitor for mobile packaging
npm install @capacitor/core @capacitor/cli
npx cap init "Space Invaders Futurista" "com.example.spaceinvaders"

# Add plugins for mobile features
npm install @capacitor/app @capacitor/device @capacitor/keyboard

# Initialize platforms
npx cap add ios
npx cap add android

# Build web assets
npm run build
npx cap copy

# Open native IDEs for signing
npx cap open ios
npx cap open android
```

### Mobile-Specific Packages (Phase 5 - Monetization)

```bash
# Ad integration
npm install @capacitor-firebase/analytics
npm install google-mobile-ads-plugin-capacitor

# Optional: crash reporting
npm install @sentry/react @sentry/tracing
```

### Development Workflow

```bash
# Web development (existing)
npm run dev

# iOS testing (on mac)
npm run build
npx cap copy
npx cap open ios
# Then: Product → Run in Xcode Simulator

# Android testing (windows/mac/linux)
npm run build
npx cap copy
npx cap open android
# Then: Run project in Android Studio Emulator

# Real device testing
npx cap run ios --target [device-name]
npx cap run android
```

## Performance Targets

| Metric | Target | Reasoning |
|--------|--------|-----------|
| **Cold boot (home screen → game starts)** | <2s | User expectation; longer = uninstall |
| **Frame rate** | 60 fps (mid-range), 120fps (flagship) | Arcade game; jank instantly noticeable |
| **Memory (mid-range device)** | <150MB | Snapdragon 695, iPhone 11 typical; avoid OOM kills |
| **App size** | <100MB | App Store/Play Store download threshold; over = users skip |
| **Battery drain (per 30min session)** | <15% | Mobile users sensitive to battery impact |
| **Network latency (optional cloud features)** | <100ms | Unnoticed for async leaderboards |

## Browser/OS Support

| Platform | Minimum Version | Rationale |
|----------|-----------------|-----------|
| **iOS** | 14.0+ | Covers 95%+ of iOS users (2026); WKWebView stable |
| **Android** | API 26 (8.0) | Covers 85%+ of Android users; older devices have memory limits anyway |
| **Web (fallback)** | Chrome 90+, Safari 14+ | Modern WebGL 2.0; graceful degradation for olderspeakers |

## CI/CD Recommendations

```yaml
# GitHub Actions example (Phase 6-7)
name: Build Mobile Apps

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '^18'
      - run: npm install
      - run: npm run build
      - run: npx cap copy
      
      # Android build
      - uses: android-actions/setup-android@v2
      - run: cd android && ./gradlew assembleRelease
      
      # iOS build (requires macOS runner)
      # Can also use EAS Build (Expo) as alternative
```

## Dependencies Summary

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "@capacitor/core": "^6.0.0",
    "@capacitor/app": "^6.0.0",
    "@capacitor/device": "^6.0.0",
    "@capacitor/keyboard": "^6.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@playwright/test": "^1.40.0"
  }
}
```

## Known Issues & Mitigation

| Issue | Platform | Mitigation |
|-------|----------|-----------|
| **Inconsistent WebView behavior** | iOS/Android | Test on real devices; use Capacitor plugins for OS-specific needs |
| **Audio latency on Android** | Android | Use Web Audio API; test on diverse devices |
| **Memory pressure on low-end devices** | Android | Aggressive asset streaming; limit particle count dynamically |
| **App Store review delays** | iOS | Plan 3-5 day review cycle; test with TestFlight first |
| **Play Store policy on ads** | Android | Interstitial only (not fullscreen); clearly skippable |
| **Battery drain from canvas rendering** | Both | Limit FPS in background; use requestAnimationFrame caps |

## Estimated Effort

| Task | Effort | Owner |
|------|--------|-------|
| Set up Capacitor + Gradle/Xcode signing | 2-3 days | DevOps/Mobile |
| Android Play Store account + app setup | 1 day | Product |
| iOS App Store account + app setup | 1 day | Product |
| Real device testing (target 5+ devices) | 2-3 days | QA |
| Build signing + CI/CD pipeline | 2-3 days | DevOps |
| Total mobile packaging prep | **~2 weeks** | **Phase 5-6** |

## Sources

- **Capacitor docs:** https://capacitorjs.com/docs (verified 2026-03-23)
- **Firebase Mobile:** https://firebase.google.com/products/analytics (market standard)
- **Google Mobile Ads (Admob):** https://admob.google.com (casual game RPM data)
- **React 18 + TypeScript:** Validated in project; no upgrades needed
- **Vitest + Playwright:** Existing testing coverage is solid
