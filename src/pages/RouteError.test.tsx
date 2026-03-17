import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router-dom';
import { RouteError } from './RouteError';

describe('RouteError', () => {
  it('renders generic error message for thrown Error', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          loader: () => {
            throw new Error('Boom failure');
          },
          HydrateFallback: () => null,
          element: <div>ok</div>,
          errorElement: <RouteError />,
        },
      ],
      { initialEntries: ['/'] },
    );

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Boom failure')).toBeInTheDocument();
  });

  it('renders route response details when loader throws Response', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          loader: () => {
            throw new Response('Cannot load this route', { status: 500, statusText: 'Server Error' });
          },
          HydrateFallback: () => null,
          element: <div>ok</div>,
          errorElement: <RouteError />,
        },
      ],
      { initialEntries: ['/'] },
    );

    render(<RouterProvider router={router} />);

    expect(await screen.findByText('500 Server Error')).toBeInTheDocument();
    expect(screen.getByText('Cannot load this route')).toBeInTheDocument();
  });
});
