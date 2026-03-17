import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from './hooks';
import { hydrateAuth, selectAuthStatus } from '../features/auth/authSlice';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const location = useLocation();

  useEffect(() => {
    dispatch(hydrateAuth());
  }, [dispatch, location.pathname]);

  if (status === 'signed_out') {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <>{children}</>;
}
