"use client";

import React, { useState } from "react";
import RoleIcon from "../my-meetup/RoleIcon";
import { useQuery } from "@tanstack/react-query";
import { getMyAdsApi } from "@/services/my.space.service";
import { BUTTONS_PER_GROUP, SIZE_LIMIT } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";
import MySpaceListItem from "../MySpaceListItem";
import Spinner from "@/components/common/Spinner";

const PastMyAd = () => {
  const [page, setPage] = useState(1);

  const handlePageButtonClick = (newPage: number) => {
    setPage(newPage);
  };
  const handlePreviousGroupButtonClick = () => {
    const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);
    const previousGroupLastPage = (currentGroup - 1) * BUTTONS_PER_GROUP;
    setPage(previousGroupLastPage);
  };
  const handleNextGroupButtonClick = () => {
    const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);
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
  const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);
  const hasPreviousGroup = currentGroup > 1;
  const hasNextGroup = currentGroup * BUTTONS_PER_GROUP < totalPages;
  const startPage = (currentGroup - 1) * BUTTONS_PER_GROUP + 1;
  const endPage = Math.min(currentGroup * BUTTONS_PER_GROUP, totalPages);

  if (isPending) return <Spinner isLoading={isPending} />;
  if (isError) return <div>에러: {error.message}</div>;
  if (!myAdsData || myAdsData.result.length === 0) return <p className="mt-[6rem] flex justify-center">지난 내 광고가 없습니다.</p>;

  return (
    <>
      {myAdsData.result.map(myAd => (
        <MySpaceListItem key={myAd.id} isOngoing={false}>
          <div className="flex items-center">
            <RoleIcon isOrganizer={true} />
            <div className="max-w-[20rem] truncate md:max-w-[36rem]">{myAd.ad_title}</div>
          </div>
        </MySpaceListItem>
      ))}
      {}

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

export default PastMyAd;
