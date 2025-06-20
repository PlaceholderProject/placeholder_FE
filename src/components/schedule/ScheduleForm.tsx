"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import MemberSelector from "@/components/schedule/MemberSelector";
import { useCreateSchedule, useScheduleDetail, useUpdateSchedule } from "@/hooks/useSchedule";
import { useDaumPostcodePopup } from "react-daum-postcode";
import { useImageUpload } from "@/hooks/useImageUpload"; // [!code ++]
import { BASE_URL } from "@/constants/baseURL";

interface ScheduleFormProps {
  meetupId: number;
  mode?: "create" | "edit";
  scheduleId?: number;
}

// 카카오맵 SDK 로딩 확인 훅
const useKakaoMapSDK = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.kakao?.maps?.services) {
      setIsLoaded(true);
      return;
    }
    const checkKakaoMaps = () => {
      if (window.kakao?.maps?.services) {
        setIsLoaded(true);
        return;
      }
      setTimeout(checkKakaoMaps, 100);
    };
    if (!document.querySelector('script[src*="dapi.kakao.com"]')) {
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&libraries=services&autoload=false`;
      script.async = true;
      script.onload = () => {
        if (window.kakao?.maps) {
          window.kakao.maps.load(() => {
            checkKakaoMaps();
          });
        }
      };
      document.head.appendChild(script);
    } else {
      checkKakaoMaps();
    }
  }, []);

  return isLoaded;
};

const ScheduleForm = ({ meetupId, mode = "create", scheduleId }: ScheduleFormProps) => {
  const router = useRouter();
  const openPostcode = useDaumPostcodePopup();
  const isKakaoMapLoaded = useKakaoMapSDK();

  // 이미지 업로드 훅과 스케줄 생성/수정 훅을 모두 사용합니다.
  const imageUploadMutation = useImageUpload();
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

  // 멤버 상태관리
  const [selectedMember, setSelectedMember] = useState<number[]>([]);

  // 이미지 업로드 관련 상태
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // 폼 초기화 (수정 모드일 때)
  useEffect(() => {
    if (mode === "edit" && scheduleData) {
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

      // 기존 이미지가 있으면 미리보기로 설정
      if (scheduleData.image) {
        // 백엔드에서 전체 URL을 주지 않는 경우를 대비하여 BASE_URL과 조합
        const fullImageUrl = scheduleData.image.startsWith("http") ? scheduleData.image : `${BASE_URL}/${scheduleData.image}`;
        setImagePreview(fullImageUrl);
      }

      const participantIds = scheduleData.participant.map(p => (typeof p === "object" && p !== null && "id" in p ? p.id : 0)).filter(id => id > 0) as number[];
      setSelectedMember(participantIds);
    }
  }, [scheduleData, mode]);

  // 멤버 선택 처리
  const handleMemberSelect = (memberId: number) => {
    setSelectedMember(prev => (prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]));
  };

  // 이미지 선택 핸들러
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 제거 핸들러
  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (imageRef.current) {
      imageRef.current.value = "";
    }
  };

  // 주소 검색 처리
  const handleAddressSearch = useCallback(() => {
    openPostcode({
      onComplete: data => {
        if (addressRef.current) addressRef.current.value = data.address;
        if (isKakaoMapLoaded && window.kakao?.maps?.services) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(data.address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK && result[0]) {
              if (longitudeRef.current) longitudeRef.current.value = result[0].x;
              if (latitudeRef.current) latitudeRef.current.value = result[0].y;
            }
          });
        }
      },
    });
  }, [openPostcode, isKakaoMapLoaded]);

  // 폼 제출 처리 (Pre-signed URL 로직 적용)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 수정 모드일 때, 새 이미지가 없으면 기존 이미지 경로를 유지
    let imageKey: string | null = mode === "edit" ? scheduleData?.image || null : null;

    // 1. 새 이미지가 선택된 경우, S3에 먼저 업로드
    if (selectedImage) {
      try {
        const uploadedKeys = await imageUploadMutation.mutateAsync({
          files: [selectedImage],
          target: "schedule",
        });
        imageKey = uploadedKeys?.[0] || null;
      } catch (error) {
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        return; // 업로드 실패 시 중단
      }
    }

    // 2. 서버에 전송할 최종 JSON payload 생성
    const payload = {
      scheduled_at: scheduledAtRef.current?.value || "",
      place: placeRef.current?.value || "",
      address: addressRef.current?.value || "",
      latitude: String(latitudeRef.current?.value || "0"),
      longitude: String(longitudeRef.current?.value || "0"),
      memo: memoRef.current?.value || "",
      participant: selectedMember,
      image: imageKey,
    };

    // 3. 스케줄 생성 또는 수정 API 호출
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (mode === "edit" && scheduleId) {
        await updateMutation.mutateAsync({ scheduleId, payload });
      }
      router.push(`/meetup/${meetupId}`);
    } catch (error) {
      console.error(`스케줄 ${mode} 실패:`, error);
      alert(`스케줄 ${mode === "create" ? "생성" : "수정"}에 실패했습니다.`);
    }
  };

  // 로딩 상태 처리
  const isProcessing = createMutation.isPending || updateMutation.isPending || imageUploadMutation.isPending;

  if (mode === "edit" && isLoadingSchedule) {
    return <div className="p-4 text-center">데이터를 불러오는 중...</div>;
  }

  return (
    <div className="responsive-container">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
        {/* 날짜 및 시간 */}
        <div className="space-y-2">
          <label htmlFor="scheduled_at" className="block text-sm font-medium text-gray-700">
            날짜 및 시간 *
          </label>
          <input
            type="datetime-local"
            id="scheduled_at"
            ref={scheduledAtRef}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#006B8B] focus:outline-none focus:ring-1 focus:ring-[#006B8B]"
          />
        </div>

        {/* 장소명 */}
        <div className="space-y-2">
          <label htmlFor="place" className="block text-sm font-medium text-gray-700">
            장소명 *
          </label>
          <input
            type="text"
            id="place"
            ref={placeRef}
            required
            placeholder="모임 장소명을 입력하세요"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#006B8B] focus:outline-none focus:ring-1 focus:ring-[#006B8B]"
          />
        </div>

        {/* 주소 */}
        <div className="space-y-2">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            주소 *
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="address"
              ref={addressRef}
              required
              readOnly
              placeholder="우편번호 찾기 버튼을 클릭하세요"
              className="flex-1 cursor-pointer rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:border-[#006B8B] focus:outline-none focus:ring-1 focus:ring-[#006B8B]"
              onClick={handleAddressSearch}
            />
            <button type="button" onClick={handleAddressSearch} className="rounded-md bg-[#006B8B] px-4 py-2 text-white transition-colors hover:bg-[#005070]">
              우편번호 찾기
            </button>
          </div>
        </div>

        {/* 위경도 히든 필드 */}
        <input type="hidden" ref={latitudeRef} />
        <input type="hidden" ref={longitudeRef} />

        {/* 메모 */}
        <div className="space-y-2">
          <label htmlFor="memo" className="block text-sm font-medium text-gray-700">
            메모
          </label>
          <textarea
            id="memo"
            ref={memoRef}
            rows={4}
            placeholder="스케줄에 대한 추가 정보를 입력하세요"
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#006B8B] focus:outline-none focus:ring-1 focus:ring-[#006B8B]"
          />
        </div>

        {/* 이미지 업로드 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">이미지 업로드</label>
          <input ref={imageRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" id="image-upload" />
          <label htmlFor="image-upload" className="flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-gray-400">
            {imagePreview ? (
              <div className="relative">
                <img src={imagePreview} alt="미리보기" className="h-48 w-full rounded-lg object-cover" />
                <button type="button" onClick={handleImageRemove} className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600">
                  ✕
                </button>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500">클릭하여 이미지 선택</p>
                <p className="text-xs text-gray-400">JPG, PNG 파일만 가능</p>
              </div>
            )}
          </label>
        </div>

        {/* 멤버 선택 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">참석자 선택</label>
          <MemberSelector meetupId={meetupId} selectedMember={selectedMember} onMemberSelect={handleMemberSelect} />
        </div>

        {/* 제출 버튼 */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full rounded-md bg-[#006B8B] px-4 py-3 font-medium text-white transition-colors hover:bg-[#005070] focus:outline-none focus:ring-2 focus:ring-[#006B8B] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isProcessing ? "처리 중..." : mode === "create" ? "스케줄 생성" : "스케줄 수정"}
        </button>
      </form>
    </div>
  );
};

export default ScheduleForm;
