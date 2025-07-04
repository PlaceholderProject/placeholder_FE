"use client";

import React from "react";
import MeetupEditForm from "@/components/meetup/MeetupEditForm";
import { useParams } from "next/navigation";

const MeetupEditPage = () => {
  const { meetupId } = useParams<{ meetupId: string }>();
  return (
    <>
      <MeetupEditForm meetupId={parseInt(meetupId, 10)} />
    </>
  );
};

export default MeetupEditPage;
