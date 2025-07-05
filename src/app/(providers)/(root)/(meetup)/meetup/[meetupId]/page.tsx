import KakaoMaps from "@/components/kakao/KakaoMaps";
import MeetupSignboard from "@/components/meetup/MeetupSignboard";
import ScheduleArea from "@/components/schedule/ScheduleArea";
import React from "react";

const MeetupPage = async ({ params }: { params: Promise<{ meetupId: string }> }) => {
  const { meetupId } = await params;

  const meetupIdNum = Number(meetupId);

  return (
    <div className="-mb-[6rem] flex h-[calc(100vh-6rem)] flex-col md:h-[calc(100vh-7.5rem)]">
      <div className="lg:hidden">
        <MeetupSignboard meetupId={meetupIdNum} />
      </div>
      <div className="flex-1 overflow-hidden lg:flex lg:flex-row">
        <div className="h-[400px] lg:h-full lg:w-1/2">
          <KakaoMaps meetupId={meetupIdNum} />
        </div>
        <div className="flex-1 overflow-y-auto lg:mx-8 lg:flex lg:w-1/2 lg:flex-col">
          <div className="hidden lg:block">
            <MeetupSignboard meetupId={meetupIdNum} />
          </div>
          <div className="flex-1 overflow-y-auto">
            <ScheduleArea meetupId={meetupIdNum} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetupPage;
