import { describe, expect, it, vi } from 'vitest'

const { putRecordMock } = vi.hoisted(() => ({
  putRecordMock: vi.fn()
}))

vi.mock('../../src/lib/indexedDb', () => ({
  putRecord: putRecordMock
}))

import { logTelemetryEvent, setTelemetryConsent } from '../../src/lib/telemetry'

describe('US3 telemetry consent', () => {
  it('bloqueia log sem consentimento explícito', async () => {
    setTelemetryConsent(false)
    const result = await logTelemetryEvent('game_start')

    expect(result).toBe(false)
    expect(putRecordMock).not.toHaveBeenCalled()
  })

  it('permite log quando consentimento está ativo', async () => {
    putRecordMock.mockResolvedValue(undefined)
    setTelemetryConsent(true)

    const result = await logTelemetryEvent('game_over', { score: 100 })

    expect(result).toBe(true)
    expect(putRecordMock).toHaveBeenCalledTimes(1)
  })
})
