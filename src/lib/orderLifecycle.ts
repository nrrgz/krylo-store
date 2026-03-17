import type { Order, OrderStatus } from '../types';

const STATUS_ORDER: OrderStatus[] = ['processing', 'shipped', 'delivered'];
const SHIPPED_AFTER_MS = 24 * 60 * 60 * 1000;
const DELIVERED_AFTER_MS = 72 * 60 * 60 * 1000;

const isKnownStatus = (value: unknown): value is OrderStatus =>
  value === 'processing' || value === 'shipped' || value === 'delivered' || value === 'cancelled';

const normalizeStatus = (status: unknown): OrderStatus => (isKnownStatus(status) ? status : 'processing');

const createBaseHistory = (createdAt: string): Array<{ status: OrderStatus; at: string }> => [
  { status: 'processing', at: createdAt },
];

const deriveTimelineStatus = (createdAt: string, now: number): OrderStatus => {
  const created = new Date(createdAt).getTime();
  if (!Number.isFinite(created)) return 'processing';

  if (now >= created + DELIVERED_AFTER_MS) return 'delivered';
  if (now >= created + SHIPPED_AFTER_MS) return 'shipped';
  return 'processing';
};

const maxStatus = (a: OrderStatus, b: OrderStatus): OrderStatus => {
  if (a === 'cancelled' || b === 'cancelled') return 'cancelled';
  return STATUS_ORDER[Math.max(STATUS_ORDER.indexOf(a), STATUS_ORDER.indexOf(b))];
};

const buildHistory = (
  createdAt: string,
  existing: Array<{ status: OrderStatus; at: string }> | undefined,
  finalStatus: OrderStatus,
): Array<{ status: OrderStatus; at: string }> => {
  const created = new Date(createdAt).getTime();
  const result = existing && existing.length > 0 ? [...existing] : createBaseHistory(createdAt);
  const seen = new Set(result.map((entry) => entry.status));

  if (!seen.has('processing')) {
    result.push({ status: 'processing', at: createdAt });
    seen.add('processing');
  }

  if (finalStatus === 'cancelled') {
    if (!seen.has('cancelled')) {
      result.push({ status: 'cancelled', at: new Date().toISOString() });
    }
  } else {
    if ((finalStatus === 'shipped' || finalStatus === 'delivered') && !seen.has('shipped')) {
      result.push({ status: 'shipped', at: new Date(created + SHIPPED_AFTER_MS).toISOString() });
      seen.add('shipped');
    }
    if (finalStatus === 'delivered' && !seen.has('delivered')) {
      result.push({ status: 'delivered', at: new Date(created + DELIVERED_AFTER_MS).toISOString() });
      seen.add('delivered');
    }
  }

  return result.sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
};

export const reconcileOrder = (raw: Partial<Order>, now = Date.now()): Order | null => {
  if (!raw.orderId || !raw.createdAt || !raw.customer || !raw.items || !raw.totals) {
    return null;
  }

  const normalizedStatus = normalizeStatus(raw.status);
  const derivedStatus = normalizedStatus === 'cancelled' ? 'cancelled' : deriveTimelineStatus(raw.createdAt, now);
  const finalStatus = maxStatus(normalizedStatus, derivedStatus);
  const existingHistory = Array.isArray(raw.statusHistory)
    ? raw.statusHistory
        .filter((entry): entry is { status: OrderStatus; at: string } => Boolean(entry && isKnownStatus(entry.status) && entry.at))
        .map((entry) => ({ status: entry.status, at: entry.at }))
    : undefined;

  const statusHistory = buildHistory(raw.createdAt, existingHistory, finalStatus);

  return {
    orderId: raw.orderId,
    createdAt: raw.createdAt,
    status: finalStatus,
    customer: raw.customer,
    items: raw.items,
    totals: raw.totals,
    statusHistory,
  };
};

export const reconcileOrders = (rawOrders: Array<Partial<Order>>, now = Date.now()): Order[] =>
  rawOrders
    .map((order) => reconcileOrder(order, now))
    .filter((order): order is Order => Boolean(order));
