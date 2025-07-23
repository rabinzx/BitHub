import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  userInfo: any; // Adjust type as needed
}

const initialState: AuthState = {
  userInfo: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserInfo(state, action: PayloadAction<any>) {
      state.userInfo = action.payload;
    },
    clearUserInfo(state) {
      state.userInfo = null;
    },
  },
});

export const { setUserInfo, clearUserInfo } = authSlice.actions;
export default authSlice.reducer;