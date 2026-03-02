import { getRecord, putRecord } from '../lib/indexedDb'
import type { GameSettings } from '../state/settingsStore'

type SettingsRecord = {
  id: 'game-settings'
  value: GameSettings
  updatedAt: string
}

const STORE_ID = 'game-settings'

export async function loadSettings(): Promise<GameSettings | null> {
  const record = await getRecord<SettingsRecord>('settings', STORE_ID)
  return record?.value ?? null
}

export async function saveSettings(settings: GameSettings): Promise<void> {
  await putRecord<SettingsRecord>('settings', {
    id: STORE_ID,
    value: settings,
    updatedAt: new Date().toISOString()
  })
}
