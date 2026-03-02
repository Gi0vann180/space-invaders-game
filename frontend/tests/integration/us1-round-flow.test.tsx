import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useState } from 'react'
import { GameOverlay } from '../../src/components/GameOverlay'
import type { GameStatus } from '../../src/game/types'

function RoundFlowHarness() {
  const [status, setStatus] = useState<GameStatus>('idle')

  return (
    <div>
      <p data-testid="status">{status}</p>
      <button onClick={() => setStatus('game-over')} type="button">
        force-game-over
      </button>
      <GameOverlay
        status={status}
        onPrimaryAction={() => {
          if (status === 'idle') {
            setStatus('running')
            return
          }

          if (status === 'paused') {
            setStatus('running')
            return
          }

          if (status === 'game-over') {
            setStatus('running')
          }
        }}
      />
    </div>
  )
}

describe('US1 round flow', () => {
  it('transita idle -> running -> game-over -> running', () => {
    render(<RoundFlowHarness />)

    fireEvent.click(screen.getByRole('button', { name: 'Iniciar rodada' }))
    expect(screen.getByTestId('status')).toHaveTextContent('running')

    fireEvent.click(screen.getByRole('button', { name: 'force-game-over' }))
    expect(screen.getByRole('heading', { name: 'Game Over' })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar' }))
    expect(screen.getByTestId('status')).toHaveTextContent('running')
  })
})
