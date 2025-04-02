import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toggleLikeApi } from "@/services/like.service";
import { LikeContainerProps } from "@/types/likeType";
import { Meetup } from "@/types/meetupType";
import LikePart from "./LikePart";

const LikeContainerByGPT = ({ id }: LikeContainerProps) => {
  const queryClient = useQueryClient();

  // ✅ 렌더링용 likeData
  const {
    data: likeData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["likes", id],
    queryFn: () => {
      const h = queryClient.getQueryData<Meetup>(["headhuntings", id]);
      return {
        isLike: h?.isLike ?? false,
        likeCount: h?.likeCount ?? 0,
      };
    },
    staleTime: 1000 * 60 * 5, // ✅ 5분 동안 fresh 상태 유지
  });

  // ✅ 낙관적 업데이트 mutation
  const likeMutation = useMutation({
    mutationFn: () => {
      const latest = queryClient.getQueryData<{ isLike: boolean }>(["likes", id]);
      const currentIsLike = latest?.isLike ?? false;
      return toggleLikeApi(id, currentIsLike);
    },

    onMutate: async () => {
      const previousLikeData = queryClient.getQueryData(["likes", id]);
      const previousHeadhunting = queryClient.getQueryData(["headhuntings", id]);

      // ✅ 캐시 없으면 초기화
      if (!previousLikeData) {
        const fallback = queryClient.getQueryData<Meetup>(["headhuntings", id]);
        queryClient.setQueryData(["likes", id], {
          isLike: fallback?.isLike ?? false,
          likeCount: fallback?.likeCount ?? 0,
        });
      }

      // ✅ 최신 상태 기준 낙관적 업데이트
      queryClient.setQueryData(["likes", id], (old: any) => {
        const isLike = old?.isLike ?? false;
        const count = old?.likeCount ?? 0;
        return {
          isLike: !isLike,
          likeCount: isLike ? count - 1 : count + 1,
        };
      });

      // ✅ 상세 페이지 캐시도 업데이트
      if (previousHeadhunting) {
        queryClient.setQueryData(["headhuntings", id], {
          ...previousHeadhunting,
          isLike: !previousHeadhunting.isLike,
          likeCount: previousHeadhunting.isLike ? (previousHeadhunting.likeCount ?? 1) - 1 : (previousHeadhunting.likeCount ?? 0) + 1,
        });
      }

      // ✅ 목록도 동기화
      const list = queryClient.getQueryData<Meetup[]>(["headhuntings"]);
      if (list) {
        queryClient.setQueryData(
          ["headhuntings"],
          list.map(item =>
            item.id === id
              ? {
                  ...item,
                  isLike: !item.isLike,
                  likeCount: item.isLike ? (item.likeCount ?? 1) - 1 : (item.likeCount ?? 0) + 1,
                }
              : item,
          ),
        );
      }

      return { previousLikeData, previousHeadhunting };
    },

    onError: (error, _vars, context) => {
      console.error("❌ 좋아요 토글 실패", error);
      queryClient.setQueryData(["likes", id], context?.previousLikeData);
      if (context?.previousHeadhunting) {
        queryClient.setQueryData(["headhuntings", id], context.previousHeadhunting);
      }
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["likes", id] });
      queryClient.invalidateQueries({ queryKey: ["headhuntings", id] });
      queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
    },
  });

  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러 발생</div>;

  const handleToggleLike = () => {
    likeMutation.mutate();
  };

  return <LikePart isLike={likeData?.isLike ?? false} likeCount={likeData?.likeCount ?? 0} onToggle={handleToggleLike} isPending={likeMutation.isPending} />;
};

export default LikeContainerByGPT;
