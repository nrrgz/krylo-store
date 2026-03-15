import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { register } from '../features/auth/authSlice';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/account';

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email.');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }

    try {
      dispatch(register({ email, name }));
      navigate(redirect, { replace: true });
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Registration failed';
      setError(message);
    }
  };

  return (
    <div className="container-base py-24 flex items-center justify-center">
      <div className="w-full max-w-md bg-[var(--surface)] p-8 rounded-xl border border-[var(--border)] shadow-sm">
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">Create Account</h1>
        <p className="text-gray-500 mb-6 text-sm">Join Krylo to manage your orders.</p>

        {error && <div className="mb-4 text-red-500 text-sm font-semibold">{error}</div>}

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <Input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>
          <Button type="submit" size="lg" className="mt-4">
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button
            onClick={() => navigate(`/login?redirect=${encodeURIComponent(redirect)}`)}
            className="text-[var(--primary)] hover:underline font-semibold"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
}
