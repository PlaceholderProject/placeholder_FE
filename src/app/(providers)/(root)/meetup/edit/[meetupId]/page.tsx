import React from "react";
import MeetupForm from "@/components/meetup/MeetupForm";
import { parsePositiveInteger } from "@/utils/parsePositiveInteger";
import { notFound } from "next/navigation";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const MeetupEditPage = async ({ params }: { params: Promise<{ meetupId: string }> }) => {
  const { meetupId } = await params;
  const meetupIdNum = parsePositiveInteger(meetupId);
  if (!meetupIdNum) notFound();

  return <MeetupForm mode="edit" meetupId={meetupIdNum} />;
};

export default MeetupEditPage;
