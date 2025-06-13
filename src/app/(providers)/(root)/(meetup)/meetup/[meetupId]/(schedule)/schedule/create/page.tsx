import ScheduleForm from "@/components/schedule/ScheduleForm";

interface MeetupCreatePageProps {
  params: Promise<{
    meetupId: string;
  }>;
}

const MeetupCreatePage = async ({ params }: MeetupCreatePageProps) => {
  const { meetupId } = await params;

  const meetupIdNum = Number(meetupId);

  return (
    <div>
      <h1>스케줄 생성</h1>
      <ScheduleForm meetupId={meetupIdNum} />
    </div>
  );
};

export default MeetupCreatePage;
