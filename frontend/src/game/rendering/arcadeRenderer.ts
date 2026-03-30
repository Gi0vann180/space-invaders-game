import type { BossEntity } from '../entities/boss'
import type { RareDropEntity } from '../entities/dropItem'
import type { EnemyEntity } from '../entities/enemy'
import type { PlayerEntity } from '../entities/player'
import type { ProjectileEntity } from '../entities/projectile'

const BOSS_THEME: Record<string, { primary: string; secondary: string; glow: string }> = {
  ember: { primary: '#fb923c', secondary: '#f97316', glow: 'rgba(251, 146, 60, 0.35)' },
  volt: { primary: '#facc15', secondary: '#eab308', glow: 'rgba(250, 204, 21, 0.35)' },
  frost: { primary: '#67e8f9', secondary: '#22d3ee', glow: 'rgba(103, 232, 249, 0.32)' },
  nova: { primary: '#c084fc', secondary: '#a855f7', glow: 'rgba(192, 132, 252, 0.35)' },
  void: { primary: '#818cf8', secondary: '#6366f1', glow: 'rgba(99, 102, 241, 0.35)' }
}

type RenderSceneInput = {
  context: CanvasRenderingContext2D
  nowMs: number
  stage: number
  player: PlayerEntity
  enemies: EnemyEntity[]
  boss: BossEntity | null
  projectiles: ProjectileEntity[]
  activeDrops: RareDropEntity[]
}

function drawBackground(context: CanvasRenderingContext2D, nowMs: number, stage: number): void {
  const { canvas } = context
  const gradient = context.createLinearGradient(0, 0, 0, canvas.height)
  gradient.addColorStop(0, '#020617')
  gradient.addColorStop(0.45, '#071329')
  gradient.addColorStop(1, '#02030a')
  context.fillStyle = gradient
  context.fillRect(0, 0, canvas.width, canvas.height)

  const stageGlow = context.createRadialGradient(canvas.width * 0.5, canvas.height * 0.18, 20, canvas.width * 0.5, canvas.height * 0.18, 280)
  stageGlow.addColorStop(0, 'rgba(59, 130, 246, 0.22)')
  stageGlow.addColorStop(1, 'rgba(2, 6, 23, 0)')
  context.fillStyle = stageGlow
  context.fillRect(0, 0, canvas.width, canvas.height)

  const starLayers = [
    { count: 28, speed: 14, size: 1.2, color: 'rgba(255,255,255,0.35)' },
    { count: 18, speed: 24, size: 1.8, color: 'rgba(125,211,252,0.4)' },
    { count: 10, speed: 42, size: 2.4, color: 'rgba(167,139,250,0.28)' }
  ]

  starLayers.forEach((layer, layerIndex) => {
    context.fillStyle = layer.color
    for (let index = 0; index < layer.count; index += 1) {
      const seed = (index + 1) * (stage + layerIndex + 3)
      const baseX = (seed * 73) % canvas.width
      const baseY = (seed * 131) % canvas.height
      const twinkle = 0.55 + Math.abs(Math.sin(nowMs / 500 + seed)) * 0.45
      const y = (baseY + (nowMs / 1000) * layer.speed) % canvas.height
      context.globalAlpha = twinkle
      context.beginPath()
      context.arc(baseX, y, layer.size, 0, Math.PI * 2)
      context.fill()
    }
  })
  context.globalAlpha = 1

  context.strokeStyle = 'rgba(148, 163, 184, 0.08)'
  context.lineWidth = 1
  for (let y = 0; y < canvas.height; y += 36) {
    context.beginPath()
    context.moveTo(0, y + 0.5)
    context.lineTo(canvas.width, y + 0.5)
    context.stroke()
  }
}

function drawPlayer(context: CanvasRenderingContext2D, player: PlayerEntity, nowMs: number): void {
  const bob = Math.sin(nowMs / 120) * 1.5
  const x = player.x
  const y = player.y + bob

  context.save()
  context.shadowColor = 'rgba(56, 189, 248, 0.55)'
  context.shadowBlur = 14

  context.fillStyle = '#7dd3fc'
  context.beginPath()
  context.moveTo(x + player.width / 2, y - 8)
  context.lineTo(x + player.width - 4, y + player.height)
  context.lineTo(x + 4, y + player.height)
  context.closePath()
  context.fill()

  context.fillStyle = '#e0f2fe'
  context.fillRect(x + player.width / 2 - 4, y + 1, 8, player.height - 8)

  context.shadowBlur = 0
  context.fillStyle = '#f97316'
  context.beginPath()
  context.moveTo(x + 10, y + player.height)
  context.lineTo(x + 15, y + player.height + 10 + Math.abs(Math.sin(nowMs / 90)) * 4)
  context.lineTo(x + 20, y + player.height)
  context.closePath()
  context.fill()

  context.beginPath()
  context.moveTo(x + player.width - 20, y + player.height)
  context.lineTo(x + player.width - 15, y + player.height + 10 + Math.abs(Math.cos(nowMs / 105)) * 4)
  context.lineTo(x + player.width - 10, y + player.height)
  context.closePath()
  context.fill()
  context.restore()
}

function drawEnemy(context: CanvasRenderingContext2D, enemy: EnemyEntity, nowMs: number, index: number): void {
  const hover = Math.sin(nowMs / 240 + index * 0.8) * 2
  const x = enemy.x
  const y = enemy.y + hover

  context.save()
  context.shadowColor = 'rgba(163, 230, 53, 0.4)'
  context.shadowBlur = 8
  context.fillStyle = '#a3e635'
  context.beginPath()
  context.moveTo(x + enemy.width / 2, y)
  context.lineTo(x + enemy.width, y + 8)
  context.lineTo(x + enemy.width - 6, y + enemy.height)
  context.lineTo(x + 6, y + enemy.height)
  context.lineTo(x, y + 8)
  context.closePath()
  context.fill()

  context.shadowBlur = 0
  context.fillStyle = '#1a2e05'
  context.fillRect(x + 8, y + 8, 5, 4)
  context.fillRect(x + enemy.width - 13, y + 8, 5, 4)
  context.fillRect(x + enemy.width / 2 - 4, y + 14, 8, 3)
  context.restore()
}

function drawBoss(context: CanvasRenderingContext2D, boss: BossEntity, nowMs: number): void {
  const theme = BOSS_THEME[boss.feedbackPreset] ?? BOSS_THEME.void
  const pulse = 0.7 + Math.abs(Math.sin(nowMs / 320)) * 0.3
  const x = boss.x
  const y = boss.y + Math.sin(nowMs / 260) * 2

  context.save()
  context.shadowColor = theme.glow
  context.shadowBlur = 24
  context.fillStyle = theme.primary

  context.beginPath()
  context.moveTo(x + 10, y + boss.height * 0.6)
  context.lineTo(x + boss.width * 0.2, y + 12)
  context.lineTo(x + boss.width * 0.45, y + boss.height * 0.25)
  context.lineTo(x + boss.width * 0.55, y + boss.height * 0.25)
  context.lineTo(x + boss.width * 0.8, y + 12)
  context.lineTo(x + boss.width - 10, y + boss.height * 0.6)
  context.lineTo(x + boss.width * 0.7, y + boss.height - 6)
  context.lineTo(x + boss.width * 0.3, y + boss.height - 6)
  context.closePath()
  context.fill()

  context.shadowBlur = 0
  context.fillStyle = theme.secondary
  context.fillRect(x + 18, y + boss.height * 0.3, boss.width - 36, boss.height * 0.34)
  context.fillRect(x + boss.width * 0.35, y + boss.height * 0.1, boss.width * 0.3, boss.height * 0.18)

  context.fillStyle = '#e2e8f0'
  context.beginPath()
  context.arc(x + boss.width / 2, y + boss.height * 0.46, 7 + pulse * 2, 0, Math.PI * 2)
  context.fill()

  context.fillStyle = '#0f172a'
  context.beginPath()
  context.arc(x + boss.width / 2, y + boss.height * 0.46, 3.5, 0, Math.PI * 2)
  context.fill()

  const healthRatio = boss.maxHealth > 0 ? boss.health / boss.maxHealth : 0
  context.fillStyle = 'rgba(15, 23, 42, 0.72)'
  context.fillRect(x + 10, y - 14, boss.width - 20, 6)
  context.fillStyle = theme.primary
  context.fillRect(x + 10, y - 14, (boss.width - 20) * healthRatio, 6)
  context.restore()
}

function drawProjectile(context: CanvasRenderingContext2D, projectile: ProjectileEntity): void {
  context.save()

  if (projectile.origin === 'player') {
    const trailLength = projectile.kind === 'laser' ? 34 : projectile.kind === 'homing' ? 24 : 18
    context.strokeStyle = projectile.kind === 'laser' ? 'rgba(103, 232, 249, 0.8)' : projectile.kind === 'homing' ? 'rgba(196, 181, 253, 0.75)' : 'rgba(248, 250, 252, 0.65)'
    context.lineWidth = projectile.kind === 'laser' ? 4 : 2
    context.beginPath()
    context.moveTo(projectile.x + projectile.width / 2, projectile.y + projectile.height)
    context.lineTo(projectile.x + projectile.width / 2, projectile.y + projectile.height + trailLength)
    context.stroke()
  } else {
    context.strokeStyle = 'rgba(248, 113, 113, 0.65)'
    context.lineWidth = 2
    context.beginPath()
    context.moveTo(projectile.x + projectile.width / 2, projectile.y)
    context.lineTo(projectile.x + projectile.width / 2, projectile.y - 16)
    context.stroke()
  }

  if (projectile.kind === 'laser') {
    context.fillStyle = '#67e8f9'
  } else if (projectile.kind === 'homing') {
    context.fillStyle = '#c4b5fd'
  } else if (projectile.origin === 'enemy') {
    context.fillStyle = '#fb7185'
  } else {
    context.fillStyle = '#f8fafc'
  }

  context.shadowColor = context.fillStyle
  context.shadowBlur = 10
  context.fillRect(projectile.x, projectile.y, projectile.width, projectile.height)
  context.restore()
}

function drawDrop(context: CanvasRenderingContext2D, drop: RareDropEntity, nowMs: number): void {
  const pulse = 0.85 + Math.abs(Math.sin(nowMs / 180)) * 0.3
  const centerX = drop.x + drop.width / 2
  const centerY = drop.y + drop.height / 2

  context.save()
  context.translate(centerX, centerY)
  context.rotate(nowMs / 500)
  context.scale(pulse, pulse)
  context.shadowColor = 'rgba(251, 191, 36, 0.55)'
  context.shadowBlur = 10
  context.fillStyle = '#fbbf24'
  context.beginPath()
  context.moveTo(0, -drop.height / 2)
  context.lineTo(drop.width / 2, 0)
  context.lineTo(0, drop.height / 2)
  context.lineTo(-drop.width / 2, 0)
  context.closePath()
  context.fill()
  context.restore()
}

function drawForegroundEffects(context: CanvasRenderingContext2D, nowMs: number): void {
  const { canvas } = context
  context.save()
  context.globalAlpha = 0.07
  context.fillStyle = '#e2e8f0'
  for (let y = 0; y < canvas.height; y += 4) {
    context.fillRect(0, y + Math.sin(nowMs / 800 + y) * 0.5, canvas.width, 1)
  }
  context.restore()
}

export function renderScene({ context, nowMs, stage, player, enemies, boss, projectiles, activeDrops }: RenderSceneInput): void {
  const { canvas } = context
  context.clearRect(0, 0, canvas.width, canvas.height)
  drawBackground(context, nowMs, stage)
  enemies.forEach((enemy, index) => drawEnemy(context, enemy, nowMs, index))
  if (boss) {
    drawBoss(context, boss, nowMs)
  }
  activeDrops.forEach((drop) => drawDrop(context, drop, nowMs))
  projectiles.forEach((projectile) => drawProjectile(context, projectile))
  drawPlayer(context, player, nowMs)
  drawForegroundEffects(context, nowMs)
}
