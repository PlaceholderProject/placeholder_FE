"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MemberSelector from "@/components/schedule/MemberSelector";
import { Schedule } from "@/types/scheduleType";
import { useCreateSchedule, useScheduleDetail, useUpdateSchedule } from "@/hooks/useSchedule";
import { useDaumPostcodePopup } from "react-daum-postcode";

interface ScheduleFormProps {
  meetupId: number;
  mode?: "create" | "edit";
  scheduleId?: number;
  initialData?: Schedule;
}

const ScheduleForm = ({ meetupId, mode = "create", scheduleId }: ScheduleFormProps) => {
  const router = useRouter();
  //카카오 우편 API 팝업
  const openPostcode = useDaumPostcodePopup();

  const createMutation = useCreateSchedule(meetupId);
  const updateMutation = useUpdateSchedule(scheduleId || 0);
  const { data: scheduleData, isPending: isLoadingSchedule } = useScheduleDetail(mode === "edit" && scheduleId ? scheduleId : undefined, {
    enabled: mode === "edit" && !!scheduleId,
  });

  // 폼 Ref들
  const scheduledAtRef = useRef<HTMLInputElement>(null);
  const placeRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const latitudeRef = useRef<HTMLInputElement>(null);
  const longitudeRef = useRef<HTMLInputElement>(null);
  const memoRef = useRef<HTMLTextAreaElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  //멤버 상태관리
  const [selectedMember, setSelectedMember] = useState<number[]>([]);

  // 폼 초기화
  useEffect(() => {
    if (mode === "edit" && scheduleData) {
      // 폼 필드 초기화
      if (scheduledAtRef.current) {
        const date = new Date(scheduleData.scheduledAt);
        const formattedDate = date.toISOString().slice(0, 16);
        scheduledAtRef.current.value = formattedDate;
      }
      if (placeRef.current) placeRef.current.value = scheduleData.place;
      if (addressRef.current) addressRef.current.value = scheduleData.address;
      if (latitudeRef.current) latitudeRef.current.value = scheduleData.latitude;
      if (longitudeRef.current) longitudeRef.current.value = scheduleData.longitude;
      if (memoRef.current) memoRef.current.value = scheduleData.memo;

      // 참석자 초기화
      const participantIds = scheduleData.participant.map(p => {
        if (typeof p === "object" && p !== null) {
          if ("id" in p) return p.id;
          if ("nickname" in p) return parseInt(p.nickname);
        }
        return 0; // 또는 다른 기본값
      }) as number[];

      setSelectedMember(participantIds);
    }
  }, [scheduleData, mode]);

  // 멤버 선택 처리
  const handleMemberSelect = (memberId: number) => {
    setSelectedMember(prev => (prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]));
  };

  // 주소 검색 처리
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

  // 폼 제출 처리
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(formData);
      } else if (mode === "edit" && scheduleId && updateMutation) {
        await updateMutation.mutateAsync({ scheduleId, formData });
      }
      router.push(`/meetup/${meetupId}`);
    } catch (error) {
      console.error(`Failed to ${mode} schedule:`, error);
    }
  };

  // 로딩 상태 처리
  if (mode === "edit" && isLoadingSchedule) {
    return <div className="p-4 text-center">데이터를 불러오는 중...</div>;
  }

  // 에러 상태 처리
  if (createMutation.isError || (updateMutation && updateMutation.isError)) {
    return <div className="p-4 text-center text-red-500">{`스케줄 ${mode === "create" ? "생성" : "수정"}에 실패했습니다.`}</div>;
  }

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

      <MemberSelector meetupId={meetupId} selectedMember={selectedMember} onMemberSelect={handleMemberSelect} />

      <button type="submit" className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
        {mode === "create" ? "스케줄 생성" : "스케줄 수정"}
      </button>
    </form>
  );
};

export default ScheduleForm;
