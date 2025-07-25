import React from "react";
import { LikeContainerProps } from "@/types/likeType";
import LikeItem from "../likes/LikeItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeApi } from "@/services/like.service";
import { Meetup } from "@/types/meetupType";
import { getUser } from "@/services/user.service";

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

      if (isAuthError) {
        console.log("🦾인증 필요 기능");
      } else {
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
      alert("로그인한 유저만 좋아요를 누를 수 있습니다.");
      return;
    }
    console.log("좋아요 토글 시작");

    likeMutation.mutate();
  };

  return (
    <LikeItem isLike={initialIsLike} likeCount={initialLikeCount} onToggle={handleToggleLike} isPending={likeMutation.isPending} />

    // <div className="flex items-center">
    //   <div className="flex">
    //     <IoMdHeart className="h-[1.5rem] w-[1.5rem] text-primary md:h-[20px] md:w-[20px]" />
    //   </div>
    //   <div className="text-sm md:text-[18px]">likeCount</div>
    // </div>
  );
};

export default AdLikeContainer;
