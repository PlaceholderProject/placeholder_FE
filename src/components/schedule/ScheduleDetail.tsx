"use client";

import Image from "next/image";
import { useScheduleDetail, useSchedules } from "@/hooks/useSchedule";
import { formatDateTime } from "@/utils/scheduleDateUtils";
import AttendeePopover from "@/components/schedule/AttendeePopover";
import ScheduleNumber from "@/components/schedule/ScheduleNumber";
import { useMemo } from "react";

const ScheduleDetail = ({ scheduleId, meetupId }: { scheduleId: number; meetupId: number }) => {
  const { data: schedule, isPending, error } = useScheduleDetail(scheduleId);
  const { data: schedules } = useSchedules(meetupId);

  // 스케줄 번호 계산
  const scheduleNumber = useMemo(() => {
    if (!schedules || !schedule) return 1;
    const index = schedules.findIndex(s => s.id === schedule.id);
    return index >= 0 ? index + 1 : 1;
  }, [schedules, schedule]);

  if (isPending) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!schedule) return <div>스케줄을 찾을 수 없습니다.</div>;

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="w-full rounded-md p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <ScheduleNumber number={scheduleNumber} />
            <div>
              <div className="text-sm font-semibold">{formatDateTime(schedule.scheduledAt)}</div>
              <div className="text-lg font-bold">{schedule.place}</div>
              <div className="truncate text-sm text-gray-500">{schedule.address}</div>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center">
          {schedule.image ? (
            <Image src={schedule.image} alt="스케줄 이미지" width={300} height={300} className="rounded-md object-cover" />
          ) : (
            <div className="flex h-64 w-full items-center justify-center rounded-md text-gray-500">
              <span>등록된 이미지가 없습니다</span>
            </div>
          )}
        </div>

        <div className="mt-4 flex w-full items-center justify-between">
          <AttendeePopover participants={schedule.participant} />
          <button className="rounded-md bg-white px-3 py-1 text-sm text-gray-700 shadow-sm hover:bg-gray-50">사진 수정</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetail;
