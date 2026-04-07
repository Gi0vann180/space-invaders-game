import {
  EXTRA_LIFE_COST_POINTS,
  MAX_LIVES_PER_STAGE,
  MAX_UPGRADE_LEVEL,
  SHOP_CATALOG,
  canPurchaseExtraLife,
  canPurchaseShopItem,
  getUpgradeLevel,
  getUpgradePurchaseCost,
  purchaseExtraLife,
  purchasePermanentUpgrade,
  type UpgradeLevels
} from '../services/shopService'

type ShopScreenProps = {
  score: number
  lives: number
  upgradeLevels: UpgradeLevels
  onConfirmClick?: () => void
  onPurchaseExtraLife: (nextScore: number, nextLives: number) => void
  onPurchase: (nextScore: number, nextUpgradeLevels: UpgradeLevels) => void
  onContinue: () => void
}

export function ShopScreen({
  score,
  lives,
  upgradeLevels,
  onConfirmClick,
  onPurchaseExtraLife,
  onPurchase,
  onContinue
}: ShopScreenProps) {
  const canBuyExtraLife = canPurchaseExtraLife(score, lives)

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-slate-950/72 px-3 py-4 backdrop-blur-sm sm:px-4">
      <div className="ui-shell-strong mx-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] p-4 text-slate-100 sm:p-5">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="ui-chip mb-2 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-100/90">
              Phase Shop
            </p>
            <h2 className="ui-display text-[1.5rem] font-bold uppercase tracking-[0.22em] text-white">Loja da fase</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">Pontos disponíveis: {score}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="ui-chip px-3 py-1.5 text-xs font-semibold text-amber-100">Vidas {lives}/{MAX_LIVES_PER_STAGE}</span>
          </div>
        </div>

        <ul className="space-y-3">
          {SHOP_CATALOG.filter((item) => item.id !== 'upgrade-shield').map((item) => {
            const currentLevel = getUpgradeLevel(upgradeLevels, item.id)
            const canBuy = canPurchaseShopItem(score, upgradeLevels, item)
            const isAtMaxLevel = currentLevel >= MAX_UPGRADE_LEVEL
            const purchaseCost = getUpgradePurchaseCost(item, currentLevel)

            return (
              <li className="ui-field flex flex-col gap-3 rounded-[22px] p-4 sm:flex-row sm:items-center sm:justify-between" key={item.id}>
                <div className="space-y-1">
                  <p className="flex flex-wrap items-center gap-2 font-medium text-white">
                    <span>{item.name}</span>
                    <span className="ui-chip px-2.5 py-1 text-[10px] font-semibold text-cyan-100">Nível {currentLevel}/{MAX_UPGRADE_LEVEL}</span>
                  </p>
                  <p className="max-w-xl text-xs leading-relaxed text-slate-300">{item.description}</p>
                </div>
                <button
                  className="ui-button-primary rounded-full px-4 py-2 text-xs font-semibold disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/10 disabled:text-slate-400 disabled:shadow-none"
                  disabled={!canBuy}
                  onClick={() => {
                    const result = purchasePermanentUpgrade(score, upgradeLevels, item)
                    onConfirmClick?.()
                    onPurchase(result.score, result.upgradeLevels)
                  }}
                  type="button"
                >
                  {isAtMaxLevel ? 'Nível máximo' : `Evoluir (${purchaseCost})`}
                </button>
              </li>
            )
          })}

          <li className="ui-field flex flex-col gap-3 rounded-[22px] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-1">
              <p className="flex flex-wrap items-center gap-2 font-medium text-white">
                <span>Vida Extra</span>
                <span className="ui-chip px-2.5 py-1 text-[10px] font-semibold text-emerald-100">{lives}/{MAX_LIVES_PER_STAGE}</span>
              </p>
              <p className="max-w-xl text-xs leading-relaxed text-slate-300">Compra válida apenas nesta fase (limite 3 vidas).</p>
            </div>
            <button
              className="rounded-full border border-emerald-400/30 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-100 transition hover:bg-emerald-500/25 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/10 disabled:text-slate-400"
              disabled={!canBuyExtraLife}
              onClick={() => {
                const result = purchaseExtraLife(score, lives)
                if (!result.purchased) {
                  return
                }

                onConfirmClick?.()
                onPurchaseExtraLife(result.score, result.lives)
              }}
              type="button"
            >
              {lives >= MAX_LIVES_PER_STAGE ? 'Vidas no limite' : `Comprar vida (${EXTRA_LIFE_COST_POINTS})`}
            </button>
          </li>
        </ul>

        <div className="sticky bottom-0 mt-4 border-t border-white/10 bg-slate-950/88 pt-3 backdrop-blur">
          <div className="flex justify-end">
            <button
              className="ui-button-primary rounded-full px-5 py-2 text-sm font-semibold"
              onClick={() => {
                onConfirmClick?.()
                onContinue()
              }}
              type="button"
            >
              Próxima fase
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
