import { getRecord, putRecord } from '../lib/indexedDb'
import {
  EMPTY_UPGRADE_LEVELS,
  type ShopItemId,
  type UpgradeLevels
} from './shopService'

type UpgradesRecord = {
  id: 'owned-upgrades'
  upgrades?: ShopItemId[]
  upgradeLevels?: UpgradeLevels
  updatedAt: string
}

export type ProgressProfile = {
  id: 'player-progress'
  highestUnlockedStage: number
  totalRuns: number
  updatedAt: string
}

const STORE_ID = 'owned-upgrades'
const PROGRESS_PROFILE_ID = 'player-progress'

export async function getPersistedUpgradeLevels(): Promise<UpgradeLevels> {
  const record = await getRecord<UpgradesRecord>('upgrades', STORE_ID)
  if (!record) {
    return { ...EMPTY_UPGRADE_LEVELS }
  }

  if (record.upgradeLevels) {
    return {
      ...EMPTY_UPGRADE_LEVELS,
      ...record.upgradeLevels
    }
  }

  const migrated = { ...EMPTY_UPGRADE_LEVELS }
  for (const upgrade of record.upgrades ?? []) {
    migrated[upgrade] = Math.max(1, migrated[upgrade])
  }

  return migrated
}

export async function savePersistedUpgradeLevels(upgradeLevels: UpgradeLevels): Promise<void> {
  await putRecord<UpgradesRecord>('upgrades', {
    id: STORE_ID,
    upgradeLevels,
    updatedAt: new Date().toISOString()
  })
}

export async function getPersistedUpgrades(): Promise<ShopItemId[]> {
  const levels = await getPersistedUpgradeLevels()
  return (Object.keys(levels) as ShopItemId[]).filter((upgrade) => levels[upgrade] > 0)
}

export async function savePersistedUpgrades(upgrades: ShopItemId[]): Promise<void> {
  const levels = { ...EMPTY_UPGRADE_LEVELS }
  for (const upgrade of upgrades) {
    levels[upgrade] = 1
  }

  await savePersistedUpgradeLevels(levels)
}

export async function getPersistedProgressProfile(): Promise<ProgressProfile> {
  const record = await getRecord<ProgressProfile>('upgrades', PROGRESS_PROFILE_ID)
  if (!record) {
    return {
      id: 'player-progress',
      highestUnlockedStage: 1,
      totalRuns: 0,
      updatedAt: new Date().toISOString()
    }
  }

  return {
    ...record,
    highestUnlockedStage: Math.max(1, record.highestUnlockedStage),
    totalRuns: Math.max(0, record.totalRuns)
  }
}

export async function savePersistedProgressProfile(profile: Omit<ProgressProfile, 'id' | 'updatedAt'>): Promise<void> {
  await putRecord<ProgressProfile>('upgrades', {
    id: PROGRESS_PROFILE_ID,
    highestUnlockedStage: Math.max(1, profile.highestUnlockedStage),
    totalRuns: Math.max(0, profile.totalRuns),
    updatedAt: new Date().toISOString()
  })
}
