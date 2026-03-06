import { describe, expect, it } from 'vitest'
import { getCycleIndex, isBossStage } from '../../src/game/config/gameplay'

describe('US1 boss phase detection', () => {
  it('marca fase de boss apenas em multiplos de 10', () => {
    expect(isBossStage(9)).toBe(false)
    expect(isBossStage(10)).toBe(true)
    expect(isBossStage(11)).toBe(false)
    expect(isBossStage(20)).toBe(true)
  })

  it('calcula indice de ciclo por faixa de 10 fases', () => {
    expect(getCycleIndex(1)).toBe(0)
    expect(getCycleIndex(10)).toBe(0)
    expect(getCycleIndex(11)).toBe(1)
    expect(getCycleIndex(30)).toBe(2)
  })
})
