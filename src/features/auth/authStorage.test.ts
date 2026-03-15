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
});
