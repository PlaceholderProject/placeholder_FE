"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MeetupForm from "@/components/meetup/MeetupForm";

const queryClient = new QueryClient();

// 위에 providers폴더는? 그 위에 app 폴더 안의 page 파일은?
const MeetupCreatePage = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MeetupForm />
      </QueryClientProvider>
    </>
  );
};

export default MeetupCreatePage;
