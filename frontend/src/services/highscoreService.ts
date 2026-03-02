import { getRecord, putRecord } from '../lib/indexedDb'

type HighscoreRecord = {
  id: 'local-highscore'
  value: number
  updatedAt: string
}

const HIGHSCORE_ID = 'local-highscore'

export async function getLocalHighscore(): Promise<number> {
  const record = await getRecord<HighscoreRecord>('highscores', HIGHSCORE_ID)
  return record?.value ?? 0
}

export async function saveLocalHighscore(score: number): Promise<void> {
  const current = await getLocalHighscore()

  if (score <= current) {
    return
  }

  await putRecord<HighscoreRecord>('highscores', {
    id: HIGHSCORE_ID,
    value: score,
    updatedAt: new Date().toISOString()
  })
}
