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
    <div className="border rounded-lg p-4 mb-2 flex items-start">
      <ScheduleNumber number={number} />

      <div className="flex flex-col gap-2 flex-1" onClick={handleItemClick}>
        <div className="font-semibold text-lg">{formatDateTime(schedule.scheduledAt)}</div>
        <div className="font-medium text-gray-800">{schedule.place}</div>
        <div className="text-gray-600 text-sm">{schedule.address}</div>
        {schedule.memo && (
          <div className="text-gray-500 text-sm mt-2  p-2 rounded">{schedule.memo}</div>
        )}
      </div>

      <div onClick={(e) => e.stopPropagation()} className="ml-auto">
        <ScheduleThreeDotsMenu scheduleId={schedule.id} meetupId={schedule.meetupId} />
      </div>
    </div>
  );
};

export default ScheduleItem;