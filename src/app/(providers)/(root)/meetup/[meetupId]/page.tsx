import KakaoMaps from "@/components/kakao/KakaoMaps";
import MeetupSignboard from "@/components/meetup/MeetupSignboard";
import ScheduleArea from "@/components/schedule/ScheduleArea";
import { notFound } from "next/navigation";
import React from "react";

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const MeetupPage = async ({ params }: { params: Promise<{ meetupId: string }> }) => {
  const { meetupId } = await params;

  const meetupIdNum = Number(meetupId);
  if (isNaN(meetupIdNum) || meetupIdNum <= 0) {
    notFound();
  }

  return (
    <div className="-mb-[6rem] flex h-[calc(100vh-6rem)] flex-col md:h-[calc(100vh-7.5rem)]">
      <div className="md:hidden">
        <MeetupSignboard meetupId={meetupIdNum} />
      </div>
      <div className="flex-1 overflow-hidden md:flex md:flex-row md:p-8">
        <div className="h-[400px] overflow-hidden md:h-full md:w-2/5 md:rounded-3xl">
          <KakaoMaps meetupId={meetupIdNum} />
        </div>
        <div className="flex-1 overflow-y-auto md:flex md:w-3/5 md:flex-col md:pl-8">
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
