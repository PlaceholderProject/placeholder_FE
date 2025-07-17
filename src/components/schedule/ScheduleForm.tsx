"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import type { Address } from "react-daum-postcode";
import { FaSearch } from "react-icons/fa";

import MemberSelector from "@/components/schedule/MemberSelector";
import ScheduleNumber from "./ScheduleNumber";
import { useCreateSchedule, useScheduleDetail, useUpdateSchedule } from "@/hooks/useSchedule";
import { useImageUpload } from "@/hooks/useImageUpload";
import { useScheduleForm } from "@/hooks/useScheduleForm";
import { useModal } from "@/hooks/useModal";
import SubmitLoader from "../common/SubmitLoader";

interface ScheduleFormProps {
  meetupId: number;
  mode?: "create" | "edit";
  scheduleId?: number;
}

const useKakaoMapSDK = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const loadKakaoSDK = () => {
      if (window.kakao?.maps?.services) {
        setIsLoaded(true);
      } else if (!document.querySelector("script[src*='dapi.kakao.com']")) {
        const script = document.createElement("script");
        script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&libraries=services&autoload=false`;
        script.async = true;
        script.onload = () => window.kakao.maps.load(() => setIsLoaded(true));
        document.head.appendChild(script);
      }
    };
    if (typeof window !== "undefined") {
      loadKakaoSDK();
    }
  }, []);
  return isLoaded;
};

const ScheduleForm = ({ meetupId, mode = "create", scheduleId }: ScheduleFormProps) => {
  const router = useRouter();
  const isKakaoMapLoaded = useKakaoMapSDK();
  const { openModal } = useModal();

  const { data: scheduleData, isPending: isLoadingSchedule } = useScheduleDetail(mode === "edit" ? scheduleId : undefined, { enabled: mode === "edit" && !!scheduleId });

  const { formData, imagePreview, handleChange, handleMemberSelect, handleImageSelect, handleImageRemove, setAddress } = useScheduleForm(mode, scheduleData);

  const handleCompletePostcode = useCallback(
    (data: Address) => {
      if (!isKakaoMapLoaded || !window.kakao?.maps?.services) {
        alert("지도 서비스가 아직 로딩 중입니다. 잠시 후 다시 시도해주세요.");
        return;
      }
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(data.address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK && result?.[0]) {
          setAddress(data.address, result[0].y, result[0].x);
        } else {
          setAddress(data.address, "0", "0");
        }
      });
    },
    [isKakaoMapLoaded, setAddress],
  );

  const handleAddressSearch = useCallback(() => {
    openModal("POSTCODE", { onCompletePostcode: handleCompletePostcode });
  }, [openModal, handleCompletePostcode]);

  // ... (handleSubmit 등 나머지 코드는 이전과 동일)
  const imageUploadMutation = useImageUpload();
  const createMutation = useCreateSchedule(meetupId);
  const updateMutation = useUpdateSchedule(scheduleId || 0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!formData.place.trim() || !formData.address.trim() || !formData.date || !formData.time) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    let imageKey: string | null = mode === "edit" ? (scheduleData?.image ?? null) : null;

    if (formData.image) {
      try {
        const [uploadedKey] = await imageUploadMutation.mutateAsync({
          files: [formData.image],
          target: "schedule",
        });
        imageKey = uploadedKey ?? null;
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
        alert("이미지 업로드에 실패했습니다. 다시 시도해주세요.");
        return;
      }
    }

    const payload = {
      ...formData,
      scheduledAt: `${formData.date}T${formData.time}:00`,
      image: imageKey || "",
    };

    try {
      if (mode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (scheduleId) {
        await updateMutation.mutateAsync({ scheduleId, payload });
      }
      router.push(`/meetup/${meetupId}`);
    } catch (error) {
      console.error(`스케줄 ${mode === "create" ? "생성" : "수정"} 실패:`, error);
      alert(`스케줄 처리 중 오류가 발생했습니다.`);
    }
  };

  if (mode === "edit" && isLoadingSchedule) {
    return <div className="p-4 text-center">데이터를 불러오는 중...</div>;
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending || imageUploadMutation.isPending;

  return (
    <>
      {isSubmitting && <SubmitLoader isLoading={isSubmitting} />}

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

              <div>
                <label className="mb-2 block text-base font-bold">이미지 업로드</label>
                <input type="file" id="image-upload" accept="image/*" onChange={handleImageSelect} className="hidden" />
                <div className="relative">
                  <label
                    htmlFor="image-upload"
                    className="flex h-48 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-4 transition-colors hover:border-gray-400"
                  >
                    {imagePreview ? (
                      <Image src={imagePreview} alt="미리보기" fill style={{ objectFit: "cover" }} className="rounded-lg" />
                    ) : (
                      <div className="text-center text-gray-500">클릭하여 이미지 선택</div>
                    )}
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
    </>
  );
};

export default ScheduleForm;
