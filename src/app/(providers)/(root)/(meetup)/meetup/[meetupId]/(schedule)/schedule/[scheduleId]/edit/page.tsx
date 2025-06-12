import ScheduleForm from "@/components/schedule/ScheduleForm";

interface EditSchedulePageProps {
  params: {
    meetupId: string;
    scheduleId: string;
  };
}

const EditSchedulePage = ({ params }: EditSchedulePageProps) => {
  const meetupId = Number(params.meetupId);
  const scheduleId = Number(params.scheduleId);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">스케줄 수정</h1>
      <ScheduleForm meetupId={meetupId} mode="edit" scheduleId={scheduleId} />
    </div>
  );
};

export default EditSchedulePage;
