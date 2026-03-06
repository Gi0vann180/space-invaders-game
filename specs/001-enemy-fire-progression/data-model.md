# Data Model — Inimigos com Tiro e Progressão de Fase

## Entidade: Enemy

- Descrição: Inimigo ativo em campo com capacidade de disparo enquanto vivo.
- Campos:
  - id: string
  - isAlive: boolean
  - position: { x: number, y: number }
  - shotCooldownMs: number
  - lastShotAtMs: number
  - phaseMultiplier: number
- Regras de validação:
  - `isAlive = false` impede novos disparos.
  - `shotCooldownMs > 0` obrigatório.

## Entidade: EnemyProjectile

- Descrição: Projétil disparado por inimigo, com trajetória e poder de dano.
- Campos:
  - id: string
  - enemyId: string
  - position: { x: number, y: number }
  - velocity: { x: number, y: number }
  - damage: number
  - isActive: boolean
  - spawnedAtMs: number
- Regras de validação:
  - `enemyId` deve referenciar inimigo válido no momento do spawn.
  - Projéteis fora de área jogável devem ser desativados/reciclados.

## Entidade: PhaseDifficulty

- Descrição: Configuração de dificuldade por fase.
- Campos:
  - phaseNumber: number
  - enemyFireRateMultiplier: number
  - enemyProjectileSpeedMultiplier: number
  - maxConcurrentEnemyProjectiles: number
- Regras de validação:
  - `phaseNumber >= 1`.
  - Multiplicadores da fase N+1 devem ser `>=` fase N (monotonicidade).

## Entidade: UpgradeLevel

- Descrição: Estado de nível de uma melhoria específica do jogador.
- Campos:
  - upgradeId: string
  - level: number
  - maxLevel: number (=10)
  - currentEffectValue: number
- Regras de validação:
  - `1 <= level <= 10` após primeira compra.
  - Compra só incrementa em +1 por transação válida.
  - Se `level = 10`, compra adicional é bloqueada.

## Entidade: PlayerProgression

- Descrição: Estado de progressão da partida e do jogador.
- Campos:
  - currentPhase: number
  - lives: number
  - score: number
  - upgrades: Record<string, UpgradeLevel>
- Regras de validação:
  - `currentPhase >= 1`.
  - Atualizações de fase devem aplicar `PhaseDifficulty` correspondente.
  - Estado de upgrades deve persistir na sessão e recarga.

## Relacionamentos

- `EnemyProjectile.enemyId` -> `Enemy.id` (N:1)
- `PlayerProgression.upgrades[*]` -> `UpgradeLevel.upgradeId` (1:N)
- `PlayerProgression.currentPhase` -> `PhaseDifficulty.phaseNumber` (N:1 ao longo da partida)

## Transições de Estado

1. Enemy: `alive` -> `shooting` quando cooldown é satisfeito.
2. EnemyProjectile: `active` -> `inactive` ao colidir, sair da tela ou expirar.
3. Phase: `N` -> `N+1` ao cumprir condição de conclusão da fase atual.
4. UpgradeLevel: `level X` -> `level X+1` por compra válida, até `10`.
5. UpgradeLevel em `10`: permanece em `10` com retorno de bloqueio de compra.
