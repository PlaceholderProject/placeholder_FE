"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getMyAdsApi } from "@/services/my.space.service";
import Link from "next/link";
import { BUTTONS_PER_GROUP, SIZE_LIMIT } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";
import MySpaceListItem from "../MySpaceListItem";
import Spinner from "@/components/common/Spinner";
import { LuChevronRight, LuMegaphone, LuUserCheck } from "react-icons/lu";
import { getDday } from "@/utils/getDday";
import MySpaceEmptyState from "../MySpaceEmptyState";
import { useDispatch } from "react-redux";
import { setSelectedMeetupId } from "@/stores/proposalSlice";

const CurrentMyAd = () => {
  const dispatch = useDispatch();
  // const [isLoading, setIsLoading] = useState(false);

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

  //

  const {
    data: myAdsData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myAds", "ongoing", page],
    queryFn: () => getMyAdsApi("ongoing", page, SIZE_LIMIT),
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
      <div className="border-error/20 bg-error/5 text-error rounded-[1.6rem] border px-[1.4rem] py-[2.4rem] text-center text-sm font-medium">{error.message || "모집글을 불러오지 못했어요."}</div>
    );
  }
  if (!myAdsData || myAdsData.result.length === 0) {
    return <MySpaceEmptyState title="진행 중인 모집이 없어요" description="함께할 사람을 찾을 수 있도록 새로운 모집글을 만들어보세요." actionHref="/meetup/create" actionLabel="모임 만들기" />;
  }

  return (
    <div className="space-y-[0.8rem]">
      {myAdsData.result.map(myAd => {
        const dday = getDday(myAd.ad_ended_at);
        const isUrgent = dday === "D-DAY" || /^D-[0-3]$/.test(dday ?? "");

        return (
          <MySpaceListItem key={myAd.id}>
            <Link href={`/ad/${myAd.id}`} className="flex min-w-0 flex-1 items-center gap-[1rem]">
              <span className="bg-primary-soft text-primary grid h-[5rem] w-[5rem] shrink-0 place-items-center rounded-[1.4rem]">
                <LuMegaphone className="h-[2.2rem] w-[2.2rem] stroke-[1.9]" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-[0.5rem]">
                  <span className="bg-primary-soft text-primary rounded-full px-[0.75rem] py-[0.2rem] text-[1rem] font-black">모집 중</span>
                  <span className={`rounded-full px-[0.75rem] py-[0.2rem] text-[1rem] font-black ${isUrgent ? "bg-destructive/10 text-destructive" : "bg-accent text-accent-foreground"}`}>{dday}</span>
                </div>
                <p className="text-foreground mt-[0.45rem] truncate font-bold">{myAd.ad_title}</p>
                <p className="text-muted-foreground mt-[0.3rem] inline-flex items-center gap-[0.35rem] text-xs">
                  <LuUserCheck className="h-[1.3rem] w-[1.3rem] stroke-[1.9]" />
                  가입 신청 {myAd.total}건
                </p>
              </div>
            </Link>
            {myAd.total > 0 ? (
              <Link
                href="/my-space/received-proposal"
                onClick={() => dispatch(setSelectedMeetupId(myAd.id))}
                className="border-primary/15 bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground inline-flex h-[3.8rem] shrink-0 items-center gap-[0.45rem] rounded-full border px-[1.1rem] text-xs font-bold transition-colors"
              >
                신청 관리
                <LuChevronRight className="h-[1.4rem] w-[1.4rem]" />
              </Link>
            ) : (
              <LuChevronRight className="text-muted-foreground h-[1.8rem] w-[1.8rem] shrink-0" aria-hidden="true" />
            )}
          </MySpaceListItem>
        );
      })}

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

export default CurrentMyAd;
