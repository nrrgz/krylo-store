import { describe, it, expect, beforeEach } from 'vitest';
import cartReducer, {
  addItem,
  removeItem,
  updateQty,
  clearCart,
  selectCartItemCount,
  selectCartSubtotal,
  type CartState,
} from './cartSlice';

describe('cartSlice', () => {
  const mockCartItem = {
    productId: 'p1',
    name: 'Test Keyboard',
    price: 100,
    image: 'img.png',
    selectedColor: { name: 'Black', hex: '#000' },
    quantity: 2,
  };

  let initialState: CartState;

  beforeEach(() => {
    initialState = { items: [] };
  });

  it('adds a new item correctly', () => {
    const action = addItem(mockCartItem);
    const state = cartReducer(initialState, action);

    expect(state.items.length).toBe(1);
    expect(state.items[0].productId).toBe('p1');
    expect(state.items[0].quantity).toBe(2);
  });

  it('increments quantity when adding same product/color', () => {
    let state = cartReducer(initialState, addItem({ ...mockCartItem, quantity: 1 }));
    state = cartReducer(state, addItem({ ...mockCartItem, quantity: 2 }));

    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(3);
  });

  it('clamps addItem quantity to real stock when product exists', () => {
    const state = cartReducer(
      initialState,
      addItem({
        productId: 'p_kb_1',
        name: 'Krylo Pro Mechanical Keyboard',
        price: 149.99,
        image: '/images/products/keyboard-pro-1.png',
        selectedColor: { name: 'Obsidian Black', hex: '#111111' },
        quantity: 999,
      }),
    );

    expect(state.items.length).toBe(1);
    expect(state.items[0].quantity).toBe(45);
  });

  it('removes an item correctly', () => {
    let state = cartReducer(initialState, addItem(mockCartItem));
    expect(state.items.length).toBe(1);

    state = cartReducer(state, removeItem({ productId: 'p1', selectedColor: 'Black' }));
    expect(state.items.length).toBe(0);
  });

  it('updateQty clamps between 1 and maxStock', () => {
    let state = cartReducer(initialState, addItem(mockCartItem));

    state = cartReducer(state, updateQty({ productId: 'p1', selectedColor: 'Black', quantity: 0, maxStock: 10 }));
    expect(state.items[0].quantity).toBe(1);

    state = cartReducer(state, updateQty({ productId: 'p1', selectedColor: 'Black', quantity: 15, maxStock: 10 }));
    expect(state.items[0].quantity).toBe(10);
  });

  it('calculates selectors correctly', () => {
    const state = cartReducer(initialState, addItem({ ...mockCartItem, quantity: 3 }));

    const rootState = { cart: state };
    expect(selectCartItemCount(rootState)).toBe(3);
    expect(selectCartSubtotal(rootState)).toBe(300);
  });

  it('clears cart', () => {
    let state = cartReducer(initialState, addItem({ ...mockCartItem, quantity: 3 }));
    expect(state.items.length).toBe(1);

    state = cartReducer(state, clearCart());
    expect(state.items.length).toBe(0);
  });
});
