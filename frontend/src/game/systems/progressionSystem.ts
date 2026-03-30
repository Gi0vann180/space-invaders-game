import { getStageConfig, type StageConfig } from '../config/stages'
import { isBossStage } from '../config/gameplay'
import type { UpgradeLevels } from '../../services/shopService'
import { generateRunModifierOffer } from './runModifierSystem'

export type ProgressionResult = {
  enterShop: boolean
  enterBossFight: boolean
  nextStage: number
  nextStageConfig: StageConfig
}

export function evaluateStageProgression(
  currentStage: number,
  enemiesRemaining: number,
  bossActive = false,
  bossDefeated = false
): ProgressionResult {
  if (enemiesRemaining > 0) {
    return {
      enterShop: false,
      enterBossFight: false,
      nextStage: currentStage,
      nextStageConfig: getStageConfig(currentStage)
    }
  }

  const bossStage = isBossStage(currentStage)

  if (!bossStage) {
    const nextStage = currentStage + 1
    return {
      enterShop: true,
      enterBossFight: false,
      nextStage,
      nextStageConfig: getStageConfig(nextStage)
    }
  }

  if (!bossActive) {
    return {
      enterShop: false,
      enterBossFight: true,
      nextStage: currentStage,
      nextStageConfig: getStageConfig(currentStage)
    }
  }

  if (!bossDefeated) {
    return {
      enterShop: false,
      enterBossFight: false,
      nextStage: currentStage,
      nextStageConfig: getStageConfig(currentStage)
    }
  }

  const nextStage = currentStage + 1

  return {
    enterShop: true,
    enterBossFight: false,
    nextStage,
    nextStageConfig: getStageConfig(nextStage)
  }
}

export function createShopRunModifierOffer(input: {
  runId: string
  runSeed: string
  stageNumber: number
  upgradeLevels: UpgradeLevels
}) {
  return generateRunModifierOffer({
    runId: input.runId,
    stageNumber: input.stageNumber,
    runSeed: input.runSeed,
    upgradeLevels: input.upgradeLevels
  })
}

