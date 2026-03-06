import { describe, expect, it } from 'vitest'
import { EMPTY_UPGRADE_LEVELS, MAX_UPGRADE_LEVEL } from '../../src/services/shopService'
import { generateRunModifierOffer } from '../../src/game/systems/runModifierSystem'

describe('US3 roguelike offer generation', () => {
  it('gera no mínimo duas opções e garante ao menos uma aplicável', () => {
    const offer = generateRunModifierOffer({
      runId: 'run-1',
      stageNumber: 2,
      runSeed: 'seed-a',
      upgradeLevels: { ...EMPTY_UPGRADE_LEVELS }
    })

    expect(offer.options.length).toBeGreaterThanOrEqual(2)
    expect(offer.options.some((option) => option.applicable)).toBe(true)
    expect(offer.guaranteedApplicableOption).toBe(true)
  })

  it('varia combinações entre seeds distintas mantendo aplicabilidade', () => {
    const maxed = {
      ...EMPTY_UPGRADE_LEVELS,
      'upgrade-fire-rate': MAX_UPGRADE_LEVEL,
      'upgrade-speed': MAX_UPGRADE_LEVEL,
      'upgrade-shield': MAX_UPGRADE_LEVEL - 1
    }

    const offerA = generateRunModifierOffer({
      runId: 'run-a',
      stageNumber: 3,
      runSeed: 'seed-001',
      upgradeLevels: maxed
    })
    const offerB = generateRunModifierOffer({
      runId: 'run-b',
      stageNumber: 3,
      runSeed: 'seed-777',
      upgradeLevels: maxed
    })

    expect(offerA.options.map((item) => item.modifierId).join(',')).not.toBe(
      offerB.options.map((item) => item.modifierId).join(',')
    )
    expect(offerA.options.some((option) => option.applicable)).toBe(true)
    expect(offerB.options.some((option) => option.applicable)).toBe(true)
  })
})
