"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const AdClientSideWrapper = ({ meetupId }: { meetupId: number }) => {
  return (
    <>
      <div>
        <QueryClientProvider client={queryClient}>
          <div>--TO DO-- AdClientSideWrapper 이브와 논의🧼</div>
        </QueryClientProvider>
      </div>
    </>
  );
};

export default AdClientSideWrapper;
