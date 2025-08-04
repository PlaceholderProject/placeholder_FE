import ScheduleDetail from "@/components/schedule/ScheduleDetail";
import ReplyArea from "@/components/common/reply/ReplyArea";

const ScheduleDetailPage = async ({ params }: { params: Promise<{ scheduleId: string; meetupId: string }> }) => {
  const { scheduleId, meetupId } = await params;
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
