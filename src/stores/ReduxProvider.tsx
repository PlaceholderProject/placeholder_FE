"use client";

import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "./store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// 위 임포트 두 줄 추가 & 쿼리클라이언트 프로바이더 코드 추가했습니다!!!!
// 전 컴포넌트에서 탠스택쿼리 사용하기 위함!

type Children = {
  children: React.ReactNode;
};

export default function Providers({ children }: Children) {
  const [queryClient] = useState(() => new QueryClient());
  // 뭔 문법인지 모르겟는데 필요해서 추가햇습ㄴ다 우선

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>{children}</Provider>
      </QueryClientProvider>
    </>
  );
}
