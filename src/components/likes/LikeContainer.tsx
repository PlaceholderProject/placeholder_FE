import React, { useEffect } from "react";
import { toggleLikeApi } from "@/services/like.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InfiniteData } from "@tanstack/react-query";
import { LikeContainerProps, PageData } from "@/types/likeType";
import { Meetup } from "@/types/meetupType";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import LikeItem from "./LikeItem";
import { getUser } from "@/services/user.service";
import { toast } from "sonner";

const LikeContainer = ({ id, initialIsLike, initialLikeCount }: LikeContainerProps) => {
  const queryClient = useQueryClient();
  const sortType = useSelector((state: RootState) => state.sort.sortType);
  const place = useSelector((state: RootState) => state.filter.place);
  const category = useSelector((state: RootState) => state.filter.category);
  const isFilterActive = useSelector((state: RootState) => state.filter.isFilterActive);

  const baseQueryKey = ["headhuntings", sortType];
  const getQueryKey = () => {
    if (isFilterActive) {
      if (place) {
        baseQueryKey.push("place", place);
      }
      if (category) {
        baseQueryKey.push("category", category);
      }
    }
    return baseQueryKey;
  };

  useEffect(() => {
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeApi(id, initialIsLike ?? false),
    onMutate: async () => {
      const currentQueryKey = getQueryKey();
      await queryClient.cancelQueries({ queryKey: currentQueryKey });
      await queryClient.cancelQueries({ queryKey: ["like", id] });
      const previousHeadhuntingsData = queryClient.getQueryData<InfiniteData<PageData>>(currentQueryKey);
      queryClient.setQueryData<InfiniteData<PageData>>(currentQueryKey, oldData => {
        if (!oldData) {
          return oldData;
        }
        if (oldData.pages?.[0]) {
          const firstPage = oldData.pages[0];
          if (firstPage.result?.[0]) {
          }
        }
        const allItems = oldData.pages?.flatMap(page => page.result) || [];
        const targetItem = allItems.find(item => item.id === id);
        return {
          ...oldData,
          pages: oldData.pages.map(page => ({
            ...page,
            result: page.result.map((item: Meetup) =>
              item.id === id
                ? {
                    ...item,
                    isLike: !initialIsLike,
                    likeCount: initialIsLike ? Math.max(0, initialLikeCount - 1) : initialLikeCount + 1,
                  }
                : item,
            ),
          })),
        };
      });
      return { previousHeadhuntingsData, queryKey: currentQueryKey };
    },
    onError: (error, variables, context) => {
      console.error("좋아요 토글 에러 ", error);

      if (context?.previousHeadhuntingsData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousHeadhuntingsData);
      }
      const isAuthError = error.message.includes("User not authenticated") || error.message.includes("401") || error.message.includes("Unauthorized");

      if (isAuthError) {
      } else {
        console.error("좋아요 처리 중 오류가 발생했습니다", error.message);
      }
    },
    onSuccess: () => {
      const currentQueryKey = getQueryKey();

      if (sortType === "like") {
        queryClient.refetchQueries({ queryKey: currentQueryKey });
      } else {
        queryClient.invalidateQueries({ queryKey: currentQueryKey });
      }
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

  return <LikeItem isLike={initialIsLike} likeCount={initialLikeCount} onToggle={handleToggleLike} isPending={likeMutation.isPending} />;
};

export default LikeContainer;
