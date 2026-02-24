import { useParams } from 'react-router-dom';

export function OrderConfirmation() {
  const { orderId } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
      <p className="text-gray-600">Thank you for your order.</p>
      <p className="text-gray-500 mt-2 text-sm">Order ID: {orderId}</p>
    </div>
  );
}
