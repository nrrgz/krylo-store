import { beforeEach, describe, expect, it } from 'vitest';
import { authStorage } from './authStorage';

describe('authStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('registers a new user and stores session', () => {
    const user = authStorage.registerUser({ email: 'user@example.com', name: 'User Name' });

    expect(user.email).toBe('user@example.com');
    expect(authStorage.loadUsers()).toHaveLength(1);
    expect(authStorage.loadSessionUser()?.email).toBe('user@example.com');
  });

  it('prevents duplicate registration', () => {
    authStorage.registerUser({ email: 'user@example.com', name: 'User Name' });

    expect(() => authStorage.registerUser({ email: 'USER@example.com', name: 'Another' })).toThrow(
      'Email already registered',
    );
  });

  it('logs in existing user and writes session', () => {
    authStorage.registerUser({ email: 'user@example.com', name: 'User Name' });
    authStorage.clearSessionUser();

    const loggedIn = authStorage.loginUser({ email: 'user@example.com' });
    expect(loggedIn.name).toBe('User Name');
    expect(authStorage.loadSessionUser()?.email).toBe('user@example.com');
  });

  it('throws for unknown login', () => {
    expect(() => authStorage.loginUser({ email: 'missing@example.com' })).toThrow('No account found');
  });

  it('expires session when expiresAt is in the past', () => {
    const user = authStorage.registerUser({ email: 'user@example.com', name: 'User Name' });

    localStorage.setItem(
      'krylo-auth-v1',
      JSON.stringify({
        user,
        issuedAt: '2026-03-01T00:00:00.000Z',
        expiresAt: '2026-03-01T00:00:01.000Z',
        remember: false,
      }),
    );

    expect(authStorage.loadSessionUser()).toBeNull();
    expect(localStorage.getItem('krylo-auth-v1')).toBeNull();
  });

  it('invalidates session when user no longer exists', () => {
    const user = authStorage.registerUser({ email: 'user@example.com', name: 'User Name' });
    authStorage.saveUsers([]);
    authStorage.saveSessionUser(user, true);

    expect(authStorage.loadSessionUser()).toBeNull();
    expect(localStorage.getItem('krylo-auth-v1')).toBeNull();
  });
});
