import MyMeetupArea from "@/components/my-space/my-meetup/MyMeetupArea";
import React from "react";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const MyMeetupPage = () => {
  return <MyMeetupArea />;
};

export default MyMeetupPage;
