"use client";

import React, { useState } from "react";
import RoleIcon from "./RoleIcon";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MemberOutContainer from "./MemberOutContainer";
import { getMyMeetupMembersApi, getMyMeetupsApi } from "@/services/my.space.service";
import Link from "next/link";
import { BUTTONS_PER_GROUP, SIZE_LIMIT } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";
import { getUser } from "@/services/user.service";
import { useMemberDelete } from "@/hooks/useMemberDelete";

const CurrentMyMeetup = () => {
  const queryClient = useQueryClient();

  // 삭제 로직을 조부모가 통합적으로 관리하는데 그걸 커스텀훅으로 뻈습니다
  const deleteMutation = useMemberDelete();

  // 현재 사용자 정보 가져오기 (닉넴으로 식별하려고)
  const { data: currentUserData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getUser(),
  });

  // 내 memberId 찾기
  const getMyMemberId = async (meetupId: number) => {
    try {
      const membersData = await getMyMeetupMembersApi(meetupId);

      // 현 유저 닉넴으로 멤버 찾기
      const myMember = membersData?.result?.find((member: any) => member.user.nickname === currentUserData?.nickname);

      if (!myMember) {
        console.error("내 멤버 정보 찾을 수 없읍ㄴ다");
        console.log("==에러속 찾고 있는 닉네임:", currentUserData?.nickname);
        console.log("==에러속 전체 멤버 데이터:", membersData);
        return null;
      }

      console.log("찾고 있는 닉네임:", currentUserData?.nickname);
      console.log("전체 멤버 데이터:", membersData);
      return myMember.id;
    } catch (error) {
      console.error("멤버 조회 실패:", error);
      return null;
    }
  };

  // 스스로 퇴장 핸들러
  const handleSelfLeave = async (meetupId: number) => {
    if (!currentUserData?.nickname) {
      alert("사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    const confirmed = window.confirm("정말 이 모임에서 퇴장하시겠습니까?");
    if (!confirmed) return;

    const myMemberId = await getMyMemberId(meetupId);
    if (myMemberId) {
      deleteMutation.mutate(myMemberId);
    } else {
      alert("모임 퇴장 중 오류가 발생했습니다.");
    }
  };
  // 강퇴 핸들러 모달에서 씀
  const handleKickMember = (memberId: number) => {
    const confirmed = window.confirm("정말 이 멤버를 강퇴하시겠습니까?");
    if (confirmed) {
      deleteMutation.mutate(memberId);
    }
  };

  // 페이지네이션 헤ㅐㄴ들러들
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
              <span>{myMeetup.name}</span>
            </Link>
            <MemberOutContainer meetupId={myMeetup.id} isOrganizer={myMeetup.is_organizer} onSelfLeave={handleSelfLeave} isPending={deleteMutation.isPending} />
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
      {/* <MemberDeleteModal onKickMember={handleKickMember} isPending={deleteMutation.isPending} /> */}
    </>
  );
};

export default CurrentMyMeetup;
