import { describe, expect, it } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import type { User } from '../features/auth/authTypes';
import { ProtectedRoute } from './ProtectedRoute';

const baseUser: User = {
  id: 'usr-test',
  name: 'Test User',
  email: 'test@example.com',
  createdAt: '2026-03-18T00:00:00.000Z',
};

const renderWithState = (authState: {
  user: User | null;
  status: 'signed_out' | 'signed_in';
  hydrated: boolean;
}) => {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
    },
    preloadedState: {
      cart: { items: [] },
      auth: authState,
    },
  });

  const router = createMemoryRouter(
    [
      {
        path: '/protected',
        element: (
          <ProtectedRoute>
            <div>secret page</div>
          </ProtectedRoute>
        ),
      },
      {
        path: '/login',
        element: <div>login page</div>,
      },
    ],
    {
      initialEntries: ['/protected'],
    },
  );

  render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
  );
};

describe('ProtectedRoute', () => {
  it('waits for hydration before redirecting', () => {
    renderWithState({ user: null, status: 'signed_out', hydrated: false });

    expect(screen.queryByText('login page')).not.toBeInTheDocument();
    expect(screen.queryByText('secret page')).not.toBeInTheDocument();
  });

  it('redirects signed out users after hydration', async () => {
    renderWithState({ user: null, status: 'signed_out', hydrated: true });

    expect(await screen.findByText('login page')).toBeInTheDocument();
  });

  it('renders protected content for signed in users', async () => {
    renderWithState({ user: baseUser, status: 'signed_in', hydrated: true });

    expect(await screen.findByText('secret page')).toBeInTheDocument();
  });
});
