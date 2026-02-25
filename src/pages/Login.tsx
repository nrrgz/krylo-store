import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { login } from '../features/auth/authSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    try {
      dispatch(login({ email }));
      navigate(redirect, { replace: true });
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  };

  return (
    <div className="container-base py-24 flex items-center justify-center">
      <div className="w-full max-w-md bg-[var(--surface)] p-8 rounded-xl border border-[var(--border)] shadow-sm">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Sign In</h1>
        <p className="text-gray-500 mb-6 text-sm">Please log in to continue.</p>

        {error && <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>}

        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 mt-1">
            <input type="checkbox" id="remember" className="rounded border-gray-300" />
            <label htmlFor="remember" className="text-sm text-gray-600">Remember me</label>
          </div>
          <Button type="submit" size="lg" className="mt-4">
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Don't have an account?{' '}
          <button
            onClick={() => navigate(`/register?redirect=${encodeURIComponent(redirect)}`)}
            className="text-[var(--primary)] hover:underline font-semibold"
          >
            Create one
          </button>
        </div>
      </div>
    </div>
  );
}
