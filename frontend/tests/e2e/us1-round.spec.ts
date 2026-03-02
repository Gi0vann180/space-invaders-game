import { expect, test } from '@playwright/test'

test('US1 smoke de gameplay básico', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByRole('heading', { name: 'Space Invaders — Modern UI' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Iniciar rodada' })).toBeVisible()

  await page.getByRole('button', { name: 'Iniciar rodada' }).click()

  const canvas = page.locator('canvas')
  await expect(canvas).toBeVisible()
})
