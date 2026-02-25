import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from './hooks';
import { selectAuthStatus } from '../features/auth/authSlice';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const status = useAppSelector(selectAuthStatus);
  const location = useLocation();

  if (status === 'signed_out') {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}
