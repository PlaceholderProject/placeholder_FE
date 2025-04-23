"use client";

import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { getMyAdsApi } from "@/services/my.space.service";
import RoleIcon from "../my-meetup/RoleIcon";
import Link from "next/link";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

const SIZE_LIMIT = 10;
const BUTTONS_PER_GROUP = 5;

const CurrentMyAd = () => {
  const [page, setPage] = useState(1);

  const handlePageButtonClick = (newPage: number) => {
    setPage(newPage);
  };

  // 이전 이후 그룹 버튼 핸들러

  //이전 버튼 클릭
  const handlePreviousGroupClick = () => {
    // 현재 그룹 찾기
    const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);
    // 이전 그룹의 마지막 페이지는
    const previousGroupLastPage = (currentGroup - 1) * BUTTONS_PER_GROUP;
    setPage(previousGroupLastPage);
  };

  //  이후 버튼 클릭
  const handleNextGroupClick = () => {
    //현재 그룹
    const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);
    // 다음 그룹 첫페이지는
    const nextGroupFirstPage = currentGroup * BUTTONS_PER_GROUP + 1;
    setPage(nextGroupFirstPage);
  };

  //

  const [isOrganizer, setIsOrganizer] = useState(true);
  const {
    data: myAdsData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myAds", "ongoing", page],
    queryFn: () => getMyAdsApi("ongoing", page, SIZE_LIMIT),
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

  // 페이지버튼 생성

  const renderPageButtons = () => {
    const buttons = [];

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button key={i} onClick={() => handlePageButtonClick(i)} className={`mx-1 px-3 py-1 ${page === i ? "font-bold bg-gray-200 rounded" : ""}`}>
          {i}
        </button>,
      );
    }

    return buttons;
  };

  if (isPending) return <div>로딩중..</div>;
  if (isError) return <div>에러: {error.message}</div>;
  if (!myAdsData || myAdsData.result.length === 0) return <div>현재 광고글이 없습니다.</div>;
  return (
    <>
      <div className="grid grid-cols-1">
        {myAdsData.result.map(myAd => (
          <Link href={`http://localhost:3000/ad/${myAd.id}`} key={myAd.id} className="flex justify-between">
            <RoleIcon isOrganizer={isOrganizer} />
            광고글 이름: {myAd.ad_title} 광고종료일: {myAd.ad_ended_at}
          </Link>
        ))}
      </div>

      {/* 버튼 영역 */}
      <div className="flex flex-row justify-center items-center mt-4 space-x-1">
        {/* 이전그룹 버튼 */}
        <button onClick={handlePreviousGroupClick} disabled={!hasPreviousGroup} className={`px-3 py-1 ${!hasPreviousGroup ? "text-gray-300 cursor-not-allowed" : ""}`}>
          <FaArrowAltCircleLeft />
        </button>

        {/* 페이지버튼 */}
        <div className="flex justify-center space-x-1 min-w-[180px]">{renderPageButtons()}</div>
        {/* 다음그룹 버튼 */}
        <button onClick={handleNextGroupClick} disabled={!hasNextGroup} className={`px-3 py-1 ${!hasNextGroup ? "text-gray-300 cursor-not-allowed" : ""}`}>
          <FaArrowAltCircleRight />
        </button>
      </div>
    </>
  );
};

export default CurrentMyAd;
