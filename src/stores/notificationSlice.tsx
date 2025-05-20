import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationState {
  hasUnread: boolean;
}

const initialState: NotificationState = {
  hasUnread: false,
};

const notificationSlice = createSlice({
  name: "notification", initialState, reducers: {
    setHasUnreadNotifications(state, action: PayloadAction<boolean>) {
      state.hasUnread = action.payload;
    },
  },
});

export const { setHasUnreadNotifications } = notificationSlice.actions;

export default notificationSlice.reducer;