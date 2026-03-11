import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';
import { selectAuthStatus } from '../features/auth/authSlice';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import type { Order } from '../types';

export function OrderConfirmation() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const authStatus = useAppSelector(selectAuthStatus);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('krylo-last-order');
      if (stored) {
        const parsed = JSON.parse(stored) as Order;
        if (parsed.orderId === orderId) {
          setOrder(parsed);
        }
      }
    } catch (e) {
      console.error('Failed to parse last order', e);
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    if (!order || authStatus !== 'signed_in') return;

    const timer = setTimeout(() => {
      navigate('/account', { replace: true });
    }, 2500);

    return () => clearTimeout(timer);
  }, [order, authStatus, navigate]);

  if (loading) {
    return (
      <div className="container-base py-24 flex justify-center items-center">
        <div className="animate-pulse flex flex-col items-center w-full max-w-lg">
          <div className="w-20 h-20 bg-[var(--surface-2)] rounded-full mb-8 shadow-sm"></div>
          <div className="h-8 bg-[var(--surface-2)] rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-[var(--surface-2)] rounded w-1/2 mb-10"></div>
          <div className="h-64 bg-[var(--surface-2)] rounded-xl w-full mb-12"></div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-base py-24 flex flex-col items-center text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-4">
          Order Not Found
        </h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          We couldn't locate details for this order, or it may have been from a previous session.
        </p>
        <Link to="/products">
          <Button size="lg">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container-base py-24 flex flex-col items-center text-center">

      {/* Success Icon */}
      <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center text-white mb-8 shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      </div>

      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">
        Thank you for your order!
      </h1>

      <p className="text-lg text-gray-600 mb-2">
        We've received your order and are getting it ready to ship.
      </p>

      {authStatus === 'signed_in' && (
        <p className="text-sm text-gray-500 mb-4">Redirecting to your orders...</p>
      )}

      <p className="text-gray-500 font-medium mb-10">
        Order ID: <span className="text-gray-900">{order.orderId}</span>
      </p>

      {/* Summary Card */}
      <Card className="w-full max-w-lg mb-12 text-left bg-gray-50/50 border-gray-100 shadow-sm">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
            Order Details
          </h2>

          <div className="flex flex-col gap-4 mb-6">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.selectedColor.name}`} className="flex justify-between items-start">
                <div className="flex flex-col">
                  <span className="text-gray-600 font-medium">{item.name} (x{item.quantity})</span>
                  <span className="text-xs text-gray-400">Color: {item.selectedColor.name}</span>
                </div>
                <span className="text-gray-900 font-medium">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>${order.totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>{order.totals.shipping === 0 ? 'Free' : `$${order.totals.shipping.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax</span>
              <span>${order.totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-gray-900 mt-2 pt-2 border-t border-gray-200">
              <span>Total paid</span>
              <span>${order.totals.total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Link to="/products">
        <Button size="lg" className="px-8 shadow-sm">
          Continue Shopping
        </Button>
      </Link>

    </div>
  );
}
