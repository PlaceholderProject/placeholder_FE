"use client";

import { useEffect, useState } from "react";
import ReplyForm from "./ReplyForm";
import ReplyList from "./ReplyList";
import { getMeetupByIdApi } from "@/services/meetup.service";
import { useParams } from "next/navigation";
import { Reply } from "@/types/replyType";
import { getReply } from "@/services/reply.service";

const ReplyArea: React.FC = () => {
  const params = useParams();
  const [replyCount, setReplyCount] = useState<number>(0);
  const [replies, setReplies] = useState<Reply[]>([]);

  useEffect(() => {
    const fetchReplyCount = async () => {
      if (params.meetupId) {
        const meetup = await getMeetupByIdApi(Number(params.meetupId));
        setReplyCount(meetup.commentCount);
      }
    };
    const fetchReplies = async () => {
      if (params.meetupId) {
        const result = await getReply(params.meetupId);
        setReplies(result.result);
      }
    };
    fetchReplyCount();
    fetchReplies();
  }, [params.meetupId]);

  return (
    <div className="flex flex-col justify-start">
      <ReplyForm />
      <div className="text-[10px] m-2 font-[700]">댓글 {replyCount}개</div>
      <ReplyList replies={replies} />
    </div>
  );
};

export default ReplyArea;
