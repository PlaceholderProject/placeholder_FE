"use client";

import { Schedule } from "@/types/scheduleType";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { formatDateTime } from "@/utils/scheduleDateUtils";
import ScheduleNumber from "@/components/schedule/ScheduleNumber";

const ScheduleItem = ({ schedule, number }: { schedule: Schedule; number: number }) => {

  const router = useRouter();

  const handleItemClick = useCallback(() => {
    router.push(`/meetup/${schedule.meetupId}/schedule/${schedule.id}`);
  }, [router, schedule.meetupId]);


  return (
    <div onClick={handleItemClick}>
      <ScheduleNumber number={number} />

      <div>
        <div>{formatDateTime(schedule.scheduledAt)}</div>
        <div>{schedule.place}</div>
        <div>{schedule.address}</div>
        {schedule.memo && (
          <div>메모 : {schedule.memo}</div>
        )}
      </div>
    </div>
  );
};

export default ScheduleItem;
