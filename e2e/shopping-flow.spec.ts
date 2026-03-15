import { expect, test } from '@playwright/test';

const E2E_USER = {
  id: 'usr-e2e-fixed',
  name: 'E2E User',
  email: 'e2e.user@example.com',
  createdAt: '2026-03-16T00:00:00.000Z',
};

test.beforeEach(async ({ context }) => {
  await context.addInitScript((user) => {
    const seeded = sessionStorage.getItem('__e2e_seeded__');
    if (seeded) return;

    localStorage.clear();
    sessionStorage.clear();

    localStorage.setItem('krylo-users-v1', JSON.stringify([user]));
    localStorage.setItem('krylo-auth-v1', JSON.stringify(user));
    sessionStorage.setItem('__e2e_seeded__', 'true');
  }, E2E_USER);
});

test('shop flow: product -> cart -> checkout -> confirmation -> account', async ({ page }) => {
  await page.goto('/products');

  const productCardLink = page.locator('a[href^="/products/p_"]').first();
  await expect(productCardLink).toBeVisible();
  await productCardLink.click();

  await expect(page.getByRole('button', { name: /Add to Cart/i })).toBeVisible();
  await page.getByRole('button', { name: /Add to Cart/i }).click();

  await page.getByRole('link', { name: /Cart/i }).click();
  await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Proceed to Checkout' })).toBeVisible();

  await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  await expect(page).toHaveURL(/\/checkout$/);

  await page.getByLabel('Email address').fill(E2E_USER.email);
  await page.getByLabel('Full name').fill(E2E_USER.name);
  await page.getByLabel('Phone number').fill('5551234567');
  await page.getByLabel('Street address').fill('123 Main St');
  await page.getByLabel('City').fill('Baku');
  await page.getByLabel('Postal code').fill('AZ1000');

  await page.locator('button:visible', { hasText: 'Place Order' }).click();

  await expect(page).toHaveURL(/\/order\/ORD-/);
  await expect(page.getByRole('heading', { name: /Thank you for your order!/i })).toBeVisible();

  const orderIdText = await page.getByText(/^Order ID:/).innerText();
  const orderId = orderIdText.replace('Order ID:', '').trim();

  await page.getByRole('link', { name: 'My Orders' }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  await expect(page.getByText(orderId)).toBeVisible();
});
