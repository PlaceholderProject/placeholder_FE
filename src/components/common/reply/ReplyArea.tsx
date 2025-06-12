"use client";

import { useEffect, useState } from "react";
import ReplyForm from "./ReplyForm";
import ReplyList from "./ReplyList";
import { getMeetupByIdApi } from "@/services/meetup.service";
import { useParams } from "next/navigation";
import { getSchedule } from "@/services/schedule.service";

const ReplyArea: React.FC = () => {
  const { meetupId, scheduleId } = useParams();

  console.log(useParams());
  const [replyCount, setReplyCount] = useState<number>(0);

  useEffect(() => {
    const fetchReplyCount = async () => {
      if (meetupId) {
        const meetup = await getMeetupByIdApi(Number(meetupId));
        setReplyCount(meetup.commentCount);
      }
      if (scheduleId) {
        const schedule = await getSchedule(Number(scheduleId));
        setReplyCount(schedule.commentCount);
      }
    };
    fetchReplyCount();
  }, [meetupId, scheduleId]);

  return (
    <div className="flex flex-col items-center justify-center">
      <ReplyForm />
      <div className="mx-[1.5rem] my-[1rem] flex w-[95%] font-semibold md:max-w-[90rem]">댓글 {replyCount}개</div>
      {meetupId && <ReplyList meetupId={meetupId} scheduleId={scheduleId} />}
    </div>
  );
};
export default ReplyArea;
