"use client";

import React, { useState } from "react";
import RoleIcon from "./RoleIcon";
import { useQuery } from "@tanstack/react-query";
import { getMyMeetupMembersApi, getMyMeetupsApi } from "@/services/my.space.service";
import { BUTTONS_PER_GROUP, SIZE_LIMIT } from "@/constants/pagination";
import PaginationButtons from "../PaginationButtons";
import { useMemberDelete } from "@/hooks/useMemberDelete";
import { getUser } from "@/services/user.service";
import { MyMeetupMember, MyMeetupMembersResponse } from "@/types/myMeetupMemberType";
import Link from "next/link";
import MemberOutContainer from "./MemberOutContainer";
import MySpaceListItem from "../MySpaceListItem";
import { toast } from "sonner";
import { showConfirmToast } from "@/components/common/ConfirmDialog";
import Spinner from "@/components/common/Spinner";

const PastMyMeetup = () => {
  const deleteMutation = useMemberDelete();

  const { data: currentUserData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getUser(),
  });

  //내 memberId 찾기

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
            await deleteMutation.mutateAsync(myMemberId);
          }
          toast.success("정상적으로 퇴장되었습니다.");
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
    queryKey: ["myMeetups", "ended"],
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
    return (
      <div className="border-border bg-card flex min-h-[16rem] items-center justify-center rounded-[2rem] border text-center">
        <p className="text-muted-foreground text-sm">지난 내 모임이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-[0.8rem]">
      {myMeetupsData.result.map(myMeetup => (
        <MySpaceListItem key={myMeetup.id} isOngoing={false}>
          <Link href={`/meetup/${myMeetup.id}`} className="flex min-w-0 flex-1 items-center gap-[1rem]">
            <RoleIcon isOrganizer={myMeetup.is_organizer} />
            <div className="min-w-0 flex-1">
              <p className="text-muted-foreground flex items-center gap-[0.5rem] text-xs">
                {myMeetup.is_organizer ? "내가 만든 모임" : "참여했던 모임"}
                <span className="bg-muted rounded-full px-[0.7rem] py-[0.1rem] text-[1rem]">종료</span>
              </p>
              <p className="text-foreground mt-[0.2rem] truncate font-semibold">{myMeetup.name}</p>
              <p className="text-muted-foreground mt-[0.2rem] text-xs">멤버 {myMeetup.total}명</p>
            </div>
          </Link>
          <MemberOutContainer meetupId={myMeetup.id} isOrganizer={myMeetup.is_organizer} onSelfLeave={handleSelfLeave} isPending={deleteMutation.isPending} />
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
