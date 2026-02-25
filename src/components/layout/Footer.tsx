export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] py-12 mt-16">
      <div className="container-base flex flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg font-semibold text-[var(--primary-foreground)]">Krylo</p>
        <p className="text-sm opacity-80 max-w-md">
          Aesthetics and performance engineered for your ultimate desk setup.
        </p>
        <p className="text-sm opacity-60 mt-4">
          &copy; {new Date().getFullYear()} Krylo. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
