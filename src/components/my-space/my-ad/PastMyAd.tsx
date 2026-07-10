"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyAdsApi } from "@/services/my.space.service";
import { BUTTONS_PER_GROUP, SIZE_LIMIT } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";
import MySpaceListItem from "../MySpaceListItem";
import Spinner from "@/components/common/Spinner";
import { LuChevronRight, LuMegaphone, LuUserCheck } from "react-icons/lu";
import MySpaceEmptyState from "../MySpaceEmptyState";
import Link from "next/link";

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
    queryKey: ["myAds", "ended", page],
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
  if (isError) {
    return (
      <div className="border-error/20 bg-error/5 text-error rounded-[1.6rem] border px-[1.4rem] py-[2.4rem] text-center text-sm font-medium">
        {error.message || "마감된 모집글을 불러오지 못했어요."}
      </div>
    );
  }
  if (!myAdsData || myAdsData.result.length === 0) {
    return <MySpaceEmptyState title="마감된 모집글이 없어요" description="모집이 끝난 기록은 이곳에서 다시 확인할 수 있어요." />;
  }

  return (
    <div className="space-y-[0.8rem]">
      {myAdsData.result.map(myAd => (
        <MySpaceListItem key={myAd.id}>
          <Link href={`/ad/${myAd.id}`} className="flex min-w-0 flex-1 items-center gap-[1rem]">
            <span className="bg-muted text-muted-foreground grid h-[5rem] w-[5rem] shrink-0 place-items-center rounded-[1.4rem]">
              <LuMegaphone className="h-[2.2rem] w-[2.2rem] stroke-[1.9]" />
            </span>
            <div className="min-w-0 flex-1">
              <span className="border-border text-muted-foreground inline-flex rounded-full border px-[0.75rem] py-[0.2rem] text-[1rem] font-black">모집 마감</span>
              <p className="text-foreground mt-[0.45rem] truncate font-bold">{myAd.ad_title}</p>
              <p className="text-muted-foreground mt-[0.3rem] inline-flex items-center gap-[0.35rem] text-xs">
                <LuUserCheck className="h-[1.3rem] w-[1.3rem] stroke-[1.9]" />
                가입 신청 {myAd.total}건
              </p>
            </div>
          </Link>
          <LuChevronRight className="text-muted-foreground h-[1.8rem] w-[1.8rem] shrink-0" aria-hidden="true" />
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
