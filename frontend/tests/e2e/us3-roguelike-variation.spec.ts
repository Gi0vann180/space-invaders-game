import { expect, test } from '@playwright/test'

test('US3 nao exibe oferta roguelike na loja', async ({ page }) => {
  await page.goto('/')

  await page.evaluate(() => {
    ;(window as Window & { __GAME_STORE__: { setState: (state: unknown) => void } }).__GAME_STORE__.setState({
      status: 'shop',
      score: 200
      }
    })
  })

  await expect(page.getByText('Loja da fase')).toBeVisible()
  await expect(page.getByText('Oferta da run')).toHaveCount(0)
  await expect(page.getByText('Run tática')).toHaveCount(0)
})
