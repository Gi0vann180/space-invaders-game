import { saveLocalHighscore } from '../services/highscoreService'
import type { ShopItemId } from '../services/shopService'
import { createEnemyGrid } from './entities/enemy'
import { createPlayer, movePlayer, tickPlayer, tryConsumeShot, type PlayerEntity } from './entities/player'
import { createPlayerProjectile, stepProjectiles, type ProjectileEntity } from './entities/projectile'
import { createInputManager } from './input/inputManager'
import { createGameLoop, type GameLoopController } from './loop'
import { gameStore } from '../state/gameStore'
import { checkEnemyReachedPlayerLine, resolvePlayerProjectileCollisions } from './systems/collisionSystem'
import { evaluateStageProgression } from './systems/progressionSystem'
import { updateScoreAndLives } from './systems/scoreLivesSystem'
import { applyPlayerUpgrades, hasShieldUpgrade } from './systems/upgradeSystem'
import { applyWaveEnemies, createInitialWave, stepEnemies, type WaveState } from './systems/waveSystem'

let context: CanvasRenderingContext2D | null = null
let loopController: GameLoopController | null = null
const inputManager = createInputManager()
let player: PlayerEntity | null = null
let wave: WaveState = createInitialWave()
let projectiles: ProjectileEntity[] = []
let pendingStage: number | null = null

function syncStore(): void {
  const state = gameStore.getState()
  gameStore.setState({
    score: state.score,
    lives: state.lives,
    stage: wave.stage,
    input: inputManager.readInput()
  })
}

function resetRoundState(canvas: HTMLCanvasElement): void {
  player = createPlayer(canvas.width, canvas.height)
  wave = createInitialWave()
  projectiles = []
  pendingStage = null
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
  if (input.pause) {
    pauseGame()
    return
  }

  player = tickPlayer(player, deltaSeconds)
  player = movePlayer(player, input.horizontal, deltaSeconds, context.canvas.width)

  if (input.fire) {
    const [nextPlayer, shouldShoot] = tryConsumeShot(player)
    player = nextPlayer

    if (shouldShoot) {
      projectiles.push(createPlayerProjectile(player.x + player.width / 2 - 2, player.y - 10))
    }
  }

  wave = stepEnemies(wave, deltaSeconds, context.canvas.width)
  projectiles = stepProjectiles(projectiles, deltaSeconds, context.canvas.height)

  const collisionResult = resolvePlayerProjectileCollisions(wave.enemies, projectiles)
  wave = applyWaveEnemies(wave, collisionResult.enemies)
  projectiles = collisionResult.projectiles

  const progression = evaluateStageProgression(wave.stage, wave.enemies.length)
  if (progression.enterShop) {
    pendingStage = progression.nextStage
    gameStore.setState({
      status: 'shop',
      score: state.score,
      lives: state.lives,
      stage: wave.stage,
      highScore: state.highScore,
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
    enemyReachedBottom
  })

  const highScore = Math.max(state.highScore, scoreLives.score)

  if (enemyReachedBottom) {
    if (scoreLives.isGameOver) {
      gameStore.setState({
        status: 'game-over',
        score: scoreLives.score,
        lives: scoreLives.lives,
        highScore,
        stage: wave.stage,
        input
      })

      void saveLocalHighscore(scoreLives.score)
      pauseGameLoop()
      return
    }

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

  context.fillStyle = '#f8fafc'
  for (const projectile of projectiles) {
    context.fillRect(projectile.x, projectile.y, projectile.width, projectile.height)
  }
}

function pauseGameLoop(): void {
  if (!loopController) {
    return
  }

  loopController.pause()
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
  player = applyPlayerUpgrades(player, state.activeUpgrades as ShopItemId[])

  if (hasShieldUpgrade(state.activeUpgrades as ShopItemId[])) {
    gameStore.setState({
      lives: Math.max(state.lives, 4)
    })
  }

  gameStore.setState({
    status: 'running'
  })
  loopController?.resume()
}

export function pauseGame(): void {
  if (gameStore.getState().status !== 'running') {
    return
  }

  gameStore.setState({
    status: 'paused'
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

export function continueToNextStage(upgrades: ShopItemId[]): void {
  if (!context || pendingStage === null) {
    return
  }

  wave = {
    stage: pendingStage,
    enemies: createEnemyGrid(pendingStage),
    direction: 1
  }
  pendingStage = null
  projectiles = []

  if (player) {
    player = applyPlayerUpgrades(player, upgrades)
  }

  gameStore.setState({
    status: 'running',
    stage: wave.stage,
    activeUpgrades: upgrades
  })

  loopController?.resume()
}
