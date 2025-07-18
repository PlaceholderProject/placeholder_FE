import ScheduleForm from "@/components/schedule/ScheduleForm";

interface EditSchedulePageProps {
  params: Promise<{
    meetupId: string;
    scheduleId: string;
  }>;
}

const EditSchedulePage = async ({ params }: EditSchedulePageProps) => {
  const { meetupId, scheduleId } = await params;

  const meetupIdNum = Number(meetupId);
  const scheduleIdNum = Number(scheduleId);

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold">스케줄 수정</h1>
      <ScheduleForm meetupId={meetupIdNum} mode="edit" scheduleId={scheduleIdNum} />
    </div>
  );
};

export default EditSchedulePage;
