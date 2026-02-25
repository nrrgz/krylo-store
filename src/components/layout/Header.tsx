import { Link } from 'react-router-dom';
import { useAppSelector } from '../../app/hooks';
import { selectCartItemCount } from '../../features/cart/cartSlice';

export function Header() {
  const cartCount = useAppSelector(selectCartItemCount);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--surface)]/90 backdrop-blur-md border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight text-[var(--primary)]">
          Krylo
        </Link>

        <nav className="flex items-center gap-6">
          <Link to="/products" className="text-[var(--muted)] hover:text-[var(--primary)] font-medium transition-colors">
            Catalog
          </Link>
          <Link to="/cart" className="relative text-[var(--muted)] hover:text-[var(--primary)] flex items-center gap-2 font-medium transition-colors">
            Cart
            {cartCount > 0 && (
              <span className="flex items-center justify-center bg-[var(--primary)] text-[var(--primary-foreground)] text-xs rounded-full w-5 h-5 font-semibold">
                {cartCount}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
