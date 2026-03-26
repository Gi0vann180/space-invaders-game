import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { evaluateStageProgression } from '../../src/game/systems/progressionSystem'
import { spawnBossForWave } from '../../src/game/systems/bossSystem'
import { resolveBossProjectileCollisions } from '../../src/game/systems/collisionSystem'
import { createBossForStage } from '../../src/game/entities/boss'
import { CampaignMap } from '../../src/components/CampaignMap'
import { GameOverlay } from '../../src/components/GameOverlay'
import type { WaveState } from '../../src/game/systems/waveSystem'

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
  resolveInterruptedRunSnapshot,
  savePersistedProgressProfile
} from '../../src/services/shopPersistenceService'

describe('US1 boss stage flow', () => {
  beforeEach(() => {
    getRecordMock.mockReset()
    putRecordMock.mockReset()
  })

  it('entra em boss fight ao limpar inimigos e avanca para loja apos derrotar chefe', () => {
    const beforeBoss = evaluateStageProgression(10, 0, false, false)
    expect(beforeBoss.enterBossFight).toBe(true)
    expect(beforeBoss.enterShop).toBe(false)

    const waveWithEnemiesCleared: WaveState = {
      stage: 10,
      enemies: [],
      boss: null,
      direction: 1
    }

    const withBoss = spawnBossForWave(waveWithEnemiesCleared)
    expect(withBoss.boss).not.toBeNull()

    const boss = {
      ...createBossForStage(10),
      x: 100,
      y: 100,
      width: 50,
      height: 40,
      health: 1,
      maxHealth: 1
    }

    const hit = resolveBossProjectileCollisions(boss, [
      {
        id: 'player-shot',
        origin: 'player',
        kind: 'default',
        x: 110,
        y: 110,
        width: 4,
        height: 12,
        speedY: -400,
        speedX: 0
      }
    ])

    expect(hit.bossDefeated).toBe(true)

    const afterBoss = evaluateStageProgression(10, 0, true, hit.bossDefeated)
    expect(afterBoss.enterShop).toBe(true)
    expect(afterBoss.nextStage).toBe(11)
  })

  it('migra perfil legado com defaults seguros para novos campos de campanha', async () => {
    getRecordMock.mockResolvedValue({
      id: 'player-progress',
      highestUnlockedStage: 3,
      totalRuns: 8,
      updatedAt: '2026-01-01T10:00:00.000Z'
    })

    const profile = await getPersistedProgressProfile()

    expect(profile.highestUnlockedStage).toBe(3)
    expect(profile.totalRuns).toBe(8)
    expect(profile.lastAttemptedStage).toBeNull()
    expect(profile.lastCompletedStage).toBeNull()
    expect(profile.interruptedRun).toBeNull()
  })

  it('persiste sequencia de checkpoints (inicio, pausa e conclusao) sem dependencia de rede', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    await savePersistedProgressProfile({
      highestUnlockedStage: 3,
      totalRuns: 9,
      lastAttemptedStage: 3,
      lastCompletedStage: 2,
      interruptedRun: null
    })

    await savePersistedProgressProfile({
      highestUnlockedStage: 3,
      totalRuns: 9,
      lastAttemptedStage: 3,
      lastCompletedStage: 2,
      interruptedRun: {
        stage: 3,
        atStatus: 'paused',
        savedAt: '2026-03-24T18:00:00.000Z'
      }
    })

    await savePersistedProgressProfile({
      highestUnlockedStage: 4,
      totalRuns: 9,
      lastAttemptedStage: 3,
      lastCompletedStage: 3,
      interruptedRun: null
    })

    expect(putRecordMock).toHaveBeenCalledTimes(3)

    const lastCall = putRecordMock.mock.calls[2]?.[1]
    expect(lastCall.highestUnlockedStage).toBe(4)
    expect(lastCall.lastAttemptedStage).toBe(3)
    expect(lastCall.lastCompletedStage).toBe(3)
    expect(lastCall.interruptedRun).toBeNull()
    expect(fetchSpy).not.toHaveBeenCalled()

    vi.unstubAllGlobals()
  })

  it('retorna fallback seguro quando interrupted payload e invalido', () => {
    const invalid = resolveInterruptedRunSnapshot({ stage: 0, atStatus: 'invalid', savedAt: '' }, 2)
    expect(invalid).toBeNull()

    const valid = resolveInterruptedRunSnapshot(
      {
        stage: 2,
        atStatus: 'paused',
        savedAt: '2026-03-24T18:10:00.000Z'
      },
      1
    )

    expect(valid).not.toBeNull()
    expect(valid?.stage).toBe(2)
    expect(valid?.atStatus).toBe('paused')
  })

  it('renderiza mapa da campanha com estados locked, unlocked e completed', () => {
    const onSelectStage = vi.fn()

    render(
      <CampaignMap
        highestUnlockedStage={3}
        currentStage={2}
        completedStages={[1, 2]}
        onSelectStage={onSelectStage}
      />
    )

    expect(screen.getByText('Fase 1')).toBeInTheDocument()
    expect(screen.getByText('Fase 5')).toBeInTheDocument()
    expect(screen.getAllByText('Derrote o chefe da fase anterior para desbloquear').length).toBeGreaterThan(0)

    const stageThreeButton = screen.getByRole('button', { name: /Fase 3/i })
    fireEvent.click(stageThreeButton)
    expect(onSelectStage).toHaveBeenCalledWith(3)
  })

  it('mostra copy de fase completada e prompt de run interrompida com acoes', () => {
    const onPrimary = vi.fn()
    const onContinueStage = vi.fn()
    const onResume = vi.fn()
    const onRestart = vi.fn()

    const { rerender } = render(
      <GameOverlay
        status="running"
        showCompletion={true}
        onPrimaryAction={onPrimary}
        onContinueStage={onContinueStage}
      />
    )

    expect(screen.getByRole('heading', { name: 'FASE COMPLETADA' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Proxima fase' })).toBeInTheDocument()

    rerender(
      <GameOverlay
        status="idle"
        showInterruptedRunPrompt={true}
        onPrimaryAction={onPrimary}
        onResumeInterruptedRun={onResume}
        onRestartInterruptedRun={onRestart}
      />
    )

    expect(screen.getByRole('heading', { name: 'Run interrompida encontrada' })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Continuar' }))
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }))
    expect(onResume).toHaveBeenCalledTimes(1)
    expect(onRestart).toHaveBeenCalledTimes(1)
  })

  it('replay de fase concluida nao reduz progressao desbloqueada', async () => {
    await savePersistedProgressProfile({
      highestUnlockedStage: 4,
      totalRuns: 10,
      lastAttemptedStage: 2,
      lastCompletedStage: 3,
      interruptedRun: null
    })

    await savePersistedProgressProfile({
      highestUnlockedStage: 4,
      totalRuns: 11,
      lastAttemptedStage: 1,
      lastCompletedStage: 3,
      interruptedRun: null
    })

    const latest = putRecordMock.mock.calls[putRecordMock.mock.calls.length - 1]?.[1]
    expect(latest.highestUnlockedStage).toBe(4)
    expect(latest.lastCompletedStage).toBe(3)
  })
})

