export type ProgressionResult = {
  enterShop: boolean
  nextStage: number
}

export function evaluateStageProgression(currentStage: number, enemiesRemaining: number): ProgressionResult {
  if (enemiesRemaining > 0) {
    return {
      enterShop: false,
      nextStage: currentStage
    }
  }

  return {
    enterShop: true,
    nextStage: currentStage + 1
  }
}
