import { beforeEach, describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import { Account } from './Account';
import type { AuthState, User } from '../features/auth/authTypes';
import type { Order } from '../types';

const user: User = {
  id: 'usr-account',
  name: 'Account User',
  email: 'account@example.com',
  createdAt: '2026-03-18T00:00:00.000Z',
};

const buildOrder = (): Order => ({
  orderId: 'ORD-TEST-001',
  createdAt: '2026-03-18T00:00:00.000Z',
  status: 'processing',
  customer: {
    name: user.name,
    email: user.email,
    address: '123 Main St',
  },
  items: [
    {
      productId: 'p_kb_1',
      name: 'Krylo Pro Mechanical Keyboard',
      price: 149.99,
      image: '/images/products/does-not-exist.png',
      selectedColor: { name: 'Arctic White', hex: '#F3F4F6' },
      quantity: 1,
    },
  ],
  totals: {
    subtotal: 149.99,
    tax: 15,
    shipping: 0,
    total: 164.99,
  },
  statusHistory: [{ status: 'processing', at: '2026-03-18T00:00:00.000Z' }],
});

describe('Account', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('falls back from stale order image to color-mapped catalog image', async () => {
    localStorage.setItem(`krylo-orders-${user.id}`, JSON.stringify([buildOrder()]));

    const store = configureStore({
      reducer: {
        cart: cartReducer,
        auth: authReducer,
      },
      preloadedState: {
        cart: { items: [] },
        auth: { user, status: 'signed_in', hydrated: true } as AuthState,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Account />
        </MemoryRouter>
      </Provider>,
    );

    const image = await screen.findByAltText('Krylo Pro Mechanical Keyboard');
    expect((image as HTMLImageElement).src).toContain('/images/products/does-not-exist.png');

    fireEvent.error(image);

    await waitFor(() => {
      expect((screen.getByAltText('Krylo Pro Mechanical Keyboard') as HTMLImageElement).src).toContain(
        '/images/products/keyboard-pro-2.png',
      );
    });
  });
});
