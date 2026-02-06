"use client";

import React from "react";
import AdSignboard from "./AdSignboard";
import AdOrganizer from "./AdOrganizer";
import AdDetail from "./AdDetail";
import AdButton from "./AdButton";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { useAdItem } from "@/hooks/useAdItem";
import AdLikeContainer from "./AdLikeContainer";
import { Meetup } from "@/types/meetupType";
import Spinner from "../common/Spinner";

const AdArea = ({ initialData, meetupId }: { initialData: Meetup; meetupId: number }) => {
  const user = useSelector((state: RootState) => state.user.user);
  const userNickname = user?.nickname || "";
  const { adData, error, isPending } = useAdItem(meetupId, initialData);
  if (error) return <div>에러 발생: {error.message}</div>;
  if (isPending) {
    return <Spinner isLoading={isPending} />;
  }
  if (!adData) return <div>데이터를 찾을 수 없습니다.</div>;
  return (
    <div className="flex min-w-[32rem] flex-col items-center justify-center space-y-[0.5rem]">
      <AdSignboard adData={adData} />
      <div className="flex w-[95%] justify-between py-[1rem] md:max-w-[80rem]">
        <AdOrganizer adData={adData} />
        <AdLikeContainer id={adData.id} initialIsLike={adData.isLike} initialLikeCount={adData.likeCount} />
      </div>
      <AdDetail adData={adData} userNickname={userNickname} />
      <AdButton meetupId={meetupId} />
      ``
    </div>
  );
};

export default AdArea;
