"use client";

import Image from "next/image";
import { useScheduleDetail, useSchedules, useUpdateSchedule } from "@/hooks/useSchedule";
import { useImageUpload } from "@/hooks/useImageUpload";
import { formatDateTime } from "@/utils/scheduleDateUtils";
import AttendeePopover from "@/components/schedule/AttendeePopover";
import ScheduleNumber from "@/components/schedule/ScheduleNumber";
import { getS3ImageURL } from "@/utils/getImageURL";
import { useEffect, useMemo, useRef, useState } from "react";
import { SchedulePayload } from "@/types/scheduleType";
import { SkeletonTheme } from "react-loading-skeleton";
import ScheduleDetailSkeleton from "@/components/schedule/ScheduleDetailSkeleton";
import { toast } from "sonner";

const ScheduleDetail = ({ scheduleId, meetupId }: { scheduleId: number; meetupId: number }) => {
  const { data: schedule, isPending, error } = useScheduleDetail(scheduleId);
  const { data: schedules } = useSchedules(meetupId);
  const imageUploadMutation = useImageUpload();
  const updateMutation = useUpdateSchedule(scheduleId);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isEditingImage, setIsEditingImage] = useState(false);
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (schedule?.image) {
      setImagePreview(getS3ImageURL(schedule.image));
    } else {
      setImagePreview(null);
    }
  }, [schedule]);

  const scheduleNumber = useMemo(() => {
    if (!schedules || !schedule) return 1;
    const index = schedules.findIndex(s => s.id === schedule.id);
    return index >= 0 ? index + 1 : 1;
  }, [schedules, schedule]);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setNewImageFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveImages = async () => {
    if (!newImageFile) {
      setIsEditingImage(false);
      return;
    }

    try {
      const uploadedKeys = await imageUploadMutation.mutateAsync({
        files: [newImageFile],
        target: "schedule",
      });

      const payload: SchedulePayload = {
        scheduledAt: schedule!.scheduledAt,
        place: schedule!.place,
        address: schedule!.address,
        latitude: schedule!.latitude,
        longitude: schedule!.longitude,
        memo: schedule!.memo,
        participant: schedule!.participant.map(participant => participant.id),
        image: uploadedKeys[0] || schedule!.image,
      };

      await updateMutation.mutateAsync({ scheduleId, payload });

      setIsEditingImage(false);
      setNewImageFile(null);
    } catch (err) {
      console.error("이미지 수정 실패:", err);
      toast.error("이미지 수정에 실패했습니다.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditingImage(false);
    setNewImageFile(null);
    setImagePreview(schedule?.image ? getS3ImageURL(schedule.image) : null);
  };

  const handleRemoveImage = () => {
    setNewImageFile(null);
    setImagePreview(null);
  };

  if (isPending) {
    return (
      <SkeletonTheme baseColor="#E8E8E8" highlightColor="#D9D9D9">
        <ScheduleDetailSkeleton />
      </SkeletonTheme>
    );
  }
  if (error) return <div className="p-4 text-center">에러 발생: {error.message}</div>;
  if (!schedule) return <div className="p-4 text-center">스케줄을 찾을 수 없습니다.</div>;

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

        <div className="flex w-full flex-col items-center justify-center">
          {imagePreview ? (
            <div className="relative w-full max-w-md">
              <div className="aspect-square overflow-hidden rounded-md">
                <Image unoptimized={true} src={imagePreview} alt="스케줄 이미지" width={400} height={400} className="h-full w-full object-cover" />
              </div>
              {isEditingImage && (
                <button onClick={handleRemoveImage} className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-sm text-white hover:bg-red-600">
                  삭제
                </button>
              )}
            </div>
          ) : (
            <div className="flex h-64 w-full items-center justify-center rounded-md bg-gray-100 text-gray-500">
              <span>등록된 이미지가 없습니다</span>
            </div>
          )}
        </div>

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
                  사진 변경
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

        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageSelect} className="hidden" />
      </div>
    </div>
  );
};

export default ScheduleDetail;
