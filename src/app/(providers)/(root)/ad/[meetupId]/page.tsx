"use client";

import { use, useEffect } from "react";
import AdButton from "@/components/ad/AdButton";
import AdClientSideWrapper from "@/components/ad/AdClientSideWrapper";
import AdDetail from "@/components/ad/AdDetail";
import AdSignboard from "@/components/ad/AdSignboard";
import AdOrganizer from "@/components/ad/AdOrganizer";
import ReplyArea from "@/components/common/reply/ReplyArea";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";

type PageParams = {
  meetupId: string;
};

const AdPage = ({ params }: { params: PageParams }) => {
  const resolvedParams = use(params as any) as PageParams;
  const parsedMeetupId = parseInt(resolvedParams.meetupId, 10);
  const user = useSelector((state: RootState) => state.user.user);
  const userNickname = user?.nickname || "";

  console.log("광고페이지 유저 메일정보는?", userNickname);

  return (
    <div>
      <AdSignboard meetupId={parsedMeetupId} />
      <AdOrganizer meetupId={parsedMeetupId} />
      <AdDetail meetupId={parsedMeetupId} userNickname={userNickname} />
      <AdButton meetupId={parsedMeetupId} />
      <ReplyArea />
      <AdClientSideWrapper meetupId={parsedMeetupId} />
    </div>
  );
};

export default AdPage;
