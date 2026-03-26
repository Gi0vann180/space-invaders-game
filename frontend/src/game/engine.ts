import { saveLocalHighscore } from '../services/highscoreService'
import { logTelemetryEvent } from '../lib/telemetry'
import {
  getPersistedProgressProfile,
  savePersistedProgressProfile
} from '../services/shopPersistenceService'
import type { UpgradeLevels } from '../services/shopService'
import { getCycleIndex, isBossStage } from './config/gameplay'
import { createEnemyGrid } from './entities/enemy'
import { clampActiveDropsByStage } from './config/performance'
import type { RareDropEntity } from './entities/dropItem'
import { createPlayer, movePlayer, tickPlayer, tryConsumeShot, type PlayerEntity } from './entities/player'
import {
  createHomingMissileProjectile,
  createLaserProjectile,
  createPlayerProjectile,
  steerHomingProjectiles,
  stepProjectiles,
  type ProjectileEntity
} from './entities/projectile'
import { createInputManager } from './input/inputManager'
import { createGameLoop, type GameLoopController } from './loop'
import { gameStore } from '../state/gameStore'
import {
  checkEnemyReachedPlayerLine,
  resolveBossProjectileCollisions,
  resolvePlayerDropCollisions,
  resolveEnemyProjectileHitsPlayer,
  resolvePlayerProjectileCollisions
} from './systems/collisionSystem'
import { emitBossProjectiles } from './systems/bossAttackSystem'
import { spawnBossForWave, tickBoss } from './systems/bossSystem'
import { removeExpiredDrops, resolveCollectedSpecialShot, stepDrops } from './systems/dropSystem'
import { createShopRunModifierOffer, evaluateStageProgression } from './systems/progressionSystem'
import { addOrRefreshPowerUp, getActiveWeaponPowerUp, removeExpiredPowerUps } from './systems/powerUpSystem'
import { updateScoreAndLives } from './systems/scoreLivesSystem'
import { applyPlayerUpgrades } from './systems/upgradeSystem'
import {
  applyWaveEnemies,
  createDropsFromDefeatedEnemies,
  createInitialWave,
  emitEnemyProjectiles,
  stepEnemies,
  type WaveState
} from './systems/waveSystem'

let context: CanvasRenderingContext2D | null = null
let loopController: GameLoopController | null = null
const inputManager = createInputManager()
let player: PlayerEntity | null = null
let wave: WaveState = createInitialWave()
let projectiles: ProjectileEntity[] = []
let activeDrops: RareDropEntity[] = []
let pendingStage: number | null = null
let currentRunId = 'run-0'
let currentRunSeed = 'seed-0'

function syncStore(): void {
  const state = gameStore.getState()
  gameStore.setState({
    score: state.score,
    lives: state.lives,
    stage: wave.stage,
    bossEncounter: {
      active: Boolean(wave.boss),
      bossId: wave.boss?.id ?? null,
      health: wave.boss?.health ?? 0,
      maxHealth: wave.boss?.maxHealth ?? 0
    },
    activeDrops: activeDrops.map((drop) => ({
      id: drop.id,
      x: drop.x,
      y: drop.y,
      width: drop.width,
      height: drop.height,
      grantedShotType: drop.grantedShotType,
      expiresAtMs: drop.expiresAtMs
    })),
    input: inputManager.readInput()
  })
}

function resetRoundState(canvas: HTMLCanvasElement): void {
  player = createPlayer(canvas.width, canvas.height)
  wave = createInitialWave()
  projectiles = []
  activeDrops = []
  pendingStage = null
  currentRunId = 'run-0'
  currentRunSeed = 'seed-0'
}

function update(deltaSeconds: number): void {
  if (!context || !player) {
    return
  }

  const state = gameStore.getState()
  if (state.status !== 'running') {
    return
  }

  const input = inputManager.readInput()
  const nowMs = Date.now()
  if (input.pause) {
    pauseGame()
    return
  }

  let activePowerUps = removeExpiredPowerUps(state.activePowerUps, nowMs)
  activeDrops = removeExpiredDrops(activeDrops, nowMs)
  activeDrops = stepDrops(activeDrops, deltaSeconds, context.canvas.height)

  player = tickPlayer(player, deltaSeconds)
  player = movePlayer(player, input.horizontal, deltaSeconds, context.canvas.width)

  if (input.fire) {
    const [nextPlayer, shouldShoot] = tryConsumeShot(player)
    player = nextPlayer

    if (shouldShoot) {
      const weaponPowerUp = getActiveWeaponPowerUp(activePowerUps)
      if (weaponPowerUp === 'laser') {
        projectiles.push(createLaserProjectile(player.x + player.width / 2 - 4, player.y - 12))
      } else if (weaponPowerUp === 'homing-missile') {
        projectiles.push(createHomingMissileProjectile(player.x + player.width / 2 - 3, player.y - 12))
      } else {
        projectiles.push(createPlayerProjectile(player.x + player.width / 2 - 2, player.y - 10))
      }
    }
  }

  const targetX = wave.boss ? wave.boss.x + wave.boss.width / 2 : wave.enemies[0]?.x ?? null
  projectiles = steerHomingProjectiles(projectiles, targetX, deltaSeconds)
  wave = stepEnemies(wave, deltaSeconds, context.canvas.width)
  wave = tickBoss(wave, deltaSeconds, context.canvas.width)
  projectiles = stepProjectiles(projectiles, deltaSeconds, context.canvas.height)

  const enemyShotsUpdate = emitEnemyProjectiles(wave, projectiles, player.x + player.width / 2)
  wave = enemyShotsUpdate.wave
  projectiles = enemyShotsUpdate.projectiles

  const bossShotResult = emitBossProjectiles(wave, projectiles, player.x + player.width / 2)
  wave = bossShotResult.wave
  projectiles = bossShotResult.projectiles

  const collisionResult = resolvePlayerProjectileCollisions(wave.enemies, projectiles)
  if (collisionResult.defeatedEnemies.length > 0) {
    const spawnedDrops = createDropsFromDefeatedEnemies(collisionResult.defeatedEnemies, nowMs)

    if (spawnedDrops.length > 0) {
      const merged = [...activeDrops, ...spawnedDrops]
      const allowedCount = clampActiveDropsByStage(wave.stage, merged.length)
      activeDrops = merged.slice(-allowedCount)
    }
  }
  wave = applyWaveEnemies(wave, collisionResult.enemies)
  projectiles = collisionResult.projectiles

  const bossBeforeCollision = wave.boss
  const bossCollisionResult = resolveBossProjectileCollisions(wave.boss, projectiles)
  wave = {
    ...wave,
    boss: bossCollisionResult.boss
  }
  projectiles = bossCollisionResult.projectiles

  const playerHitResult = resolveEnemyProjectileHitsPlayer(player, projectiles, deltaSeconds, false)
  projectiles = playerHitResult.projectiles

  const dropCollision = resolvePlayerDropCollisions(player, activeDrops)
  activeDrops = dropCollision.drops
  if (dropCollision.collectedShots.length > 0) {
    for (const shotType of dropCollision.collectedShots) {
      const currentWeapon = getActiveWeaponPowerUp(activePowerUps)
      const resolvedShot = resolveCollectedSpecialShot(shotType, currentWeapon)
      activePowerUps = addOrRefreshPowerUp(activePowerUps, resolvedShot, nowMs)
    }
  }

  const progression = evaluateStageProgression(
    wave.stage,
    wave.enemies.length,
    Boolean(wave.boss),
    bossCollisionResult.bossDefeated
  )

  if (progression.enterBossFight) {
    wave = spawnBossForWave(wave)
    gameStore.setState({
      bossEncounter: {
        active: Boolean(wave.boss),
        bossId: wave.boss?.id ?? null,
        health: wave.boss?.health ?? 0,
        maxHealth: wave.boss?.maxHealth ?? 0
      }
    })
    return
  }

  if (progression.enterShop) {
    pendingStage = progression.nextStage

    const bossPoints = bossCollisionResult.bossDefeated ? (bossBeforeCollision?.points ?? 0) : 0
    const nextScore = state.score + bossPoints
    const highScoreWithBoss = Math.max(state.highScore, nextScore)

    void getPersistedProgressProfile().then((profile) => {
      void savePersistedProgressProfile({
        highestUnlockedStage: Math.max(profile.highestUnlockedStage, progression.nextStage),
        totalRuns: profile.totalRuns,
        lastAttemptedStage: profile.lastAttemptedStage,
        lastCompletedStage: Math.max(wave.stage, profile.lastCompletedStage ?? 0),
        interruptedRun: null
      })
    })

    const runModifierOffer = createShopRunModifierOffer({
      runId: currentRunId,
      stageNumber: wave.stage,
      runSeed: currentRunSeed,
      upgradeLevels: state.upgradeLevels
    })

    gameStore.setState({
      status: 'shop',
      score: nextScore,
      lives: state.lives,
      stage: wave.stage,
      highScore: highScoreWithBoss,
      progressionProfile: {
        highestUnlockedStage: Math.max(state.progressionProfile.highestUnlockedStage, progression.nextStage),
        totalRuns: state.progressionProfile.totalRuns,
        lastAttemptedStage: state.progressionProfile.lastAttemptedStage,
        lastCompletedStage: Math.max(wave.stage, state.progressionProfile.lastCompletedStage ?? 0),
        interruptedRun: null
      },
      bossEncounter: {
        active: false,
        bossId: null,
        health: 0,
        maxHealth: 0
      },
      runModifierOffer,
      activePowerUps,
      activeDrops,
      input
    })
    pauseGameLoop()
    return
  }

  const enemyReachedBottom = checkEnemyReachedPlayerLine(wave.enemies, player)
  const scoreLives = updateScoreAndLives({
    score: state.score,
    lives: state.lives,
    defeatedEnemyCount: collisionResult.defeatedEnemyCount,
    enemyReachedBottom,
    playerHitCount: playerHitResult.playerHitCount,
    bonusScore: bossCollisionResult.bossDefeated ? (bossBeforeCollision?.points ?? 0) : 0
  })

  const highScore = Math.max(state.highScore, scoreLives.score)

  if (scoreLives.isGameOver) {
    gameStore.setState({
      status: 'game-over',
      score: scoreLives.score,
      lives: scoreLives.lives,
      highScore,
      stage: wave.stage,
      bossEncounter: {
        active: Boolean(wave.boss),
        bossId: wave.boss?.id ?? null,
        health: wave.boss?.health ?? 0,
        maxHealth: wave.boss?.maxHealth ?? 0
      },
      activePowerUps,
      activeDrops,
      input
    })

    void saveLocalHighscore(scoreLives.score)
    pauseGameLoop()
    return
  }

  if (enemyReachedBottom) {
    player = createPlayer(context.canvas.width, context.canvas.height)
    wave = {
      ...wave,
      enemies: createEnemyGrid(wave.stage)
    }
    projectiles = []
  }

  gameStore.setState({
    score: scoreLives.score,
    lives: scoreLives.lives,
    highScore,
    stage: wave.stage,
    bossEncounter: {
      active: Boolean(wave.boss),
      bossId: wave.boss?.id ?? null,
      health: wave.boss?.health ?? 0,
      maxHealth: wave.boss?.maxHealth ?? 0
    },
    activePowerUps,
    activeDrops,
    input
  })
}

function render(): void {
  if (!context || !player) {
    return
  }

  const { canvas } = context
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#020617'
  context.fillRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = '#38bdf8'
  context.fillRect(player.x, player.y, player.width, player.height)

  context.fillStyle = '#a3e635'
  for (const enemy of wave.enemies) {
    context.fillRect(enemy.x, enemy.y, enemy.width, enemy.height)
  }

  if (wave.boss) {
    context.fillStyle = '#f97316'
    context.fillRect(wave.boss.x, wave.boss.y, wave.boss.width, wave.boss.height)
  }

  context.fillStyle = '#f8fafc'
  for (const projectile of projectiles) {
    context.fillRect(projectile.x, projectile.y, projectile.width, projectile.height)
  }

  context.fillStyle = '#fbbf24'
  for (const drop of activeDrops) {
    context.fillRect(drop.x, drop.y, drop.width, drop.height)
  }
}

function pauseGameLoop(): void {
  if (!loopController) {
    return
  }

  loopController.pause()
}

function createInterruptedRunPayload(stage: number): { stage: number; atStatus: 'running' | 'paused'; savedAt: string } {
  return {
    stage,
    atStatus: 'paused',
    savedAt: new Date().toISOString()
  }
}

export function startGame(canvas: HTMLCanvasElement): void {
  context = canvas.getContext('2d')
  if (!context) {
    return
  }

  resetRoundState(canvas)
  inputManager.connect(canvas)

  loopController = createGameLoop({
    update,
    render
  })

  loopController.start()
  syncStore()
}

export function stopGame(): void {
  loopController?.stop()
  loopController = null
  inputManager.disconnect()
}

export function startRound(): void {
  if (!context) {
    return
  }

  if (!player) {
    player = createPlayer(context.canvas.width, context.canvas.height)
  }

  const state = gameStore.getState()
  const nextRunOrdinal = Math.max(1, state.progressionProfile.totalRuns + 1)
  currentRunId = `run-${nextRunOrdinal}`
  currentRunSeed = `${nextRunOrdinal}-${Date.now()}-${state.highScore}`

  player = applyPlayerUpgrades(player, state.upgradeLevels)

  gameStore.setState({
    status: 'running'
  })

  void getPersistedProgressProfile().then((profile) => {
    const nextRuns = profile.totalRuns + 1
    const stageCheckpoint = gameStore.getState().stage
    gameStore.setState({
      progressionProfile: {
        highestUnlockedStage: profile.highestUnlockedStage,
        totalRuns: nextRuns,
        lastAttemptedStage: stageCheckpoint,
        lastCompletedStage: profile.lastCompletedStage,
        interruptedRun: null
      }
    })

    void savePersistedProgressProfile({
      highestUnlockedStage: profile.highestUnlockedStage,
      totalRuns: nextRuns,
      lastAttemptedStage: stageCheckpoint,
      lastCompletedStage: profile.lastCompletedStage,
      interruptedRun: null
    })
  })

  loopController?.resume()
}

export function pauseGame(): void {
  const state = gameStore.getState()
  if (state.status !== 'running') {
    return
  }

  const interruptedRun = createInterruptedRunPayload(state.stage)

  gameStore.setState({
    status: 'paused',
    progressionProfile: {
      ...state.progressionProfile,
      interruptedRun
    }
  })

  void getPersistedProgressProfile().then((profile) => {
    void savePersistedProgressProfile({
      highestUnlockedStage: profile.highestUnlockedStage,
      totalRuns: profile.totalRuns,
      lastAttemptedStage: profile.lastAttemptedStage,
      lastCompletedStage: profile.lastCompletedStage,
      interruptedRun
    })
  })

  pauseGameLoop()
}

export function resumeGame(): void {
  if (gameStore.getState().status !== 'paused') {
    return
  }

  gameStore.setState({
    status: 'running'
  })
  loopController?.resume()
}

export function restartRound(): void {
  if (!context) {
    return
  }

  gameStore.reset()
  resetRoundState(context.canvas)
  gameStore.setState({
    status: 'running'
  })
  loopController?.resume()
}

export function continueToNextStage(upgradeLevels: UpgradeLevels): void {
  if (!context || pendingStage === null) {
    return
  }

  wave = {
    stage: pendingStage,
    enemies: createEnemyGrid(pendingStage),
    boss: null,
    direction: 1
  }
  pendingStage = null
  projectiles = []
  activeDrops = []

  if (player) {
    player = applyPlayerUpgrades(player, upgradeLevels)
  }

  void logTelemetryEvent('cycle-stage-advanced', {
    stage: wave.stage,
    cycle: getCycleIndex(wave.stage),
    bossStage: isBossStage(wave.stage)
  })

  gameStore.setState({
    status: 'running',
    stage: wave.stage,
    upgradeLevels,
    runModifierOffer: null,
    activeDrops
  })

  loopController?.resume()
}


