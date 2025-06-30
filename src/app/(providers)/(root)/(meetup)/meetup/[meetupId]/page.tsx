import KakaoMaps from "@/components/kakao/KakaoMaps";
import MeetupSignboard from "@/components/meetup/MeetupSignboard";
import ScheduleArea from "@/components/schedule/ScheduleArea";
import React from "react";

const MeetupPage = async ({ params }: { params: Promise<{ meetupId: string }> }) => {
  const { meetupId } = await params;

  const meetupIdNum = Number(meetupId);

  return (
    <div>
      <div className="lg:hidden">
        <MeetupSignboard meetupId={meetupIdNum} />
      </div>
      <div className="lg:flex lg:flex-row lg:gap-8">
        <div className="h-[400px] lg:h-auto lg:w-1/2">
          <KakaoMaps meetupId={meetupIdNum} />
        </div>
        <div className="lg:flex lg:w-1/2 lg:flex-col">
          <div className="hidden lg:block">
            <MeetupSignboard meetupId={meetupIdNum} />
          </div>
          <ScheduleArea meetupId={meetupIdNum} />
        </div>
      </div>
    </div>
  );
};

export default MeetupPage;
