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
    closeModal();
  };

  return (
    <div className="grid w-full grid-cols-1 space-y-2 text-base">
      삭제 버튼을 클릭하면
      <br />
      광고글이 영구적으로 사라집니다.
      <button onClick={handleDeleteClick} type="button" disabled={deleteMutation.isPending} className="h-[2rem] w-full rounded-[0.5rem] bg-warning text-xs font-bold text-white">
        {deleteMutation.isPending ? "삭제 중..." : "삭제"}
      </button>
    </div>
  );
};

export default AdDeleteContent;
