"use client";

import React from "react";
import { Meetup } from "@/types/meetupType";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { useModal } from "@/hooks/useModal";
import calculateDays from "@/utils/calculateDays";

interface MeetupInfoContentProps {
  meetupData: Meetup;
  isOrganizer: boolean;
  meetupId: number;
}

const MeetupInfoContent = ({ meetupData, isOrganizer, meetupId }: MeetupInfoContentProps) => {
  const { closeModal } = useModal();
  const router = useRouter();
  const queryClient = useQueryClient();

  const deleteMeetup = async () => {
    const token = Cookies.get("accessToken");
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error("모임 삭제에 실패했습니다.");
    return true;
  };

  const deleteMutation = useMutation({
    mutationFn: deleteMeetup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
      router.push("/");
      closeModal();
    },
  });

  const handleEdit = () => {
    router.push(`/meetup-edit/${meetupId}`);
    closeModal();
  };

  const handleDelete = () => {
    if (confirm("정말로 이 모임을 삭제하시겠습니까?")) {
      deleteMutation.mutate();
    }
  };

  const duration =
    meetupData.startedAt && meetupData.endedAt
      ? calculateDays({
          startedAt: meetupData.startedAt,
          endedAt: meetupData.endedAt,
        })
      : "미정";

  return (
    <div className="w-full text-gray-800">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-primary lg:text-3xl">{meetupData.name}</h2>
      </div>

      <div className="space-y-4 text-base">
        <div className="grid grid-cols-[auto_1fr] items-start gap-x-6">
          <span className="whitespace-nowrap font-semibold text-gray-500">모임 장소</span>
          <span className="break-words">{meetupData.place}</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] items-start gap-x-6">
          <span className="whitespace-nowrap font-semibold text-gray-500">모임 날짜</span>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded bg-gray-100 px-2 py-1 text-sm">{meetupData.startedAt ? meetupData.startedAt.substring(0, 10) : "미정"}</span>
            <span>~</span>
            <span className="rounded bg-gray-100 px-2 py-1 text-sm">{meetupData.endedAt ? meetupData.endedAt.substring(0, 10) : "미정"}</span>
          </div>
        </div>
        <div className="grid grid-cols-[auto_1fr] items-start gap-x-6">
          <span className="whitespace-nowrap font-semibold text-gray-500">모임 기간</span>
          <span className="font-bold text-primary">{duration}</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] items-start gap-x-6">
          <span className="whitespace-nowrap font-semibold text-gray-500">참여 인원</span>
          <span>{meetupData.likeCount || 0} 명</span>
        </div>
        <div className="grid grid-cols-[auto_1fr] items-start gap-x-6">
          <span className="whitespace-nowrap font-semibold text-gray-500">메모</span>
          <p className="rounded-lg bg-secondary-light p-3 text-sm">{meetupData.description || "메모가 없습니다."}</p>
        </div>
      </div>

      {isOrganizer && (
        <div className="mt-8 grid grid-cols-2 gap-3">
          <button onClick={handleEdit} className="w-full rounded-lg bg-primary py-3 font-bold text-white transition hover:bg-opacity-80">
            수정하기
          </button>
          <button onClick={handleDelete} disabled={deleteMutation.isPending} className="w-full rounded-lg bg-error py-3 font-bold text-white transition hover:bg-opacity-80 disabled:opacity-50">
            {deleteMutation.isPending ? "삭제 중..." : "모임 삭제하기"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetupInfoContent;
