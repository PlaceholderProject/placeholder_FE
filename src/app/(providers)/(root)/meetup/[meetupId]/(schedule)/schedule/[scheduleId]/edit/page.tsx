import ScheduleForm from "@/components/schedule/ScheduleForm";
import { parsePositiveInteger } from "@/utils/parsePositiveInteger";
import { notFound } from "next/navigation";

interface EditSchedulePageProps {
  params: Promise<{
    meetupId: string;
    scheduleId: string;
  }>;
}

const EditSchedulePage = async ({ params }: EditSchedulePageProps) => {
  const { meetupId, scheduleId } = await params;

  const meetupIdNum = parsePositiveInteger(meetupId);
  const scheduleIdNum = parsePositiveInteger(scheduleId);
  if (!meetupIdNum || !scheduleIdNum) notFound();

  return <ScheduleForm meetupId={meetupIdNum} mode="edit" scheduleId={scheduleIdNum} />;
};

export default EditSchedulePage;
