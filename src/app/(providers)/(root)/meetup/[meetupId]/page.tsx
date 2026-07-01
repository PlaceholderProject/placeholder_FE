import MeetupDetailArea from "@/components/meetup/MeetupDetailArea";
import { notFound } from "next/navigation";
import React from "react";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const MeetupPage = async ({ params }: { params: Promise<{ meetupId: string }> }) => {
  const { meetupId } = await params;

  const meetupIdNum = Number(meetupId);
  if (isNaN(meetupIdNum) || meetupIdNum <= 0) {
    notFound();
  }

  return <MeetupDetailArea meetupId={meetupIdNum} />;
};

export default MeetupPage;
