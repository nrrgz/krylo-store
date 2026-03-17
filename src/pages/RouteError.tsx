import { Link, isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function RouteError() {
  const error = useRouteError();

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred. Please try again.';

  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText || 'Error'}`;
    message =
      typeof error.data === 'string' && error.data.trim().length > 0
        ? error.data
        : 'We could not load this page right now.';
  } else if (error instanceof Error && error.message) {
    message = error.message;
  }

  return (
    <div className="container-base py-24">
      <div className="mx-auto max-w-2xl rounded-xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center shadow-sm">
        <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-gray-900">{title}</h1>
        <p className="mb-8 text-gray-600">{message}</p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/">
            <Button size="lg">Go Home</Button>
          </Link>
          <Link to="/products">
            <Button size="lg" variant="secondary">Browse Products</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
