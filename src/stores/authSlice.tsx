import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  isPasswordRechecked: boolean;
  isCheckedEmail: boolean;
  isCheckedNickname: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isPasswordRechecked: false,
  isCheckedEmail: false,
  isCheckedNickname: false,
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
    setIsCheckedEmail(state, action: PayloadAction<boolean>) {
      state.isCheckedEmail = action.payload;
    },
    setIsCheckedNickname(state, action: PayloadAction<boolean>) {
      state.isCheckedNickname = action.payload;
    },
  },
});

export const { setIsAuthenticated, setIsPasswordRechecked, setIsCheckedEmail, setIsCheckedNickname } = authSlice.actions;

export default authSlice.reducer;
