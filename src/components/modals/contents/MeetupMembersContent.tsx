"use client";

import React from "react";
import { useMeetupMembers } from "@/hooks/useSchedule";
import Image from "next/image";
import { getImageURL } from "@/utils/getImageURL";
import { useModal } from "@/hooks/useModal";
import { useMemberDelete } from "@/hooks/useMemberDelete";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { showConfirmToast } from "@/components/common/ConfirmDialog";
import { toast } from "sonner";
import { LuCrown, LuUserRound, LuUsersRound } from "react-icons/lu";

interface MeetupMembersContentProps {
  meetupId: number;
  meetupName: string;
}

const MeetupMembersContent = ({ meetupId, meetupName }: MeetupMembersContentProps) => {
  const { closeModal } = useModal();
  const { data: members, isPending, error } = useMeetupMembers(meetupId);

  const deleteMutation = useMemberDelete();
  const currentUser = useSelector((state: RootState) => state.user.user);
  const isCurrentUserOrganizer = members?.find(member => member.user.nickname === currentUser.nickname)?.role === "organizer";

  const handleKickOut = (memberId: number, memberNickname: string) => {
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

  return (
    <div className="space-y-[1.6rem] pr-[0.2rem]">
      <div className="flex items-start gap-[1rem] pr-[3.2rem]">
        <span className="bg-primary-soft text-primary grid h-[4.4rem] w-[4.4rem] shrink-0 place-items-center rounded-[1.3rem]">
          <LuUsersRound className="h-[2rem] w-[2rem] stroke-[1.9]" />
        </span>
        <div className="min-w-0">
          <p className="text-muted-foreground text-xs font-semibold">모임 멤버</p>
          <h2 className="text-foreground mt-[0.2rem] truncate text-lg font-bold">{meetupName}</h2>
          <p className="text-muted-foreground mt-[0.4rem] text-sm leading-relaxed">함께 참여 중인 멤버를 확인해요.</p>
        </div>
      </div>

      {isPending ? (
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
      ) : error ? (
        <div className="border-error/20 bg-error/5 text-error rounded-[1.6rem] border px-[1.4rem] py-[2.4rem] text-center text-sm font-medium">멤버 정보를 불러오지 못했어요.</div>
      ) : !members || members.length === 0 ? (
        <div className="border-border bg-background rounded-[1.6rem] border px-[1.4rem] py-[3rem] text-center">
          <span className="bg-muted text-muted-foreground mx-auto mb-[1rem] grid h-[4.4rem] w-[4.4rem] place-items-center rounded-full">
            <LuUsersRound className="h-[2rem] w-[2rem] stroke-[1.8]" />
          </span>
          <p className="text-foreground text-sm font-semibold">아직 멤버가 없어요.</p>
        </div>
      ) : (
        <div className="space-y-[1rem]">
          <div className="border-border flex items-center justify-between border-t pt-[1.4rem]">
            <p className="text-foreground text-sm font-semibold">전체 {members.length}명</p>
            <p className="text-muted-foreground text-xs">모임장 포함</p>
          </div>

          <ul className="max-h-[42rem] space-y-[0.8rem] overflow-y-auto pr-[0.2rem]">
            {members.map(member => {
              const isOrganizer = member.role === "organizer";
              const RoleIcon = isOrganizer ? LuCrown : LuUserRound;

              return (
                <li key={member.id} className="border-border bg-background flex items-center gap-[1rem] rounded-[1.6rem] border p-[1.2rem]">
                  <div className="bg-muted relative h-[4.4rem] w-[4.4rem] shrink-0 overflow-hidden rounded-full">
                    <Image unoptimized src={getImageURL(member.user.image)} alt={member.user.nickname} fill sizes="4.4rem" className="object-cover" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-foreground truncate text-sm font-semibold">{member.user.nickname}</p>
                    <span
                      className={`mt-[0.4rem] inline-flex items-center gap-[0.4rem] rounded-full px-[0.8rem] py-[0.25rem] text-xs font-semibold ${
                        isOrganizer ? "bg-accent text-accent-foreground" : "bg-primary-soft text-primary"
                      }`}
                    >
                      <RoleIcon className="h-[1.2rem] w-[1.2rem] stroke-[1.9]" />
                      {isOrganizer ? "모임장" : "멤버"}
                    </span>
                  </div>

                  {isCurrentUserOrganizer && !isOrganizer ? (
                    <button
                      onClick={() => handleKickOut(member.id, member.user.nickname)}
                      disabled={deleteMutation.isPending}
                      className="text-destructive hover:bg-destructive/5 border-border h-[3.2rem] shrink-0 rounded-full border px-[1.1rem] text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {deleteMutation.isPending ? "처리 중" : "내보내기"}
                    </button>
                  ) : (
                    <span className="text-muted-foreground shrink-0 text-xs font-medium">{isOrganizer ? "관리자" : ""}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <button
        onClick={closeModal}
        className="border-border text-muted-foreground hover:bg-muted flex h-[4.4rem] w-full items-center justify-center rounded-[1.4rem] border text-sm font-semibold transition-colors"
      >
        닫기
      </button>
    </div>
  );
};

export default MeetupMembersContent;
