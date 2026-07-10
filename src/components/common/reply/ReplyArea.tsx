"use client";

import ReplyForm from "./ReplyForm";
import ReplyList from "./ReplyList";
import { useParams } from "next/navigation";
import { useMeetupDetail } from "@/hooks/useMeetupApi";
import { useScheduleDetail } from "@/hooks/useSchedule";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { useMyProposalStatus } from "@/hooks/useProposal";
import { LuMessageCircle } from "react-icons/lu";

interface ReplyAreaProps {
  variant?: "default" | "card";
}

const ReplyArea: React.FC<ReplyAreaProps> = ({ variant = "default" }) => {
  const { meetupId, scheduleId } = useParams();

  const meetupNumberId = Number(meetupId);
  const scheduleNumberId = Number(scheduleId);

  const { data: meetupDetail, isLoading } = useMeetupDetail(meetupNumberId, { enabled: true });
  const { data: schedule } = useScheduleDetail(scheduleNumberId);
  const { data: proposal } = useMyProposalStatus(meetupNumberId);
  const user = useSelector((state: RootState) => state.user.user);

  if (isLoading) return <div>로딩중</div>;

  const isCard = variant === "card";
  const isOwner = user.nickname === meetupDetail?.organizer.nickname;
  const isAcceptedMember = proposal?.status === "acceptance";
  const canWriteInCard = !!user.email && (isOwner || isAcceptedMember);
  const commentCount = schedule ? schedule.commentCount : (meetupDetail?.commentCount ?? 0);
  const disabledReason = !user.email
    ? "로그인 후 댓글을 작성할 수 있어요."
    : proposal?.status === "pending"
      ? "신청 승인 대기 중에는 댓글을 작성할 수 없어요."
      : "모임에 참가한 멤버만 댓글을 작성할 수 있어요.";

  return (
    <div className={isCard ? "flex flex-col" : "mx-auto mb-[5rem] flex w-[95%] max-w-[90rem] flex-col"}>
      <div className={isCard ? "border-border flex items-center justify-between border-b px-[1.8rem] py-[1.5rem] md:px-[2rem]" : "mb-[1.4rem] flex items-center justify-between"}>
        <h2 className="text-foreground inline-flex items-center gap-[0.7rem] text-lg font-bold">
          <LuMessageCircle className="text-primary h-[2rem] w-[2rem] stroke-[1.9]" />
          댓글
          <span className="text-primary">{commentCount}개</span>
        </h2>
      </div>
      {meetupId && (
        <ReplyList
          meetupId={meetupNumberId}
          scheduleId={scheduleNumberId}
          variant={variant}
          canWrite={!isCard || canWriteInCard}
          disabledReason={isCard && !canWriteInCard ? disabledReason : undefined}
        />
      )}
      <ReplyForm variant={variant} canWrite={!isCard || canWriteInCard} disabledReason={isCard && !canWriteInCard ? disabledReason : undefined} />
    </div>
  );
};
export default ReplyArea;
