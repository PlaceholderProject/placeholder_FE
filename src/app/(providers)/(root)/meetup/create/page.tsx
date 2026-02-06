import React from "react";
import MeetupForm from "@/components/meetup/MeetupForm";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};
const MeetupCreatePage = () => {
  return (
    <div>
      <MeetupForm mode="create" />
    </div>
  );
};

export default MeetupCreatePage;
