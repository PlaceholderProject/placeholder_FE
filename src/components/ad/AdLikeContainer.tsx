import React from "react";
import { LikeContainerProps } from "@/types/likeType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeApi } from "@/services/like.service";
import { Meetup } from "@/types/meetupType";
import { getUser } from "@/services/user.service";
import { toast } from "sonner";
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";

const AdLikeContainer = ({ id, initialIsLike, initialLikeCount }: LikeContainerProps) => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeApi(id, initialIsLike ?? false),

    //낙관적 업데이트
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["ad", id] });
      const previousAdData = queryClient.getQueryData<Meetup>(["ad", id]);

      queryClient.setQueryData(["ad", id], (oldData: Meetup) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          isLike: !initialIsLike,
          likeCount: initialIsLike ? initialLikeCount - 1 : initialLikeCount + 1,
        };
      });

      return { previousAdData };
    },

    //에러발생 롤백
    onError: (error, variables, context) => {
      if (context?.previousAdData) {
        queryClient.setQueryData(["ad", id], context.previousAdData);
      }

      // 401 제외 에러메시지는 임시 처리했음!
      const isAuthError = error.message.includes("User not authenticated") || error.message.includes("401") || error.message.includes("Unauthorized");

      if (!isAuthError) {
        console.error("좋아요 처리 중 오류가 발생했습니다", error.message);
      }
    },

    // 성공시 쿼리무효화
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ad", id] });
    },
  });

  const handleToggleLike = async () => {
    const getUserResponse = await getUser();
    if (!getUserResponse) {
      toast.error("로그인한 유저만 좋아요를 누를 수 있습니다.");
      return;
    }

    likeMutation.mutate();
  };

  return (
    <div className="text-muted-foreground inline-flex min-w-[3.2rem] flex-col items-center gap-[0.3rem]">
      <button
        type="button"
        onClick={handleToggleLike}
        disabled={likeMutation.isPending}
        aria-label="좋아요"
        className="hover:text-primary disabled:text-muted-foreground inline-flex h-[1.8rem] w-[1.8rem] items-center justify-center transition disabled:cursor-not-allowed disabled:opacity-60"
      >
        {initialIsLike ? <IoMdHeart className="text-primary h-[1.9rem] w-[1.9rem]" /> : <IoMdHeartEmpty className="h-[1.9rem] w-[1.9rem]" />}
      </button>
      <span className="text-sm leading-none">{initialLikeCount}</span>
    </div>
  );
};

export default AdLikeContainer;
