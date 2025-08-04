"use client";

import { useSchedules } from "@/hooks/useSchedule";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import ScheduleItem from "@/components/schedule/ScheduleItem";
import { FaPlus } from "react-icons/fa";
import Spinner from "../common/Spinner";

const ScheduleArea = ({ meetupId }: { meetupId: number }) => {
  const router = useRouter();
  const { data: schedules, isPending, error } = useSchedules(meetupId);

  const handleCreateClick = useCallback(() => {
    router.push(`/meetup/${meetupId}/schedule/create`);
  }, [router, meetupId]);

  if (isPending) {
    // return <Loading />;
    return <Spinner isLoading={isPending} />;
  }
  if (error) return <div>Error: {error.message}</div>;

  const hasSchedules = schedules && schedules.length > 0;

  return (
    <div className="relative flex min-h-[400px] flex-col p-4">
      {!hasSchedules ? (
        <div className="flex flex-grow flex-col items-center justify-center gap-4">
          <p className="text-gray-500">버튼을 눌러 스케줄을 등록해보세요</p>
          <button
            onClick={handleCreateClick}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-3xl text-white shadow-lg transition-transform hover:scale-105"
            aria-label="스케줄 추가"
          >
            <FaPlus />
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {schedules.map((schedule, index) => (
            <ScheduleItem key={schedule.id} schedule={schedule} number={index + 1} />
          ))}
          <button
            onClick={handleCreateClick}
            className="absolute bottom-4 left-1/2 flex h-14 w-14 -translate-x-1/2 transform items-center justify-center rounded-full bg-primary text-2xl text-white shadow-lg transition-transform hover:scale-105 md:h-16 md:w-16"
            aria-label="스케줄 추가"
          >
            <FaPlus />
          </button>
        </div>
      )}
    </div>
  );
};

export default ScheduleArea;
