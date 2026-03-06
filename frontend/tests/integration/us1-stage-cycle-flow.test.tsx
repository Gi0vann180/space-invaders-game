import { describe, expect, it } from 'vitest'
import { evaluateStageProgression } from '../../src/game/systems/progressionSystem'

describe('US1 stage cycle flow', () => {
  it('fase normal conclui sem boss e vai para loja', () => {
    const stage9 = evaluateStageProgression(9, 0, false, false)

    expect(stage9.enterBossFight).toBe(false)
    expect(stage9.enterShop).toBe(true)
    expect(stage9.nextStage).toBe(10)
  })

  it('fase 10 entra em boss fight antes de concluir', () => {
    const stage10BeforeBoss = evaluateStageProgression(10, 0, false, false)

    expect(stage10BeforeBoss.enterBossFight).toBe(true)
    expect(stage10BeforeBoss.enterShop).toBe(false)

    const stage10AfterBoss = evaluateStageProgression(10, 0, true, true)
    expect(stage10AfterBoss.enterShop).toBe(true)
    expect(stage10AfterBoss.nextStage).toBe(11)
  })
})
