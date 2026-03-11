import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectAuthUser, logout } from '../features/auth/authSlice';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import type { Order } from '../types';

export function Account() {
  const user = useAppSelector(selectAuthUser);
  const dispatch = useAppDispatch();

  const orders = useMemo<Order[]>(() => {
    if (!user) return [];
    try {
      const storedOrders = localStorage.getItem(`krylo-orders-${user.id}`);
      return storedOrders ? (JSON.parse(storedOrders) as Order[]) : [];
    } catch (e) {
      console.error('Failed to load orders', e);
      return [];
    }
  }, [user]);

  const handleSignOut = () => {
    dispatch(logout());
  };

  if (!user) return null; // protected route handles redirect

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
                  {orders.map((order) => (
                    <div key={order.orderId} className="border border-[var(--border)] rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{order.orderId}</p>
                          <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                        <p className="font-bold text-gray-900">${order.totals.total.toFixed(2)}</p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
