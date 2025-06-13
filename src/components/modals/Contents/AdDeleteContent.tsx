"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { deleteAd } from "@/services/ad.service";

const AdDeleteContent = ({ meetupId }: { meetupId: number }) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const router = useRouter();

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
      삭제하기 버튼을 클릭하면 광고글이 영구적으로 사라집니다.
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
