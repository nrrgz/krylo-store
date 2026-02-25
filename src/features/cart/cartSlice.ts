import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { CartItem } from '../../types';

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (
      state,
      action: PayloadAction<CartItem>
    ) => {
      const item = action.payload;
      const existingItemIndex = state.items.findIndex(
        (i) => i.productId === item.productId && i.selectedColor.name === item.selectedColor.name
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },
    removeItem: (
      state,
      action: PayloadAction<{ productId: string; selectedColor: string }>
    ) => {
      const { productId, selectedColor } = action.payload;
      state.items = state.items.filter(
        (item) => !(item.productId === productId && item.selectedColor.name === selectedColor)
      );
    },
    updateQty: (
      state,
      action: PayloadAction<{ productId: string; selectedColor: string; quantity: number; maxStock?: number }>
    ) => {
      const { productId, selectedColor, quantity, maxStock } = action.payload;
      const upperLimit = maxStock !== undefined ? maxStock : 99;
      const clampedQty = Math.max(1, Math.min(quantity, upperLimit));

      const existingItem = state.items.find(
        (item) => item.productId === productId && item.selectedColor.name === selectedColor
      );

      if (existingItem) {
        existingItem.quantity = clampedQty;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQty, clearCart } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0);
export const selectCartSubtotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

export default cartSlice.reducer;
