import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameOverlay } from '../../src/components/GameOverlay'

describe('US2 boss outcome feedback', () => {
  it('mostra estado contextual de derrota no encounter', () => {
    render(
      <GameOverlay
        status="game-over"
        activePowerUps={[]}
        onPrimaryAction={() => {}}
      />
    )

    expect(screen.getByRole('heading', { name: 'Game Over' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Reiniciar' })).toBeInTheDocument()
  })

  it('mostra estado contextual de vitoria no encounter', () => {
    render(
      <GameOverlay
        status="shop"
        activePowerUps={[]}
        showCompletion
        onPrimaryAction={() => {}}
        onContinueStage={() => {}}
      />
    )

    expect(screen.getByRole('heading', { name: 'FASE COMPLETADA' })).toBeInTheDocument()
    expect(screen.getByText('Recompensa aplicada. Voce desbloqueou a proxima fase da campanha.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Proxima fase' })).toBeInTheDocument()
  })
})
