"use client";

import AdButton from "@/components/ad/AdButton";
import AdClientSideWrapper from "@/components/ad/AdClientSideWrapper";
import AdDetail from "@/components/ad/AdDetail";
import AdSignboard from "@/components/ad/AdSignboard";
import AdOrganizer from "@/components/ad/AdOrganizer";
import ReplyArea from "@/components/common/reply/ReplyArea";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { useParams } from "next/navigation";

const AdPage = () => {
  const { meetupId } = useParams();
  const meetupIdNum = Number(meetupId);

  const user = useSelector((state: RootState) => state.user.user);
  const userNickname = user?.nickname || "";

  console.log("광고페이지 유저 메일정보는?", userNickname);

  return (
    <div className="py-[10rem]">
      <AdSignboard meetupId={meetupIdNum} />
      <AdOrganizer meetupId={meetupIdNum} />
      <AdDetail meetupId={meetupIdNum} userNickname={userNickname} />
      <AdButton meetupId={meetupIdNum} />
      <ReplyArea />
      <AdClientSideWrapper meetupId={meetupIdNum} />
    </div>
  );
};

export default AdPage;
