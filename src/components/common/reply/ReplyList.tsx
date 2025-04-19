import { useReplyList } from "@/hooks/useReply";
import ReplyItem from "./ReplyItem";
import { Reply } from "@/types/replyType";

const ReplyList = ({ meetupId }: { meetupId: string | string[] }) => {
  const { data, isLoading } = useReplyList(meetupId);

  if (!data) return;

  const replies = data.result;

  const topLevelReplies = replies.filter((reply: Reply) => reply.root === null);

  if (isLoading) return <div>로딩중</div>;

  return (
    <div className="border-t-[1px] border-[#CFCFCF] w-full p-[10px]">
      {topLevelReplies.length === 0 ? (
        <p className="text-[10px]">댓글이 없습니다.</p>
      ) : (
        topLevelReplies.map((reply: Reply) => <ReplyItem key={reply.id} reply={reply} allReplies={replies} meetupId={meetupId} />)
      )}
    </div>
  );
};

export default ReplyList;
