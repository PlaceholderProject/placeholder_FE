"use client";

import React from "react";
import { useParams } from "next/navigation";
import MeetupForm from "@/components/meetup/MeetupForm";

const MeetupEditPage = () => {
  const { meetupId } = useParams<{ meetupId: string }>();
  return (
    <>
      <MeetupForm mode="edit" meetupId={parseInt(meetupId, 10)} />
    </>
  );
};

export default MeetupEditPage;
