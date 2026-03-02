import { submitHighscore } from './leaderboardApi'

type SyncInput = {
  score: number
  telemetryConsent: boolean
  playerName?: string
}

export async function syncHighscoreIfConsented({ score, telemetryConsent, playerName }: SyncInput): Promise<boolean> {
  if (!telemetryConsent) {
    return false
  }

  await submitHighscore({
    playerName,
    score,
    timestamp: new Date().toISOString()
  })

  return true
}
