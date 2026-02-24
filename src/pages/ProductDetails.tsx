import { useParams } from 'react-router-dom';

export function ProductDetails() {
  const { id } = useParams();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Product Details</h1>
      <p className="text-gray-600">Viewing product ID: {id}</p>
    </div>
  );
}
