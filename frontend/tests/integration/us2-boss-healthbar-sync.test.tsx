import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GameOverlay } from '../../src/components/GameOverlay'

describe('US2 boss healthbar sync', () => {
  it('exibe HP do boss quando encontro esta ativo', () => {
    render(
      <GameOverlay
        status="running"
        activePowerUps={[]}
        bossHealth={12}
        bossMaxHealth={20}
        onPrimaryAction={() => {}}
      />
    )

    expect(screen.getByText('Boss HP: 12/20')).toBeInTheDocument()
  })
})
