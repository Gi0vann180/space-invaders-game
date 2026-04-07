import { getStageConfig, type StageConfig } from '../config/stages'
import { isBossStage } from '../config/gameplay'

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

  if (bossDefeated) {
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

  // Boss fight in progress
  return {
    enterShop: false,
    enterBossFight: false,
    nextStage: currentStage,
    nextStageConfig: getStageConfig(currentStage)
  }
}


