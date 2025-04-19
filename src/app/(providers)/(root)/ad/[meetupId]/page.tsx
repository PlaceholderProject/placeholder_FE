"use client";

import { use } from "react";
import AdButton from "@/components/ad/AdButton";
import AdClientSideWrapper from "@/components/ad/AdClientSideWrapper";
import AdDetail from "@/components/ad/AdDetail";
import AdSignboard from "@/components/ad/AdSignboard";
import AdOrganizer from "@/components/ad/AdOrganizer";
import ReplyArea from "@/components/common/reply/ReplyArea";

type PageParams = {
  meetupId: string;
};

const AdPage = ({ params }: { params: PageParams }) => {
  const resolvedParams = use(params as any) as PageParams;
  const parsedMeetupId = parseInt(resolvedParams.meetupId, 10);

  return (
    <div>
      <AdSignboard meetupId={parsedMeetupId} />
      <AdOrganizer meetupId={parsedMeetupId} />
      <AdDetail meetupId={parsedMeetupId} />
      <AdButton meetupId={parsedMeetupId} />
      <ReplyArea />
      <AdClientSideWrapper meetupId={parsedMeetupId} />
    </div>
  );
};

export default AdPage;
