import ScheduleDetail from "@/components/schedule/ScheduleDetail";
import ReplyArea from "@/components/common/reply/ReplyArea";

const ScheduleDetailPage = async ({ params }: { params: Promise<{ scheduleId: string; meetupId: string }> }) => {
  const { scheduleId, meetupId } = await params;
  const scheduleIdNum = Number(scheduleId);
  const meetupIdNum = Number(meetupId);

  return (
    <main className="mx-auto w-[95%] max-w-[120rem] pb-[6rem]">
      <ScheduleDetail scheduleId={scheduleIdNum} meetupId={meetupIdNum} />
      <section className="border-border bg-card overflow-hidden rounded-[2rem] border">
        <ReplyArea variant="card" />
      </section>
    </main>
  );
};

export default ScheduleDetailPage;
