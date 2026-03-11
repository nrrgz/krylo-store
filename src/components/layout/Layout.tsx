import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { ScrollToTop } from '../../app/ScrollToTop';

export function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-[var(--bg)] text-[var(--text)]">
      <Header />
      <ScrollToTop />
      <main className="flex-1 w-full pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
