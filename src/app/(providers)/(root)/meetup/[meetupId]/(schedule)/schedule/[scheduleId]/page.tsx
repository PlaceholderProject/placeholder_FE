import ScheduleDetail from "@/components/schedule/ScheduleDetail";
import { parsePositiveInteger } from "@/utils/parsePositiveInteger";
import { notFound } from "next/navigation";

const ScheduleDetailPage = async ({ params }: { params: Promise<{ scheduleId: string; meetupId: string }> }) => {
  const { scheduleId, meetupId } = await params;
  const scheduleIdNum = parsePositiveInteger(scheduleId);
  const meetupIdNum = parsePositiveInteger(meetupId);
  if (!scheduleIdNum || !meetupIdNum) notFound();

  return <ScheduleDetail scheduleId={scheduleIdNum} meetupId={meetupIdNum} />;
};

export default ScheduleDetailPage;
