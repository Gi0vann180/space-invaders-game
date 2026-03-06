import { MAX_UPGRADE_LEVEL, type UpgradeLevels } from '../../services/shopService'

export type RunModifierId =
  | 'rapid-loader'
  | 'thruster-boost'
  | 'shield-matrix'
  | 'balanced-kit'
  | 'defense-overdrive'

export type RunModifierCategory = 'offense' | 'defense' | 'utility'

export type RunModifierOption = {
  modifierId: RunModifierId
  label: string
  category: RunModifierCategory
  applicable: boolean
}

export type RunModifierOffer = {
  runId: string
  stageNumber: number
  options: RunModifierOption[]
  guaranteedApplicableOption: true
  selectedModifierId: RunModifierId | null
}

type RunModifierDefinition = {
  id: RunModifierId
  label: string
  category: RunModifierCategory
  isApplicable: (upgradeLevels: UpgradeLevels) => boolean
  apply: (upgradeLevels: UpgradeLevels) => UpgradeLevels
}

const RUN_MODIFIER_CATALOG: RunModifierDefinition[] = [
  {
    id: 'rapid-loader',
    label: 'Carregador Rápido',
    category: 'offense',
    isApplicable: (levels) => levels['upgrade-fire-rate'] < MAX_UPGRADE_LEVEL,
    apply: (levels) => ({
      ...levels,
      'upgrade-fire-rate': Math.min(MAX_UPGRADE_LEVEL, levels['upgrade-fire-rate'] + 1)
    })
  },
  {
    id: 'thruster-boost',
    label: 'Impulso de Propulsor',
    category: 'utility',
    isApplicable: (levels) => levels['upgrade-speed'] < MAX_UPGRADE_LEVEL,
    apply: (levels) => ({
      ...levels,
      'upgrade-speed': Math.min(MAX_UPGRADE_LEVEL, levels['upgrade-speed'] + 1)
    })
  },
  {
    id: 'shield-matrix',
    label: 'Matriz de Escudo',
    category: 'defense',
    isApplicable: (levels) => levels['upgrade-shield'] < MAX_UPGRADE_LEVEL,
    apply: (levels) => ({
      ...levels,
      'upgrade-shield': Math.min(MAX_UPGRADE_LEVEL, levels['upgrade-shield'] + 1)
    })
  },
  {
    id: 'balanced-kit',
    label: 'Kit Balanceado',
    category: 'utility',
    isApplicable: (levels) =>
      levels['upgrade-fire-rate'] < MAX_UPGRADE_LEVEL || levels['upgrade-speed'] < MAX_UPGRADE_LEVEL,
    apply: (levels) => {
      if (levels['upgrade-fire-rate'] <= levels['upgrade-speed']) {
        return {
          ...levels,
          'upgrade-fire-rate': Math.min(MAX_UPGRADE_LEVEL, levels['upgrade-fire-rate'] + 1)
        }
      }

      return {
        ...levels,
        'upgrade-speed': Math.min(MAX_UPGRADE_LEVEL, levels['upgrade-speed'] + 1)
      }
    }
  },
  {
    id: 'defense-overdrive',
    label: 'Sobrecarga Defensiva',
    category: 'defense',
    isApplicable: (levels) =>
      levels['upgrade-shield'] < MAX_UPGRADE_LEVEL || levels['upgrade-speed'] < MAX_UPGRADE_LEVEL,
    apply: (levels) => {
      if (levels['upgrade-shield'] <= levels['upgrade-speed']) {
        return {
          ...levels,
          'upgrade-shield': Math.min(MAX_UPGRADE_LEVEL, levels['upgrade-shield'] + 1)
        }
      }

      return {
        ...levels,
        'upgrade-speed': Math.min(MAX_UPGRADE_LEVEL, levels['upgrade-speed'] + 1)
      }
    }
  }
]

const OFFER_SIZE = 3

function hashString(value: string): number {
  let hash = 2166136261
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }

  return hash >>> 0
}

function sortCatalogForSeed(runSeed: string, stageNumber: number): RunModifierDefinition[] {
  return [...RUN_MODIFIER_CATALOG].sort((left, right) => {
    const leftScore = hashString(`${runSeed}:${stageNumber}:${left.id}`)
    const rightScore = hashString(`${runSeed}:${stageNumber}:${right.id}`)
    if (leftScore === rightScore) {
      return left.id.localeCompare(right.id)
    }

    return leftScore - rightScore
  })
}

export function generateRunModifierOffer(input: {
  runId: string
  stageNumber: number
  runSeed: string
  upgradeLevels: UpgradeLevels
}): RunModifierOffer {
  const sortedCatalog = sortCatalogForSeed(input.runSeed, input.stageNumber)
  const initialSelection = sortedCatalog.slice(0, OFFER_SIZE)
  const hasApplicableInSelection = initialSelection.some((modifier) => modifier.isApplicable(input.upgradeLevels))

  let selected = initialSelection
  if (!hasApplicableInSelection) {
    const fallback = sortedCatalog.find((modifier) => modifier.isApplicable(input.upgradeLevels)) ?? sortedCatalog[0]
    selected = [...initialSelection.slice(0, OFFER_SIZE - 1), fallback]
  }

  return {
    runId: input.runId,
    stageNumber: input.stageNumber,
    options: selected.map((modifier) => ({
      modifierId: modifier.id,
      label: modifier.label,
      category: modifier.category,
      applicable: modifier.isApplicable(input.upgradeLevels)
    })),
    guaranteedApplicableOption: true,
    selectedModifierId: null
  }
}

export function applyRunModifierSelection(
  upgradeLevels: UpgradeLevels,
  modifierId: RunModifierId
): UpgradeLevels {
  const modifier = RUN_MODIFIER_CATALOG.find((item) => item.id === modifierId)
  if (!modifier || !modifier.isApplicable(upgradeLevels)) {
    return upgradeLevels
  }

  return modifier.apply(upgradeLevels)
}