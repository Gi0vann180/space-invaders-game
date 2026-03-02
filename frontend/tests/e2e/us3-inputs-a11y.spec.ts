import { expect, test } from '@playwright/test'

test('US3 smoke de configurações e alto contraste', async ({ page }) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Configurações' }).click()
  await expect(page.getByRole('heading', { name: 'Configurações' })).toBeVisible()

  await page.getByLabel('Alto contraste').check()
  await expect(page.locator('.high-contrast')).toHaveCount(1)

  await page.getByRole('button', { name: 'Fechar' }).click()
  await expect(page.getByRole('heading', { name: 'Configurações' })).toHaveCount(0)
})
