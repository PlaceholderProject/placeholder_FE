import ScheduleDetail from "@/components/schedule/ScheduleDetail";
import ReplyArea from "@/components/common/reply/ReplyArea";

const ScheduleDetailPage = async ({ params }: { params: Promise<{ scheduleId: string }> }) => {
  const { scheduleId } = await params;
  const scheduleIdNum = Number(scheduleId);

  return (
    <>
      <ScheduleDetail scheduleId={scheduleIdNum} />
      <ReplyArea />
    </>
  );
};

export default ScheduleDetailPage;
