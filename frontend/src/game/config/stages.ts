import type { BossAttackPatternId } from '../entities/boss'
import { getCycleDifficultyMultiplier } from './gameplay'

export type StageConfig = {
  stage: number
  enemySpeedMultiplier: number
  enemyRows: number
  enemyFireIntervalSeconds: number
  enemyProjectileSpeed: number
  maxConcurrentEnemyProjectiles: number
  bossHealth: number
  bossAttackIntervalSeconds: number
  bossPatternIds: BossAttackPatternId[]
  bossPoints: number
}

export const STAGES: StageConfig[] = [
  {
    stage: 1,
    enemySpeedMultiplier: 1,
    enemyRows: 2,
    enemyFireIntervalSeconds: 1.8,
    enemyProjectileSpeed: 220,
    maxConcurrentEnemyProjectiles: 3,
    bossHealth: 16,
    bossAttackIntervalSeconds: 1.2,
    bossPatternIds: ['burst-3', 'targeted-2'],
    bossPoints: 240
  },
  {
    stage: 2,
    enemySpeedMultiplier: 1.15,
    enemyRows: 3,
    enemyFireIntervalSeconds: 1.55,
    enemyProjectileSpeed: 250,
    maxConcurrentEnemyProjectiles: 4,
    bossHealth: 24,
    bossAttackIntervalSeconds: 1.05,
    bossPatternIds: ['line-5', 'burst-3'],
    bossPoints: 320
  },
  {
    stage: 3,
    enemySpeedMultiplier: 1.3,
    enemyRows: 3,
    enemyFireIntervalSeconds: 1.3,
    enemyProjectileSpeed: 285,
    maxConcurrentEnemyProjectiles: 5,
    bossHealth: 30,
    bossAttackIntervalSeconds: 0.95,
    bossPatternIds: ['targeted-2', 'line-5', 'burst-3'],
    bossPoints: 420
  },
  {
    stage: 4,
    enemySpeedMultiplier: 1.45,
    enemyRows: 4,
    enemyFireIntervalSeconds: 1.1,
    enemyProjectileSpeed: 320,
    maxConcurrentEnemyProjectiles: 6,
    bossHealth: 38,
    bossAttackIntervalSeconds: 0.85,
    bossPatternIds: ['line-5', 'targeted-2', 'burst-3'],
    bossPoints: 520
  }
]

export function getStageConfig(stage: number): StageConfig {
  const staticConfig = STAGES.find((item) => item.stage === stage)
  if (staticConfig) {
    return staticConfig
  }

  const last = STAGES[STAGES.length - 1]
  const extraStages = Math.max(0, stage - last.stage)

  const cycleMultiplier = getCycleDifficultyMultiplier(stage)

  return {
    stage,
    enemyRows: Math.min(5, last.enemyRows + Math.floor(extraStages / 2) + Math.floor(cycleMultiplier - 1)),
    enemySpeedMultiplier: (last.enemySpeedMultiplier + extraStages * 0.08) * cycleMultiplier,
    enemyFireIntervalSeconds: Math.max(0.4, (last.enemyFireIntervalSeconds - extraStages * 0.08) / cycleMultiplier),
    enemyProjectileSpeed: (last.enemyProjectileSpeed + extraStages * 18) * cycleMultiplier,
    maxConcurrentEnemyProjectiles: Math.min(14, last.maxConcurrentEnemyProjectiles + Math.floor(extraStages / 2) + 1 + Math.floor(cycleMultiplier - 1)),
    bossHealth: Math.round((last.bossHealth + extraStages * 8) * cycleMultiplier),
    bossAttackIntervalSeconds: Math.max(0.45, (last.bossAttackIntervalSeconds - extraStages * 0.04) / cycleMultiplier),
    bossPatternIds: ['line-5', 'targeted-2', 'burst-3'],
    bossPoints: Math.round((last.bossPoints + extraStages * 120) * cycleMultiplier)
  }
}
