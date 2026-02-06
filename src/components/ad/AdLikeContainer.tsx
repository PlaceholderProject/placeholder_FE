import React from "react";
import { LikeContainerProps } from "@/types/likeType";
import LikeItem from "../likes/LikeItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeApi } from "@/services/like.service";
import { Meetup } from "@/types/meetupType";
import { getUser } from "@/services/user.service";
import { toast } from "sonner";

const AdLikeContainer = ({ id, initialIsLike, initialLikeCount }: LikeContainerProps) => {
  const queryClient = useQueryClient();

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeApi(id, initialIsLike ?? false),
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
    onError: (error, variables, context) => {
      if (context?.previousAdData) {
        queryClient.setQueryData(["ad", id], context.previousAdData);
      }
      const isAuthError = error.message.includes("User not authenticated") || error.message.includes("401") || error.message.includes("Unauthorized");

      if (isAuthError) {
      } else {
        console.error("좋아요 처리 중 오류가 발생했습니다", error.message);
      }
    },
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
    <LikeItem isLike={initialIsLike} likeCount={initialLikeCount} onToggle={handleToggleLike} isPending={likeMutation.isPending} />
  );
};

export default AdLikeContainer;
