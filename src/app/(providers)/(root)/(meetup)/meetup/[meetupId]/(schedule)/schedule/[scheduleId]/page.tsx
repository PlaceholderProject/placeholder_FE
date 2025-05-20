import ScheduleDetail from "@/components/schedule/ScheduleDetail";
import ReplyArea from "@/components/common/reply/ReplyArea";

const ScheduleDetailPage = ({ params }: { params: { scheduleId: number } }) => {
  const { scheduleId } = params;
  
  return (
    <>
      <ScheduleDetail scheduleId={scheduleId} />
      <ReplyArea />
    </>
  );
};

export default ScheduleDetailPage;
