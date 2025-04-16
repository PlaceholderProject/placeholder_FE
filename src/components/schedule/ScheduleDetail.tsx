"use client";

import Image from "next/image";
import { useScheduleDetail } from "@/hooks/useSchedule";
import { formatDateTime } from "@/utils/scheduleDateUtils";

const ScheduleDetail = ({ scheduleId }: { scheduleId: number }) => {
  const { data: schedule, isPending, error } = useScheduleDetail(scheduleId);

  if (isPending) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!schedule) return <div>스케줄을 찾을 수 없습니다.</div>;

  // 참석자 정보 표시 문자열 생성
  const participantText = schedule.participant?.length > 0
    ? schedule.participant.length === 1
      ? schedule.participant[0].nickname
      : `${schedule.participant[0].nickname} 외 ${schedule.participant.length - 1}인 참석`
    : "참석자 없음";

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="w-full bg-gray-100 p-4 rounded-md shadow">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <span
              className="bg-blue-700 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold mr-2">
              1
            </span>
            <div>
              {/* 날짜 포맷팅 유틸 함수 사용 */}
              <div className="text-sm text-blue-700 font-semibold">
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
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-md text-gray-500">
              <span>등록된 이미지가 없습니다</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center w-full mt-4">
          {/* 동적으로 참석자 정보 표시 */}
          <span className="text-gray-600">{participantText}</span>
          <button className="text-sm text-gray-700 bg-white px-3 py-1 rounded-md shadow-sm hover:bg-gray-50">
            사진 수정
          </button>
        </div>

        {/* 댓글 컴포넌트 위치 */}
        <div className="mt-4 w-full">
          {/* <CommentComponent scheduleId={scheduleId} /> */}
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetail;