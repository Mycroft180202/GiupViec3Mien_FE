import { createSlice } from '@reduxjs/toolkit';
import { normalizeStoredUser } from '../../utils/auth';

const storedToken = localStorage.getItem('token');
let storedUser = null;
try { storedUser = normalizeStoredUser(JSON.parse(localStorage.getItem('user'))); } catch { storedUser = null; }

const initialState = {
  user: storedUser,
  token: storedToken,
  isAuthenticated: !!storedToken,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = normalizeStoredUser(action.payload.user);
      state.token = action.payload.token;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUser: (state, action) => {
      state.user = normalizeStoredUser({
        ...state.user,
        ...action.payload,
      });
      localStorage.setItem('user', JSON.stringify(state.user));
    },
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, updateUser, logout } = authSlice.actions;

export default authSlice.reducer;
