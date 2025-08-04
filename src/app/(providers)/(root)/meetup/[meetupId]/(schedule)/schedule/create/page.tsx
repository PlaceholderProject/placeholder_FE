import ScheduleForm from "@/components/schedule/ScheduleForm";

interface MeetupCreatePageProps {
  params: {
    meetupId: string;
  };
}

const MeetupCreatePage = ({ params }: MeetupCreatePageProps) => {
  const { meetupId } = params;

  const meetupIdNum = Number(meetupId);

  return (
    <div>
      <ScheduleForm meetupId={meetupIdNum} />
    </div>
  );
};

export default MeetupCreatePage;
