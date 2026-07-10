import ScheduleForm from "@/components/schedule/ScheduleForm";
import { parsePositiveInteger } from "@/utils/parsePositiveInteger";
import { notFound } from "next/navigation";

interface MeetupCreatePageProps {
  params: Promise<{
    meetupId: string;
  }>;
}

const MeetupCreatePage = async ({ params }: MeetupCreatePageProps) => {
  const { meetupId } = await params;

  const meetupIdNum = parsePositiveInteger(meetupId);
  if (!meetupIdNum) notFound();

  return <ScheduleForm meetupId={meetupIdNum} />;
};

export default MeetupCreatePage;
