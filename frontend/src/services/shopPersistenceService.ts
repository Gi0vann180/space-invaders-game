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

export type InterruptedRunSnapshot = {
  stage: number
  atStatus: 'running' | 'paused'
  savedAt: string
}

export type ProgressProfile = {
  id: 'player-progress'
  highestUnlockedStage: number
  totalRuns: number
  lastAttemptedStage: number | null
  lastCompletedStage: number | null
  interruptedRun: InterruptedRunSnapshot | null
  updatedAt: string
}

const STORE_ID = 'owned-upgrades'
const PROGRESS_PROFILE_ID = 'player-progress'

function createDefaultProgressProfile(): ProgressProfile {
  return {
    id: PROGRESS_PROFILE_ID,
    highestUnlockedStage: 1,
    totalRuns: 0,
    lastAttemptedStage: null,
    lastCompletedStage: null,
    interruptedRun: null,
    updatedAt: new Date().toISOString()
  }
}

export function isValidInterruptedRunSnapshot(value: unknown): value is InterruptedRunSnapshot {
  if (!value || typeof value !== 'object') {
    return false
  }

  const candidate = value as Record<string, unknown>
  const validStatus = candidate.atStatus === 'running' || candidate.atStatus === 'paused'

  return (
    typeof candidate.stage === 'number' &&
    Number.isFinite(candidate.stage) &&
    candidate.stage >= 1 &&
    validStatus &&
    typeof candidate.savedAt === 'string' &&
    candidate.savedAt.length > 0
  )
}

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
  const record = await getRecord<Partial<ProgressProfile>>('upgrades', PROGRESS_PROFILE_ID)
  if (!record) {
    return createDefaultProgressProfile()
  }

  const defaults = createDefaultProgressProfile()
  const normalizedAttempted = typeof record.lastAttemptedStage === 'number' ? Math.max(1, record.lastAttemptedStage) : null
  const normalizedCompleted = typeof record.lastCompletedStage === 'number' ? Math.max(1, record.lastCompletedStage) : null

  return {
    id: PROGRESS_PROFILE_ID,
    highestUnlockedStage: Math.max(1, record.highestUnlockedStage ?? defaults.highestUnlockedStage),
    totalRuns: Math.max(0, record.totalRuns ?? defaults.totalRuns),
    lastAttemptedStage: normalizedAttempted,
    lastCompletedStage: normalizedCompleted,
    interruptedRun: isValidInterruptedRunSnapshot(record.interruptedRun) ? record.interruptedRun : null,
    updatedAt: typeof record.updatedAt === 'string' ? record.updatedAt : defaults.updatedAt
  }
}

export async function savePersistedProgressProfile(profile: Omit<ProgressProfile, 'id' | 'updatedAt'>): Promise<void> {
  await putRecord<ProgressProfile>('upgrades', {
    id: PROGRESS_PROFILE_ID,
    highestUnlockedStage: Math.max(1, profile.highestUnlockedStage),
    totalRuns: Math.max(0, profile.totalRuns),
    lastAttemptedStage: typeof profile.lastAttemptedStage === 'number' ? Math.max(1, profile.lastAttemptedStage) : null,
    lastCompletedStage: typeof profile.lastCompletedStage === 'number' ? Math.max(1, profile.lastCompletedStage) : null,
    interruptedRun: isValidInterruptedRunSnapshot(profile.interruptedRun) ? profile.interruptedRun : null,
    updatedAt: new Date().toISOString()
  })
}


export function resolveInterruptedRunSnapshot(
  value: unknown,
  fallbackStage: number
): InterruptedRunSnapshot | null {
  if (!isValidInterruptedRunSnapshot(value)) {
    return null
  }

  return {
    stage: value.stage >= 1 ? value.stage : Math.max(1, fallbackStage),
    atStatus: value.atStatus,
    savedAt: value.savedAt
  }
}

