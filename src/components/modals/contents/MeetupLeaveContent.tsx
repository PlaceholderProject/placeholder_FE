"use client";

import { useModal } from "@/hooks/useModal";
import { deleteMeetupMemberApi, getMyMeetupMembersApi } from "@/services/my.space.service";
import { getUser } from "@/services/user.service";
import { RootState } from "@/stores/store";
import { MyMeetupMember, MyMeetupMembersResponse } from "@/types/myMeetupMemberType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuCircleAlert, LuInfo, LuLoaderCircle } from "react-icons/lu";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const MeetupLeaveContent = ({ meetupId, meetupName }: { meetupId: number; meetupName: string }) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const currentUserNickname = useSelector((state: RootState) => state.user.user.nickname);

  const leaveMutation = useMutation({
    mutationFn: async () => {
      const nickname = currentUserNickname || (await getUser())?.nickname;
      if (!nickname) throw new Error("current user not found");

      const membersData = (await getMyMeetupMembersApi(meetupId)) as MyMeetupMembersResponse;
      const currentMember = membersData?.result?.find((member: MyMeetupMember) => member.user?.nickname === nickname);

      if (!currentMember) throw new Error("current member not found");
      const response = await deleteMeetupMemberApi(currentMember.id);
      if (!response.ok) throw new Error("leave meetup failed");
      return response;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["myMeetups"] }),
        queryClient.invalidateQueries({ queryKey: ["myMeetupMembers"] }),
        queryClient.invalidateQueries({ queryKey: ["members"] }),
      ]);
      closeModal();
      toast.success("모임에서 퇴장했습니다.");
    },
    onError: () => {
      toast.error("모임 퇴장 중 문제가 발생했습니다.");
    },
  });

  return (
    <div className="pt-[0.2rem]">
      <header className="mb-[1.8rem]">
        <div className="text-destructive flex items-center gap-[0.5rem] pr-[4.4rem]">
          <LuCircleAlert className="h-[1.5rem] w-[1.5rem] shrink-0 stroke-[2]" aria-hidden="true" />
          <p className="text-xs font-black">모임 퇴장</p>
        </div>
        <h2 className="text-foreground mt-[0.9rem] pr-[1rem] text-[2.2rem] leading-[1.25] font-black tracking-[-0.035em] break-keep">이 모임에서 퇴장할까요?</h2>
      </header>

      <section className="border-destructive/15 bg-destructive/[0.035] rounded-[1.4rem] border px-[1.3rem] py-[1.15rem]" aria-label="퇴장할 모임">
        <p className="text-destructive text-[1rem] font-black">퇴장할 모임</p>
        <p className="text-foreground mt-[0.45rem] text-sm leading-[1.55] font-bold break-keep">{meetupName}</p>
      </section>

      <p className="text-muted-foreground mt-[1.1rem] flex items-start gap-[0.55rem] px-[0.2rem] text-xs leading-[1.65] break-keep">
        <LuInfo className="mt-[0.15rem] h-[1.4rem] w-[1.4rem] shrink-0 stroke-[2]" />
        <span>퇴장하면 멤버 목록에서 제외되고, 이 모임의 멤버 전용 활동에 참여할 수 없어요.</span>
      </p>

      <div className="mt-[1.6rem] grid grid-cols-2 gap-[0.8rem]">
        <button
          type="button"
          onClick={closeModal}
          className="border-border text-muted-foreground hover:bg-muted hover:text-foreground h-[4.6rem] rounded-[1.4rem] border text-sm font-bold transition-colors"
        >
          계속 참여
        </button>
        <button
          type="button"
          onClick={() => leaveMutation.mutate()}
          disabled={leaveMutation.isPending}
          className="bg-destructive text-destructive-foreground flex h-[4.6rem] items-center justify-center gap-[0.6rem] rounded-[1.4rem] text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-55"
        >
          {leaveMutation.isPending && <LuLoaderCircle className="h-[1.6rem] w-[1.6rem] animate-spin" />}
          {leaveMutation.isPending ? "퇴장 중" : "모임 퇴장"}
        </button>
      </div>
    </div>
  );
};

export default MeetupLeaveContent;
