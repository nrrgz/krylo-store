import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from './authTypes';

const AUTH_STORAGE_KEY = 'krylo-auth-v1';
const USERS_STORAGE_KEY = 'krylo-users-v1';

const loadInitialState = (): AuthState => {
  try {
    const data = localStorage.getItem(AUTH_STORAGE_KEY);
    if (data) {
      const user = JSON.parse(data);
      return { user, status: 'signed_in' };
    }
  } catch (e) {
    console.error('Failed to load auth state', e);
  }
  return { user: null, status: 'signed_out' };
};

const initialState: AuthState = loadInitialState();

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    hydrateAuth: (state) => {
      try {
        const data = localStorage.getItem(AUTH_STORAGE_KEY);
        if (data) {
          const user = JSON.parse(data);
          state.user = user;
          state.status = 'signed_in';
        }
      } catch (e) {
        console.error('Failed to load auth state', e);
      }
    },
    register: (state, action: PayloadAction<{ email: string; name: string }>) => {
      const email = action.payload.email.trim().toLowerCase();
      const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      const existingUsers: User[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

      if (existingUsers.some(u => u.email === email)) {
        throw new Error("Email already registered");
      }

      const user: User = {
        id: crypto.randomUUID ? crypto.randomUUID() : `usr-${Date.now()}`,
        email,
        name: action.payload.name,
        createdAt: new Date().toISOString(),
      };

      existingUsers.push(user);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(existingUsers));

      state.user = user;
      state.status = 'signed_in';
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    },
    login: (state, action: PayloadAction<{ email: string }>) => {
      const email = action.payload.email.trim().toLowerCase();
      const existingUsersRaw = localStorage.getItem(USERS_STORAGE_KEY);
      const existingUsers: User[] = existingUsersRaw ? JSON.parse(existingUsersRaw) : [];

      const user = existingUsers.find(u => u.email === email);
      if (!user) {
        throw new Error("No account found");
      }

      state.user = user;
      state.status = 'signed_in';
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    },
    logout: (state) => {
      state.user = null;
      state.status = 'signed_out';
      localStorage.removeItem(AUTH_STORAGE_KEY);
    },
  },
});

export const { register, login, logout, hydrateAuth } = authSlice.actions;

export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthed = (state: { auth: AuthState }) => state.auth.status === 'signed_in';
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;

export default authSlice.reducer;
