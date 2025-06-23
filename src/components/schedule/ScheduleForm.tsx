"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import MemberSelector from "@/components/schedule/MemberSelector";
import { useCreateSchedule, useScheduleDetail, useUpdateSchedule } from "@/hooks/useSchedule";
import { useImageUpload } from "@/hooks/useImageUpload"; // ✅ 추가
import { useDaumPostcodePopup } from "react-daum-postcode";
import { FaSearch } from "react-icons/fa";
import ScheduleNumber from "./ScheduleNumber";
import { BASE_URL } from "@/constants/baseURL";

interface ScheduleFormProps {
  meetupId: number;
  mode?: "create" | "edit";
  scheduleId?: number;
}

// 카카오맵 SDK 로딩 확인 훅 (이전과 동일)
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
          window.kakao.maps.load(checkKakaoMaps);
        }
      };
      document.head.appendChild(script);
    } else {
      checkKakaoMaps();
    }
  }, []);
  return isLoaded;
};

// 폼 데이터의 초기 상태
const initialFormData = {
  date: "",
  time: "12:00",
  place: "",
  address: "",
  latitude: "0",
  longitude: "0",
  memo: "",
  participant: [] as number[],
  image: null as File | null,
};

const ScheduleForm = ({ meetupId, mode = "create", scheduleId }: ScheduleFormProps) => {
  const router = useRouter();
  const openPostcode = useDaumPostcodePopup();
  const isKakaoMapLoaded = useKakaoMapSDK();

  // useState로 폼 데이터 관리
  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ✅ 이미지 업로드 훅 추가
  const imageUploadMutation = useImageUpload();
  const createMutation = useCreateSchedule(meetupId);
  const updateMutation = useUpdateSchedule(scheduleId || 0);
  const { data: scheduleData, isPending: isLoadingSchedule } = useScheduleDetail(mode === "edit" && scheduleId ? scheduleId : undefined, {
    enabled: mode === "edit" && !!scheduleId,
  });

  // 수정 모드일 때 기존 데이터로 폼 상태 초기화
  useEffect(() => {
    if (mode === "edit" && scheduleData) {
      const scheduledDate = new Date(scheduleData.scheduledAt);
      setFormData({
        date: scheduledDate.toISOString().split("T")[0],
        time: scheduledDate.toTimeString().slice(0, 5),
        place: scheduleData.place,
        address: scheduleData.address,
        latitude: scheduleData.latitude,
        longitude: scheduleData.longitude,
        memo: scheduleData.memo,
        participant: (scheduleData.participant.map(participant => (typeof participant === "object" && "id" in participant ? participant.id : 0)) as number[]).filter(id => id > 0),
        image: null,
      });

      // ✅ 기존 이미지 미리보기 설정
      if (scheduleData.image) {
        const fullImageUrl = scheduleData.image.startsWith("http") ? scheduleData.image : `${BASE_URL}/${scheduleData.image}`;
        setImagePreview(fullImageUrl);
      }
    }
  }, [scheduleData, mode]);

  // 입력값 변경 핸들러
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 멤버 선택 핸들러
  const handleMemberSelect = (memberId: number) => {
    setFormData(prev => ({
      ...prev,
      participant: prev.participant.includes(memberId) ? prev.participant.filter(id => id !== memberId) : [...prev.participant, memberId],
    }));
  };

  // 이미지 선택 핸들러
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ✅ 이미지 제거 핸들러 추가
  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  // 주소 검색 처리
  const handleAddressSearch = useCallback(() => {
    openPostcode({
      onComplete: data => {
        setFormData(prev => ({ ...prev, address: data.address }));

        if (isKakaoMapLoaded && window.kakao?.maps?.services) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(data.address, (result, status) => {
            if (status === window.kakao.maps.services.Status.OK && result[0]) {
              setFormData(prev => ({ ...prev, longitude: result[0].x, latitude: result[0].y }));
            } else {
              setFormData(prev => ({ ...prev, longitude: "0", latitude: "0" }));
            }
          });
        }
      },
    });
  }, [openPostcode, isKakaoMapLoaded]);

  // ✅ 폼 제출 처리 - 완전히 수정
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // 1. 이미지 업로드 처리
    let imageKey: string | null = mode === "edit" ? scheduleData?.image || null : null;

    if (formData.image) {
      try {
        const uploadedKeys = await imageUploadMutation.mutateAsync({
          files: [formData.image],
          target: "schedule",
        });
        imageKey = uploadedKeys?.[0] || null;
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        return;
      }
    }

    // 2. payload 생성
    const scheduledAtString = `${formData.date}T${formData.time}:00`;

    const payload = {
      scheduledAt: scheduledAtString,
      place: formData.place,
      address: formData.address,
      latitude: String(formData.latitude),
      longitude: String(formData.longitude),
      memo: formData.memo || "", // 빈 문자열 보장
      // participant: formData.participant, // ❌ Swagger에 없는 필드 제거
      image: imageKey || "", // 빈 문자열 보장
    };

    // 디버깅을 위한 로그 출력
    console.log("📝 Form Data:", formData);
    console.log("📦 Final Payload:", payload);
    console.log("📅 Scheduled At String:", scheduledAtString);

    // 필수 필드 검증
    if (!formData.place.trim()) {
      alert("모임 장소를 입력해주세요.");
      return;
    }
    if (!formData.address.trim()) {
      alert("주소를 검색해주세요.");
      return;
    }
    if (!formData.date) {
      alert("날짜를 선택해주세요.");
      return;
    }
    if (!formData.time) {
      alert("시간을 선택해주세요.");
      return;
    }

    // 3. API 호출
    try {
      if (mode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (mode === "edit" && scheduleId) {
        await updateMutation.mutateAsync({ scheduleId, payload });
      }
      router.push(`/meetup/${meetupId}`);
    } catch (error) {
      console.error(`Failed to ${mode} schedule:`, error);
      console.error("Error details:", error);
      alert(`스케줄 ${mode === "create" ? "생성" : "수정"}에 실패했습니다.`);
    }
  };

  if (mode === "edit" && isLoadingSchedule) {
    return <div className="p-4 text-center">데이터를 불러오는 중...</div>;
  }

  // ✅ 로딩 상태에 이미지 업로드도 포함
  const isSubmitting = createMutation.isPending || updateMutation.isPending || imageUploadMutation.isPending;

  return (
    <div className="p-4 lg:p-8">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl">
        <div className="mb-6 flex justify-center">
          <ScheduleNumber number={1} />
        </div>

        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <div>
              <label htmlFor="place" className="mb-2 block text-base font-bold">
                모임 장소
              </label>
              <input
                type="text"
                id="place"
                name="place"
                value={formData.place}
                onChange={handleChange}
                required
                placeholder="모임 장소명을 입력하세요"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label htmlFor="address" className="mb-2 block text-base font-bold">
                주소
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  readOnly
                  placeholder="클릭하여 우편 입력 창 열기"
                  onClick={handleAddressSearch}
                  className="flex-1 cursor-pointer rounded-md border border-gray-300 bg-gray-50 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button type="button" onClick={handleAddressSearch} className="rounded-md bg-primary p-3 text-white transition-colors hover:bg-opacity-80">
                  <FaSearch />
                </button>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-1">
                <label htmlFor="date" className="mb-2 block text-base font-bold">
                  날짜
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="time" className="mb-2 block text-base font-bold">
                  시간
                </label>
                <input
                  type="time"
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            <div>
              <label htmlFor="memo" className="mb-2 block text-base font-bold">
                메모 ✍️
              </label>
              <textarea
                id="memo"
                name="memo"
                value={formData.memo}
                onChange={handleChange}
                rows={5}
                placeholder="스케줄에 대한 추가 정보를 입력하세요"
                className="w-full rounded-md border border-gray-300 bg-secondary-light px-3 py-2 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* ✅ 이미지 업로드 섹션 개선 */}
            <div>
              <label className="mb-2 block text-base font-bold">이미지 업로드</label>
              <input type="file" id="image-upload" accept="image/*" onChange={handleImageSelect} className="hidden" />
              <div className="relative">
                <label
                  htmlFor="image-upload"
                  className="flex h-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-gray-400"
                >
                  {imagePreview ? <img src={imagePreview} alt="미리보기" className="h-full w-full rounded-lg object-cover" /> : <div className="text-center text-gray-500">클릭하여 이미지 선택</div>}
                </label>
                {imagePreview && (
                  <button type="button" onClick={handleImageRemove} className="absolute right-2 top-2 rounded-full bg-red-500 px-2 py-1 text-sm text-white hover:bg-red-600">
                    ✕
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-6 lg:mt-0">
            <div>
              <label className="mb-2 block text-base font-bold">참석자 등록하기</label>
              <MemberSelector meetupId={meetupId} selectedMember={formData.participant} onMemberSelect={handleMemberSelect} />
            </div>
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="mt-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-primary px-4 py-3 text-lg font-bold text-white transition-colors hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "처리 중..." : mode === "create" ? "스케줄 등록" : "스케줄 수정"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScheduleForm;
