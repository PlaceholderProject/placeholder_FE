"use client";

import { Schedule } from "@/types/scheduleType";

interface ScheduleItemProps {
  schedule: Schedule;
  number: number;
}

const ScheduleItem = ({ schedule, number }: ScheduleItemProps) => {
  return (
    <div className="border rounded-lg p-4 mb-2 flex items-start shadow-sm hover:shadow-md transition-shadow">
      <div className="mr-4 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center">{number}</div>
      <div className="flex flex-col gap-2 flex-1">
        <div className="font-semibold text-lg">{schedule.scheduled_at}</div>
        <div className="font-medium text-gray-800">{schedule.place}</div>
        <div className="text-gray-600 text-sm">{schedule.address}</div>
        {schedule.memo && <div className="text-gray-500 text-sm mt-2 bg-gray-50 p-2 rounded">{schedule.memo}</div>}
      </div>
    </div>
  );
};

export default ScheduleItem;
