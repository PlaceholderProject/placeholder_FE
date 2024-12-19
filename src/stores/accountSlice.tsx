import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AccountState {
  isPasswordRechecked: boolean;
  user: {
    email: string | null;
    nickname: string | null;
    bio: string | null;
    profileImage: string | null;
  };
}

const initialState: AccountState = {
  isPasswordRechecked: false,
  user: {
    email: null,
    nickname: null,
    bio: null,
    profileImage: null,
  },
};

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setIsPasswordRechecked(state, action: PayloadAction<boolean>) {
      state.isPasswordRechecked = action.payload;
    },
    setUser(state, action: PayloadAction<AccountState["user"]>) {
      state.user = action.payload;
    },
  },
});

export const { setIsPasswordRechecked, setUser } = accountSlice.actions;

export default accountSlice.reducer;
