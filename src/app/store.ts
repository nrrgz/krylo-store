import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import authReducer from '../features/auth/authSlice';
import type { CartState } from '../features/cart/cartSlice';

const CART_STORAGE_KEY = 'krylo-cart-v1';

// Load initial state from localStorage
const loadCartState = (): { cart: CartState } | undefined => {
  try {
    const serialized = localStorage.getItem(CART_STORAGE_KEY);
    if (!serialized) return undefined;
    return { cart: JSON.parse(serialized) };
  } catch (e) {
    console.error('Could not load cart state from localStorage', e);
    return undefined;
  }
};

const preloadedState = loadCartState();

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
  },
  preloadedState,
});

// Subscribe to store changes to persist cart state
store.subscribe(() => {
  try {
    const { cart } = store.getState();
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (e) {
    console.error('Could not save cart state to localStorage', e);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
