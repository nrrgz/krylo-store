import { Link } from 'react-router-dom';
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectAuthUser, logout } from '../features/auth/authSlice';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import type { Order, OrderStatus } from '../types';
import { reconcileOrders } from '../lib/orderLifecycle';
import { products, resolveProductImageForColor } from '../data/products';

const statusClasses: Record<OrderStatus, string> = {
  processing: 'bg-amber-100 text-amber-800 border-amber-200',
  shipped: 'bg-blue-100 text-blue-800 border-blue-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
};

function OrderThumbnail({
  primary,
  fallback,
  alt,
}: {
  primary: string;
  fallback: string;
  alt: string;
}) {
  const sources = useMemo(
    () => Array.from(new Set([primary, fallback].filter((source) => Boolean(source.trim())))),
    [primary, fallback],
  );
  const [sourceIndex, setSourceIndex] = useState(0);

  const currentSource = sources[sourceIndex] || '';

  return (
    <div className="w-10 h-10 rounded-md bg-[var(--surface-2)] overflow-hidden flex-shrink-0 border border-[var(--border)]">
      {currentSource ? (
        <img
          src={currentSource}
          alt={alt}
          className="w-full h-full object-cover block"
          onError={() => setSourceIndex((prev) => prev + 1)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
          Item
        </div>
      )}
    </div>
  );
}

export function Account() {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();
  const orderStorageKey = user ? `krylo-orders-${user.id}` : null;
  const snapshotCacheRef = useRef<{ raw: string | null; orders: Order[] }>({
    raw: null,
    orders: [],
  });

  const orders = useSyncExternalStore(
    (notify) => {
      if (!orderStorageKey) return () => undefined;

      const onStorage = (event: StorageEvent) => {
        if (event.key === orderStorageKey || event.key === null) {
          notify();
        }
      };

      const onFocus = () => notify();
      const onVisibility = () => notify();

      window.addEventListener('storage', onStorage);
      window.addEventListener('focus', onFocus);
      document.addEventListener('visibilitychange', onVisibility);

      return () => {
        window.removeEventListener('storage', onStorage);
        window.removeEventListener('focus', onFocus);
        document.removeEventListener('visibilitychange', onVisibility);
      };
    },
    () => {
      if (!orderStorageKey) return snapshotCacheRef.current.orders;
      try {
        const storedOrders = localStorage.getItem(orderStorageKey);
        if (storedOrders === snapshotCacheRef.current.raw) {
          return snapshotCacheRef.current.orders;
        }

        if (!storedOrders) {
          snapshotCacheRef.current = { raw: null, orders: [] };
          return snapshotCacheRef.current.orders;
        }

        const parsed = JSON.parse(storedOrders) as Array<Partial<Order>>;
        const reconciled = reconcileOrders(parsed);
        snapshotCacheRef.current = { raw: storedOrders, orders: reconciled };
        return snapshotCacheRef.current.orders;
      } catch (e) {
        console.error('Failed to load orders', e);
        snapshotCacheRef.current = { raw: null, orders: [] };
        return snapshotCacheRef.current.orders;
      }
    },
    () => snapshotCacheRef.current.orders,
  );

  useEffect(() => {
    if (!orderStorageKey) return;

    try {
      localStorage.setItem(orderStorageKey, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to persist reconciled orders', e);
    }
  }, [orderStorageKey, orders]);

  const handleSignOut = () => {
    dispatch(logout());
  };

  if (!user) return null;

  return (
    <div className="container-base py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="bg-[var(--surface)] border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{user.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
                <Button variant="secondary" onClick={handleSignOut} className="mt-4">
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="bg-[var(--surface)] border-[var(--border)] shadow-sm">
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-gray-500 text-sm">You haven't placed any orders yet.</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {orders.map((order) => {
                    const firstItem = order.items[0];
                    const remainingItems = Math.max(0, order.items.length - 1);
                    const shortOrderId = order.orderId.replace('ORD-', '').slice(0, 8).toUpperCase();
                    const productMatch = firstItem
                      ? products.find((product) => product.id === firstItem.productId)
                      : undefined;
                    const productFallbackImage = firstItem
                      ? resolveProductImageForColor(productMatch, firstItem.selectedColor.name)
                      : '';
                    const thumbnailSrc = firstItem?.image || '';

                    return (
                      <div key={order.orderId} className="border border-[var(--border)] rounded-lg p-4">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
                          <div className="flex gap-3">
                            <OrderThumbnail
                              primary={thumbnailSrc}
                              fallback={productFallbackImage}
                              alt={firstItem?.name || 'Ordered item'}
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {firstItem?.name || `Order ${order.orderId}`}
                              </p>
                              {remainingItems > 0 && (
                                <p className="text-sm text-gray-600">
                                  +{remainingItems} more item{remainingItems > 1 ? 's' : ''}
                                </p>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                Order #{shortOrderId} - {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3">
                            <Badge className={statusClasses[order.status]}>{order.status}</Badge>
                            <p className="font-bold text-gray-900">${order.totals.total.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="text-sm text-gray-600">
                            {order.items.length} item{order.items.length > 1 ? 's' : ''}
                          </div>
                          <Link to={`/order/${order.orderId}`}>
                            <Button size="sm" variant="secondary">View details</Button>
                          </Link>
                        </div>

                        {order.statusHistory.length > 0 && (
                          <div className="mt-3 border-t border-[var(--border)] pt-3">
                            <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">
                              Status History
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {order.statusHistory.map((event) => (
                                <span
                                  key={`${order.orderId}-${event.status}-${event.at}`}
                                  className="inline-flex items-center rounded-full border border-[var(--border)] bg-[var(--surface-2)] px-2 py-1 text-xs text-gray-700"
                                >
                                  {event.status} - {new Date(event.at).toLocaleDateString()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
