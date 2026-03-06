import type { RareDropEntity } from '../../src/game/entities/dropItem'

export const DROP_TEST_SEEDS = {
  alwaysDrop: 3,
  neverDrop: 91,
  randomWeaponA: 2,
  randomWeaponB: 7
}

export function createDropFixture(partial: Partial<RareDropEntity> = {}): RareDropEntity {
  return {
    id: 'drop-fixture-1',
    x: 120,
    y: 160,
    width: 12,
    height: 12,
    sourceEnemyId: 'enemy-1',
    spawnedAtMs: 1_000,
    expiresAtMs: 9_000,
    grantedShotType: 'laser',
    ...partial
  }
}
