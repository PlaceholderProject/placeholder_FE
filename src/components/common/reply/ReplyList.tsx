import { useReplyList } from "@/hooks/useReply";
import ReplyItem from "./ReplyItem";
import { Reply } from "@/types/replyType";
import { useScheduleReply } from "@/hooks/useScheduleReply";

const ReplyList = ({ meetupId, scheduleId }: { meetupId: string | string[]; scheduleId?: string | string[] }) => {
  const { data: meetupReply, isLoading } = useReplyList(meetupId, {
    enabled: !scheduleId,
  });
  const { data: scheduleReply, isPending } = useScheduleReply(Number(scheduleId), {
    enabled: !!scheduleId,
  });

  const replyData = scheduleReply ? scheduleReply : meetupReply;
  const loading = scheduleId ? isPending : isLoading;

  if (loading) return <div>로딩중</div>;

  if (!replyData) return;

  const replies = replyData.result;

  const topLevelReplies = replies.filter((reply: Reply) => reply.root === null);

  return (
    <div className="border-gray-medium flex w-full justify-center border-t-[0.1rem] py-[1.5rem]">
      {topLevelReplies.length === 0 ? (
        <p>댓글이 없습니다.</p>
      ) : (
        <div className="flex w-[95%] flex-col gap-[2rem] md:max-w-[90rem]">
          {topLevelReplies.map((reply: Reply) => (
            <ReplyItem key={reply.id} reply={reply} allReplies={replies} meetupId={meetupId} scheduleId={scheduleId} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReplyList;
