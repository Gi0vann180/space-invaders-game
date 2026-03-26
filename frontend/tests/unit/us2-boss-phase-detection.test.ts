import { describe, expect, it } from 'vitest'
import { isBossStage } from '../../src/game/config/gameplay'
import { evaluateStageProgression } from '../../src/game/systems/progressionSystem'

describe('US2 boss phase detection', () => {
  it('marca fases 1..5 como boss encounter obrigatorio na campanha', () => {
    expect(isBossStage(1)).toBe(true)
    expect(isBossStage(2)).toBe(true)
    expect(isBossStage(3)).toBe(true)
    expect(isBossStage(4)).toBe(true)
    expect(isBossStage(5)).toBe(true)
  })

  it('entra em boss fight ao limpar inimigos antes da loja', () => {
    const progression = evaluateStageProgression(1, 0, false, false)

    expect(progression.enterBossFight).toBe(true)
    expect(progression.enterShop).toBe(false)
    expect(progression.nextStage).toBe(1)
  })

  it('apos derrotar boss transiciona para shop e proxima fase', () => {
    const progression = evaluateStageProgression(1, 0, true, true)

    expect(progression.enterBossFight).toBe(false)
    expect(progression.enterShop).toBe(true)
    expect(progression.nextStage).toBe(2)
  })
})
