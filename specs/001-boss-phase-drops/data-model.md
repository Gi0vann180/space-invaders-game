# Data Model — Ciclo de 10 Fases com Boss e Drops Raros

## Entidade: StageCycle

- Descricao: Agrupa a progressao em blocos de 10 fases.
- Campos:
  - cycleIndex: number
  - startStage: number
  - endStage: number
  - difficultyMultiplier: number
- Regras de validacao:
  - `cycleIndex >= 0`.
  - `startStage = cycleIndex * 10 + 1`.
  - `endStage = startStage + 9`.
  - `difficultyMultiplier > 0` e monotonicamente crescente por ciclo.

## Entidade: StageProgression

- Descricao: Estado de progressao da partida em uma fase especifica.
- Campos:
  - stageNumber: number
  - isBossStage: boolean
  - status: enum (`regular-combat`, `boss-fight`, `completed`)
  - nextStageNumber: number
- Regras de validacao:
  - `stageNumber >= 1`.
  - `isBossStage = (stageNumber % 10 === 0)`.
  - `nextStageNumber = stageNumber + 1` quando `status = completed`.

## Entidade: BossEncounter

- Descricao: Combate do boss da fase de boss.
- Campos:
  - bossId: string
  - stageNumber: number
  - maxHealth: number
  - currentHealth: number
  - moveSpeed: number
  - moveDirection: enum (`left`, `right`)
  - state: enum (`active`, `defeated`)
- Regras de validacao:
  - `maxHealth > 0`.
  - `0 <= currentHealth <= maxHealth`.
  - `moveSpeed > 0` quando `state = active`.
  - `state = defeated` quando `currentHealth = 0`.

## Entidade: RareDropItem

- Descricao: Bolinha coletavel gerada raramente na morte de inimigo comum.
- Campos:
  - dropId: string
  - sourceEnemyId: string
  - x: number
  - y: number
  - spawnedAtMs: number
  - expiresAtMs: number
  - state: enum (`active`, `collected`, `expired`)
- Regras de validacao:
  - `expiresAtMs > spawnedAtMs`.
  - `state = expired` quando tempo atual ultrapassa `expiresAtMs` sem coleta.
  - `state = collected` remove o item da arena.

## Entidade: SpecialShotGrant

- Descricao: Beneficio de tiro especial concedido ao coletar drop raro.
- Campos:
  - grantId: string
  - dropId: string
  - grantedShotType: enum (`laser`, `homing-missile`, `burst-shot`)
  - grantedAtMs: number
- Regras de validacao:
  - `grantedShotType` deve estar no conjunto permitido pelo jogo.
  - Deve existir no maximo um `SpecialShotGrant` por `dropId`.

## Entidade: DropRarityPolicy

- Descricao: Parametros de raridade para geracao de drops.
- Campos:
  - triggerEvent: enum (`enemy-defeated`)
  - dropChancePercent: number
  - minPercent: number
  - maxPercent: number
- Regras de validacao:
  - `0 < dropChancePercent <= 100`.
  - `minPercent <= dropChancePercent <= maxPercent`.
  - Definir faixa para evento raro conforme balanceamento de produto.

## Relacionamentos

- `StageProgression.stageNumber` pertence a um `StageCycle`.
- `BossEncounter.stageNumber` existe somente quando `StageProgression.isBossStage = true`.
- `RareDropItem.sourceEnemyId` referencia inimigo derrotado.
- `SpecialShotGrant.dropId` referencia `RareDropItem.dropId` coletado.

## Transicoes de Estado

1. StageProgression: `regular-combat` -> `boss-fight` no final de fases de boss.
2. BossEncounter: `active` -> `defeated` ao atingir `currentHealth = 0`.
3. StageProgression: `boss-fight` -> `completed` apos derrota do boss.
4. RareDropItem: `active` -> `collected` na colisao com jogador.
5. RareDropItem: `active` -> `expired` ao ultrapassar `expiresAtMs`.
