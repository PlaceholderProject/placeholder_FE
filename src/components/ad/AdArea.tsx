import React from "react";
import AdSignboard from "./AdSignboard";
import AdOrganizer from "./AdOrganizer";
import AdDetail from "./AdDetail";
import AdButton from "./AdButton";
import { useParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { useAdItem } from "@/hooks/useAdItem";
import { SkeletonTheme } from "react-loading-skeleton";
import AdAreaSkeleton from "@/components/ad/AdAreaSkeleton";

const AdArea = () => {
  const { meetupId } = useParams();
  const meetupIdNum = Number(meetupId);
  const user = useSelector((state: RootState) => state.user.user);
  const userNickname = user?.nickname || "";

  // 통합해서 adData가져오기
  const { adData, error, isPending } = useAdItem(meetupIdNum);
  if (error) return <div>에러 발생: {error.message}</div>;
  if (isPending) {
    return (
      <div className="py-[10rem]">
        <SkeletonTheme baseColor="#E8E8E8" highlightColor="#D9D9D9">
          <AdAreaSkeleton />
        </SkeletonTheme>
      </div>
    );
  }
  if (!adData) return <div>데이터를 찾을 수 없습니다.</div>;

  return (
    <div className="mx-auto w-[34rem]">
      <div className="flex-col space-y-[0.5rem]">
        <AdSignboard adData={adData} />
        <AdOrganizer adData={adData} />
        <AdDetail adData={adData} userNickname={userNickname} />
        <AdButton meetupId={meetupIdNum} />
      </div>
    </div>
  );
};

export default AdArea;
