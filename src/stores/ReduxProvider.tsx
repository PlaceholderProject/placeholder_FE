//-----TODO: 파일 이름을 바꿔야할 것 같습니당!!!!-----

"use client";

import React, { useState } from "react";
import { Provider } from "react-redux";
import { persistor, store } from "./store";
import { PersistGate } from "redux-persist/integration/react";

type Children = {
  children: React.ReactNode;
};

export default function ReduxProvider({ children }: Children) {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      </Provider>
    </>
  );
}
