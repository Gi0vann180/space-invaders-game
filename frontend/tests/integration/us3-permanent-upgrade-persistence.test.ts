import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getRecordMock, putRecordMock } = vi.hoisted(() => ({
  getRecordMock: vi.fn(),
  putRecordMock: vi.fn()
}))

vi.mock('../../src/lib/indexedDb', () => ({
  getRecord: getRecordMock,
  putRecord: putRecordMock
}))

import {
  getPersistedProgressProfile,
  getPersistedUpgradeLevels,
  savePersistedProgressProfile,
  savePersistedUpgradeLevels
} from '../../src/services/shopPersistenceService'

describe('US3 permanent upgrade persistence', () => {
  beforeEach(() => {
    getRecordMock.mockReset()
    putRecordMock.mockReset()
  })

  it('restaura upgrades e perfil persistidos entre partidas', async () => {
    getRecordMock.mockImplementation(async (_store: string, key: string) => {
      if (key === 'owned-upgrades') {
        return {
          id: 'owned-upgrades',
          upgradeLevels: {
            'upgrade-fire-rate': 2,
            'upgrade-speed': 1,
            'upgrade-shield': 0
          }
        }
      }

      return {
        id: 'player-progress',
        highestUnlockedStage: 4,
        totalRuns: 12,
        updatedAt: new Date().toISOString()
      }
    })

    const levels = await getPersistedUpgradeLevels()
    const profile = await getPersistedProgressProfile()

    expect(levels['upgrade-fire-rate']).toBe(2)
    expect(profile.highestUnlockedStage).toBe(4)
    expect(profile.totalRuns).toBe(12)
  })

  it('persiste upgrades e perfil atualizado', async () => {
    await savePersistedUpgradeLevels({
      'upgrade-fire-rate': 3,
      'upgrade-speed': 2,
      'upgrade-shield': 1
    })
    await savePersistedProgressProfile({
      highestUnlockedStage: 5,
      totalRuns: 13
    })

    expect(putRecordMock).toHaveBeenCalledTimes(2)
  })
})
