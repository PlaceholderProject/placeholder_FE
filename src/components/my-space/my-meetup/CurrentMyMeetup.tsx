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

      // 타입 단언을 사용하여 안전하게 접근
      const typedMembersData = membersData as MyMeetupMembersResponse;

      // 현 유저 닉넴으로 멤버 찾기
      const myMember = typedMembersData?.result?.find((member: MyMeetupMember) => {
        return member.user?.nickname === currentUserData?.nickname;
      });

      if (!myMember) {
        console.error("=== 내 멤버 정보를 찾을 수 없습니다 ===");
        return null;
      }

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
          const myMemberId = await getMyMemberId(meetupId);
          if (myMemberId) {
            deleteMutation.mutate(myMemberId);
          } else {
            toast.error("모임 퇴장 중 오류가 발생했습니다.");
          }
          toast.success("퇴장했습니다.");
        } catch {
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
  if (!myMeetupsData || myMeetupsData.result.length === 0) {
    return (
      <div className="border-border bg-card flex min-h-[16rem] items-center justify-center rounded-[2rem] border text-center">
        <p className="text-muted-foreground text-sm">현재 내 모임이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-[0.8rem]">
      {myMeetupsData.result.map(myMeetup => (
        <MySpaceListItem key={myMeetup.id} isOngoing={true}>
          <Link href={`/meetup/${myMeetup.id}`} className="flex min-w-0 flex-1 items-center gap-[1rem]">
            <RoleIcon isOrganizer={myMeetup.is_organizer} />
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground text-xs">{myMeetup.is_organizer ? "내가 만든 모임" : "참여 중인 모임"}</p>
              <p className="text-foreground mt-[0.2rem] truncate font-semibold">{myMeetup.name}</p>
              <p className="text-muted-foreground mt-[0.2rem] text-xs">멤버 {myMeetup.total}명</p>
            </div>
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
    </div>
  );
};

export default CurrentMyMeetup;
