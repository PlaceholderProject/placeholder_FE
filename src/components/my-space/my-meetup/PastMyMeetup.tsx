"use client";

import React, { useState } from "react";
import MeetupRoleIcon from "./MeetupRoleIcon";
import { useQuery } from "@tanstack/react-query";
import { getMyMeetupsApi } from "@/services/my.space.service";
import { BUTTONS_PER_GROUP, SIZE_LIMIT } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";
import Link from "next/link";
import MemberOutContainer from "./MemberOutContainer";
import MySpaceListItem from "../MySpaceListItem";
import Spinner from "@/components/common/Spinner";
import MySpaceEmptyState from "../MySpaceEmptyState";
import { LuUsersRound } from "react-icons/lu";

const PastMyMeetup = () => {
  // 페이지네이션 핸들러들

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
    data: myMeetupsData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myMeetups", "ended", page],
    queryFn: () => getMyMeetupsApi("ended", page, SIZE_LIMIT),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });

  const totalPages = Math.ceil((myMeetupsData?.total ?? 0) / SIZE_LIMIT);

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
  if (isError) return <div> 에러 발생: {error.message}</div>;
  if (!myMeetupsData || myMeetupsData.result.length === 0) {
    return <MySpaceEmptyState title="종료된 모임이 없어요" description="활동이 끝난 모임은 이곳에 차곡차곡 기록됩니다." />;
  }

  return (
    <div className="space-y-[0.8rem]">
      {myMeetupsData.result.map(myMeetup => (
        <MySpaceListItem key={myMeetup.id}>
          <Link href={`/meetup/${myMeetup.id}`} className="flex min-w-0 flex-1 items-center gap-[1rem]">
            <MeetupRoleIcon isOrganizer={myMeetup.is_organizer} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-[0.5rem]">
                <span
                  className={`inline-flex rounded-full px-[0.75rem] py-[0.2rem] text-[1rem] font-black ${myMeetup.is_organizer ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"}`}
                >
                  {myMeetup.is_organizer ? "방장" : "멤버"}
                </span>
                <span className="border-border text-muted-foreground inline-flex rounded-full border px-[0.7rem] py-[0.15rem] text-[1rem] font-bold">종료</span>
              </div>
              <p className="text-foreground mt-[0.4rem] truncate font-bold">{myMeetup.name}</p>
              <p className="text-muted-foreground mt-[0.3rem] inline-flex items-center gap-[0.35rem] text-xs">
                <LuUsersRound className="h-[1.3rem] w-[1.3rem] stroke-[1.9]" />
                {myMeetup.total}명
              </p>
            </div>
          </Link>
          <MemberOutContainer meetupId={myMeetup.id} meetupName={myMeetup.name} isOrganizer={myMeetup.is_organizer} />
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

export default PastMyMeetup;
