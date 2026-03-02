import { beforeEach, describe, expect, it, vi } from 'vitest'

const { getRecordMock, putRecordMock } = vi.hoisted(() => ({
  getRecordMock: vi.fn(),
  putRecordMock: vi.fn()
}))

vi.mock('../../src/lib/indexedDb', () => ({
  getRecord: getRecordMock,
  putRecord: putRecordMock
}))

import { getPersistedUpgrades, savePersistedUpgrades } from '../../src/services/shopPersistenceService'

describe('US2 shop persistence', () => {
  beforeEach(() => {
    getRecordMock.mockReset()
    putRecordMock.mockReset()
  })

  it('carrega upgrades persistidos', async () => {
    getRecordMock.mockResolvedValue({
      id: 'owned-upgrades',
      upgrades: ['upgrade-speed']
    })

    const upgrades = await getPersistedUpgrades()
    expect(upgrades).toEqual(['upgrade-speed'])
  })

  it('persiste upgrades comprados', async () => {
    putRecordMock.mockResolvedValue(undefined)

    await savePersistedUpgrades(['upgrade-speed', 'upgrade-fire-rate'])

    expect(putRecordMock).toHaveBeenCalledTimes(1)
    expect(putRecordMock.mock.calls[0][0]).toBe('upgrades')
    expect(putRecordMock.mock.calls[0][1].upgrades).toEqual(['upgrade-speed', 'upgrade-fire-rate'])
  })
})
