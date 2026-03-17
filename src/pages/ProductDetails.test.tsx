import { describe, expect, it, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import { ProductDetails } from './ProductDetails';
import * as catalogApi from '../lib/api/catalogApi';
import type { AuthState } from '../features/auth/authTypes';

vi.mock('../lib/api/catalogApi', async () => {
  const actual = await vi.importActual('../lib/api/catalogApi');
  return {
    ...actual,
    getProductById: vi.fn(),
    getProducts: vi.fn(),
  };
});

const product = {
  id: 'p_test_1',
  name: 'Test Board',
  brand: 'Krylo',
  description: 'Test description',
  category: 'keyboards',
  price: 100,
  rating: 4.5,
  reviewCount: 10,
  images: ['/images/products/keyboard-pro-1.png', '/images/products/keyboard-pro-2.png'],
  imagesByColor: {
    Black: '/images/products/keyboard-pro-1.png',
    White: '/images/products/keyboard-pro-2.png',
  },
  colors: [
    { name: 'Black', hex: '#000000' },
    { name: 'White', hex: '#ffffff' },
  ],
  tags: ['test'],
  isFeatured: true,
  createdAt: '2026-03-18T00:00:00.000Z',
  stockByColor: {
    Black: 2,
    White: 0,
  },
};

const renderProductPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const store = configureStore({
    reducer: {
      cart: cartReducer,
      auth: authReducer,
    },
    preloadedState: {
      cart: { items: [] },
      auth: { user: null, status: 'signed_out', hydrated: true } as AuthState,
    },
  });

  const router = createMemoryRouter(
    [
      {
        path: '/products/:id',
        element: <ProductDetails />,
      },
    ],
    {
      initialEntries: ['/products/p_test_1'],
    },
  );

  render(
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>,
  );

  return { store };
};

describe('ProductDetails', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.mocked(catalogApi.getProductById).mockResolvedValue(product);
    vi.mocked(catalogApi.getProducts).mockResolvedValue({
      items: [product],
      total: 1,
      page: 1,
      pageSize: 8,
    });
  });

  it('switches image when selecting another color', async () => {
    renderProductPage();

    expect(await screen.findByRole('heading', { name: 'Test Board' })).toBeInTheDocument();

    const whiteColorButton = screen.getByTitle('White (Out of stock)');
    await userEvent.click(whiteColorButton);

    const mainImage = screen.getByAltText('Test Board') as HTMLImageElement;
    await waitFor(() => {
      expect(mainImage.src).toContain('/images/products/keyboard-pro-2.png');
    });
  });

  it('disables add to cart when selected color is out of stock', async () => {
    renderProductPage();

    expect(await screen.findByRole('heading', { name: 'Test Board' })).toBeInTheDocument();

    await userEvent.click(screen.getByTitle('White (Out of stock)'));
    expect(screen.getByRole('button', { name: 'Out of Stock' })).toBeDisabled();
  });

  it('clamps quantity to stock and adds valid cart item', async () => {
    const { store } = renderProductPage();

    expect(await screen.findByRole('heading', { name: 'Test Board' })).toBeInTheDocument();

    const plusButton = screen.getByRole('button', { name: '+' });
    await userEvent.click(plusButton);
    await userEvent.click(plusButton);
    await userEvent.click(plusButton);

    await userEvent.click(screen.getByRole('button', { name: /Add to Cart/i }));

    const state = store.getState();
    expect(state.cart.items).toHaveLength(1);
    expect(state.cart.items[0].quantity).toBe(2);
    expect(state.cart.items[0].selectedColor.name).toBe('Black');
  });
});
