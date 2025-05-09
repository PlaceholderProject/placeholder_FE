"use client";

import { useEffect, useState } from "react";
import ReplyForm from "./ReplyForm";
import ReplyList from "./ReplyList";
import { getMeetupByIdApi } from "@/services/meetup.service";
import { useParams } from "next/navigation";

const ReplyArea: React.FC = () => {
  const { meetupId } = useParams();
  const [replyCount, setReplyCount] = useState<number>(0);

  useEffect(() => {
    const fetchReplyCount = async () => {
      if (meetupId) {
        const meetup = await getMeetupByIdApi(Number(meetupId));
        setReplyCount(meetup.commentCount);
      }
    };
    fetchReplyCount();
  }, [meetupId]);

  return (
    <div className="flex flex-col justify-start">
      <ReplyForm />
      <div className="text-[10px] m-2 font-[700]">댓글 {replyCount}개</div>
      {meetupId && <ReplyList meetupId={meetupId} />}
    </div>
  );
};

export default ReplyArea;
