"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "./store";

type Children = {
  children: React.ReactNode;
};

export default function Providers({ children }: Children) {
  return (
    <>
      <Provider store={store}>{children}</Provider>
    </>
  );
}
