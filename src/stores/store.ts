import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import nonModalReducer from "./nonModalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nonModal: nonModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
