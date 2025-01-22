import ScheduleForm from "@/components/schedule/ScheduleForm";

interface MeetupCreatePageProps {
  params: {
    meetupId: string;
  };
}

const MeetupCreatePage = ({ params }: MeetupCreatePageProps) => {
  const meetupId = parseInt(params.meetupId);

  return (
    <div>
      <h1>스케줄 생성</h1>
      <ScheduleForm meetupId={meetupId} />
    </div>
  );
};

export default MeetupCreatePage;
