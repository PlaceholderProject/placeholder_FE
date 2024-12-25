import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  isPasswordRechecked: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isPasswordRechecked: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setIsAuthenticated(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setIsPasswordRechecked(state, action: PayloadAction<boolean>) {
      state.isPasswordRechecked = action.payload;
    },
  },
});

export const { setIsAuthenticated, setIsPasswordRechecked } = authSlice.actions;

export default authSlice.reducer;
