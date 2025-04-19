"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createSchedule, getSchedule, updateSchedule } from "@/services/schedule.service";
import { useDaumPostcodePopup } from "react-daum-postcode";
import MemberSelector from "@/components/schedule/MemberSelector";
import { Schedule } from "@/types/scheduleType";

interface ScheduleFormProps {
  meetupId: number;
  mode?: "create" | "edit";
  scheduleId?: number;
  initialData?: Schedule;
}

const ScheduleForm = ({
                        meetupId,
                        mode = "create",
                        scheduleId,
                        initialData,
                      }: ScheduleFormProps) => {
  const router = useRouter();
  const scheduledAtRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const latitudeRef = useRef<HTMLInputElement>(null);
  const longitudeRef = useRef<HTMLInputElement>(null);
  const memoRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const [selectedMember, setSelectedMember] = useState<number[]>([]);
  const [isPending, setIsPending] = useState(mode === "edit" && !initialData);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const openPostcode = useDaumPostcodePopup();

  // 수정 모드에서 초기 데이터 가져오기
  useEffect(() => {
    const fetchScheduleData = async () => {
      if (mode === "edit" && scheduleId && !initialData) {
        try {
          setIsPending(true);
          const data = await getSchedule(scheduleId);

          // 폼 필드 초기화
          if (scheduledAtRef.current) {
            // datetime-local 입력에 맞는 형식으로 변환
            const date = new Date(data.scheduledAt);
            const formattedDate = date.toISOString().slice(0, 16);
            scheduledAtRef.current.value = formattedDate;
          }
          if (placeRef.current) placeRef.current.value = data.place;
          if (addressRef.current) addressRef.current.value = data.address;
          if (latitudeRef.current) latitudeRef.current.value = data.latitude;
          if (longitudeRef.current) longitudeRef.current.value = data.longitude;
          if (memoRef.current) memoRef.current.value = data.memo;

          // 참석자 초기화
          const participantIds = data.participant.map(p => p.id);
          setSelectedMember(participantIds);

          setIsPending(false);
        } catch (error: unknown) {
          setErrorMessage("스케줄 정보를 불러오는 데 실패했습니다.");
          setIsPending(false);
          console.error("Schedule fetch error:", error);
        }
      }
    };

    fetchScheduleData();
  }, [mode, scheduleId, initialData]);

  // 초기 데이터가 제공된 경우 폼 초기화
  useEffect(() => {
    if (initialData && mode === "edit") {
      if (scheduledAtRef.current) {
        const date = new Date(initialData.scheduledAt);
        const formattedDate = date.toISOString().slice(0, 16);
        scheduledAtRef.current.value = formattedDate;
      }
      if (placeRef.current) placeRef.current.value = initialData.place;
      if (addressRef.current) addressRef.current.value = initialData.address;
      if (latitudeRef.current) latitudeRef.current.value = initialData.latitude;
      if (longitudeRef.current) longitudeRef.current.value = initialData.longitude;
      if (memoRef.current) memoRef.current.value = initialData.memo;

      const participantIds = initialData.participant.map(p => parseInt(p.nickname));
      setSelectedMember(participantIds);
    }
  }, [initialData, mode]);

  const handleMemberSelect = (memberId: number) => {
    setSelectedMember(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId],
    );
  };

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
        participant: selectedMember,
      };

      formData.append("payload", JSON.stringify(payload));
      if (imageRef.current?.files?.[0]) {
        formData.append("image", imageRef.current.files[0]);
      }

      if (mode === "create") {
        await createSchedule(meetupId, formData);
      } else if (mode === "edit" && scheduleId) {
        await updateSchedule(scheduleId, formData);
      }

      router.push(`/meetup/${meetupId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Failed to ${mode} schedule:`, error.message);
      } else {
        console.error(`Failed to ${mode} schedule with unknown error`);
      }
      setErrorMessage(`스케줄 ${mode === "create" ? "생성" : "수정"}에 실패했습니다.`);
    }
  };

  if (isPending) return <div>데이터를 불러오는 중...</div>;
  if (errorMessage) return <div>에러: {errorMessage}</div>;

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
        <input type="text" id="address" onClick={handleAddressSearch} ref={addressRef} required />
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

      <div>
        <label htmlFor="image">이미지</label>
        <input type="file" id="image" ref={imageRef} accept="image/*" />
      </div>

      <MemberSelector
        meetupId={meetupId}
        selectedMember={selectedMember}
        onMemberSelect={handleMemberSelect}
      />

      <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
        {mode === "create" ? "스케줄 생성" : "스케줄 수정"}
      </button>
    </form>
  );
};

export default ScheduleForm;