import { describe, expect, it, beforeEach, vi } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import { Checkout } from './Checkout';
import type { AuthState, User } from '../features/auth/authTypes';
import * as paymentApi from '../lib/api/paymentApi';

vi.mock('../lib/api/paymentApi', async () => {
  const actual = await vi.importActual('../lib/api/paymentApi');
  return {
    ...actual,
    createCheckoutSession: vi.fn(),
    verifyCheckoutSession: vi.fn(),
  };
});

const user: User = {
  id: 'usr-checkout',
  name: 'Checkout User',
  email: 'checkout@example.com',
  createdAt: '2026-03-18T00:00:00.000Z',
};

describe('Checkout', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('locks submit to avoid duplicate checkout session creation', async () => {
    const assignSpy = vi.fn();
    Object.defineProperty(window, 'location', {
      value: { ...window.location, assign: assignSpy },
      writable: true,
    });

    vi.mocked(paymentApi.createCheckoutSession).mockResolvedValue({
      checkoutUrl: 'http://localhost:5173/checkout?payment=success&session_id=demo_1',
    });

    const store = configureStore({
      reducer: {
        cart: cartReducer,
        auth: authReducer,
      },
      preloadedState: {
        auth: { user, status: 'signed_in', hydrated: true } as AuthState,
        cart: {
          items: [
            {
              productId: 'p_kb_1',
              name: 'Krylo Pro Mechanical Keyboard',
              price: 149.99,
              image: '/images/products/keyboard-pro-1.png',
              selectedColor: { name: 'Obsidian Black', hex: '#111111' },
              quantity: 1,
            },
          ],
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Checkout />
        </MemoryRouter>
      </Provider>,
    );

    const ui = userEvent.setup();

    await ui.type(screen.getByLabelText('Email address'), user.email);
    await ui.type(screen.getByLabelText('Full name'), user.name);
    await ui.type(screen.getByLabelText('Phone number'), '5551234567');
    await ui.type(screen.getByLabelText('Street address'), '123 Main St');
    await ui.type(screen.getByLabelText('City'), 'Baku');
    await ui.type(screen.getByLabelText('Postal code'), 'AZ1000');

    const submitButton = screen.getAllByRole('button', { name: /Pay & Place Order|Processing/i })[0];

    await ui.click(submitButton);

    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /Processing/i })[0]).toBeDisabled();
    });

    await ui.click(screen.getAllByRole('button', { name: /Processing/i })[0]);

    await waitFor(() => {
      expect(paymentApi.createCheckoutSession).toHaveBeenCalledTimes(1);
      expect(assignSpy).toHaveBeenCalledTimes(1);
    });
  });
});
