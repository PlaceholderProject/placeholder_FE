"use client";

import React from "react";
import MeetupForm from "@/components/meetup/MeetupForm";

// 위에 providers폴더는? 그 위에 app 폴더 안의 page 파일은?
const MeetupCreatePage = () => {
  return (
    <div className="py-[10rem]">
      <MeetupForm />
    </div>
  );
};

export default MeetupCreatePage;
