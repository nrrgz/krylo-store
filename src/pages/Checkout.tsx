import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export function Checkout() {
  const navigate = useNavigate();

  // Mock data for the summary
  const subtotal = 269.97;
  const tax = 21.60;
  const shipping = 0.00;
  const total = subtotal + tax + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Temporary redirect for UI mockup purposes
    navigate('/order/demo');
  };

  return (
    <div className="container-base py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Checkout Form */}
        <div className="lg:col-span-7 xl:col-span-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8">

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
                  <Input type="email" id="email" required placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full name
                  </label>
                  <Input type="text" id="fullName" required placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone number
                  </label>
                  <Input type="tel" id="phone" required placeholder="(555) 123-4567" />
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
                  <Input type="text" id="address" required placeholder="123 Main St" />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <Input type="text" id="city" required placeholder="San Francisco" />
                </div>
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    Postal code
                  </label>
                  <Input type="text" id="postalCode" required placeholder="94105" />
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

              {/* Mock Items list brief */}
              <div className="flex flex-col gap-3 pb-4 border-b border-gray-200">
                <div className="flex justify-between items-start text-sm">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">Krylo Pro Keyboard</p>
                      <p className="text-gray-500">Qty: 1</p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">$149.99</span>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <div className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-200 rounded shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">Merino Wool Desk Mat</p>
                      <p className="text-gray-500">Qty: 2</p>
                    </div>
                  </div>
                  <span className="font-medium text-gray-900">$119.98</span>
                </div>
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
                size="lg"
                className="w-full mt-4 hidden lg:flex text-base h-12"
                onClick={handleSubmit}
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
