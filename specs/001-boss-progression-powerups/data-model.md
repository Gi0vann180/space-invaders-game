# Data Model — Progressão com Chefes e Power-ups

## Entidade: Stage

- Descrição: Fase jogável com encontro final de chefe e parâmetros gerais de progressão.
- Campos:
  - stageNumber: number
  - regularEnemySetId: string
  - bossId: string
  - completionRule: string
- Regras de validação:
  - `stageNumber >= 1`.
  - Cada fase deve possuir exatamente um `bossId` válido.

## Entidade: Boss

- Descrição: Inimigo final da fase com atributos de ameaça e identidade de combate.
- Campos:
  - id: string
  - stageNumber: number
  - maxHealth: number
  - currentHealth: number
  - contactDamage: number
  - attackPatternIds: string[]
  - rewardScore: number
- Regras de validação:
  - `maxHealth > 0`.
  - `currentHealth` entre `0` e `maxHealth`.
  - `attackPatternIds.length >= 1`.

## Entidade: BossAttackPattern

- Descrição: Padrão de ataque parametrizado executado pelo chefe.
- Campos:
  - id: string
  - bossId: string
  - patternType: enum (`burst`, `sweep`, `targeted`, `zoneControl`)
  - cadenceMs: number
  - projectileProfileId: string
  - activeWindowMs: number
- Regras de validação:
  - `cadenceMs > 0`.
  - `activeWindowMs > 0`.
  - Cada chefe deve possuir ao menos um padrão exclusivo no conjunto da fase.

## Entidade: TemporaryPowerUp

- Descrição: Efeito temporário aplicável durante uma run.
- Campos:
  - id: string
  - type: enum (`laser`, `homingMissile`, `shield`)
  - durationMs: number
  - startedAtMs: number
  - expiresAtMs: number
  - conflictGroup: enum (`weapon`, `defense`)
- Regras de validação:
  - `durationMs > 0`.
  - `expiresAtMs = startedAtMs + durationMs`.
  - Apenas um power-up ativo por `conflictGroup` quando política for substituição.

## Entidade: PermanentUpgrade

- Descrição: Melhoria persistente da nave aplicada entre partidas.
- Campos:
  - upgradeId: string
  - level: number
  - maxLevel: number
  - effectPerLevel: number
  - upgradeCostCurveId: string
- Regras de validação:
  - `0 <= level <= maxLevel`.
  - Compra válida incrementa exatamente +1 nível.

## Entidade: RunModifierOffer

- Descrição: Oferta de melhorias roguelike apresentada ao jogador durante a run.
- Campos:
  - runId: string
  - stageNumber: number
  - offeredModifierIds: string[]
  - selectedModifierId: string | null
  - rollSeed: string
- Regras de validação:
  - `offeredModifierIds.length >= 2`.
  - Ao menos uma opção oferecida deve ser aplicável ao estado atual da run.

## Entidade: PlayerProgressProfile

- Descrição: Estado persistente de meta progressão do jogador.
- Campos:
  - profileId: string
  - permanentUpgrades: Record<string, number>
  - highestUnlockedStage: number
  - totalRuns: number
  - updatedAt: string
- Regras de validação:
  - `highestUnlockedStage >= 1`.
  - `permanentUpgrades` contém somente níveis dentro do limite configurado.

## Relacionamentos

- `Stage.bossId` -> `Boss.id` (1:1 por fase)
- `Boss.attackPatternIds[*]` -> `BossAttackPattern.id` (1:N)
- `RunModifierOffer` -> estado de run atual (1:1 por ponto de oferta)
- `PlayerProgressProfile.permanentUpgrades[*]` -> `PermanentUpgrade.upgradeId` (1:N)

## Transições de Estado

1. Stage: `regular-combat` -> `boss-fight` quando objetivos da fase são cumpridos.
2. Boss: `alive` -> `defeated` quando `currentHealth` chega a 0.
3. TemporaryPowerUp: `inactive` -> `active` ao coletar; `active` -> `expired` ao atingir `expiresAtMs`.
4. PermanentUpgrade: `level X` -> `level X+1` por compra válida (até `maxLevel`).
5. RunModifierOffer: `generated` -> `selected` após escolha do jogador; segue para próximo ciclo de combate.
