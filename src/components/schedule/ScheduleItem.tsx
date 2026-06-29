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
    <div className="flex flex-col rounded-lg border bg-white p-4 shadow-sm md:bg-white">
      <div className="flex items-start">
        <ScheduleNumber number={number} />

        <div className="flex-1 cursor-pointer" onClick={handleItemClick}>
          <div className="bg-primary mb-1 inline-block px-2 py-0.5 text-sm font-bold text-white">{schedule.place}</div>
          <div className="text-primary text-base font-bold">{formatDateTime(schedule.scheduledAt)}</div>
          <div className="text-gray-dark text-sm">{schedule.address}</div>
        </div>

        <div onClick={e => e.stopPropagation()} className="ml-auto pl-2">
          <ScheduleThreeDotsMenu scheduleId={schedule.id} meetupId={schedule.meetupId} />
        </div>
      </div>

      {schedule.memo && (
        <div className="bg-secondary-light mt-2 w-full cursor-pointer rounded-lg p-3 text-base text-gray-800" onClick={handleItemClick}>
          <p className="whitespace-pre-wrap">{schedule.memo}</p>
        </div>
      )}
    </div>
  );
};

export default ScheduleItem;
