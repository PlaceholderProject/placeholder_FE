"use client";

import React from "react";
import { Meetup } from "@/types/meetupType";
import { formatDateTime } from "@/utils/scheduleDateUtils";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";
import { useModal } from "@/hooks/useModal";

interface MeetupInfoContentProps {
  meetupData: Meetup;
  isOrganizer: boolean;
  meetupId: number;
}

const MeetupInfoContent = ({ meetupData, isOrganizer, meetupId }: MeetupInfoContentProps) => {
  const { closeModal } = useModal();
  const router = useRouter();
  const queryClient = useQueryClient();

  // 모임 삭제 API 호출 함수
  const deleteMeetup = async () => {
    const token = Cookies.get("accessToken");

    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("모임 삭제에 실패했습니다.");
    }

    return true;
  };

  // tanstack query mutation 설정
  const deleteMutation = useMutation({
    mutationFn: deleteMeetup,
    onSuccess: () => {
      // 캐시 무효화 및 홈페이지로 리다이렉트
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
      router.push("/");
    },
  });

  // 모임 수정 페이지로 이동
  const handleEdit = () => {
    router.push(`/meetup-edit/${meetupId}`);
    closeModal();
  };

  // 모임 삭제 처리
  const handleDelete = () => {
    if (confirm("정말로 이 모임을 삭제하시겠습니까?")) {
      deleteMutation.mutate();
    }
    closeModal();
  };

  return (
    <div className="w-full text-black">
      <h2 className="mb-4 text-xl font-bold">{meetupData.name}</h2>

      <div className="mb-4 space-y-2">
        <div>
          <span className="font-semibold">모임 장소:</span> {meetupData.place}
        </div>
        <div>
          <span className="font-semibold">상세 위치:</span> {meetupData.placeDescription}
        </div>
        <div>
          <span className="font-semibold">모임 날짜:</span> {meetupData.startedAt ? formatDateTime(meetupData.startedAt) : "미정"} ~ {meetupData.endedAt ? formatDateTime(meetupData.endedAt) : "미정"}
        </div>
        <div>
          <span className="font-semibold">모임 기간:</span>{" "}
          {meetupData.startedAt && meetupData.endedAt ? `${Math.ceil((new Date(meetupData.endedAt).getTime() - new Date(meetupData.startedAt).getTime()) / (1000 * 60 * 60 * 24) + 1)} 일` : "미정"}
        </div>
        <div>
          <span className="font-semibold">참여인원:</span> {meetupData.likeCount || 0} 명
        </div>
      </div>

      <div className="mb-4">
        <h3 className="mb-2 font-semibold">메모</h3>
        <p className="rounded bg-gray-50 p-3">{meetupData.description || "메모가 없습니다."}</p>
      </div>

      <div className="flex justify-end space-x-2">
        {isOrganizer && (
          <>
            <button onClick={handleEdit} className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
              수정하기
            </button>
            <button onClick={handleDelete} className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600" disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? "삭제 중..." : "모임 삭제하기"}
            </button>
          </>
        )}
        <button onClick={closeModal} className="rounded bg-gray-300 px-4 py-2 hover:bg-gray-400">
          닫기
        </button>
      </div>
    </div>
  );
};

export default MeetupInfoContent;
