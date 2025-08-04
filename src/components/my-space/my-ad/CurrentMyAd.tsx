"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getMyAdsApi } from "@/services/my.space.service";
import RoleIcon from "../my-meetup/RoleIcon";
import Link from "next/link";
import { BUTTONS_PER_GROUP, SIZE_LIMIT } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";
import MySpaceListItem from "../MySpaceListItem";
import Spinner from "@/components/common/Spinner";

const CurrentMyAd = () => {
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

  const isOrganizer = true;
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
  if (isError) return <div>에러: {error.message}</div>;
  if (!myAdsData || myAdsData.result.length === 0) return <p className="mt-[6rem] flex justify-center">현재 내 광고가 없습니다.</p>;

  return (
    <>
      {myAdsData.result.map(myAd => (
        <MySpaceListItem key={myAd.id} isOngoing={true}>
          <Link href={`/ad/${myAd.id}`} className="flex items-center">
            <RoleIcon isOrganizer={isOrganizer} />
            <div className="max-w-[20rem] truncate md:max-w-[36rem]">{myAd.ad_title}</div>
          </Link>
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
    </>
  );
};

export default CurrentMyAd;
