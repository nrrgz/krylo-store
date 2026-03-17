import type { User } from './authTypes';

const AUTH_STORAGE_KEY = 'krylo-auth-v1';
const USERS_STORAGE_KEY = 'krylo-users-v1';
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;
const REMEMBER_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const normalizeEmail = (email: string): string => email.trim().toLowerCase();
const isUserLike = (value: unknown): value is User => {
  if (!value || typeof value !== 'object') return false;

  const candidate = value as Partial<User>;
  return Boolean(
    candidate.id &&
      candidate.name &&
      candidate.email &&
      candidate.createdAt &&
      typeof candidate.id === 'string' &&
      typeof candidate.name === 'string' &&
      typeof candidate.email === 'string' &&
      typeof candidate.createdAt === 'string',
  );
};

interface AuthSession {
  user: User;
  issuedAt: string;
  expiresAt: string;
  remember: boolean;
}

const parseSession = (raw: string): Partial<AuthSession> | null => {
  try {
    return JSON.parse(raw) as Partial<AuthSession>;
  } catch {
    return null;
  }
};

export const authStorage = {
  loadSessionUser(): User | null {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as unknown;

      // Legacy migration path: session previously stored as plain user object.
      if (isUserLike(parsed)) {
        this.saveSessionUser(parsed, false);
        return parsed;
      }

      const session = parsed as Partial<AuthSession>;
      if (!session || !session.user || !session.expiresAt || !isUserLike(session.user)) {
        this.clearSessionUser();
        return null;
      }

      const expiresAt = new Date(session.expiresAt).getTime();
      if (!Number.isFinite(expiresAt) || Date.now() >= expiresAt) {
        this.clearSessionUser();
        return null;
      }

      const users = this.loadUsers();
      const exists = users.some((user) => user.id === session.user!.id);
      if (!exists) {
        this.clearSessionUser();
        return null;
      }

      return session.user;
    } catch (e) {
      console.error('Failed to parse auth session', e);
      this.clearSessionUser();
      return null;
    }
  },

  saveSessionUser(user: User, remember = false): void {
    const ttl = remember ? REMEMBER_SESSION_TTL_MS : SESSION_TTL_MS;
    const now = Date.now();
    const session: AuthSession = {
      user,
      issuedAt: new Date(now).toISOString(),
      expiresAt: new Date(now + ttl).toISOString(),
      remember,
    };
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
  },

  getSessionExpiryMs(): number | null {
    const user = this.loadSessionUser();
    if (!user) return null;

    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;

    const session = parseSession(raw);
    if (!session?.expiresAt) return null;

    const expiresAt = new Date(session.expiresAt).getTime();
    return Number.isFinite(expiresAt) ? expiresAt : null;
  },

  clearSessionUser(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  },

  loadUsers(): User[] {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) return [];

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return [];
      return parsed.filter(isUserLike);
    } catch (e) {
      console.error('Failed to parse users from storage', e);
      return [];
    }
  },

  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  },

  registerUser(payload: { email: string; name: string; remember?: boolean }): User {
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
    this.saveSessionUser(user, payload.remember ?? false);
    return user;
  },

  loginUser(payload: { email: string; remember?: boolean }): User {
    const email = normalizeEmail(payload.email);
    if (!email || !email.includes('@')) {
      throw new Error('Please enter a valid email.');
    }

    const users = this.loadUsers();
    const user = users.find((u) => u.email === email);

    if (!user) {
      throw new Error('No account found');
    }

    this.saveSessionUser(user, payload.remember ?? false);
    return user;
  },
};
