import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

type E2EUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

const BASE_USER: E2EUser = {
  id: 'usr-e2e-fixed',
  name: 'E2E User',
  email: 'e2e.user@example.com',
  createdAt: '2026-03-16T00:00:00.000Z',
};

type SeedOptions = {
  users?: E2EUser[];
  authSession?: {
    user: E2EUser;
    issuedAt: string;
    expiresAt: string;
    remember: boolean;
  } | null;
  cartState?: unknown;
  lastOrder?: unknown;
};

const makeSession = (user: E2EUser, expiresAt: string, remember = false) => ({
  user,
  issuedAt: '2026-03-16T00:00:00.000Z',
  expiresAt,
  remember,
});

const seedApp = async (page: Page, options: SeedOptions) => {
  await page.addInitScript((seed: SeedOptions) => {
    localStorage.clear();
    sessionStorage.clear();

    if (seed.users) {
      localStorage.setItem('krylo-users-v1', JSON.stringify(seed.users));
    }

    if (seed.authSession) {
      localStorage.setItem('krylo-auth-v1', JSON.stringify(seed.authSession));
    }

    if (seed.cartState) {
      localStorage.setItem('krylo-cart-v1', JSON.stringify(seed.cartState));
    }

    if (seed.lastOrder) {
      sessionStorage.setItem('krylo-last-order', JSON.stringify(seed.lastOrder));
    }
  }, options);
};

const mockPaymentFlow = async (page: Page) => {
  await page.route('**/api/payment/create-checkout-session', async (route) => {
    const request = route.request();
    const payload = request.postDataJSON() as { origin?: string };
    const origin = payload.origin || 'http://127.0.0.1:4173';

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        sessionId: 'demo_e2e_paid_001',
        checkoutUrl: `${origin}/checkout?payment=success&session_id=demo_e2e_paid_001`,
        mode: 'demo',
      }),
    });
  });

  await page.route('**/api/payment/verify-session', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        paid: true,
        mode: 'demo',
        customer: {
          name: BASE_USER.name,
          email: BASE_USER.email,
          address: '123 Main St, Baku AZ1000',
        },
      }),
    });
  });
};

test('shop flow: product -> cart -> checkout -> confirmation -> account', async ({ page }) => {
  await mockPaymentFlow(page);
  await seedApp(page, {
    users: [BASE_USER],
    authSession: makeSession(BASE_USER, '2099-01-01T00:00:00.000Z', true),
  });

  await page.goto('/products');

  const productCardLink = page.locator('a[href^="/products/p_"]').first();
  await expect(productCardLink).toBeVisible();
  await productCardLink.click();

  await expect(page.getByRole('button', { name: /Add to Cart/i })).toBeVisible();
  await page.getByRole('button', { name: /Add to Cart/i }).click();

  await page.getByRole('link', { name: /Cart/i }).click();
  await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeVisible();
  await page.getByRole('button', { name: 'Proceed to Checkout' }).click();
  await expect(page).toHaveURL(/\/checkout$/);

  await page.getByLabel('Email address').fill(BASE_USER.email);
  await page.getByLabel('Full name').fill(BASE_USER.name);
  await page.getByLabel('Phone number').fill('5551234567');
  await page.getByLabel('Street address').fill('123 Main St');
  await page.getByLabel('City').fill('Baku');
  await page.getByLabel('Postal code').fill('AZ1000');
  await page.locator('button:visible', { hasText: 'Pay & Place Order' }).click();

  await expect(page).toHaveURL(/\/order\/ORD-/);
  await expect(page.getByRole('heading', { name: /Thank you for your order!/i })).toBeVisible();

  const orderIdText = await page.getByText(/^Order ID:/).innerText();
  const orderId = orderIdText.replace('Order ID:', '').trim();

  await page.getByRole('link', { name: 'My Orders' }).click();
  await expect(page).toHaveURL(/\/account$/);
  await expect(page.getByRole('heading', { name: 'My Account' })).toBeVisible();
  await expect(page.getByText(orderId)).toBeVisible();
});

test('signed-out user is redirected from checkout to login', async ({ page }) => {
  await seedApp(page, { users: [] });
  await page.goto('/checkout');
  await expect(page).toHaveURL(/\/login\?redirect=%2Fcheckout/);
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
});

test('expired session is invalidated and protected route redirects to login', async ({ page }) => {
  await seedApp(page, {
    users: [BASE_USER],
    authSession: makeSession(BASE_USER, '2020-01-01T00:00:00.000Z'),
  });

  await page.goto('/account');
  await expect(page).toHaveURL(/\/login\?redirect=%2Faccount/);
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
});

test('login and register failure states are shown', async ({ page }) => {
  await seedApp(page, {
    users: [BASE_USER],
    authSession: null,
  });

  await page.goto('/login');
  await page.getByPlaceholder('you@example.com').fill('missing@example.com');
  await page.getByRole('button', { name: 'Sign In' }).click();
  await expect(page.getByText('No account found')).toBeVisible();

  await page.goto('/register');
  await page.getByPlaceholder('Your name').fill('Another User');
  await page.getByPlaceholder('you@example.com').fill('E2E.USER@EXAMPLE.COM');
  await page.getByRole('button', { name: 'Create Account' }).click();
  await expect(page.getByText('Email already registered')).toBeVisible();
});

test('cart quantity controls are locked when item is out of stock', async ({ page }) => {
  await seedApp(page, {
    users: [BASE_USER],
    authSession: makeSession(BASE_USER, '2099-01-01T00:00:00.000Z', true),
    cartState: {
      items: [
        {
          productId: 'p_kb_1',
          name: 'Krylo Pro Mechanical Keyboard',
          price: 149.99,
          image: '/images/products/keyboard-pro-1.png',
          selectedColor: { name: 'Unavailable Color', hex: '#000000' },
          quantity: 1,
        },
      ],
    },
  });

  await page.goto('/cart');
  const itemRow = page.locator('div.border.border-\\[var\\(--border\\)\\].rounded-xl').first();
  await expect(page.getByText('Out of stock')).toBeVisible();
  await expect(itemRow.locator('button').nth(0)).toBeDisabled();
  await expect(itemRow.locator('button').nth(1)).toBeDisabled();
});

test('order not found page is shown for missing order', async ({ page }) => {
  await seedApp(page, {
    users: [BASE_USER],
    authSession: makeSession(BASE_USER, '2099-01-01T00:00:00.000Z', true),
    lastOrder: null,
  });

  await page.goto('/order/ORD-MISSING-123');
  await expect(page.getByRole('heading', { name: 'Order Not Found' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Go to My Orders' })).toBeVisible();
});
