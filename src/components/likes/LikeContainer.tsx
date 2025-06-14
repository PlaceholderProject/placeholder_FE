import React from "react";
import { toggleLikeApi } from "@/services/like.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InfiniteData } from "@tanstack/react-query";
import LikePart from "./LikePart";
import { LikeContainerProps } from "@/types/likeType";
import { Meetup } from "@/types/meetupType";

// API 응답 페이지 데이터 타입
interface PageData {
  result: Meetup[];
  total: number;
  previous: string | null;
  next: string | null;
}

const LikeContainer = ({ id, initialIsLike, initialLikeCount }: LikeContainerProps) => {
  const queryClient = useQueryClient();

  // useEffect(() => {
  //   console.log("좋아요눌림??", id, initialIsLike);
  // });

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeApi(id, initialIsLike ?? false),

    // 낙관적 업데이트
    onMutate: async () => {
      // 이전 쿼리요청 취소
      await queryClient.cancelQueries({ queryKey: ["headhuntings"] });
      await queryClient.cancelQueries({ queryKey: ["like", id] });

      // 이전 데이터 백업
      const previousHeadhuntingsData = queryClient.getQueryData(["headhuntings"]);

      // headhuntings 쿼리 데이터 업데이트 - 정확한 타입 지정
      queryClient.setQueryData<InfiniteData<PageData>>(["headhuntings"], oldData => {
        if (!oldData) return oldData;
        console.log("ㅇㄷㄷㅇㅌ", oldData);

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

      return { previousHeadhuntingsData };
    },

    // 에러 발생 롤백
    onError: (error, variables, context) => {
      console.error("좋아요 토글 에러 ", error);

      if (context?.previousHeadhuntingsData) {
        queryClient.setQueryData(["headhuntings"], context.previousHeadhuntingsData);
      }

      // 인증 에러 아닐 때만 에러메세지 표시
      if (!error.message.includes("User not authenticated")) {
        console.error("좋아요 처리 중 오류가 발생했습니다.");
      }
    },

    // 성공시 쿼리 무효화
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
    },
  });

  const handleToggleLike = () => {
    console.log("좋아요 토글 시작");
    likeMutation.mutate();
  };

  return <LikePart isLike={initialIsLike} likeCount={initialLikeCount} onToggle={handleToggleLike} isPending={likeMutation.isPending} />;
};

export default LikeContainer;
