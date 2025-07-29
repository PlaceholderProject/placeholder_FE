"use client";

import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/useModal";
import { deleteAd } from "@/services/ad.service";
import { showConfirmToast } from "@/components/common/ConfirmDialog";
import { toast } from "sonner";

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
    showConfirmToast({
      message: "정말 삭제하시겠습니까?",
      confirmText: "삭제",
      cancelText: "취소",
      onConfirm: async () => {
        try {
          await deleteMutation.mutateAsync({ meetupId });
          toast.success("정상적으로 삭제되었습니다.");
          closeModal();
        } catch {
          toast.error("삭제 중 문제가 발생했습니다.");
        }
      },
    });
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
