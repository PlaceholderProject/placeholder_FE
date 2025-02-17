import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: {
    email: string | null;
    nickname: string | null;
    bio: string | null;
    profileImage: string | null;
  };
}

const initialState: UserState = {
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
    setUser(state, action: PayloadAction<UserState["user"]>) {
      state.user = action.payload;
    },
    logout: state => {
      state.user = {
        email: null,
        nickname: null,
        bio: null,
        profileImage: null,
      };
    },
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
