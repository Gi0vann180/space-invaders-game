# External Integrations

**Analysis Date:** 2026-03-09

## APIs & External Services

**Leaderboard API:**
- HTTP leaderboard service - read/write highscores from frontend
  - SDK/Client: native `fetch` in `frontend/src/services/leaderboardApi.ts`
  - Auth: Not detected

## Data Storage

**Databases:**
- Browser IndexedDB (client-side only)
  - Connection: browser `indexedDB` API in `frontend/src/lib/indexedDb.ts`
  - Client: custom wrapper functions (`openGameDb`, `putRecord`, `getRecord`) in `frontend/src/lib/indexedDb.ts`

**File Storage:**
- Local browser storage only (IndexedDB object stores `highscores`, `upgrades`, `settings`, `telemetry`) in `frontend/src/lib/indexedDb.ts`

**Caching:**
- None detected (no Redis/service-worker cache strategy found)

## Authentication & Identity

**Auth Provider:**
- Custom/none
  - Implementation: no login/session system detected in `frontend/src`.

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry/NewRelic/Bugsnag client)

**Logs:**
- Gameplay telemetry events persisted locally in IndexedDB via `frontend/src/lib/telemetry.ts`

## CI/CD & Deployment

**Hosting:**
- Not detected in repository configuration files

**CI Pipeline:**
- Not detected (`.github/workflows` not found)

## Environment Configuration

**Required env vars:**
- Not detected
- API target currently hardcoded as `/api` in `frontend/src/services/leaderboardApi.ts`

**Secrets location:**
- Not detected

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- `GET /leaderboard` and `POST /leaderboard` from `frontend/src/services/leaderboardApi.ts`

---

*Integration audit: 2026-03-09*
