import { getRecord, putRecord } from '../lib/indexedDb'
import type { ShopItemId } from './shopService'

type UpgradesRecord = {
  id: 'owned-upgrades'
  upgrades: ShopItemId[]
  updatedAt: string
}

const STORE_ID = 'owned-upgrades'

export async function getPersistedUpgrades(): Promise<ShopItemId[]> {
  const record = await getRecord<UpgradesRecord>('upgrades', STORE_ID)
  return record?.upgrades ?? []
}

export async function savePersistedUpgrades(upgrades: ShopItemId[]): Promise<void> {
  await putRecord<UpgradesRecord>('upgrades', {
    id: STORE_ID,
    upgrades,
    updatedAt: new Date().toISOString()
  })
}
