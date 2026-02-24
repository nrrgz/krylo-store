import { Link } from 'react-router-dom';

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center px-4">
      <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
        Krylo
      </h1>
      <p className="text-xl text-gray-600 mb-10 max-w-xl mx-auto">
        Tech accessories for your desk setup. Curated for aesthetics, engineered for performance.
      </p>
      <Link
        to="/products"
        className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition-colors"
      >
        Shop Products
      </Link>
    </div>
  );
}
