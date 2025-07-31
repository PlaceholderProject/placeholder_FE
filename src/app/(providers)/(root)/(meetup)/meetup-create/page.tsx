import React from "react";
import MeetupForm from "@/components/meetup/MeetupForm";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

// 위에 providers폴더는? 그 위에 app 폴더 안의 page 파일은?
const MeetupCreatePage = () => {
  return (
    <div>
      <MeetupForm mode="create" />
    </div>
  );
};

export default MeetupCreatePage;
