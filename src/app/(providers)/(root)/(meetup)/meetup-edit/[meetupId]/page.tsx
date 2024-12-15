"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import MeetupEditForm from "@/components/meetup/MeetupEditForm";
import { useParams } from "next/navigation";

const queryClient = new QueryClient();

const MeetupEditPage = () => {
  const { meetupId } = useParams<{ meetupId: string }>();
  return (
    <>
      <div>모임 수정 페이지</div>
      <QueryClientProvider client={queryClient}>{meetupId && <MeetupEditForm meetupId={parseInt(meetupId, 10)} />}</QueryClientProvider>
    </>
  );
};

export default MeetupEditPage;
