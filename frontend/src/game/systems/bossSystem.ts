import { createBossForStage, tickBossAttackTimer, type BossEntity } from '../entities/boss'
import type { WaveState } from './waveSystem'

export function spawnBossForWave(wave: WaveState): WaveState {
  if (wave.boss || wave.enemies.length > 0) {
    return wave
  }

  return {
    ...wave,
    boss: createBossForStage(wave.stage)
  }
}

export function tickBoss(wave: WaveState, deltaSeconds: number, canvasWidth: number): WaveState {
  if (!wave.boss) {
    return wave
  }

  const movedBoss = {
    ...wave.boss,
    x: wave.boss.x + wave.boss.velocityX * deltaSeconds
  }

  const clampedX = Math.max(0, Math.min(canvasWidth - movedBoss.width, movedBoss.x))
  const hitBorder = clampedX !== movedBoss.x
  const bouncedBoss = {
    ...movedBoss,
    x: clampedX,
    velocityX: hitBorder ? movedBoss.velocityX * -1 : movedBoss.velocityX
  }

  return {
    ...wave,
    boss: tickBossAttackTimer(bouncedBoss, deltaSeconds)
  }
}

export function applyBossDamage(boss: BossEntity, damage: number): BossEntity {
  const nextHealth = Math.max(0, boss.health - damage)
  return {
    ...boss,
    health: nextHealth
  }
}

export function isBossDefeated(wave: WaveState): boolean {
  return Boolean(wave.boss && wave.boss.health <= 0)
}
