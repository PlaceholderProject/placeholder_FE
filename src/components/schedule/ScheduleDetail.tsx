"use client";

import Image from "next/image";
import { useScheduleDetail } from "@/hooks/useSchedule";
import { formatDateTime } from "@/utils/scheduleDateUtils";
import AttendeePopover from "@/components/schedule/AttendeePopover";
import ScheduleNumber from "@/components/schedule/ScheduleNumber";

const ScheduleDetail = ({ scheduleId }: { scheduleId: number }) => {
  const { data: schedule, isPending, error } = useScheduleDetail(scheduleId);

  if (isPending) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!schedule) return <div>스케줄을 찾을 수 없습니다.</div>;

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="w-full p-4 rounded-md ">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <ScheduleNumber number={scheduleId} />
            <div>
              <div className="text-sm  font-semibold">
                {formatDateTime(schedule.scheduledAt)}
              </div>
              <div className="font-bold text-lg">
                {schedule.place}
              </div>
              <div className="text-sm text-gray-500 truncate">
                {schedule.address}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center">
          {schedule.image ? (
            <Image
              src={schedule.image}
              alt="스케줄 이미지"
              width={300}
              height={300}
              className="rounded-md object-cover"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center rounded-md text-gray-500">
              <span>등록된 이미지가 없습니다</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center w-full mt-4">
          <AttendeePopover participants={schedule.participant} />
          <button className="text-sm text-gray-700 bg-white px-3 py-1 rounded-md shadow-sm hover:bg-gray-50">
            사진 수정
          </button>
        </div>

        {/* 댓글 컴포넌트 위치 */}
        <div className="mt-4 w-full">
          {/* <댓글 컴뽀난트 scheduleId={scheduleId} /> */}
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetail;