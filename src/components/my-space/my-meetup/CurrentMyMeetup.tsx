"use client";

import React, { useState } from "react";
import RoleIcon from "./RoleIcon";
import { useQuery } from "@tanstack/react-query";
import MemberOutContainer from "./MemberOutContainer";
import { getMyMeetupsApi } from "@/services/my.space.service";
import Link from "next/link";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";

const SIZE_LIMIT = 10;
const BUTTONS_PER_GROUP = 5; // 한 그룹당 표시할 버튼 수

const CurrentMyMeetup = () => {
  const [page, setPage] = useState(1);

  const handlePageButtonClick = (newPage: number) => {
    setPage(newPage);
  };

  // 이전/이후 그룹 버튼 핸들러
  const handlePreviousGroupClick = () => {
    // 현재 그룹의 첫 페이지 계산
    const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);
    // 이전 그룹의 마지막 페이지로 이동
    const previousGroupLastPage = (currentGroup - 1) * BUTTONS_PER_GROUP;
    setPage(previousGroupLastPage);
  };

  const handleNextGroupClick = () => {
    // 현재 그룹의 마지막 페이지 계산
    const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);
    // 다음 그룹의 첫 페이지로 이동
    const nextGroupFirstPage = currentGroup * BUTTONS_PER_GROUP + 1;
    setPage(nextGroupFirstPage);
  };

  const {
    data: myMeetupsData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myMeetups", "ongoing", page],
    queryFn: () => getMyMeetupsApi("ongoing", page, SIZE_LIMIT),
  });

  const totalPages = Math.ceil((myMeetupsData?.total ?? 0) / SIZE_LIMIT);

  // 현재 페이지가 속한 그룹 계산
  const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);

  // 이전 그룹 존재 여부
  const hasPreviousGroup = currentGroup > 1;

  // 다음 그룹 존재 여부
  const hasNextGroup = currentGroup * BUTTONS_PER_GROUP < totalPages;

  // 현재 그룹에 표시할 페이지 버튼 범위 계산
  const startPage = (currentGroup - 1) * BUTTONS_PER_GROUP + 1;
  const endPage = Math.min(currentGroup * BUTTONS_PER_GROUP, totalPages);

  // 페이지 버튼 생성
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

  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러 : {error.message}</div>;
  if (!myMeetupsData || myMeetupsData.result.length === 0) return <div>참여 중인 모임이 없습니다.</div>;

  return (
    <>
      <div className="grid grid-cols-1">
        {myMeetupsData.result.map(myMeetup => (
          <Link href={`http://localhost:3000/meetup/${myMeetup.id}`} key={myMeetup.id} className="flex justify-between">
            <RoleIcon isOrganizer={myMeetup.is_organizer} />
            방장이니?: {`${myMeetup.is_organizer}`} 모임 이름:{myMeetup.name}
            모임종료일: {myMeetup.ended_at}
            <MemberOutContainer />
          </Link>
        ))}
      </div>

      <div className="flex flex-row justify-center items-center mt-4 space-x-1">
        {/* 이전 그룹 버튼 */}
        <button onClick={handlePreviousGroupClick} disabled={!hasPreviousGroup} className={`px-3 py-1 ${!hasPreviousGroup ? "text-gray-300 cursor-not-allowed" : ""}`}>
          <FaArrowAltCircleLeft />
        </button>

        {/* 페이지 버튼 영역 */}
        <div className="flex justify-center space-x-1 min-w-[180px]">{renderPageButtons()}</div>

        {/* 다음 그룹 버튼 */}
        <button onClick={handleNextGroupClick} disabled={!hasNextGroup} className={`px-3 py-1 ${!hasNextGroup ? "text-gray-300 cursor-not-allowed" : ""}`}>
          <FaArrowAltCircleRight />
        </button>
      </div>
    </>
  );
};

export default CurrentMyMeetup;
