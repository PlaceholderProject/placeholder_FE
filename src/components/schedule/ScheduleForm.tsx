"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { createSchedule } from "@/services/meetup.service";

interface ScheduleFormProps {
  meetupId: number;
}

const ScheduleForm = ({ meetupId }: ScheduleFormProps) => {
  const router = useRouter();

  const scheduledAtRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const latitudeRef = useRef<HTMLInputElement>(null);
  const longitudeRef = useRef<HTMLInputElement>(null);
  const memoRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const scheduleData = {
        scheduled_at: scheduledAtRef.current?.value || "",
        meetup_id: meetupId,
        place: placeRef.current?.value || "",
        address: addressRef.current?.value || "",
        latitude: Number(latitudeRef.current?.value) || 0,
        longitude: Number(longitudeRef.current?.value) || 0,
        memo: memoRef.current?.value || "",
        participant: [], // 참석자 목록은 나중에 추가
      };

      await createSchedule(meetupId, scheduleData);
      router.push(`/${meetupId}/schedule`);
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
      <div>
        <label htmlFor="scheduled_at" className="block mb-1">
          날짜 및 시간
        </label>
        <input type="datetime-local" id="scheduled_at" ref={scheduledAtRef} className="w-full p-2 border rounded" required />
      </div>

      <div>
        <label htmlFor="place" className="block mb-1">
          장소명
        </label>
        <input type="text" id="place" ref={placeRef} className="w-full p-2 border rounded" required />
      </div>

      <div>
        <label htmlFor="address" className="block mb-1">
          주소
        </label>
        <input type="text" id="address" ref={addressRef} className="w-full p-2 border rounded" required />
        {/* 우편 API 버튼 나중에 추가 */}
      </div>

      {/* 위도/경도 입력은 숨겨두거나 우편 API에서 자동으로 설정되도록 할 수 있습니다 */}
      <input type="hidden" ref={latitudeRef} />
      <input type="hidden" ref={longitudeRef} />

      <div>
        <label htmlFor="memo" className="block mb-1">
          메모
        </label>
        <textarea id="memo" ref={memoRef} className="w-full p-2 border rounded h-32" />
      </div>

      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
        스케줄 생성
      </button>
    </form>
  );
};

export default ScheduleForm;
