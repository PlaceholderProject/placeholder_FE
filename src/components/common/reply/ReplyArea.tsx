"use client";

import ReplyForm from "./ReplyForm";
import ReplyList from "./ReplyList";
import { useParams } from "next/navigation";
import { useMeetupDetail } from "@/hooks/useMeetupApi";
import { useScheduleDetail } from "@/hooks/useSchedule";

const ReplyArea: React.FC = () => {
  const { meetupId, scheduleId } = useParams();

  const meetupNumberId = Number(meetupId);
  const scheduleNumberId = Number(scheduleId);

  const { data: meetupDetail, isLoading } = useMeetupDetail(meetupNumberId, { enabled: true });
  const { data: schedule } = useScheduleDetail(Number(scheduleId));

  console.log("schedule", schedule);

  if (isLoading) return <div>로딩중</div>;

  return (
    <div className="mb-[5rem] flex flex-col items-center justify-center">
      <ReplyForm />
      <div className="mx-[1.5rem] my-[1rem] flex w-[95%] font-semibold md:max-w-[90rem]">댓글 {schedule ? schedule.commentCount : meetupDetail.commentCount}개</div>
      {meetupId && <ReplyList meetupId={meetupNumberId} scheduleId={scheduleNumberId} />}
    </div>
  );
};
export default ReplyArea;
