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

/* ------------------------------------------------------------------ */
/*  Star-field layers — seeded once per canvas size, scroll each frame */
/* ------------------------------------------------------------------ */

type Star = { x: number; baseY: number; size: number; opacity: number; tint: string }
type StreakStar = { x: number; baseY: number; length: number; opacity: number }
type Nebula = { x: number; y: number; radius: number; color: string }

let cachedWidth = 0
let cachedHeight = 0
let layerFar: Star[] = []
let layerMid: Star[] = []
let layerNear: Star[] = []
let layerStreak: StreakStar[] = []
let nebulae: Nebula[] = []

function seedRandom(seed: number): number {
  const x = Math.sin(seed * 127.1 + seed * 311.7) * 43758.5453
  return x - Math.floor(x)
}

function buildStarLayers(w: number, h: number, stage: number): void {
  if (w === cachedWidth && h === cachedHeight) return
  cachedWidth = w
  cachedHeight = h

  layerFar = []
  for (let i = 0; i < 80; i += 1) {
    layerFar.push({
      x: seedRandom(i * 7 + 1) * w,
      baseY: seedRandom(i * 13 + 3) * h,
      size: 0.8 + seedRandom(i * 19 + 5) * 0.4,
      opacity: 0.25 + seedRandom(i * 23 + 7) * 0.15,
      tint: '#ffffff'
    })
  }

  layerMid = []
  for (let i = 0; i < 50; i += 1) {
    layerMid.push({
      x: seedRandom(i * 11 + 2) * w,
      baseY: seedRandom(i * 17 + 4) * h,
      size: 1.5 + seedRandom(i * 29 + 6) * 0.5,
      opacity: 0.35 + seedRandom(i * 31 + 8) * 0.15,
      tint: seedRandom(i * 37 + 9) > 0.5 ? '#7dd3fc' : '#ffffff'
    })
  }

  layerNear = []
  for (let i = 0; i < 25; i += 1) {
    layerNear.push({
      x: seedRandom(i * 41 + 3) * w,
      baseY: seedRandom(i * 43 + 5) * h,
      size: 2.5 + seedRandom(i * 47 + 7) * 1.0,
      opacity: 0.4 + seedRandom(i * 53 + 9) * 0.2,
      tint: '#ffffff'
    })
  }

  layerStreak = []
  for (let i = 0; i < 8; i += 1) {
    layerStreak.push({
      x: seedRandom(i * 59 + 11) * w,
      baseY: seedRandom(i * 61 + 13) * h,
      length: 3 + seedRandom(i * 67 + 15) * 3,
      opacity: 0.3 + seedRandom(i * 71 + 17) * 0.25
    })
  }

  const stageSeed = stage * 997
  nebulae = [
    {
      x: seedRandom(stageSeed + 1) * w,
      y: seedRandom(stageSeed + 2) * h,
      radius: 160 + seedRandom(stageSeed + 3) * 120,
      color: 'rgba(139,92,246,0.04)'
    },
    {
      x: seedRandom(stageSeed + 4) * w,
      y: seedRandom(stageSeed + 5) * h,
      radius: 140 + seedRandom(stageSeed + 6) * 100,
      color: 'rgba(59,130,246,0.03)'
    },
    {
      x: seedRandom(stageSeed + 7) * w,
      y: seedRandom(stageSeed + 8) * h,
      radius: 130 + seedRandom(stageSeed + 9) * 90,
      color: 'rgba(20,184,166,0.025)'
    }
  ]
}

function drawBackground(context: CanvasRenderingContext2D, nowMs: number, stage: number): void {
  const { canvas } = context
  const w = canvas.width
  const h = canvas.height

  buildStarLayers(w, h, stage)

  // Dark gradient base
  const gradient = context.createLinearGradient(0, 0, 0, h)
  gradient.addColorStop(0, '#020617')
  gradient.addColorStop(0.45, '#071329')
  gradient.addColorStop(1, '#02030a')
  context.fillStyle = gradient
  context.fillRect(0, 0, w, h)

  // Stage glow
  const stageGlow = context.createRadialGradient(w * 0.5, h * 0.18, 20, w * 0.5, h * 0.18, 280)
  stageGlow.addColorStop(0, 'rgba(59, 130, 246, 0.22)')
  stageGlow.addColorStop(1, 'rgba(2, 6, 23, 0)')
  context.fillStyle = stageGlow
  context.fillRect(0, 0, w, h)

  // Nebulae — faint colored blobs that drift slowly
  const drift = nowMs / 30000
  for (const neb of nebulae) {
    const nx = neb.x + Math.sin(drift + neb.radius) * 20
    const ny = neb.y + Math.cos(drift * 0.7 + neb.x) * 15
    const g = context.createRadialGradient(nx, ny, 0, nx, ny, neb.radius)
    g.addColorStop(0, neb.color)
    g.addColorStop(1, 'rgba(2,6,23,0)')
    context.fillStyle = g
    context.fillRect(0, 0, w, h)
  }

  const t = nowMs / 1000

  // Layer 1 — far stars (slow, tiny, gentle twinkle)
  for (const star of layerFar) {
    const y = (star.baseY + t * 8) % h
    const twinkle = star.opacity * (0.7 + Math.abs(Math.sin(nowMs / 1200 + star.x)) * 0.3)
    context.globalAlpha = twinkle
    context.fillStyle = star.tint
    context.beginPath()
    context.arc(star.x, y, star.size, 0, Math.PI * 2)
    context.fill()
  }

  // Layer 2 — mid stars (medium speed, mix white/blue)
  for (const star of layerMid) {
    const y = (star.baseY + t * 20) % h
    const twinkle = star.opacity * (0.65 + Math.abs(Math.sin(nowMs / 800 + star.x * 0.5)) * 0.35)
    context.globalAlpha = twinkle
    context.fillStyle = star.tint
    context.beginPath()
    context.arc(star.x, y, star.size, 0, Math.PI * 2)
    context.fill()
  }

  // Layer 3 — near stars (fast, larger, occasional cross-flare)
  for (const star of layerNear) {
    const y = (star.baseY + t * 50) % h
    const twinkle = star.opacity * (0.6 + Math.abs(Math.sin(nowMs / 600 + star.x * 0.3)) * 0.4)
    context.globalAlpha = twinkle
    context.fillStyle = star.tint
    context.beginPath()
    context.arc(star.x, y, star.size, 0, Math.PI * 2)
    context.fill()

    // Cross-flare on brighter stars
    if (star.size > 3.0) {
      context.globalAlpha = twinkle * 0.5
      context.strokeStyle = '#ffffff'
      context.lineWidth = 0.6
      context.beginPath()
      context.moveTo(star.x - star.size * 1.5, y)
      context.lineTo(star.x + star.size * 1.5, y)
      context.moveTo(star.x, y - star.size * 1.5)
      context.lineTo(star.x, y + star.size * 1.5)
      context.stroke()
    }
  }

  // Layer 4 — streak stars (warp-speed vertical lines)
  for (const streak of layerStreak) {
    const y = (streak.baseY + t * 80) % h
    context.globalAlpha = streak.opacity
    context.strokeStyle = '#ffffff'
    context.lineWidth = 1
    context.beginPath()
    context.moveTo(streak.x, y)
    context.lineTo(streak.x, y + streak.length)
    context.stroke()
  }

  context.globalAlpha = 1
}

/* ------------------------------------------------------------------ */
/*  Player                                                             */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Enemies — 4 visual variants by row                                */
/* ------------------------------------------------------------------ */

function parseRow(enemy: EnemyEntity): number {
  // id format: enemy-{stage}-{row}-{col}
  const parts = enemy.id.split('-')
  return parts.length >= 3 ? Number(parts[2]) : 0
}

const ROW_STYLES: {
  tint: string
  glowColor: string
  shape: 'octagon' | 'diamond' | 'pentagon' | 'hexagon'
}[] = [
  { tint: '#f97316', glowColor: 'rgba(249,115,22,0.4)', shape: 'octagon' },
  { tint: '#84cc16', glowColor: 'rgba(132,204,22,0.4)', shape: 'diamond' },
  { tint: '#a3e635', glowColor: 'rgba(163,230,53,0.4)', shape: 'pentagon' },
  { tint: '#4ade80', glowColor: 'rgba(74,222,128,0.4)', shape: 'hexagon' }
]

function drawEnemyOctagon(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  const inset = w * 0.25
  ctx.beginPath()
  ctx.moveTo(x + inset, y)
  ctx.lineTo(x + w - inset, y)
  ctx.lineTo(x + w, y + h * 0.3)
  ctx.lineTo(x + w, y + h * 0.7)
  ctx.lineTo(x + w - inset, y + h)
  ctx.lineTo(x + inset, y + h)
  ctx.lineTo(x, y + h * 0.7)
  ctx.lineTo(x, y + h * 0.3)
  ctx.closePath()
}

function drawEnemyDiamond(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  const cx = x + w / 2
  const cy = y + h / 2
  ctx.beginPath()
  ctx.moveTo(cx, y)
  ctx.lineTo(x + w + 4, cy)
  ctx.lineTo(cx, y + h)
  ctx.lineTo(x - 4, cy)
  ctx.closePath()
}

function drawEnemyPentagon(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  ctx.beginPath()
  ctx.moveTo(x + w / 2, y)
  ctx.lineTo(x + w, y + 8)
  ctx.lineTo(x + w - 6, y + h)
  ctx.lineTo(x + 6, y + h)
  ctx.lineTo(x, y + 8)
  ctx.closePath()
}

function drawEnemyHexagon(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  const inset = w * 0.22
  ctx.beginPath()
  ctx.moveTo(x + inset, y)
  ctx.lineTo(x + w - inset, y)
  ctx.lineTo(x + w, y + h / 2)
  ctx.lineTo(x + w - inset, y + h)
  ctx.lineTo(x + inset, y + h)
  ctx.lineTo(x, y + h / 2)
  ctx.closePath()
}

function drawEnemy(context: CanvasRenderingContext2D, enemy: EnemyEntity, nowMs: number, index: number): void {
  const row = parseRow(enemy)
  const style = ROW_STYLES[Math.min(row, ROW_STYLES.length - 1)]
  const hover = Math.sin(nowMs / 240 + index * 0.8) * 2
  const x = enemy.x
  const y = enemy.y + hover

  context.save()
  context.shadowColor = style.glowColor
  context.shadowBlur = 8
  context.fillStyle = style.tint

  // Draw shape
  if (style.shape === 'octagon') {
    drawEnemyOctagon(context, x, y, enemy.width, enemy.height)
  } else if (style.shape === 'diamond') {
    drawEnemyDiamond(context, x, y, enemy.width, enemy.height)
  } else if (style.shape === 'hexagon') {
    drawEnemyHexagon(context, x, y, enemy.width, enemy.height)
  } else {
    drawEnemyPentagon(context, x, y, enemy.width, enemy.height)
  }
  context.fill()

  // Inner panel (darker overlay)
  context.shadowBlur = 0
  context.fillStyle = 'rgba(0,0,0,0.25)'
  context.fillRect(x + 6, y + 5, enemy.width - 12, enemy.height - 10)

  // Eyes — two small bright dots
  const eyeY = y + enemy.height * 0.35
  context.fillStyle = '#ffffff'
  context.globalAlpha = 0.9
  context.beginPath()
  context.arc(x + enemy.width * 0.33, eyeY, 2, 0, Math.PI * 2)
  context.arc(x + enemy.width * 0.67, eyeY, 2, 0, Math.PI * 2)
  context.fill()
  context.globalAlpha = 1

  // Row-specific details
  if (row === 0) {
    // Drone — antenna lines on top
    context.strokeStyle = style.tint
    context.lineWidth = 1.2
    context.beginPath()
    context.moveTo(x + enemy.width * 0.35, y)
    context.lineTo(x + enemy.width * 0.3, y - 5)
    context.moveTo(x + enemy.width * 0.65, y)
    context.lineTo(x + enemy.width * 0.7, y - 5)
    context.stroke()
    // Pulsing core
    const corePulse = 0.5 + Math.abs(Math.sin(nowMs / 200 + index)) * 0.5
    context.fillStyle = style.tint
    context.globalAlpha = corePulse
    context.beginPath()
    context.arc(x + enemy.width / 2, y + enemy.height / 2, 3, 0, Math.PI * 2)
    context.fill()
    context.globalAlpha = 1
  } else if (row === 1) {
    // Scout — subtle rotation wobble via slight transform
    const wobble = Math.sin(nowMs / 300 + index * 1.2) * 0.06
    context.translate(x + enemy.width / 2, y + enemy.height / 2)
    context.rotate(wobble)
    context.translate(-(x + enemy.width / 2), -(y + enemy.height / 2))
  } else if (row === 2) {
    // Grunt — shield shimmer
    const shimmer = 0.08 + Math.abs(Math.sin(nowMs / 400 + index)) * 0.1
    context.strokeStyle = `rgba(163,230,53,${shimmer})`
    context.lineWidth = 1.5
    drawEnemyPentagon(context, x - 2, y - 2, enemy.width + 4, enemy.height + 4)
    context.stroke()
  } else {
    // Swarm — fast flicker
    const flicker = nowMs % 160 < 80 ? 1.0 : 0.6
    context.globalAlpha = flicker
    context.fillStyle = style.tint
    drawEnemyHexagon(context, x, y, enemy.width, enemy.height)
    context.fill()
    context.globalAlpha = 1
  }

  // Engine glow — tiny colored dot below each enemy, flickering
  const engineFlicker = 0.4 + Math.abs(Math.sin(nowMs / 100 + index * 2.3)) * 0.5
  context.globalAlpha = engineFlicker
  context.fillStyle = style.tint
  context.beginPath()
  context.arc(x + enemy.width / 2, y + enemy.height + 3, 1.5, 0, Math.PI * 2)
  context.fill()
  context.globalAlpha = 1

  context.restore()
}

/* ------------------------------------------------------------------ */
/*  Boss — detailed themed rendering with animated elements           */
/* ------------------------------------------------------------------ */

function drawBoss(context: CanvasRenderingContext2D, boss: BossEntity, nowMs: number): void {
  const theme = BOSS_THEME[boss.feedbackPreset] ?? BOSS_THEME.void
  const x = boss.x
  const y = boss.y + Math.sin(nowMs / 260) * 2
  const cx = x + boss.width / 2
  const cy = y + boss.height * 0.46
  const healthRatio = boss.maxHealth > 0 ? boss.health / boss.maxHealth : 0

  context.save()
  context.shadowColor = theme.glow
  context.shadowBlur = 24

  // Main hull — wider hexagonal shape with indented center panel
  context.fillStyle = theme.primary
  context.beginPath()
  context.moveTo(x + 6, y + boss.height * 0.55)
  context.lineTo(x + boss.width * 0.18, y + 8)
  context.lineTo(x + boss.width * 0.4, y + 4)
  context.lineTo(x + boss.width * 0.5, y + boss.height * 0.15)
  context.lineTo(x + boss.width * 0.6, y + 4)
  context.lineTo(x + boss.width * 0.82, y + 8)
  context.lineTo(x + boss.width - 6, y + boss.height * 0.55)
  context.lineTo(x + boss.width * 0.72, y + boss.height - 4)
  context.lineTo(x + boss.width * 0.28, y + boss.height - 4)
  context.closePath()
  context.fill()

  // Indented center panel
  context.shadowBlur = 0
  context.fillStyle = theme.secondary
  context.beginPath()
  context.moveTo(x + boss.width * 0.3, y + boss.height * 0.25)
  context.lineTo(x + boss.width * 0.7, y + boss.height * 0.25)
  context.lineTo(x + boss.width * 0.65, y + boss.height * 0.7)
  context.lineTo(x + boss.width * 0.35, y + boss.height * 0.7)
  context.closePath()
  context.fill()

  // Wing pods — two side rectangles with energy lines
  context.fillStyle = theme.secondary
  context.fillRect(x + 2, y + boss.height * 0.3, boss.width * 0.14, boss.height * 0.35)
  context.fillRect(x + boss.width * 0.84, y + boss.height * 0.3, boss.width * 0.14, boss.height * 0.35)

  // Animated energy arcs on wing pods
  const arcAngle = (nowMs / 800) % (Math.PI * 2)
  context.strokeStyle = theme.primary
  context.lineWidth = 1.5
  context.globalAlpha = 0.7

  // Left wing arc
  context.beginPath()
  context.arc(x + boss.width * 0.09, y + boss.height * 0.48, 6, arcAngle, arcAngle + Math.PI * 0.8)
  context.stroke()

  // Right wing arc
  context.beginPath()
  context.arc(x + boss.width * 0.91, y + boss.height * 0.48, 6, arcAngle + Math.PI, arcAngle + Math.PI * 1.8)
  context.stroke()
  context.globalAlpha = 1

  // Central eye — pulsing circle
  const pulse = 0.7 + Math.abs(Math.sin(nowMs / 320)) * 0.3
  context.fillStyle = '#e2e8f0'
  context.beginPath()
  context.arc(cx, cy, 7 + pulse * 2, 0, Math.PI * 2)
  context.fill()

  context.fillStyle = '#0f172a'
  context.beginPath()
  context.arc(cx, cy, 3.5, 0, Math.PI * 2)
  context.fill()

  // Rotating ring around eye
  const ringAngle = (nowMs / 600) % (Math.PI * 2)
  context.strokeStyle = theme.primary
  context.lineWidth = 1.2
  context.globalAlpha = 0.6
  context.beginPath()
  context.arc(cx, cy, 12, ringAngle, ringAngle + Math.PI * 1.2)
  context.stroke()
  context.globalAlpha = 1

  // Orbiting energy particles — 6 small circles at varying radii
  for (let i = 0; i < 6; i += 1) {
    const orbitRadius = 18 + i * 4
    const speed = 1200 + i * 400
    const offset = (Math.PI * 2 * i) / 6
    const angle = (nowMs / speed) + offset
    const px = cx + orbitRadius * Math.cos(angle)
    const py = cy + orbitRadius * Math.sin(angle)
    context.fillStyle = theme.glow.replace('0.35', '0.7')
    context.globalAlpha = 0.5 + Math.abs(Math.sin(nowMs / 400 + i)) * 0.4
    context.beginPath()
    context.arc(px, py, 1.5 + i * 0.2, 0, Math.PI * 2)
    context.fill()
  }
  context.globalAlpha = 1

  // Damaged effect — sparks when health < 30%
  if (healthRatio < 0.3 && healthRatio > 0) {
    const showSparks = nowMs % 120 < 40
    if (showSparks) {
      context.fillStyle = '#fbbf24'
      for (let i = 0; i < 5; i += 1) {
        const sx = x + boss.width * (0.2 + seedRandom(nowMs * 0.01 + i * 73) * 0.6)
        const sy = y + boss.height * (0.2 + seedRandom(nowMs * 0.01 + i * 137) * 0.6)
        context.globalAlpha = 0.6 + seedRandom(nowMs * 0.01 + i * 211) * 0.4
        context.beginPath()
        context.arc(sx, sy, 1 + seedRandom(i * 97 + nowMs * 0.01) * 1.5, 0, Math.PI * 2)
        context.fill()
      }
      context.globalAlpha = 1
    }
  }

  // Health bar — rounded ends with bright border
  const barX = x + 10
  const barY = y - 14
  const barW = boss.width - 20
  const barH = 5

  // Background
  context.fillStyle = 'rgba(15, 23, 42, 0.72)'
  context.beginPath()
  context.roundRect(barX, barY, barW, barH, 2.5)
  context.fill()

  // Fill
  if (healthRatio > 0) {
    context.fillStyle = theme.primary
    context.beginPath()
    context.roundRect(barX, barY, barW * healthRatio, barH, 2.5)
    context.fill()
  }

  // Border
  context.strokeStyle = theme.primary
  context.lineWidth = 0.8
  context.globalAlpha = 0.6
  context.beginPath()
  context.roundRect(barX, barY, barW, barH, 2.5)
  context.stroke()
  context.globalAlpha = 1

  context.restore()
}

/* ------------------------------------------------------------------ */
/*  Projectiles                                                        */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Drops                                                              */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Foreground — subtle vignette                                       */
/* ------------------------------------------------------------------ */

function drawForegroundEffects(context: CanvasRenderingContext2D, nowMs: number): void {
  const { canvas } = context
  const w = canvas.width
  const h = canvas.height
  const cx = w / 2
  const cy = h / 2
  const outerRadius = Math.sqrt(cx * cx + cy * cy)

  // Subtle breathing vignette
  const vignetteAlpha = 0.13 + Math.sin(nowMs / 4000) * 0.02
  context.save()
  const vignette = context.createRadialGradient(cx, cy, outerRadius * 0.45, cx, cy, outerRadius)
  vignette.addColorStop(0, 'rgba(0,0,0,0)')
  vignette.addColorStop(1, `rgba(0,0,0,${vignetteAlpha})`)
  context.fillStyle = vignette
  context.fillRect(0, 0, w, h)
  context.restore()
}

/* ------------------------------------------------------------------ */
/*  Scene entry point                                                  */
/* ------------------------------------------------------------------ */

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
