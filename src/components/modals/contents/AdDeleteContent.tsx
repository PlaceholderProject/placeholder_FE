"use client";

import { useModal } from "@/hooks/useModal";
import { deleteAd } from "@/services/ad.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { LuCircleAlert, LuInfo, LuLoaderCircle, LuTrash2 } from "react-icons/lu";
import { toast } from "sonner";

const AdDeleteContent = ({ meetupId, adTitle }: { meetupId: number; adTitle?: string }) => {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: deleteAd,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["meetups"] }),
        queryClient.invalidateQueries({ queryKey: ["myAds"] }),
        queryClient.invalidateQueries({ queryKey: ["mySpaceSummary", "ads"] }),
      ]);
      closeModal();
      toast.success("모집글을 삭제했어요.");
      router.replace("/my-space/my-ad");
    },
    onError: () => toast.error("모집글 삭제 중 문제가 발생했습니다."),
  });

  return (
    <div className="pt-[0.2rem]">
      <header className="mb-[1.8rem]">
        <div className="text-destructive flex items-center gap-[0.5rem] pr-[4.4rem]">
          <LuCircleAlert className="h-[1.5rem] w-[1.5rem] shrink-0 stroke-[2]" aria-hidden="true" />
          <p className="text-xs font-black">모집글 삭제</p>
        </div>
        <h2 className="text-foreground mt-[0.9rem] pr-[1rem] text-[2.2rem] leading-[1.25] font-black tracking-[-0.035em] break-keep">이 모집글을 삭제할까요?</h2>
      </header>

      <section className="border-destructive/15 bg-destructive/[0.035] rounded-[1.4rem] border px-[1.3rem] py-[1.15rem]" aria-label="삭제할 모집글">
        <p className="text-destructive text-[1rem] font-black">삭제할 모집글</p>
        <p className="text-foreground mt-[0.45rem] text-sm leading-[1.55] font-bold break-keep">{adTitle || "선택한 모집글"}</p>
      </section>

      <p className="text-muted-foreground mt-[1.1rem] flex items-start gap-[0.55rem] px-[0.2rem] text-xs leading-[1.65] break-keep">
        <LuInfo className="mt-[0.15rem] h-[1.4rem] w-[1.4rem] shrink-0 stroke-[2]" />
        <span>삭제한 모집글은 다시 복구할 수 없어요.</span>
      </p>

      <div className="mt-[1.6rem] grid grid-cols-2 gap-[0.8rem]">
        <button
          type="button"
          onClick={closeModal}
          className="border-border text-muted-foreground hover:bg-muted hover:text-foreground h-[4.6rem] rounded-[1.4rem] border text-sm font-bold transition-colors"
        >
          유지하기
        </button>
        <button
          type="button"
          onClick={() => deleteMutation.mutate({ meetupId })}
          disabled={deleteMutation.isPending}
          className="bg-destructive text-destructive-foreground flex h-[4.6rem] items-center justify-center gap-[0.55rem] rounded-[1.4rem] text-sm font-bold transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-55"
        >
          {deleteMutation.isPending ? <LuLoaderCircle className="h-[1.6rem] w-[1.6rem] animate-spin" /> : <LuTrash2 className="h-[1.6rem] w-[1.6rem] stroke-[2]" />}
          {deleteMutation.isPending ? "삭제 중" : "삭제하기"}
        </button>
      </div>
    </div>
  );
};

export default AdDeleteContent;
