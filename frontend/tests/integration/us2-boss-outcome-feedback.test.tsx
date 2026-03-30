import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameOverlay } from '../../src/components/GameOverlay'

describe('US2 boss outcome feedback', () => {
  it('mostra estado contextual de derrota no encounter', () => {
    render(
      <GameOverlay
        status="game-over"
        bossOutcome="defeat"
        activePowerUps={[]}
        onPrimaryAction={() => {}}
      />
    )

    expect(screen.getByText('Derrota no confronto')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Nova tentativa' })).toBeInTheDocument()
  })

  it('mostra estado contextual de vitoria no encounter', () => {
    render(
      <GameOverlay
        status="shop"
        bossOutcome="victory"
        activePowerUps={[]}
        showCompletion
        onPrimaryAction={() => {}}
        onContinueStage={() => {}}
      />
    )

    expect(screen.getByText('Chefe derrotado')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Avancar campanha' })).toBeInTheDocument()
  })
})
