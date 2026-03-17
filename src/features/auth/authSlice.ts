import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AppThunk } from '../../app/store';
import type { AuthState, User } from './authTypes';
import { authStorage } from './authStorage';

const initialState: AuthState = {
  user: null,
  status: 'signed_out',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setSignedIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.status = 'signed_in';
    },
    setSignedOut: (state) => {
      state.user = null;
      state.status = 'signed_out';
    },
  },
});

const { setSignedIn, setSignedOut } = authSlice.actions;

export const hydrateAuth = (): AppThunk => (dispatch) => {
  try {
    const user = authStorage.loadSessionUser();
    if (user) {
      dispatch(setSignedIn(user));
      return;
    }
  } catch (e) {
    console.error('Failed to hydrate auth state', e);
  }
  dispatch(setSignedOut());
};

export const register = (payload: { email: string; name: string; remember?: boolean }): AppThunk => (dispatch) => {
  const user = authStorage.registerUser(payload);
  dispatch(setSignedIn(user));
};

export const login = (payload: { email: string; remember?: boolean }): AppThunk => (dispatch) => {
  const user = authStorage.loginUser(payload);
  dispatch(setSignedIn(user));
};

export const logout = (): AppThunk => (dispatch) => {
  authStorage.clearSessionUser();
  dispatch(setSignedOut());
};

export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthed = (state: { auth: AuthState }) => state.auth.status === 'signed_in';
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status;

export default authSlice.reducer;
