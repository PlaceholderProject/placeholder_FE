"use client";

import React, { useState } from "react";
import RoleIcon from "./RoleIcon";
import { useQuery } from "@tanstack/react-query";
import MemberOutContainer from "./MemberOutContainer";
import { getMyMeetupMembersApi, getMyMeetupsApi } from "@/services/my.space.service";
import Link from "next/link";
import { BUTTONS_PER_GROUP, SIZE_LIMIT } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";
import { getUser } from "@/services/user.service";
import { useMemberDelete } from "@/hooks/useMemberDelete";
import { MyMeetupMember, MyMeetupMembersResponse } from "@/types/myMeetupMemberType";
import MySpaceListItem from "../MySpaceListItem";
import { toast } from "sonner";
import { showConfirmToast } from "@/components/common/ConfirmDialog";
import Spinner from "@/components/common/Spinner";

// 기존 타입 import 추가 (파일 상단에서 import 해야 함)
// import { MyMeetupMember, MyMeetupMembersResponse } from "@/types/meetupType";

const CurrentMyMeetup = () => {
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

      // API 응답 구조 파악을 위한 콘솔 로그
      console.log("=== API 응답 전체 구조 ===");
      console.log("전체 응답:", membersData);
      console.log("응답 타입:", typeof membersData);
      console.log("응답의 키들:", Object.keys(membersData || {}));

      if (membersData?.result) {
        console.log("result 배열 길이:", membersData.result.length);
        console.log("첫 번째 멤버 구조:", membersData.result[0]);
        if (membersData.result[0]) {
          console.log("첫 번째 멤버의 키들:", Object.keys(membersData.result[0]));
          console.log("user 객체 구조:", membersData.result[0].user);
          if (membersData.result[0].user) {
            console.log("user 객체의 키들:", Object.keys(membersData.result[0].user));
          }
        }
      }

      // 타입 단언을 사용하여 안전하게 접근
      const typedMembersData = membersData as MyMeetupMembersResponse;

      // 현 유저 닉넴으로 멤버 찾기
      const myMember = typedMembersData?.result?.find((member: MyMeetupMember) => {
        console.log("비교 중인 멤버 닉네임:", member.user?.nickname);
        return member.user?.nickname === currentUserData?.nickname;
      });

      if (!myMember) {
        console.error("=== 내 멤버 정보를 찾을 수 없습니다 ===");
        console.log("찾고 있는 닉네임:", currentUserData?.nickname);
        console.log(
          "전체 멤버들의 닉네임:",
          typedMembersData?.result?.map(m => m.user?.nickname),
        );
        console.log("전체 멤버 데이터:", typedMembersData);
        return null;
      }

      console.log("=== 멤버 찾기 성공 ===");
      console.log("찾고 있는 닉네임:", currentUserData?.nickname);
      console.log("찾은 멤버 ID:", myMember.id);
      console.log("찾은 멤버 전체 정보:", myMember);

      return myMember.id;
    } catch (error) {
      console.error("=== 멤버 조회 실패 ===");
      console.error("에러 상세:", error);
      if (error instanceof Error) {
        console.error("에러 메시지:", error.message);
        console.error("에러 스택:", error.stack);
      }
      return null;
    }
  };

  // 스스로 퇴장 핸들러
  const handleSelfLeave = async (meetupId: number) => {
    if (!currentUserData?.nickname) {
      toast.error("사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    // ⭐️ 확인 후 삭제
    // const confirmed = window.confirm("정말 이 모임에서 퇴장하시겠습니까?");
    // if (!confirmed) return;

    // ⭐️ confirm 커스텀
    showConfirmToast({
      message: "정말 이 모임에서 퇴장하시겠습니까?",
      confirmText: "퇴장",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          console.log("=== 퇴장 프로세스 시작 ===");
          console.log("모임 ID:", meetupId);
          console.log("현재 사용자 닉네임:", currentUserData.nickname);

          const myMemberId = await getMyMemberId(meetupId);
          if (myMemberId) {
            console.log("퇴장 실행 - 멤버 ID:", myMemberId);
            deleteMutation.mutate(myMemberId);
          } else {
            toast.error("모임 퇴장 중 오류가 발생했습니다.");
          }
          toast.success("퇴장했습니다.");
        } catch (_error) {
          toast.error("퇴장 중 문제가 발생했습니다.");
        }
      },
    });
  };

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
  if (!myMeetupsData || myMeetupsData.result.length === 0) return <p className="mt-[6rem] flex justify-center">현재 내 모임이 없습니다.</p>;

  return (
    <>
      {myMeetupsData.result.map(myMeetup => (
        <MySpaceListItem key={myMeetup.id} isOngoing={true}>
          <Link href={`/meetup/${myMeetup.id}`} className="flex items-center">
            <RoleIcon isOrganizer={myMeetup.is_organizer} />
            <div className="max-w-[20rem] truncate md:max-w-[40rem]">{myMeetup.name}</div>
          </Link>
          <MemberOutContainer meetupId={myMeetup.id} isOrganizer={myMeetup.is_organizer} onSelfLeave={handleSelfLeave} isPending={deleteMutation.isPending} />
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
    </>
  );
};

export default CurrentMyMeetup;
