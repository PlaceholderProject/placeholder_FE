import MeetupSignboard from "@/components/meetup/MeetupSignboard";
import ScheduleArea from "@/components/schedule/ScheduleArea";
import KakaoMaps from "@/components/kakao/KakaoMaps";
import React from "react";

interface MeetupPageProps {
  params: {
    meetupId: string;
  };
}

const SchedulePage = ({ params }: MeetupPageProps) => {
  const meetupId = Number(params.meetupId);

  return (
    <div className="">
      <MeetupSignboard meetupId={meetupId} />
      <div>
        <KakaoMaps />
      </div>
      <div>
        <ScheduleArea meetupId={meetupId} />
      </div>
    </div>
  );
};

export default SchedulePage;
