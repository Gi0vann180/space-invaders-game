import { SHOP_CATALOG, canPurchaseShopItem, purchaseShopItem, type ShopItemId } from '../services/shopService'

type ShopScreenProps = {
  score: number
  ownedItems: ShopItemId[]
  onPurchase: (nextScore: number, nextOwnedItems: ShopItemId[]) => void
  onContinue: () => void
}

export function ShopScreen({ score, ownedItems, onPurchase, onContinue }: ShopScreenProps) {
  return (
    <div className="absolute inset-0 z-40 grid place-items-center bg-slate-950/95 p-4">
      <div className="w-full max-w-xl rounded-xl border border-slate-700 bg-slate-900 p-5 text-slate-100">
        <h2 className="mb-2 text-2xl font-semibold">Loja da fase</h2>
        <p className="mb-4 text-sm text-slate-300">Pontos disponíveis: {score}</p>
        <ul className="space-y-3">
          {SHOP_CATALOG.map((item) => {
            const canBuy = canPurchaseShopItem(score, ownedItems, item)
            const isOwned = ownedItems.includes(item.id)

            return (
              <li className="flex items-center justify-between rounded-lg border border-slate-700 p-3" key={item.id}>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-slate-400">{item.description}</p>
                </div>
                <button
                  className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium disabled:cursor-not-allowed disabled:bg-slate-700"
                  disabled={!canBuy}
                  onClick={() => {
                    const result = purchaseShopItem(score, ownedItems, item)
                    onPurchase(result.score, result.ownedItems)
                  }}
                  type="button"
                >
                  {isOwned ? 'Comprado' : `Comprar (${item.costPoints})`}
                </button>
              </li>
            )
          })}
        </ul>
        <div className="mt-4 flex justify-end">
          <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium" onClick={onContinue} type="button">
            Próxima fase
          </button>
        </div>
      </div>
    </div>
  )
}
