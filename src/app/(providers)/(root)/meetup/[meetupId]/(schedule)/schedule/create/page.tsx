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
      <ScheduleForm meetupId={meetupIdNum} />
    </div>
  );
};

export default MeetupCreatePage;
