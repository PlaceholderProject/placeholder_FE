"use client";

import { Schedule } from "@/types/scheduleType";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { formatDateTime } from "@/utils/scheduleDateUtils";
import ScheduleNumber from "@/components/schedule/ScheduleNumber";
import ScheduleThreeDotsMenu from "@/components/schedule/ScheduleThreeDotsMenu";

const ScheduleItem = ({ schedule, number }: { schedule: Schedule; number: number }) => {
  const router = useRouter();

  const handleItemClick = useCallback(() => {
    router.push(`/meetup/${schedule.meetupId}/schedule/${schedule.id}`);
  }, [router, schedule.meetupId, schedule.id]);

  return (
    <div className="mb-2 flex cursor-pointer items-start rounded-lg border p-4">
      <ScheduleNumber number={number} />

      <div className="flex flex-1 flex-col gap-2" onClick={handleItemClick}>
        <div className="text-lg font-semibold">{formatDateTime(schedule.scheduledAt)}</div>
        <div className="font-medium text-gray-800">{schedule.place}</div>
        <div className="text-sm text-gray-600">{schedule.address}</div>
        {schedule.memo && <div className="mt-2 rounded p-2 text-sm text-gray-500">{schedule.memo}</div>}
      </div>

      <div onClick={e => e.stopPropagation()} className="ml-auto">
        <ScheduleThreeDotsMenu scheduleId={schedule.id} meetupId={schedule.meetupId} />
      </div>
    </div>
  );
};

export default ScheduleItem;
