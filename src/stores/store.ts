import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import nonModalReducer from "./nonModalSlice";
import modalReducer from "./modalSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nonModal: nonModalReducer,
    modal: modalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
