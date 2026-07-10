import { useReplyList } from "@/hooks/useReply";
import ReplyItem from "./ReplyItem";
import { Reply } from "@/types/replyType";
import { useScheduleReply } from "@/hooks/useScheduleReply";

const ReplyList = ({
  meetupId,
  scheduleId,
  variant = "default",
  canWrite = true,
  disabledReason,
}: {
  meetupId: number;
  scheduleId?: number;
  variant?: "default" | "card";
  canWrite?: boolean;
  disabledReason?: string;
}) => {
  const { data: meetupReply, isLoading } = useReplyList(meetupId, {
    enabled: !scheduleId,
  });
  const { data: scheduleReply, isPending } = useScheduleReply(Number(scheduleId), {
    enabled: !!scheduleId,
  });

  const replyData = scheduleReply ? scheduleReply : meetupReply;
  const loading = scheduleId ? isPending : isLoading;

  if (loading) {
    return (
      <div className={variant === "card" ? "px-[1.8rem] py-[2rem] md:px-[2rem]" : "py-[2rem]"}>
        <div className="space-y-[1.2rem]">
          {[0, 1].map(item => (
            <div key={item} className="flex gap-[1rem]">
              <div className="bg-muted h-[3.8rem] w-[3.8rem] animate-pulse rounded-full" />
              <div className="bg-muted h-[5.8rem] flex-1 animate-pulse rounded-[1.6rem]" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!replyData) return;

  const replies = replyData.result;

  const topLevelReplies = replies.filter((reply: Reply) => reply.root === null);
  const isCard = variant === "card";

  return (
    <div className={isCard ? "flex w-full justify-center px-[1.8rem] py-[1.7rem] md:px-[2rem]" : "flex w-full justify-center py-[1.5rem]"}>
      {topLevelReplies.length === 0 ? (
        <p className="text-muted-foreground bg-muted/45 w-full rounded-[1.6rem] py-[2rem] text-center text-sm">아직 댓글이 없습니다.</p>
      ) : (
        <div className={isCard ? "flex w-full flex-col gap-[1.6rem]" : "flex w-full flex-col gap-[1.6rem]"}>
          {topLevelReplies.map((reply: Reply) => (
            <ReplyItem key={reply.id} reply={reply} allReplies={replies} meetupId={meetupId} scheduleId={scheduleId} canWrite={canWrite} disabledReason={disabledReason} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyList;
