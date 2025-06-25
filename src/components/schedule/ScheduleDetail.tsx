"use client";

import Image from "next/image";
import { useScheduleDetail, useSchedules, useUpdateSchedule } from "@/hooks/useSchedule";
import { useImageUpload } from "@/hooks/useImageUpload";
import { formatDateTime } from "@/utils/scheduleDateUtils";
import AttendeePopover from "@/components/schedule/AttendeePopover";
import ScheduleNumber from "@/components/schedule/ScheduleNumber";
import { getS3ImageURL } from "@/utils/getImageURL";
import { useMemo, useRef, useState } from "react";

const ScheduleDetail = ({ scheduleId, meetupId }: { scheduleId: number; meetupId: number }) => {
  const { data: schedule, isPending, error } = useScheduleDetail(scheduleId);
  const { data: schedules } = useSchedules(meetupId);
  const imageUploadMutation = useImageUpload();
  const updateMutation = useUpdateSchedule(scheduleId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 이미지 편집 상태
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 스케줄 번호 계산
  const scheduleNumber = useMemo(() => {
    if (!schedules || !schedule) return 1;
    const index = schedules.findIndex(s => s.id === schedule.id);
    return index >= 0 ? index + 1 : 1;
  }, [schedules, schedule]);

  // 현재 이미지들 (기존 + 새로운)
  const currentImages = useMemo(() => {
    const existing = schedule?.image ? [getS3ImageURL(schedule.image)] : [];
    return [...existing, ...imagePreview];
  }, [schedule?.image, imagePreview]);

  // 이미지 선택 핸들러
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    setNewImages(prev => [...prev, ...files]);

    // 미리보기 생성
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // 이미지 수정 저장
  const handleSaveImages = async () => {
    if (newImages.length === 0) {
      setIsEditingImage(false);
      return;
    }

    try {
      // S3에 새 이미지들 업로드
      const uploadedKeys = await imageUploadMutation.mutateAsync({
        files: newImages,
        target: "schedule",
      });

      // 첫 번째 이미지만 저장 (단일 이미지 스키마에 맞춤)
      const payload = {
        scheduledAt: schedule!.scheduledAt,
        place: schedule!.place,
        address: schedule!.address,
        latitude: schedule!.latitude,
        longitude: schedule!.longitude,
        memo: schedule!.memo,
        participant: schedule!.participant.map(p => (typeof p === "object" && "id" in p ? p.id : 0)).filter(id => id > 0),
        image: uploadedKeys[0] || schedule!.image,
      };

      await updateMutation.mutateAsync({ scheduleId, payload });

      // 상태 초기화
      setIsEditingImage(false);
      setNewImages([]);
      setImagePreview([]);
      setCurrentImageIndex(0);
    } catch (error) {
      console.error("이미지 수정 실패:", error);
      alert("이미지 수정에 실패했습니다.");
    }
  };

  // 이미지 수정 취소
  const handleCancelEdit = () => {
    setIsEditingImage(false);
    setNewImages([]);
    setImagePreview([]);
    setCurrentImageIndex(0);
  };

  // 이미지 삭제
  const handleRemoveImage = (index: number) => {
    if (index < (schedule?.image ? 1 : 0)) return; // 기존 이미지는 삭제 불가

    const newIndex = index - (schedule?.image ? 1 : 0);
    setNewImages(prev => prev.filter((_, i) => i !== newIndex));
    setImagePreview(prev => prev.filter((_, i) => i !== newIndex));

    if (currentImageIndex >= currentImages.length - 1) {
      setCurrentImageIndex(Math.max(0, currentImages.length - 2));
    }
  };

  if (isPending) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error.message}</div>;
  if (!schedule) return <div>스케줄을 찾을 수 없습니다.</div>;

  const hasImages = currentImages.length > 0;
  const isSubmitting = updateMutation.isPending || imageUploadMutation.isPending;

  return (
    <div className="flex flex-col items-center space-y-4 p-4">
      <div className="w-full rounded-md p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            <ScheduleNumber number={scheduleNumber} />
            <div>
              <div className="text-sm font-semibold">{formatDateTime(schedule.scheduledAt)}</div>
              <div className="text-lg font-bold">{schedule.place}</div>
              <div className="truncate text-sm text-gray-500">{schedule.address}</div>
            </div>
          </div>
        </div>

        {/* 이미지 캐러셀 */}
        <div className="flex w-full flex-col items-center justify-center">
          {hasImages ? (
            <div className="relative w-full max-w-md">
              <div className="aspect-square overflow-hidden rounded-md">
                <Image src={currentImages[currentImageIndex]} alt="스케줄 이미지" width={400} height={400} className="h-full w-full object-cover" />
              </div>

              {/* 캐러셀 컨트롤 */}
              {currentImages.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : currentImages.length - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => (prev < currentImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
                  >
                    →
                  </button>
                  <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-1">
                    {currentImages.map((_, index) => (
                      <button key={index} onClick={() => setCurrentImageIndex(index)} className={`h-2 w-2 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-white/50"}`} />
                    ))}
                  </div>
                </>
              )}

              {/* 이미지 편집 중 삭제 버튼 */}
              {isEditingImage && currentImageIndex >= (schedule.image ? 1 : 0) && (
                <button onClick={() => handleRemoveImage(currentImageIndex)} className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600">
                  ✕
                </button>
              )}
            </div>
          ) : (
            <div className="flex h-64 w-full items-center justify-center rounded-md bg-gray-100 text-gray-500">
              <span>등록된 이미지가 없습니다</span>
            </div>
          )}
        </div>

        {/* 하단 버튼들 */}
        <div className="mt-4 flex w-full items-center justify-between">
          <AttendeePopover participants={schedule.participant} />

          <div className="flex space-x-2">
            {!isEditingImage ? (
              <button onClick={() => setIsEditingImage(true)} className="rounded-md bg-white px-3 py-1 text-sm text-gray-700 shadow-sm hover:bg-gray-50">
                사진 수정
              </button>
            ) : (
              <>
                <button onClick={() => fileInputRef.current?.click()} className="rounded-md bg-blue-500 px-3 py-1 text-sm text-white hover:bg-blue-600">
                  사진 추가
                </button>
                <button onClick={handleSaveImages} disabled={isSubmitting} className="rounded-md bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600 disabled:opacity-50">
                  {isSubmitting ? "저장중..." : "저장"}
                </button>
                <button onClick={handleCancelEdit} className="rounded-md bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600">
                  취소
                </button>
              </>
            )}
          </div>
        </div>

        {/* 숨겨진 파일 입력 */}
        <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageSelect} className="hidden" />
      </div>
    </div>
  );
};

export default ScheduleDetail;
