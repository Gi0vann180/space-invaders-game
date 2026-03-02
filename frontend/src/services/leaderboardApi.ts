export type LeaderboardEntry = {
  playerName?: string
  score: number
  timestamp: string
}

const DEFAULT_BASE_URL = '/api'

export async function fetchLeaderboard(baseUrl = DEFAULT_BASE_URL): Promise<LeaderboardEntry[]> {
  const response = await fetch(`${baseUrl}/leaderboard`)

  if (!response.ok) {
    throw new Error('Falha ao buscar leaderboard')
  }

  return (await response.json()) as LeaderboardEntry[]
}

export async function submitHighscore(
  entry: LeaderboardEntry,
  baseUrl = DEFAULT_BASE_URL
): Promise<void> {
  const response = await fetch(`${baseUrl}/leaderboard`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(entry)
  })

  if (!response.ok) {
    throw new Error('Falha ao enviar highscore')
  }
}
