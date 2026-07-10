import MeetupDetailArea from "@/components/meetup/MeetupDetailArea";
import { notFound } from "next/navigation";
import React from "react";
import { parsePositiveInteger } from "@/utils/parsePositiveInteger";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const MeetupPage = async ({ params }: { params: Promise<{ meetupId: string }> }) => {
  const { meetupId } = await params;

  const meetupIdNum = parsePositiveInteger(meetupId);
  if (!meetupIdNum) notFound();

  return <MeetupDetailArea meetupId={meetupIdNum} />;
};

export default MeetupPage;
