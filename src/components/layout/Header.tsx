import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight text-gray-900">
          Krylo
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/products" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
            Catalog
          </Link>
          <Link to="/cart" className="relative text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium transition-colors">
            Cart
            <span className="flex items-center justify-center bg-black text-white text-xs rounded-full w-5 h-5 font-semibold">
              0
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
