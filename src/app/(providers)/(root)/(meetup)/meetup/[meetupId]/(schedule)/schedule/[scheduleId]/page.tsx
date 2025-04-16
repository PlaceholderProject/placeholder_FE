import ScheduleDetail from "@/components/schedule/ScheduleDetail";

const ScheduleDetailPage = ({ params }: { params: { scheduleId: string } }) => {
  const scheduleId = Number(params.scheduleId);

  return (
    <div className="p-4">
      <ScheduleDetail scheduleId={scheduleId} />
    </div>
  );
};

export default ScheduleDetailPage;
