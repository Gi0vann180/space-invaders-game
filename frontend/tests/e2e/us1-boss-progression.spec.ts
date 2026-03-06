import { expect, test } from '@playwright/test'

test('US1 mantém loop jogável com progressão de fase ativa', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Iniciar rodada' }).click()

  await expect(page.getByText('Stage: 1')).toBeVisible()
  await expect(page.getByText('Lives:')).toBeVisible()
  await expect(page.locator('canvas')).toBeVisible()
})
