import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { selectCartItems, selectCartSubtotal, clearCart } from '../features/cart/cartSlice';

export function Checkout() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const subtotal = useAppSelector(selectCartSubtotal);

  if (items.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  const tax = subtotal * 0.10; // 10% tax
  const shipping = 0.00;
  const total = subtotal + tax + shipping;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const orderId = `ORD-${Date.now()}`;
    const order = {
      orderId,
      createdAt: new Date().toISOString(),
      customer: {
        name: formData.get('fullName') as string,
        email: formData.get('email') as string,
        address: `${formData.get('address')}, ${formData.get('city')} ${formData.get('postalCode')}`,
      },
      items,
      totals: {
        subtotal,
        shipping,
        tax,
        total,
      },
    };

    sessionStorage.setItem('krylo-last-order', JSON.stringify(order));
    dispatch(clearCart());
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="container-base py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-7 xl:col-span-8">
          <form id="checkout-form" onSubmit={handleSubmit} className="flex flex-col gap-8">

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <Input name="email" type="email" id="email" required placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full name
                  </label>
                  <Input name="fullName" type="text" id="fullName" required placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone number
                  </label>
                  <Input name="phone" type="tel" id="phone" required placeholder="(555) 123-4567" />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Street address
                  </label>
                  <Input name="address" type="text" id="address" required placeholder="123 Main St" />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input name="city" type="text" id="city" required placeholder="San Francisco" />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal code
                  </label>
                  <Input name="postalCode" type="text" id="postalCode" required placeholder="94105" />
                </div>
              </div>
            </section>

            {/* Payment Info placeholder */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                Payment
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-500 text-sm">
                Payment integration will be added here.
              </div>
            </section>

            {/* Mobile Submit (Hidden on large screens, shown below form) */}
            <div className="lg:hidden mt-4">
              <Button type="submit" size="lg" className="w-full text-base h-12">
                Place Order
              </Button>
            </div>
          </form>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-5 xl:col-span-4">
          <Card className="sticky top-24 bg-gray-50/50 border-gray-100">
            <CardHeader>
              <CardTitle className="text-xl">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">

              {/* Items list */}
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

              {/* Totals */}
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

              {/* Desktop Submit */}
              <Button
                type="submit"
                form="checkout-form"
                size="lg"
                className="w-full mt-4 hidden lg:flex text-base h-12"
              >
                Place Order
              </Button>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
