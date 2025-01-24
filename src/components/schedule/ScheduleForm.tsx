"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { createSchedule } from "@/services/schedule.service";
import { useDaumPostcodePopup } from "react-daum-postcode";

const ScheduleForm = (meetupId: number) => {
  const router = useRouter();

  const scheduledAtRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const latitudeRef = useRef<HTMLInputElement>(null);
  const longitudeRef = useRef<HTMLInputElement>(null);
  const memoRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const openPostcode = useDaumPostcodePopup(); // 카카오 우편번호 API 팝업

  const handleAddressSearch = () => {
    openPostcode({
      onComplete: data => {
        if (addressRef.current) addressRef.current.value = data.address;

        // 주소를 위경도로 변환
        const geocoder = new window.kakao.maps.services.Geocoder();
        geocoder.addressSearch(data.address, (result, status) => {
          if (status === window.kakao.maps.services.Status.OK) {
            if (longitudeRef.current) longitudeRef.current.value = result[0].x;
            if (latitudeRef.current) latitudeRef.current.value = result[0].y;
          }
        });
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      const payload = {
        scheduled_at: scheduledAtRef.current?.value || "",
        place: placeRef.current?.value || "",
        address: addressRef.current?.value || "",
        latitude: String(latitudeRef.current?.value || "0"),
        longitude: String(longitudeRef.current?.value || "0"),
        memo: memoRef.current?.value || "",
        participant: [],
      };

      formData.append("payload", JSON.stringify(payload));
      if (imageRef.current?.files?.[0]) {
        formData.append("image", imageRef.current.files[0]);
      }

      await createSchedule(meetupId, formData);
      router.push(`/meetup/${meetupId}`);
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col space-y-4 p-4">
      <div>
        <label htmlFor="scheduled_at">날짜 및 시간</label>
        <input type="datetime-local" id="scheduled_at" ref={scheduledAtRef} required />
      </div>

      <div>
        <label htmlFor="place">장소명</label>
        <input type="text" id="place" ref={placeRef} required />
      </div>

      <div>
        <label htmlFor="address">주소</label>
        <input type="text" id="address" ref={addressRef} required />
        <button type="button" onClick={handleAddressSearch} className="bg-gray-300 px-2 py-1">
          우편번호 찾기
        </button>
      </div>

      {/* 위경도는 제출하되 안보이게 히든 */}
      <input type="hidden" ref={latitudeRef} />
      <input type="hidden" ref={longitudeRef} />

      <div>
        <label htmlFor="memo">메모</label>
        <textarea id="memo" ref={memoRef} />
      </div>

      <button type="submit">스케줄 생성</button>
    </form>
  );
};

export default ScheduleForm;
