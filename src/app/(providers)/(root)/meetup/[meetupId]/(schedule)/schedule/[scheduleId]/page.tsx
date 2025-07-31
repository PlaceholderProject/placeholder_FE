import ScheduleDetail from "@/components/schedule/ScheduleDetail";
import ReplyArea from "@/components/common/reply/ReplyArea";

const ScheduleDetailPage = ({ params }: { params: { scheduleId: string; meetupId: string } }) => {
  const { scheduleId, meetupId } = params;
  const scheduleIdNum = Number(scheduleId);
  const meetupIdNum = Number(meetupId);

  return (
    <>
      <ScheduleDetail scheduleId={scheduleIdNum} meetupId={meetupIdNum} />
      <ReplyArea />
    </>
  );
};

export default ScheduleDetailPage;
