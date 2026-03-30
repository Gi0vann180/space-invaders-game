import { describe, expect, it } from 'vitest'
import { getBossProfileForStage } from '../../src/game/config/bossProfiles'
import { isBossStage } from '../../src/game/config/gameplay'
import { evaluateStageProgression } from '../../src/game/systems/progressionSystem'
import { createBossForStage } from '../../src/game/entities/boss'

describe('US2 campaign boss contract', () => {
  it('mantem boss obrigatorio em todas as fases da campanha 1..5 e preserva legado apos isso', () => {
    expect([1, 2, 3, 4, 5].every((stage) => isBossStage(stage))).toBe(true)
    expect(isBossStage(6)).toBe(false)
    expect(isBossStage(10)).toBe(true)
  })

  it('expõe identidades mecânicas distintas por fase da campanha', () => {
    const stageProfiles = [1, 2, 3, 4, 5].map((stage) => getBossProfileForStage(stage))

    expect(new Set(stageProfiles.map((profile) => profile.profileId)).size).toBe(5)
    expect(new Set(stageProfiles.map((profile) => profile.movementModel)).size).toBeGreaterThanOrEqual(4)
    expect(new Set(stageProfiles.map((profile) => profile.feedbackPreset)).size).toBe(5)
  })

  it('materializa o perfil da fase no boss spawnado e mantém tentativa explícita', () => {
    const boss = createBossForStage(3, 2)

    expect(boss.stage).toBe(3)
    expect(boss.attempt).toBe(2)
    expect(boss.profileId).toBe('phase-3-frost-lancer')
    expect(boss.displayName).toBe('Frost Lancer')
    expect(boss.patternIds).toEqual(getBossProfileForStage(3, 2).attackPatternSequence)
  })

  it('entra em boss na campanha curta e só abre loja após resultado explícito', () => {
    const waitingForBoss = evaluateStageProgression(4, 0, false, false)
    const activeEncounter = evaluateStageProgression(4, 0, true, false)
    const resolvedEncounter = evaluateStageProgression(4, 0, true, true)

    expect(waitingForBoss).toMatchObject({
      enterBossFight: true,
      enterShop: false,
      nextStage: 4
    })
    expect(activeEncounter).toMatchObject({
      enterBossFight: false,
      enterShop: false,
      nextStage: 4
    })
    expect(resolvedEncounter).toMatchObject({
      enterBossFight: false,
      enterShop: true,
      nextStage: 5
    })
  })
})
