import { beforeEach, describe, expect, it, vi } from 'vitest'

const { logTelemetryEventMock } = vi.hoisted(() => ({
  logTelemetryEventMock: vi.fn()
}))

vi.mock('../../src/lib/telemetry', () => ({
  logTelemetryEvent: logTelemetryEventMock
}))

import {
  emitBossEncounterStarted,
  emitBossPlayerDefeated,
  emitBossPlayerVictory,
  resetBossTelemetryDedupe
} from '../../src/game/systems/bossEncounterTelemetry'

describe('US2 boss encounter telemetry', () => {
  beforeEach(() => {
    logTelemetryEventMock.mockReset()
    logTelemetryEventMock.mockResolvedValue(true)
    resetBossTelemetryDedupe()
  })

  it('emite boss_encounter_started com payload minimo', async () => {
    await emitBossEncounterStarted({
      stage: 2,
      bossId: 'boss-stage-2',
      attempt: 1,
      bossHealthMax: 22
    })

    expect(logTelemetryEventMock).toHaveBeenCalledWith(
      'boss_encounter_started',
      expect.objectContaining({
        stage: 2,
        bossId: 'boss-stage-2',
        attempt: 1,
        bossHealthMax: 22
      })
    )
  })

  it('deduplica emissao de derrota por tentativa', async () => {
    await emitBossPlayerDefeated({
      stage: 3,
      bossId: 'boss-stage-3',
      attempt: 2,
      bossHealthMax: 29
    })
    await emitBossPlayerDefeated({
      stage: 3,
      bossId: 'boss-stage-3',
      attempt: 2,
      bossHealthMax: 29
    })

    expect(logTelemetryEventMock).toHaveBeenCalledTimes(1)
  })

  it('deduplica emissao de vitoria por tentativa', async () => {
    await emitBossPlayerVictory({
      stage: 4,
      bossId: 'boss-stage-4',
      attempt: 3,
      bossHealthMax: 37
    })
    await emitBossPlayerVictory({
      stage: 4,
      bossId: 'boss-stage-4',
      attempt: 3,
      bossHealthMax: 37
    })

    expect(logTelemetryEventMock).toHaveBeenCalledTimes(1)
  })
})
