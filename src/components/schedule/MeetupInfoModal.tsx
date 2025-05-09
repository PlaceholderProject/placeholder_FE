"use client";

import React from "react";
import { Meetup } from "@/types/meetupType";
import { formatDateTime } from "@/utils/scheduleDateUtils";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "@/constants/baseURL";
import Cookies from "js-cookie";

interface MeetupInfoModalProps {
  meetupData: Meetup;
  onClose: () => void;
  isOrganizer: boolean;
  meetupId: number;
}

const MeetupInfoModal = ({ meetupData, onClose, isOrganizer, meetupId }: MeetupInfoModalProps) => {
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
  };

  // 모임 삭제 처리
  const handleDelete = () => {
    if (confirm("정말로 이 모임을 삭제하시겠습니까?")) {
      deleteMutation.mutate();
    }
  };

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleOverlayClick}
    >
      <div className="bg-white p-6 rounded-lg w-full max-w-md text-black">
        <h2 className="text-xl font-bold mb-4">{meetupData.name}</h2>

        <div className="space-y-2 mb-4">
          <div>
            <span className="font-semibold">모임 장소:</span> {meetupData.place}
          </div>
          <div>
            <span className="font-semibold">상세 위치:</span> {meetupData.placeDescription}
          </div>
          <div>
            <span className="font-semibold">모임 날짜:</span>{" "}
            {meetupData.startedAt ? formatDateTime(meetupData.startedAt) : "미정"} ~{" "}
            {meetupData.endedAt ? formatDateTime(meetupData.endedAt) : "미정"}
          </div>
          <div>
            <span className="font-semibold">모임 기간:</span>{" "}
            {meetupData.startedAt && meetupData.endedAt
              ? `${Math.ceil(
                (new Date(meetupData.endedAt).getTime() - new Date(meetupData.startedAt).getTime()) /
                (1000 * 60 * 60 * 24) + 1,
              )} 일`
              : "미정"}
          </div>
          <div>
            <span className="font-semibold">참여인원:</span> {meetupData.likeCount || 0} 명
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-semibold mb-2">메모</h3>
          <p className="bg-gray-50 p-3 rounded">{meetupData.description || "메모가 없습니다."}</p>
        </div>

        <div className="flex justify-end space-x-2">
          {isOrganizer && (
            <>
              <button
                onClick={handleEdit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                수정하기
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                disabled={deleteMutation.isPending}
              >
                {deleteMutation.isPending ? "삭제 중..." : "모임 삭제하기"}
              </button>
            </>
          )}
          <button
            onClick={onClose}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetupInfoModal;