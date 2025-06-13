import KakaoMaps from "@/components/kakao/KakaoMaps";
import MeetupSignboard from "@/components/meetup/MeetupSignboard";
import ScheduleArea from "@/components/schedule/ScheduleArea";
import React from "react";

const MeetupPage = async ({ params }: { params: Promise<{ meetupId: string }> }) => {
  const { meetupId } = await params;

  const meetupIdNum = Number(meetupId);

  return (
    <div>
      <MeetupSignboard meetupId={meetupIdNum} />
      <div>
        <KakaoMaps meetupId={meetupIdNum} />
      </div>
      <div>
        <ScheduleArea meetupId={meetupIdNum} />
      </div>
    </div>
  );
};

export default MeetupPage;
