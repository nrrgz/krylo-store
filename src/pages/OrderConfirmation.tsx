import { Link, useParams } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';

export function OrderConfirmation() {
  const { id } = useParams();

  // Mock static data
  const orderId = id || 'ORD-KRY-88912';

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

      <p className="text-gray-500 font-medium mb-10">
        Order ID: <span className="text-gray-900">{orderId}</span>
      </p>

      {/* Mock Summary Card */}
      <Card className="w-full max-w-lg mb-12 text-left bg-gray-50/50 border-gray-100 shadow-sm">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">
            Order Details
          </h2>

          <div className="flex flex-col gap-4 mb-6">
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">Krylo Pro Keyboard (x1)</span>
              <span className="text-gray-900 font-medium">$149.99</span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-gray-600 font-medium">Merino Wool Desk Mat (x2)</span>
              <span className="text-gray-900 font-medium">$119.98</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex flex-col gap-2">
            <div className="flex justify-between text-sm text-gray-500">
              <span>Subtotal</span>
              <span>$269.97</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between text-sm text-gray-500">
              <span>Tax</span>
              <span>$21.60</span>
            </div>
            <div className="flex justify-between items-center text-lg font-bold text-gray-900 mt-2 pt-2 border-t border-gray-200">
              <span>Total paid</span>
              <span>$291.57</span>
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
