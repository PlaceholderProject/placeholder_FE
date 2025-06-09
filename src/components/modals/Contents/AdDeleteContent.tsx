"use client";

import React from "react";
import { BASE_URL } from "@/constants/baseURL";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useModal } from "@/hooks/useModal";

const token = Cookies.get("accessToken");

const AdDeleteContent = ({ meetupId }: { meetupId: number }) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const router = useRouter();

  // 광고글 삭제 함수
  // --TO DO--
  // 이거 ad.servie.ts 로 빼야됨
  const deleteAd = async ({ meetupId }: { meetupId: number }) => {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${meetupId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.error("광고글 삭제 실패: ", response.status, response.statusText);
      throw new Error("광고글 삭제에 실패했습니다.");
    }
  };

  // 삭제 뮤테이션
  // 이긴 한데 굳이 삭제 함수를 위에서 따로 만들 필요가 있었나
  // 나중에 정리할 때 편할지 아니면 코드만 늘어난 건지 아직 모르겠다.

  const deleteMutation = useMutation({
    mutationFn: deleteAd,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetups"] });
      router.push("/");
    },
  });

  const handleDeleteClick = () => {
    const confirmed = window.confirm("정말 삭제하시겠습니까?");
    if (confirmed) deleteMutation.mutate({ meetupId });
  };

  return (
    <div className="w-full">
      '삭제하기' 버튼을 클릭하면 광고글이 영구적으로 사라집니다.
      <button type="button" onClick={closeModal}>
        닫기
      </button>
      <button onClick={handleDeleteClick} type="button" disabled={deleteMutation.isPending} className="w-50 m-2 h-10 bg-red-400">
        {deleteMutation.isPending ? "삭제 중.." : "⚠️삭제하기⚠️"}
      </button>
    </div>
  );
};

export default AdDeleteContent;
