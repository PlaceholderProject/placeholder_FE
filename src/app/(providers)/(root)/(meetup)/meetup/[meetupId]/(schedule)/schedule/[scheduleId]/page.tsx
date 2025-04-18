import ScheduleDetail from "@/components/schedule/ScheduleDetail";

const ScheduleDetailPage = ({ params }: { params: { scheduleId: string } }) => {
  const { scheduleId } = params;

  return (
    <ScheduleDetail scheduleId={scheduleId} />
  );
};

export default ScheduleDetailPage;
