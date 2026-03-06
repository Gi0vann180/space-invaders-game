import {
  MAX_UPGRADE_LEVEL,
  SHOP_CATALOG,
  canPurchaseShopItem,
  getUpgradeLevel,
  getUpgradePurchaseCost,
  purchasePermanentUpgrade,
  type UpgradeLevels
} from '../services/shopService'
import type { RunModifierOfferSnapshot } from '../game/types'

type ShopScreenProps = {
  score: number
  upgradeLevels: UpgradeLevels
  runModifierOffer: RunModifierOfferSnapshot | null
  onSelectRunModifier: (modifierId: string) => void
  onPurchase: (nextScore: number, nextUpgradeLevels: UpgradeLevels) => void
  onContinue: () => void
}

export function ShopScreen({
  score,
  upgradeLevels,
  runModifierOffer,
  onSelectRunModifier,
  onPurchase,
  onContinue
}: ShopScreenProps) {
  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-slate-950/95 p-4">
      <div className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 p-5 text-slate-100">
        <h2 className="mb-2 text-2xl font-semibold">Loja da fase</h2>
        <p className="mb-4 text-sm text-slate-300">Pontos disponíveis: {score}</p>
        <ul className="space-y-3">
          {SHOP_CATALOG.map((item) => {
            const currentLevel = getUpgradeLevel(upgradeLevels, item.id)
            const canBuy = canPurchaseShopItem(score, upgradeLevels, item)
            const isAtMaxLevel = currentLevel >= MAX_UPGRADE_LEVEL
            const purchaseCost = getUpgradePurchaseCost(item, currentLevel)

            return (
              <li className="flex items-center justify-between rounded-lg border border-slate-700 p-3" key={item.id}>
                <div>
                  <p className="font-medium">
                    {item.name} <span className="text-xs text-slate-300">Nível {currentLevel}/{MAX_UPGRADE_LEVEL}</span>
                  </p>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
                <button
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:bg-slate-700"
                  disabled={!canBuy}
                  onClick={() => {
                    const result = purchasePermanentUpgrade(score, upgradeLevels, item)
                    onPurchase(result.score, result.upgradeLevels)
                  }}
                  type="button"
                >
                  {isAtMaxLevel ? 'Nível máximo' : `Evoluir (${purchaseCost})`}
                </button>
              </li>
            )
          })}
        </ul>
        {runModifierOffer ? (
          <div className="mt-4 rounded-lg border border-slate-700 p-3">
            <p className="mb-2 text-sm font-medium text-slate-200">Oferta da run (fase {runModifierOffer.stageNumber})</p>
            <ul className="space-y-2">
              {runModifierOffer.options.map((option) => (
                <li className="flex items-center justify-between rounded border border-slate-700 p-2" key={option.modifierId}>
                  <div>
                    <p className="text-sm font-medium">
                      {option.label}{' '}
                      <span className="text-xs text-slate-400">({option.category})</span>
                    </p>
                    {!option.applicable ? <p className="text-xs text-amber-300">Indisponível para build atual</p> : null}
                  </div>
                  <button
                    className="rounded-md bg-sky-600 px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:bg-slate-700"
                    disabled={!option.applicable || runModifierOffer.selectedModifierId !== null}
                    onClick={() => onSelectRunModifier(option.modifierId)}
                    type="button"
                  >
                    {runModifierOffer.selectedModifierId === option.modifierId ? 'Selecionado' : 'Selecionar'}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-4 flex justify-end">
          <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium" onClick={onContinue} type="button">
            Próxima fase
          </button>
        </div>
      </div>
    </div>
  )
}
