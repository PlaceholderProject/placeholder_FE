import KakaoMaps from "@/components/kakao/KakaoMaps";
import MeetupSignboard from "@/components/meetup/MeetupSignboard";
import ScheduleArea from "@/components/schedule/ScheduleArea";
import React from "react";

const SchedulePage = () => {
  return (
    <div className="">
      <div className="h-16 bg-slate-400">임시 헤더</div>
      <MeetupSignboard />
      <div>
        <KakaoMaps />
      </div>
      <div>
        <ScheduleArea />
      </div>
    </div>
  );
};

export default SchedulePage;
