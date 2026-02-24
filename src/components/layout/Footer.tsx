export function Footer() {
  return (
    <footer className="w-full border-t border-gray-100 bg-gray-50 py-12 mt-16">
      <div className="container-base flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-gray-900">Krylo</p>
        <p className="text-sm text-gray-500 max-w-md">
          Aesthetics and performance engineered for your ultimate desk setup.
        </p>
        <p className="text-sm text-gray-400 mt-4">
          &copy; {new Date().getFullYear()} Krylo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
