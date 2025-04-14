import ReplyItem from "./ReplyItem";

import { Reply } from "@/types/replyType";

const ReplyList = ({ replies }: { replies: Reply[] }) => {
  const topLevelReplies = replies.filter(reply => reply.root === null);
  return (
    <div className="border-t-[1px] border-[#CFCFCF] w-full p-[10px]">
      {topLevelReplies.length === 0 ? <p className="text-[10px]">댓글이 없습니다.</p> : topLevelReplies.map(reply => <ReplyItem key={reply.id} reply={reply} allReplies={replies} />)}
    </div>
  );
};

export default ReplyList;
