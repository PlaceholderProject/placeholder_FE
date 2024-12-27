"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AdButton from "./AdButton";

const queryClient = new QueryClient();

const AdClientSideWrapper = ({ meetupId }: { meetupId: number }) => {
  return (
    <>
      <div>
        <QueryClientProvider client={queryClient}>
          <div>🧼🧼🧼🧼🧼🧼🧼🧼🧼🧼🧼🧼🧼🧼</div>
          <AdButton />
          <div>유저 인터렉티브 있는 CSR 컴포넌트들이 들어갈거예욥 근데 이제 CSS는 1도 고려하지 않은...</div>
        </QueryClientProvider>
      </div>
    </>
  );
};

export default AdClientSideWrapper;
