import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import userReducer from "./userSlice";
import storage from "redux-persist/lib/storage";
import { createTransform, FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";
import nonModalReducer from "./nonModalSlice";
import modalReducer from "./modalSlice";
import sortReducer from "./sortSlice";
import filterReducer from "./filterSlice";
import replyReducer from "./replySlice";

// 데이터 직렬화/비직렬화 변환 설정
const transform = createTransform(
  // 저장하기 전에 실행 (인코딩)
  inboundState => JSON.stringify(inboundState),
  // 불러올 때 실행 (디코딩)
  outboundState => JSON.parse(outboundState),
);

// redux-persist 설정
const persistConfig = {
  key: "user",
  storage,
};

// user reducer에 persistReducer적용
const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nonModal: nonModalReducer,
    modal: modalReducer,
    reply: replyReducer,
    user: persistedUserReducer,

    sort: sortReducer,
    filter: filterReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
