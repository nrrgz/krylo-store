import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { useAppDispatch, useAppSelector } from './hooks';
import { hydrateAuth, selectAuthStatus } from '../features/auth/authSlice';
import { authStorage } from '../features/auth/authStorage';
import { store } from './store';

function AuthHydrator() {
  const dispatch = useAppDispatch();
  const authStatus = useAppSelector(selectAuthStatus);

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch]);

  useEffect(() => {
    const revalidate = () => dispatch(hydrateAuth());

    const onStorage = (event: StorageEvent) => {
      if (event.key === 'krylo-auth-v1' || event.key === 'krylo-users-v1' || event.key === null) {
        revalidate();
      }
    };

    const onFocus = () => revalidate();
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        revalidate();
      }
    };

    window.addEventListener('storage', onStorage);
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [dispatch]);

  useEffect(() => {
    if (authStatus !== 'signed_in') return;

    const expiresAt = authStorage.getSessionExpiryMs();
    if (!expiresAt) {
      dispatch(hydrateAuth());
      return;
    }

    const delayMs = Math.max(expiresAt - Date.now(), 0) + 50;
    const timer = window.setTimeout(() => {
      dispatch(hydrateAuth());
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [authStatus, dispatch]);

  return null;
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
          },
        },
      }),
  );

  return (
    <ReduxProvider store={store}>
      <AuthHydrator />
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </ReduxProvider>
  );
}
