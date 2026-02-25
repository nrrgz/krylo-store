import { describe, it, expect, beforeEach } from 'vitest';
import cartReducer, {
  addItem,
  removeItem,
  updateQty,
  clearCart,
  selectCartItemCount,
  selectCartSubtotal,
  type CartState
} from './cartSlice';
import type { Product } from '../../types';

describe('cartSlice', () => {
  const mockProduct: Product = {
    id: 'p1',
    name: 'Test Keyboard',
    brand: 'Brand',
    description: 'Desc',
    category: 'keyboards',
    price: 100,
    rating: 5,
    reviewCount: 1,
    images: ['img.jpg'],
    colors: [{ name: 'Black', hex: '#000' }],
    tags: [],
    isFeatured: false,
    createdAt: '2023-01-01',
    stockByColor: {
      'Black': 10,
    },
  };

  let initialState: CartState;

  beforeEach(() => {
    initialState = { items: [] };
  });

  it('adds a new item correctly', () => {
    const action = addItem({ product: mockProduct, selectedColor: 'Black', quantity: 2 });
    const state = cartReducer(initialState, action);

    expect(state.items.length).toBe(1);
    expect(state.items[0].productId).toBe('p1');
    expect(state.items[0].quantity).toBe(2);
  });

  it('increments quantity when adding same product/color', () => {
    let state = cartReducer(initialState, addItem({ product: mockProduct, selectedColor: 'Black', quantity: 1 }));
    state = cartReducer(state, addItem({ product: mockProduct, selectedColor: 'Black', quantity: 2 }));

    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('removes an item correctly', () => {
    let state = cartReducer(initialState, addItem({ product: mockProduct, selectedColor: 'Black', quantity: 2 }));
    expect(state.items.length).toBe(1);

    state = cartReducer(state, removeItem({ productId: 'p1', selectedColor: 'Black' }));
    expect(state.items.length).toBe(0);
  });

  it('updateQty clamps between 1 and maxStock', () => {
    let state = cartReducer(initialState, addItem({ product: mockProduct, selectedColor: 'Black', quantity: 2 }));

    // update below 1
    state = cartReducer(state, updateQty({ productId: 'p1', selectedColor: 'Black', quantity: 0, maxStock: 10 }));
    expect(state.items[0].quantity).toBe(1);

    // update above maxStock
    state = cartReducer(state, updateQty({ productId: 'p1', selectedColor: 'Black', quantity: 15, maxStock: 10 }));
    expect(state.items[0].quantity).toBe(10);
  });

  it('calculates selectors correctly', () => {
    const state = cartReducer(initialState, addItem({ product: mockProduct, selectedColor: 'Black', quantity: 3 }));

    const rootState = { cart: state };
    expect(selectCartItemCount(rootState)).toBe(3);
    expect(selectCartSubtotal(rootState)).toBe(300);
  });

  it('clears cart', () => {
    let state = cartReducer(initialState, addItem({ product: mockProduct, selectedColor: 'Black', quantity: 3 }));
    expect(state.items.length).toBe(1);

    state = cartReducer(state, clearCart());
    expect(state.items.length).toBe(0);
  });
});
