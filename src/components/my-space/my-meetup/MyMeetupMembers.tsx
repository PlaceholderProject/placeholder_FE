"use client";

import { getMyMeetupMembersApi } from "@/services/my.space.service";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import OutButton from "./OutButton";
import { MyMeetupMember } from "@/types/myMeetupMemberType";
import Image from "next/image";
import { useMemberDelete } from "@/hooks/useMemberDelete";
import { showConfirmToast } from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import { getImageURL } from "@/utils/getImageURL";
import { LuCrown, LuUserRound, LuUsersRound } from "react-icons/lu";

interface MyMeetupMembersProps {
  meetupId: number;
  // onKickMember: (memberId: number) => void;
  // isPending: boolean;
}

const MyMeetupMembers: React.FC<MyMeetupMembersProps> = ({ meetupId }) => {
  const deleteMutation = useMemberDelete();

  const handleKickMember = (memberId: number, memberNickname: string) => {
    showConfirmToast({
      message: `${memberNickname}님을 모임에서 내보낼까요?`,
      confirmText: "내보내기",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          const response = await deleteMutation.mutateAsync(memberId);
          if (response && !response.ok) throw new Error("member delete failed");
          toast.success(`${memberNickname}님을 내보냈습니다.`);
        } catch {
          toast.error("멤버 내보내기 중 문제가 발생했습니다.");
        }
      },
    });
  };

  const {
    data: myMeetupMembersData,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["myMeetupMembers", meetupId],
    queryFn: () => getMyMeetupMembersApi(meetupId),
    enabled: !!meetupId,
  });

  if (!meetupId) {
    return <div className="bg-muted text-muted-foreground rounded-[1.6rem] px-[1.4rem] py-[2.4rem] text-center text-sm">모임 정보를 찾을 수 없어요.</div>;
  }

  if (isPending) {
    return (
      <div className="space-y-[0.8rem]">
        {[0, 1, 2].map(item => (
          <div key={item} className="border-border bg-background flex items-center gap-[1rem] rounded-[1.6rem] border p-[1.2rem]">
            <div className="bg-muted h-[4.4rem] w-[4.4rem] animate-pulse rounded-full" />
            <div className="min-w-0 flex-1 space-y-[0.6rem]">
              <div className="bg-muted h-[1.2rem] w-[10rem] animate-pulse rounded-full" />
              <div className="bg-muted h-[1rem] w-[6rem] animate-pulse rounded-full" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="border-error/20 bg-error/5 text-error rounded-[1.6rem] border px-[1.4rem] py-[2.4rem] text-center text-sm font-medium">{error.message || "멤버 정보를 불러오지 못했어요."}</div>
    );
  }

  const members = myMeetupMembersData?.result ?? [];

  if (members.length === 0) {
    return (
      <div className="border-border bg-background rounded-[1.6rem] border px-[1.4rem] py-[3rem] text-center">
        <span className="bg-muted text-muted-foreground mx-auto mb-[1rem] grid h-[4.4rem] w-[4.4rem] place-items-center rounded-full">
          <LuUsersRound className="h-[2rem] w-[2rem] stroke-[1.8]" />
        </span>
        <p className="text-foreground text-sm font-semibold">아직 멤버가 없어요.</p>
      </div>
    );
  }

  return (
    <div className="space-y-[1rem]">
      <div className="border-border flex items-center justify-between border-t pt-[1.4rem]">
        <p className="text-foreground text-sm font-semibold">전체 {members.length}명</p>
      </div>

      <ul className="max-h-[42rem] space-y-[0.8rem] overflow-y-auto pr-[0.2rem]">
        {members.map((member: MyMeetupMember) => {
          const isOrganizer = member.role === "organizer";
          const userImageSource = getImageURL(member.user?.image || null);
          const nickname = member.user?.nickname || "이름 없는 멤버";

          const RoleIcon = isOrganizer ? LuCrown : LuUserRound;

          return (
            <li key={member.id} className="border-border bg-background flex items-center gap-[1rem] rounded-[1.6rem] border p-[1.2rem]">
              <div className="relative h-[4.4rem] w-[4.4rem] shrink-0 overflow-hidden rounded-full">
                <Image unoptimized src={userImageSource} alt={`${nickname} 프로필 이미지`} sizes="4.4rem" fill className="object-cover" />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-foreground truncate text-sm font-semibold">{nickname}</p>
                <span
                  className={`mt-[0.4rem] inline-flex items-center gap-[0.4rem] rounded-full px-[0.8rem] py-[0.25rem] text-xs font-semibold ${
                    isOrganizer ? "bg-primary-soft text-primary" : "bg-muted text-muted-foreground"
                  }`}
                >
                  <RoleIcon className="h-[1.2rem] w-[1.2rem] stroke-[1.9]" />
                  {isOrganizer ? "방장" : "멤버"}
                </span>
              </div>

              {!isOrganizer && <OutButton text="내보내기" onClick={() => handleKickMember(member.id, nickname)} isPending={deleteMutation.isPending} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MyMeetupMembers;
