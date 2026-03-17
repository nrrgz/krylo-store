import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from './hooks';
import { selectAuthHydrated, selectAuthStatus } from '../features/auth/authSlice';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const hydrated = useAppSelector(selectAuthHydrated);
  const status = useAppSelector(selectAuthStatus);
  const location = useLocation();

  if (!hydrated) {
    return null;
  }

  if (status === 'signed_out') {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}
