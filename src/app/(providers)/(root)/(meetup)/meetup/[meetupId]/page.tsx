import KakaoMaps from "@/components/kakao/KakaoMaps";
import MeetupSignboard from "@/components/meetup/MeetupSignboard";
import ScheduleArea from "@/components/schedule/ScheduleArea";
import React from "react";

interface MeetupPageProps {
  params: {
    meetupId: string;
  };
}

const MeetupPage = ({ params }: MeetupPageProps) => {
  const meetupId = Number(params.meetupId);

  return (
    <>
      <MeetupSignboard meetupId={meetupId} />
      <div>
        <KakaoMaps meetupId={meetupId} />
      </div>
      <div>
        <ScheduleArea meetupId={meetupId} />
      </div>
    </>
  );
};

export default MeetupPage;
