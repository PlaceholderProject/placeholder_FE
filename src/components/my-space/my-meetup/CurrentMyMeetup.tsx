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

const CurrentMyMeetup = () => {
  const deleteMutation = useMemberDelete();
  const { data: currentUserData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => getUser(),
  });
  const getMyMemberId = async (meetupId: number) => {
    try {
      const membersData = await getMyMeetupMembersApi(meetupId);
      if (membersData?.result) {
        if (membersData.result[0]) {
          if (membersData.result[0].user) {
          }
        }
      }
      const typedMembersData = membersData as MyMeetupMembersResponse;
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
  const handleSelfLeave = async (meetupId: number) => {
    if (!currentUserData?.nickname) {
      toast.error("사용자 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }
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
  const currentGroup = Math.ceil(page / BUTTONS_PER_GROUP);
  const hasPreviousGroup = currentGroup > 1;
  const hasNextGroup = currentGroup * BUTTONS_PER_GROUP < totalPages;
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
      {}
    </>
  );
};

export default CurrentMyMeetup;
