# External Integrations

**Analysis Date:** 2026-03-09

## APIs & External Services

**Leaderboard API (optional):**
- HTTP leaderboard service expected by `frontend/src/services/leaderboardApi.ts`.
  - Client: native `fetch`.
  - Endpoints used: `GET /api/leaderboard` and `POST /api/leaderboard`.
  - Payload shape documented in `specs/001-space-invaders-modern-ui/contracts/leaderboard-openapi.yaml`.
  - Auth: none detected.
- `frontend/src/services/highscoreSyncService.ts` wraps leaderboard submission behind a consent gate, but no consumer of `syncHighscoreIfConsented` was found in `frontend/src`.
- `fetchLeaderboard` and `submitHighscore` exist as frontend client utilities only; no matching backend route/controller/server file was detected in the workspace.

**Browser Platform APIs:**
- IndexedDB is the primary local persistence integration via `frontend/src/lib/indexedDb.ts`.
- Fetch API is used only for optional leaderboard sync in `frontend/src/services/leaderboardApi.ts`.
- Web Audio API is used in `frontend/src/services/audioService.ts` through `AudioContext` / `webkitAudioContext`.
- Vibration API is used in `frontend/src/services/audioService.ts` through `navigator.vibrate`.
- Page visibility integration exists through `frontend/src/hooks/useVisibilityPause.ts` and is wired from `frontend/src/App.tsx` to pause/resume gameplay when the tab visibility changes.

## Data Storage

**Databases:**
- Browser IndexedDB only.
  - Connection layer: `frontend/src/lib/indexedDb.ts` with database name `space-invaders-modern-ui` and version `1`.
  - Object stores created: `highscores`, `upgrades`, `settings`, `telemetry`.
  - No server database client, ORM, or hosted database SDK detected.

**Local persisted data:**
- Highscore record in `frontend/src/services/highscoreService.ts` under store `highscores`.
- Settings record in `frontend/src/services/settingsService.ts` under store `settings`.
- Upgrade ownership, upgrade levels, and progression profile in `frontend/src/services/shopPersistenceService.ts` under store `upgrades`.
- Telemetry events in `frontend/src/lib/telemetry.ts` under store `telemetry`.

**File Storage:**
- Not detected. No S3, Cloudinary, Supabase Storage, Firebase Storage, or local upload flow present.

**Caching:**
- No dedicated cache layer detected.
- Browser persistence is implemented as durable app data in IndexedDB, not as a network cache.

## Authentication & Identity

**Auth Provider:**
- None detected.
- Player identity for leaderboard is optional `playerName` sent by the client in `frontend/src/services/leaderboardApi.ts` and `frontend/src/services/highscoreSyncService.ts`.
- No login flow, token handling, session library, or user profile backend exists in the current repo.

## Monitoring, Telemetry, and Privacy

**Telemetry capture:**
- Telemetry is local-first and opt-in.
- Consent is stored in app settings through `frontend/src/state/settingsStore.ts`, loaded/saved by `frontend/src/services/settingsService.ts`, and mirrored into runtime state by `frontend/src/App.tsx`.
- `frontend/src/lib/telemetry.ts` stores accepted events in IndexedDB instead of sending them to a remote collector.
- `frontend/src/services/privacyGuard.ts` defines an allowlist sanitizer and upload eligibility helper, but no remote telemetry uploader is implemented.
- Current gameplay event usage confirmed: `logTelemetryEvent('cycle-stage-advanced', ...)` in `frontend/src/game/engine.ts`.

**Error tracking / observability:**
- No Sentry, LogRocket, Datadog, OpenTelemetry, or custom ingest endpoint detected.
- Logging strategy is effectively none/minimal in shipped app code.

## Audio, Haptics, and Input-Adjacent Integrations

**Audio:**
- Generated sound effects only; no external audio library or asset pipeline detected.
- `frontend/src/services/audioService.ts` synthesizes tones with the browser Web Audio API.
- No imported audio files, CDN audio provider, or streaming service detected.

**Haptics:**
- `frontend/src/services/audioService.ts` exposes vibration support via `navigator.vibrate`.
- `audioEnabled` and `vibrationEnabled` preferences are exposed in `frontend/src/components/SettingsPanel.tsx` and stored in `frontend/src/state/settingsStore.ts`.
- No active call sites for `playTone` or `vibrate` were found in the current game loop, so the integration exists as a service but is not visibly wired into gameplay flow.

## Sync and Leaderboards

**Remote sync:**
- Only leaderboard submission is modeled as remote sync.
- Sync is gated by telemetry consent in `frontend/src/services/highscoreSyncService.ts`.
- No retry queue, offline outbox, background sync, or conflict resolution logic detected.
- No leaderboard polling/subscription/WebSocket sync detected.

**Leaderboard scope:**
- The repository contains a client contract and OpenAPI spec for an optional leaderboard.
- The local game remains functional without network access because local highscores are stored in IndexedDB via `frontend/src/services/highscoreService.ts`.
- Current implementation status is client-ready, backend-absent.

## CI/CD & Deployment

**Hosting:**
- No hosting platform configuration detected.
- Current codebase is compatible with static frontend hosting for `frontend/` plus a separate optional API service for leaderboard.

**CI Pipeline:**
- No `.github/workflows/*` files were detected.
- Validation is driven by npm scripts in `package.json` and `frontend/package.json` rather than committed CI automation.

## Environment Configuration

**Required env vars:**
- None required by the currently implemented frontend code.
- If a leaderboard backend is introduced, the current client would need either relative hosting at `/api` or a future configurable base URL.

**Secrets location:**
- None detected in repository configuration.
- No `.env` files were found during exploration.

## Webhooks & Callbacks

**Incoming:**
- None detected.

**Outgoing:**
- `GET /api/leaderboard` and `POST /api/leaderboard` from `frontend/src/services/leaderboardApi.ts`.
- No other third-party webhooks, callbacks, or outbound SDK integrations detected.

---

*Integration audit: 2026-03-09*
