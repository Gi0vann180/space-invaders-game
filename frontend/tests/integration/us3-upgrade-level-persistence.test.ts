import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getRecordMock, putRecordMock } = vi.hoisted(() => ({
  getRecordMock: vi.fn(),
  putRecordMock: vi.fn()
}))

vi.mock('../../src/lib/indexedDb', () => ({
  getRecord: getRecordMock,
  putRecord: putRecordMock
}))

import { getPersistedUpgradeLevels, savePersistedUpgradeLevels } from '../../src/services/shopPersistenceService'

describe('US3 upgrade level persistence', () => {
  beforeEach(() => {
    getRecordMock.mockReset()
    putRecordMock.mockReset()
  })

  it('restaura níveis de upgrades persistidos', async () => {
    getRecordMock.mockResolvedValue({
      id: 'owned-upgrades',
      upgradeLevels: {
        'upgrade-fire-rate': 3,
        'upgrade-speed': 2,
        'upgrade-shield': 1
      }
    })

    const levels = await getPersistedUpgradeLevels()
    expect(levels['upgrade-fire-rate']).toBe(3)
    expect(levels['upgrade-speed']).toBe(2)
    expect(levels['upgrade-shield']).toBe(1)
  })

  it('persiste mapa de níveis de upgrades', async () => {
    await savePersistedUpgradeLevels({
      'upgrade-fire-rate': 4,
      'upgrade-speed': 2,
      'upgrade-shield': 1
    })

    expect(putRecordMock).toHaveBeenCalledTimes(1)
    expect(putRecordMock.mock.calls[0][1].upgradeLevels['upgrade-fire-rate']).toBe(4)
  })
})
