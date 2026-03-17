import { describe, expect, it } from 'vitest';
import type { Order } from '../types';
import { reconcileOrder, reconcileOrders } from './orderLifecycle';

const baseOrder = (overrides: Partial<Order> = {}): Partial<Order> => ({
  orderId: 'ORD-1',
  createdAt: '2026-03-10T00:00:00.000Z',
  status: 'processing',
  customer: {
    name: 'User',
    email: 'user@example.com',
    address: '123 Main St',
  },
  items: [],
  totals: {
    subtotal: 100,
    shipping: 0,
    tax: 10,
    total: 110,
  },
  statusHistory: [{ status: 'processing', at: '2026-03-10T00:00:00.000Z' }],
  ...overrides,
});

describe('orderLifecycle', () => {
  it('keeps order as processing before shipped threshold', () => {
    const now = new Date('2026-03-10T12:00:00.000Z').getTime();
    const reconciled = reconcileOrder(baseOrder(), now);

    expect(reconciled?.status).toBe('processing');
    expect(reconciled?.statusHistory.map((event) => event.status)).toEqual(['processing']);
  });

  it('moves order to shipped after 24 hours', () => {
    const now = new Date('2026-03-11T01:00:00.000Z').getTime();
    const reconciled = reconcileOrder(baseOrder(), now);

    expect(reconciled?.status).toBe('shipped');
    expect(reconciled?.statusHistory.map((event) => event.status)).toEqual(['processing', 'shipped']);
  });

  it('moves order to delivered after 72 hours', () => {
    const now = new Date('2026-03-13T01:00:00.000Z').getTime();
    const reconciled = reconcileOrder(baseOrder(), now);

    expect(reconciled?.status).toBe('delivered');
    expect(reconciled?.statusHistory.map((event) => event.status)).toEqual([
      'processing',
      'shipped',
      'delivered',
    ]);
  });

  it('preserves cancelled status regardless of elapsed time', () => {
    const now = new Date('2026-04-01T00:00:00.000Z').getTime();
    const reconciled = reconcileOrder(baseOrder({ status: 'cancelled' }), now);

    expect(reconciled?.status).toBe('cancelled');
    expect(reconciled?.statusHistory.some((event) => event.status === 'cancelled')).toBe(true);
  });

  it('keeps and sorts existing history entries', () => {
    const reconciled = reconcileOrder(
      baseOrder({
        statusHistory: [
          { status: 'shipped', at: '2026-03-11T00:00:00.000Z' },
          { status: 'processing', at: '2026-03-10T00:00:00.000Z' },
        ],
      }),
      new Date('2026-03-11T05:00:00.000Z').getTime(),
    );

    expect(reconciled).not.toBeNull();
    const history = reconciled!.statusHistory;
    expect(history.map((event) => event.status)).toEqual(['processing', 'shipped']);
    expect(history[0].at <= history[1].at).toBe(true);
  });

  it('reconcileOrders filters out invalid orders', () => {
    const orders = reconcileOrders([
      baseOrder(),
      {
        orderId: 'ORD-INVALID',
      },
    ]);

    expect(orders).toHaveLength(1);
    expect(orders[0].orderId).toBe('ORD-1');
  });
});
