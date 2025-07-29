import KakaoMaps from "@/components/kakao/KakaoMaps";
import MeetupSignboard from "@/components/meetup/MeetupSignboard";
import ScheduleArea from "@/components/schedule/ScheduleArea";
import { notFound } from "next/navigation";
import React from "react";

const MeetupPage = ({ params }: { params: { meetupId: string } }) => {
  const { meetupId } = params;

  const meetupIdNum = Number(meetupId);
  if (isNaN(meetupIdNum) || meetupIdNum <= 0) {
    notFound();
  }

  return (
    <div className="-mb-[6rem] flex h-[calc(100vh-6rem)] h-[calc(100vh-7.5rem)] flex-col">
      <div className="md:hidden">
        <MeetupSignboard meetupId={meetupIdNum} />
      </div>
      <div className="flex-1 overflow-hidden md:flex md:flex-row">
        <div className="h-[400px] md:h-full md:w-1/2">
          <KakaoMaps meetupId={meetupIdNum} />
        </div>
        <div className="flex-1 overflow-y-auto md:mx-8 md:flex md:w-1/2 md:flex-col">
          <div className="hidden md:block">
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
