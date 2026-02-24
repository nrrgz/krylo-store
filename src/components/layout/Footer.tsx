export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Krylo. All rights reserved.
      </div>
    </footer>
  );
}
