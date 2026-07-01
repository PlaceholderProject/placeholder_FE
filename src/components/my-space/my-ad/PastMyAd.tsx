"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyAdsApi } from "@/services/my.space.service";
import { BUTTONS_PER_GROUP, SIZE_LIMIT } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";
import MySpaceListItem from "../MySpaceListItem";
import Spinner from "@/components/common/Spinner";
import { LuMegaphone } from "react-icons/lu";

const PastMyAd = () => {
  const [page, setPage] = useState(1);

  const handlePageButtonClick = (newPage: number) => {
    setPage(newPage);
  };

  // 이전 이후 그룹 버튼 핸들러

  //이전 버튼 클릭
  const handlePreviousGroupButtonClick = () => {
    // 현재 그룹 찾기
    const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);
    // 이전 그룹의 마지막 페이지는
    const previousGroupLastPage = (currentGroup - 1) * BUTTONS_PER_GROUP;
    setPage(previousGroupLastPage);
  };

  //  이후 버튼 클릭
  const handleNextGroupButtonClick = () => {
    //현재 그룹
    const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);
    // 다음 그룹 첫페이지는
    const nextGroupFirstPage = currentGroup * BUTTONS_PER_GROUP + 1;
    setPage(nextGroupFirstPage);
  };

  const {
    data: myAdsData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myAds", "ended"],
    queryFn: () => getMyAdsApi("ended", page, SIZE_LIMIT),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const totalPages = Math.ceil((myAdsData?.total ?? 0) / SIZE_LIMIT);

  // 현재 페이지가 속한 그룹
  const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);

  // 이전 그룹 있니?
  const hasPreviousGroup = currentGroup > 1;

  //다음 그룸 있니?
  const hasNextGroup = currentGroup * BUTTONS_PER_GROUP < totalPages;

  // 현재 그룹에 표시할 페이지 버튼 범위
  const startPage = (currentGroup - 1) * BUTTONS_PER_GROUP + 1;
  const endPage = Math.min(currentGroup * BUTTONS_PER_GROUP, totalPages);

  if (isPending) return <Spinner isLoading={isPending} />;
  if (isError) return <div>에러: {error.message}</div>;
  if (!myAdsData || myAdsData.result.length === 0) {
    return (
      <div className="border-border bg-card flex min-h-[16rem] items-center justify-center rounded-[2rem] border text-center">
        <p className="text-muted-foreground text-sm">지난 내 광고가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-[0.8rem]">
      {myAdsData.result.map(myAd => (
        <MySpaceListItem key={myAd.id} isOngoing={false}>
          <div className="flex min-w-0 flex-1 items-center gap-[1rem]">
            <span className="bg-muted text-muted-foreground grid h-[4.4rem] w-[4.4rem] shrink-0 place-items-center rounded-[1.2rem]">
              <LuMegaphone className="h-[2rem] w-[2rem] stroke-[1.9]" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-xs">지난 광고</p>
              <p className="text-foreground mt-[0.2rem] truncate font-semibold">{myAd.ad_title}</p>
              <p className="text-muted-foreground mt-[0.2rem] text-xs">신청 {myAd.total}건</p>
            </div>
          </div>
          <span className="bg-muted text-muted-foreground shrink-0 rounded-full px-[0.9rem] py-[0.35rem] text-xs font-semibold">마감</span>
        </MySpaceListItem>
      ))}
      {/* 버튼 영역 */}

      <PaginationButtons
        page={page}
        startPage={startPage}
        endPage={endPage}
        hasPreviousGroup={hasPreviousGroup}
        hasNextGroup={hasNextGroup}
        onPageButtonClick={handlePageButtonClick}
        onPreviousGroupButtonClick={handlePreviousGroupButtonClick}
        onNextGroupButtonClick={handleNextGroupButtonClick}
      />
    </div>
  );
};

export default PastMyAd;
