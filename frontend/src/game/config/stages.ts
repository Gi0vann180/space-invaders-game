export type StageConfig = {
  stage: number
  enemySpeedMultiplier: number
  enemyRows: number
}

export const STAGES: StageConfig[] = [
  { stage: 1, enemySpeedMultiplier: 1, enemyRows: 2 },
  { stage: 2, enemySpeedMultiplier: 1.15, enemyRows: 3 },
  { stage: 3, enemySpeedMultiplier: 1.3, enemyRows: 3 },
  { stage: 4, enemySpeedMultiplier: 1.45, enemyRows: 4 }
]

export function getStageConfig(stage: number): StageConfig {
  return STAGES.find((item) => item.stage === stage) ?? STAGES[STAGES.length - 1]
}
