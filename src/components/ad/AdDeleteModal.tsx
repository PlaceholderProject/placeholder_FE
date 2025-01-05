"use client";

import { toggleAdDeleteModal } from "@/stores/modalSlice";
import { RootState } from "@/stores/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "@/constants/baseURL";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Meetup } from "@/types/Meetup";
import { useRouter } from "next/navigation";

const token = process.env.NEXT_PUBLIC_MY_TOKEN;

const AdDeleteModal = ({ meetupId }: { meetupId: number }) => {
  const dispatch = useDispatch();
  const isAdDeleteModalOpen = useSelector((state: RootState) => state.modal.isAdDeleteModalOpen);
  const queryClient = useQueryClient();
  const router = useRouter();

  // 토글 상태 변화 감지
  React.useEffect(() => {
    console.log("삭제모달 상태업데이트됨:", isAdDeleteModalOpen);
  }, [isAdDeleteModalOpen]);

  const handleCloseButtonClick = () => {
    dispatch(toggleAdDeleteModal());
    console.log(isAdDeleteModalOpen);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleCloseButtonClick();
    }
  };

  // 광고글 삭제 함수
  const deleteAd = async ({ meetupId }: { meetupId: number }) => {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("광고글 삭제 실패: ", response.status, response.statusText);
    }
  };

  // 삭제 뮤테이션
  // 이긴 한데 굳이 삭제 함수를 따로 뺄 필요가 있나
  // 나중에 정리할 때 편할지 아니면 코드만 늘어난 건지 아직 모르겠다.

  const deleteMutation = useMutation({
    mutationFn: deleteAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
      router.push("/");
    },
  });

  const handleDeleteClick = () => {
    deleteMutation.mutate({ meetupId });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg p-6">
        <div className="w-50 h-50 bt-white rounded-lg p-6">
          '삭제하기' 버튼을 클릭하면 광고글이 영구적으로 지워집니다.
          <button type="button" onClick={handleCloseButtonClick}>
            닫기
          </button>
          <button onClick={handleDeleteClick} type="button" disabled={deleteMutation.isPending} className="m-2 w-50 h-10 bg-red-400">
            {deleteMutation.isPending ? "삭제 중.." : "⚠️삭제하기⚠️"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdDeleteModal;
