import React from "react";
import MeetupForm from "@/components/meetup/MeetupForm";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const MeetupEditPage = async ({ params }: { params: Promise<{ meetupId: string }> }) => {
  const { meetupId } = await params;
  return (
    <>
      <MeetupForm mode="edit" meetupId={parseInt(meetupId, 10)} />
    </>
  );
};

export default MeetupEditPage;
