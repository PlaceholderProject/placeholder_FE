"use client";

import React from "react";
import { useParams } from "next/navigation";
import MeetupForm from "@/components/meetup/MeetupForm";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const MeetupEditPage = () => {
  const { meetupId } = useParams<{ meetupId: string }>();
  return (
    <>
      <MeetupForm mode="edit" meetupId={parseInt(meetupId, 10)} />
    </>
  );
};

export default MeetupEditPage;
