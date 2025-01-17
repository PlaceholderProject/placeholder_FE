import ScheduleForm from "@/components/schedule/ScheduleForm";

interface ScheduleCreatePageProps {
  params: {
    meetupId: string;
  };
}

const ScheduleCreatePage = ({ params }: ScheduleCreatePageProps) => {
  const meetupId = parseInt(params.meetupId);

  return (
    <div>
      <h1>스케줄 생성</h1>
      <ScheduleForm meetupId={meetupId} />
    </div>
  );
};

export default ScheduleCreatePage;
