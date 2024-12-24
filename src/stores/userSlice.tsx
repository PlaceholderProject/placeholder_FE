import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  isPasswordRechecked: boolean;
  user: {
    email: string | null;
    nickname: string | null;
    bio: string | null;
    profileImage: string | null;
  };
}

const initialState: UserState = {
  isPasswordRechecked: false,
  user: {
    email: null,
    nickname: null,
    bio: null,
    profileImage: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsPasswordRechecked(state, action: PayloadAction<boolean>) {
      state.isPasswordRechecked = action.payload;
    },
    setUser(state, action: PayloadAction<UserState["user"]>) {
      state.user = action.payload;
    },
  },
});

export const { setIsPasswordRechecked, setUser } = userSlice.actions;

export default userSlice.reducer;
