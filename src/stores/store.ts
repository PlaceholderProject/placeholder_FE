import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import accountReducer from "./accountSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

// redux-persist 설정
const persistConfig = {
  key: "account",
  storage,
};

// account reducer에 persistReducer적용
const persistedAccountReducer = persistReducer(persistConfig, accountReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    account: persistedAccountReducer,
  },
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
