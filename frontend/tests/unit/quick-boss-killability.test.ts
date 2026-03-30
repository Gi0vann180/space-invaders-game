import { describe, expect, it } from 'vitest'
import { createBossForStage } from '../../src/game/entities/boss'
import { createHomingMissileProjectile, createLaserProjectile, createPlayerProjectile } from '../../src/game/entities/projectile'
import { resolveBossProjectileCollisions } from '../../src/game/systems/collisionSystem'

describe('boss killability', () => {
  it('fortalece o boss da fase 1 para nao morrer instantaneamente no early game', () => {
    const boss = createBossForStage(1)

    expect(boss.maxHealth).toBeGreaterThanOrEqual(18)
  })

  it('mantem tiros especiais fortes, mas sem derreter o boss em um piscar de olhos', () => {
    const baseBoss = {
      ...createBossForStage(1),
      x: 100,
      y: 100,
      width: 60,
      height: 40,
      health: 18,
      maxHealth: 18
    }

    const defaultHit = resolveBossProjectileCollisions(baseBoss, [createPlayerProjectile(110, 110)])
    const homingHit = resolveBossProjectileCollisions(baseBoss, [createHomingMissileProjectile(110, 110)])
    const laserHit = resolveBossProjectileCollisions(baseBoss, [createLaserProjectile(110, 110)])

    expect(defaultHit.boss?.health).toBe(16)
    expect(homingHit.boss?.health).toBe(15)
    expect(laserHit.boss?.health).toBe(15)
  })

  it('detecta acerto no boss mesmo com projétil rápido cruzando o hitbox entre frames', () => {
    const boss = {
      ...createBossForStage(1),
      x: 120,
      y: 120,
      width: 70,
      height: 50,
      health: 18,
      maxHealth: 18
    }

    const fastShot = {
      ...createPlayerProjectile(140, 175),
      y: 115,
      speedY: -480
    }

    const result = resolveBossProjectileCollisions(boss, [fastShot], 1 / 60)

    expect(result.boss?.health).toBe(16)
    expect(result.projectiles).toHaveLength(0)
  })
})
