import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameOverlay } from '../../src/components/GameOverlay'

describe('US2 boss outcome feedback', () => {
  it('mostra estado contextual de derrota no encounter', () => {
    render(
      <GameOverlay
        status="game-over"
        activePowerUps={[]}
        bossEncounter={{
          active: false,
          lifecycle: 'defeat',
          bossId: 'boss-stage-2',
          profile: {
            profileId: 'phase-2-volt-weaver',
            displayName: 'Volt Weaver',
            movementModel: 'zigzag',
            feedbackPreset: 'volt',
            telegraphMs: 1350,
            patternIds: ['line-5', 'burst-3', 'targeted-2']
          },
          stage: 2,
          attempt: 2,
          startedAtMs: 100,
          endedAtMs: 200,
          outcome: 'defeat',
          damageTaken: 3,
          health: 0,
          maxHealth: 24
        }}
        onPrimaryAction={() => {}}
      />
    )

    expect(screen.getByRole('heading', { name: 'Game Over' })).toBeInTheDocument()
    expect(screen.getByText('Derrota contra Volt Weaver na tentativa 2.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reiniciar' })).toBeInTheDocument()
  })

  it('mostra estado contextual de vitoria no encounter', () => {
    render(
      <GameOverlay
        status="shop"
        activePowerUps={[]}
        bossEncounter={{
          active: false,
          lifecycle: 'victory',
          bossId: 'boss-stage-3',
          profile: {
            profileId: 'phase-3-frost-lancer',
            displayName: 'Frost Lancer',
            movementModel: 'sweep',
            feedbackPreset: 'frost',
            telegraphMs: 1250,
            patternIds: ['targeted-2', 'line-5', 'burst-3']
          },
          stage: 3,
          attempt: 1,
          startedAtMs: 100,
          endedAtMs: 300,
          outcome: 'victory',
          damageTaken: 1,
          health: 0,
          maxHealth: 32
        }}
        showCompletion
        onPrimaryAction={() => {}}
        onContinueStage={() => {}}
      />
    )

    expect(screen.getByRole('heading', { name: 'FASE COMPLETADA' })).toBeInTheDocument()
    expect(screen.getByText('Boss derrotado: Frost Lancer.')).toBeInTheDocument()
    expect(screen.getByText('Recompensa aplicada. Voce desbloqueou a proxima fase da campanha.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Proxima fase' })).toBeInTheDocument()
  })
})
