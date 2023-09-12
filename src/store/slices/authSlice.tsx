import { createSlice } from '@reduxjs/toolkit';
import { Auth } from '../../interfaces/models/auth';

export type AuthState = Auth | null;

const initialState: AuthState = null;

export const authSlice = createSlice({
  name: 'admin',
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state = action.payload;
      return state;
    },
    logout: (state) => {
      state = null;

      return state;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
