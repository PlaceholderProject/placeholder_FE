import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from "redux-persist";

import authReducer from "./authSlice";
import userReducer from "./userSlice";
import notificationReducer from "./notificationSlice";
import nonModalReducer from "./nonModalSlice";
import modalReducer from "./modalSlice";
import sortReducer from "./sortSlice";
import filterReducer from "./filterSlice";
import replyReducer from "./replySlice";
import proposalReducer from "./proposalSlice";
import searchReducer from "./searchSlice";
import memberOutReducer from "./memberOutSlice";

// redux-persist 설정
const persistConfig = {
  key: "user",
  storage,
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

export const store = configureStore({
  reducer: {
    auth: authReducer,
    nonModal: nonModalReducer,
    modal: modalReducer,
    reply: replyReducer,
    user: persistedUserReducer,
    proposal: proposalReducer,
    notification: notificationReducer,
    sort: sortReducer,
    filter: filterReducer,
    search: searchReducer,
    memberOut: memberOutReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // 'modal/openModal' 액션과 non-serializable 값 검사무시
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, "modal/openModal"],
        ignoredPaths: ["modal.modalData.onCompletePostcode"],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
