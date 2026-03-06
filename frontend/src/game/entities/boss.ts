import { getStageConfig } from '../config/stages'
import { BOSS_HORIZONTAL_SPEED, getCycleDifficultyMultiplier } from '../config/gameplay'

export type BossAttackPatternId = 'burst-3' | 'line-5' | 'targeted-2'

export type BossEntity = {
  id: string
  stage: number
  x: number
  y: number
  width: number
  height: number
  health: number
  maxHealth: number
  points: number
  attackCooldownSeconds: number
  attackTimer: number
  patternIds: BossAttackPatternId[]
  patternCursor: number
  velocityX: number
}

export function createBossForStage(stage: number): BossEntity {
  const stageConfig = getStageConfig(stage)

  return {
    id: `boss-stage-${stage}`,
    stage,
    x: 340,
    y: 54,
    width: 110,
    height: 60,
    health: stageConfig.bossHealth,
    maxHealth: stageConfig.bossHealth,
    points: stageConfig.bossPoints,
    attackCooldownSeconds: stageConfig.bossAttackIntervalSeconds,
    attackTimer: stageConfig.bossAttackIntervalSeconds,
    patternIds: [...stageConfig.bossPatternIds],
    patternCursor: 0,
    velocityX: BOSS_HORIZONTAL_SPEED * getCycleDifficultyMultiplier(stage)
  }
}

export function tickBossAttackTimer(boss: BossEntity, deltaSeconds: number): BossEntity {
  return {
    ...boss,
    attackTimer: Math.max(0, boss.attackTimer - deltaSeconds)
  }
}

export function canBossAttack(boss: BossEntity): boolean {
  return boss.attackTimer <= 0
}

export function consumeBossAttack(boss: BossEntity): BossEntity {
  const nextCursor = (boss.patternCursor + 1) % boss.patternIds.length
  return {
    ...boss,
    attackTimer: boss.attackCooldownSeconds,
    patternCursor: nextCursor
  }
}

export function getCurrentBossPatternId(boss: BossEntity): BossAttackPatternId {
  return boss.patternIds[boss.patternCursor] ?? 'burst-3'
}
