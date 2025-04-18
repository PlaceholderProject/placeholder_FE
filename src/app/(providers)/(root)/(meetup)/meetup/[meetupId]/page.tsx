import KakaoMaps from "@/components/kakao/KakaoMaps";
import MeetupSignboard from "@/components/meetup/MeetupSignboard";
import ScheduleArea from "@/components/schedule/ScheduleArea";
import React from "react";


const MeetupPage = ({ params }: { params: { meetupId: string } }) => {
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
