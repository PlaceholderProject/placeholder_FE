"use client";

import React, { useState } from "react";
import RoleIcon from "./RoleIcon";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import MemberOutContainer from "./MemberOutContainer";
import { deleteMeetupMemberApi, getMyMeetupMembersApi, getMyMeetupsApi } from "@/services/my.space.service";
import Link from "next/link";
import { SIZE_LIMIT, BUTTONS_PER_GROUP } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";
import MemberDeleteModal from "./MemberDeleteModal";

const CurrentMyMeetup = () => {
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  // 내가 나가건 쫓겨나건 통합 out 뮤테이션 여기서 일괄 관리!!
  const deleteMutation = useMutation({
    mutationFn: (member_id: number) => deleteMeetupMemberApi(member_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["myMeetups"] });
      queryClient.invalidateQueries({ queryKey: ["myMeetupMembers"] });
    },
    onError: error => {
      console.error("멤버 삭제 실패:", error);
      alert("멤버 삭제 중 오류 ㅂ라생함");
    },
  });

  // 현 사용자의 member_id가져오는 함수
  const getCurrentUserMemberId = async (meetupId: number) => {
    try {
      const membersData = await getMyMeetupMembersApi(meetupId);
    } catch (error) {}
  };

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

  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러 : {error.message}</div>;
  if (!myMeetupsData || myMeetupsData.result.length === 0) return <div>참여 중인 모임이 없습니다.</div>;

  return (
    <>
      <div className="grid grid-cols-1">
        {myMeetupsData.result.map(myMeetup => (
          <div key={myMeetup.id} className="flex items-center justify-between">
            <Link href={`http://localhost:3000/meetup/${myMeetup.id}`} className="flex grow items-center">
              <RoleIcon isOrganizer={myMeetup.is_organizer} />
              {/* <span>방장이니?: {`${myMeetup.is_organizer}`}</span> */}
              <span>{myMeetup.name}</span>
              {/* <span>모임종료일: {myMeetup.ended_at}</span> */}
            </Link>
            <MemberOutContainer meetupId={myMeetup.id} isOrganizer={myMeetup.is_organizer} />
          </div>
        ))}
      </div>

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
      <MemberDeleteModal />
    </>
  );
};

export default CurrentMyMeetup;
