import { useEffect, useRef, useState } from 'react';
import { useNavigate, Navigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCartItems, selectCartSubtotal, clearCart } from '../features/cart/cartSlice';
import { selectAuthUser } from '../features/auth/authSlice';
import { calculateTax } from '../lib/pricing';
import type { Order } from '../types';
import { createCheckoutSession, verifyCheckoutSession } from '../lib/api/paymentApi';

const checkoutSchema = z.object({
  email: z.string().email('Invalid email address'),
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(7, 'Phone number must be at least 7 characters'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

function createOrderId(): string {
  return `ORD-${crypto.randomUUID()}`;
}

function createOrderIdFromSession(sessionId: string): string {
  const normalized = sessionId.replace(/[^a-zA-Z0-9]/g, '').slice(-24);
  return normalized ? `ORD-${normalized}` : createOrderId();
}

export function Checkout() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);
  const user = useAppSelector(selectAuthUser);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isFinalizingPayment, setIsFinalizingPayment] = useState(false);
  const finalizationLockRef = useRef<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
  });

  const paymentStatus = searchParams.get('payment');
  const checkoutSessionId = searchParams.get('session_id');
  const shouldRedirectToCart = items.length === 0 && !isPlacingOrder && paymentStatus !== 'success';
  const isCheckoutLocked = isPlacingOrder || isFinalizingPayment || items.length === 0;

  const tax = calculateTax(subtotal);
  const shipping = 0.0;
  const total = subtotal + tax + shipping;

  useEffect(() => {
    if (paymentStatus !== 'success' || !checkoutSessionId || isFinalizingPayment || !user) return;

    const processedKey = `krylo-processed-session-${checkoutSessionId}`;
    if (sessionStorage.getItem(processedKey) === 'done') return;
    if (finalizationLockRef.current === checkoutSessionId) return;

    const finalize = async () => {
      finalizationLockRef.current = checkoutSessionId;
      try {
        setIsPlacingOrder(true);
        setIsFinalizingPayment(true);
        setCheckoutError(null);
        sessionStorage.setItem(processedKey, 'pending');

        const verification = await verifyCheckoutSession({ sessionId: checkoutSessionId });
        if (!verification.paid) {
          throw new Error('Payment was not completed.');
        }

        const orderId = createOrderIdFromSession(checkoutSessionId);
        const createdAt = new Date().toISOString();
        const order: Order = {
          orderId,
          createdAt,
          status: 'processing',
          customer: {
            name: verification.customer?.name || user.name,
            email: verification.customer?.email || user.email,
            address: verification.customer?.address || 'Address not provided',
          },
          items,
          totals: {
            subtotal,
            shipping,
            tax,
            total,
          },
          statusHistory: [{ status: 'processing', at: createdAt }],
        };

        sessionStorage.setItem('krylo-last-order', JSON.stringify(order));

        const orderKey = `krylo-orders-${user.id}`;
        const existing = localStorage.getItem(orderKey);
        let userOrders = existing ? JSON.parse(existing) : [];
        userOrders = [order, ...userOrders.filter((storedOrder: Order) => storedOrder.orderId !== orderId)];
        localStorage.setItem(orderKey, JSON.stringify(userOrders));

        sessionStorage.setItem(processedKey, 'done');
        dispatch(clearCart());
        navigate(`/order/${orderId}`, { replace: true });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Could not finalize payment.';
        setCheckoutError(message);
        sessionStorage.removeItem(processedKey);
      } finally {
        setIsPlacingOrder(false);
        setIsFinalizingPayment(false);
        finalizationLockRef.current = null;
      }
    };

    void finalize();
  }, [
    paymentStatus,
    checkoutSessionId,
    isFinalizingPayment,
    user,
    items,
    subtotal,
    shipping,
    tax,
    total,
    dispatch,
    navigate,
  ]);

  const onSubmit = async (data: CheckoutFormValues) => {
    if (isCheckoutLocked) return;

    setIsPlacingOrder(true);
    setCheckoutError(null);

    try {
      const { checkoutUrl } = await createCheckoutSession({
        items,
        customer: {
          name: data.fullName,
          email: data.email,
          address: `${data.address}, ${data.city} ${data.postalCode}`,
        },
      });

      window.location.assign(checkoutUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to start payment.';
      setCheckoutError(message);
      setIsPlacingOrder(false);
    }
  };

  if (shouldRedirectToCart) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="container-base py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Checkout</h1>
      {paymentStatus === 'canceled' && (
        <div className="mb-6 rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Payment was canceled. You can review your details and try again.
        </div>
      )}
      {checkoutError && (
        <div className="mb-6 rounded-md border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {checkoutError}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7 xl:col-span-8">
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <Input type="email" id="email" placeholder="you@example.com" {...register('email')} />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full name
                  </label>
                  <Input type="text" id="fullName" placeholder="John Doe" {...register('fullName')} />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone number
                  </label>
                  <Input type="tel" id="phone" placeholder="(555) 123-4567" {...register('phone')} />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street address
                  </label>
                  <Input type="text" id="address" placeholder="123 Main St" {...register('address')} />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input type="text" id="city" placeholder="San Francisco" {...register('city')} />
                  {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message}</p>}
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal code
                  </label>
                  <Input type="text" id="postalCode" placeholder="94105" {...register('postalCode')} />
                  {errors.postalCode && <p className="text-red-500 text-xs mt-1">{errors.postalCode.message}</p>}
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Payment
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500 text-sm">
                You will be redirected to secure Stripe Checkout. If Stripe keys are not configured, demo mode will be used.
              </div>
            </section>

            <div className="lg:hidden mt-4">
              <Button type="submit" size="lg" className="w-full text-base h-12" disabled={isCheckoutLocked}>
                {isPlacingOrder ? 'Processing...' : 'Pay & Place Order'}
              </Button>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <Card className="sticky top-24 bg-gray-50/50 border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-3 pb-4 border-b border-gray-200">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.selectedColor.name}`} className="flex justify-between items-start text-sm">
                    <div className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded shrink-0 overflow-hidden">
                        {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 line-clamp-1">{item.name}</p>
                        <p className="text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-gray-600">
                <span>Shipping</span>
                <span className="font-medium text-green-600">Free</span>
              </div>
              <div className="flex justify-between items-center text-gray-600 pb-4 border-b border-gray-200">
                <span>Estimated Tax</span>
                <span className="font-medium text-gray-900">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-gray-900 py-2">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <Button
                type="submit"
                form="checkout-form"
                size="lg"
                className="w-full mt-4 hidden lg:flex text-base h-12"
                disabled={isCheckoutLocked}
              >
                {isPlacingOrder ? 'Processing...' : 'Pay & Place Order'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}



