import type { User } from './authTypes';

const AUTH_STORAGE_KEY = 'krylo-auth-v1';
const USERS_STORAGE_KEY = 'krylo-users-v1';

const normalizeEmail = (email: string): string => email.trim().toLowerCase();

export const authStorage = {
  loadSessionUser(): User | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as User;
  },

  saveSessionUser(user: User): void {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  },

  clearSessionUser(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  loadUsers(): User[] {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  registerUser(payload: { email: string; name: string }): User {
    const email = normalizeEmail(payload.email);
    const name = payload.name.trim();

    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email.');
    }
    if (!name) {
      throw new Error('Please enter your name.');
    }

    const users = this.loadUsers();
    if (users.some((u) => u.email === email)) {
      throw new Error('Email already registered');
    }

    const user: User = {
      id: typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `usr-${Date.now()}`,
      email,
      name,
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    this.saveUsers(users);
    this.saveSessionUser(user);
    return user;
  },

  loginUser(payload: { email: string }): User {
    const email = normalizeEmail(payload.email);
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email.');
    }

    const users = this.loadUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      throw new Error('No account found');
    }

    this.saveSessionUser(user);
    return user;
  },
};
