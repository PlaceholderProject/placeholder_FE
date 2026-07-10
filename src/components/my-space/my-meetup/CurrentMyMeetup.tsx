"use client";

import React, { useState } from "react";
import MeetupRoleIcon from "./MeetupRoleIcon";
import { useQuery } from "@tanstack/react-query";
import MemberOutContainer from "./MemberOutContainer";
import { getMyMeetupsApi } from "@/services/my.space.service";
import Link from "next/link";
import { BUTTONS_PER_GROUP, SIZE_LIMIT } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";
import MySpaceListItem from "../MySpaceListItem";
import Spinner from "@/components/common/Spinner";
import MySpaceEmptyState from "../MySpaceEmptyState";
import { LuUsersRound } from "react-icons/lu";

// 기존 타입 import 추가 (파일 상단에서 import 해야 함)
// import { MyMeetupMember, MyMeetupMembersResponse } from "@/types/meetupType";

const CurrentMyMeetup = () => {
  // 페이지네이션 핸들러들
  const [page, setPage] = useState(1);
  const handlePageButtonClick = (newPage: number) => {
    setPage(newPage);
  };

  // 이전/이후 그룹 버튼 핸들러
  const handlePreviousGroupButtonClick = () => {
    // 현재 그룹의 첫 페이지 계산
    const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);
    // 이전 그룹의 마지막 페이지로 이동
    const previousGroupLastPage = (currentGroup - 1) * BUTTONS_PER_GROUP;
    setPage(previousGroupLastPage);
  };

  const handleNextGroupButtonClick = () => {
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
    staleTime: 1000 * 60 * 5,
    retry: 1,
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

  if (isPending) return <Spinner isLoading={isPending} />;
  if (isError) return <div>에러 : {error.message}</div>;
  if (!myMeetupsData || myMeetupsData.result.length === 0) {
    return <MySpaceEmptyState title="아직 참여 중인 모임이 없어요" description="관심사가 맞는 모임을 발견하고 새로운 사람들과 시작해보세요." actionHref="/" actionLabel="모임 둘러보기" />;
  }

  return (
    <div className="space-y-[0.8rem]">
      {myMeetupsData.result.map(myMeetup => (
        <MySpaceListItem key={myMeetup.id}>
          <Link href={`/meetup/${myMeetup.id}`} className="flex min-w-0 flex-1 items-center gap-[1rem]">
            <MeetupRoleIcon isOrganizer={myMeetup.is_organizer} />
            <div className="min-w-0 flex-1">
              <span className={`inline-flex rounded-full px-[0.75rem] py-[0.2rem] text-[1rem] font-black ${myMeetup.is_organizer ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"}`}>
                {myMeetup.is_organizer ? "방장" : "멤버"}
              </span>
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
      {/* <MemberDeleteModal onKickMember={handleKickMember} isPending={deleteMutation.isPending} /> */}
    </div>
  );
};

export default CurrentMyMeetup;
