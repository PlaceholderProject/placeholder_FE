"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import MeetupEditForm from "@/components/meetup/MeetupEditForm";

const queryClient = new QueryClient();

const MeetupEditPage = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <MeetupEditForm meetupId={1} />
      </QueryClientProvider>
    </>
  );
};

export default MeetupEditPage;
