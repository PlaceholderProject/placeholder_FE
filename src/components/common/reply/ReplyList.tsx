import { useReplyList } from "@/hooks/useReply";
import ReplyItem from "./ReplyItem";
import { Reply } from "@/types/replyType";
import { useScheduleReply } from "@/hooks/useScheduleReply";

const ReplyList = ({ meetupId, scheduleId }: { meetupId: string | string[]; scheduleId: string | string[] }) => {
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
    <div className="w-full border-t-[1px] border-[#CFCFCF] p-[10px]">
      {topLevelReplies.length === 0 ? (
        <p className="text-[10px]">댓글이 없습니다.</p>
      ) : (
        topLevelReplies.map((reply: Reply) => <ReplyItem key={reply.id} reply={reply} allReplies={replies} meetupId={meetupId} scheduleId={scheduleId} />)
      )}
    </div>
  );
};

export default ReplyList;
