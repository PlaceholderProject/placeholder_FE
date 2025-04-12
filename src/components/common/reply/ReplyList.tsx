"use client";

import { useEffect, useState } from "react";
import ReplyItem from "./ReplyItem";
import { useParams } from "next/navigation";
import { getReply } from "@/services/reply.service";
import { Reply } from "@/types/replyType";

const ReplyList = () => {
  const params = useParams();

  const [replyList, setReplyList] = useState<Reply[]>([]);

  useEffect(() => {
    const fetchReplyList = async () => {
      if (params.meetupId) {
        const replyList = await getReply(params.meetupId);
        if (!replyList) return;
        setReplyList(replyList.result);
      }
    };
    fetchReplyList();
  }, []);

  return (
    <div className="border-t-[1px] border-[#CFCFCF] w-full p-[10px]">
      {replyList.length === 0 ? <p className="text-[10px]">댓글이 없습니다.</p> : replyList.map(reply => <ReplyItem key={reply.id} reply={reply} />)}
    </div>
  );
};

export default ReplyList;
