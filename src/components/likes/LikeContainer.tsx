import React, { useEffect } from "react";
import { toggleLikeApi } from "@/services/like.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InfiniteData } from "@tanstack/react-query";
import LikePart from "./LikePart";
import { LikeContainerProps, PageData } from "@/types/likeType";
import { Meetup } from "@/types/meetupType";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";

const LikeContainer = ({ id, initialIsLike, initialLikeCount }: LikeContainerProps) => {
  const queryClient = useQueryClient();

  // ThumbnailArea와 동일한 상태값들 가져오기
  const sortType = useSelector((state: RootState) => state.sort.sortType);
  const place = useSelector((state: RootState) => state.filter.place);
  const category = useSelector((state: RootState) => state.filter.category);
  const isFilterActive = useSelector((state: RootState) => state.filter.isFilterActive);

  // ThumbnailArea와 동일한 쿼리 키 생성 함수
  const getQueryKey = () => {
    const baseQueryKey = ["headhuntings", sortType];
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
    console.log("---현재 쿼리 키 가져온 결과:", getQueryKey());
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeApi(id, initialIsLike ?? false),

    // 낙관적 업데이트
    onMutate: async () => {
      const currentQueryKey = getQueryKey();
      console.log("---사용할 현재 쿼리키:", currentQueryKey);

      // // 이전 쿼리요청 취소 수정ver
      // await queryClient.cancelQueries({ queryKey: ["headhuntings"] });
      await queryClient.cancelQueries({ queryKey: currentQueryKey });
      await queryClient.cancelQueries({ queryKey: ["like", id] });

      // 이전 데이터 백업 수정 ver
      const previousHeadhuntingsData = queryClient.getQueryData<InfiniteData<PageData>>(currentQueryKey);

      // headhuntings 쿼리 데이터 업데이트 - 정확한 타입 지정
      queryClient.setQueryData<InfiniteData<PageData>>(currentQueryKey, oldData => {
        if (!oldData) {
          console.log("🔍 oldData가 없음!");
          return oldData;
        }

        console.log("🔍 ============ oldData 전체 구조 ============");
        console.log("🔍 oldData 타입:", typeof oldData);
        console.log("🔍 oldData 키들:", Object.keys(oldData));
        console.log("🔍 oldData 전체:", oldData);

        console.log("🔍 ============ pages 배열 분석 ============");
        console.log("🔍 pages 길이:", oldData.pages?.length);
        console.log("🔍 첫 번째 페이지:", oldData.pages?.[0]);

        if (oldData.pages?.[0]) {
          const firstPage = oldData.pages[0];
          console.log("🔍 첫 번째 페이지 키들:", Object.keys(firstPage));
          console.log("🔍 result 배열 길이:", firstPage.result?.length);
          console.log("🔍 total:", firstPage.total);
          console.log("🔍 previous:", firstPage.previous);
          console.log("🔍 next:", firstPage.next);

          if (firstPage.result?.[0]) {
            console.log("🔍 첫 번째 아이템 샘플:", firstPage.result[0]);
          }
        }

        console.log("🔍 ============ pageParams 분석 ============");
        console.log("🔍 pageParams:", oldData.pageParams);

        console.log("🔍 ============ 전체 아이템 개수 ============");
        const allItems = oldData.pages?.flatMap(page => page.result) || [];
        console.log("🔍 모든 아이템 개수:", allItems.length);

        console.log("🔍 ============ 타겟 아이템 찾기 ============");
        const targetItem = allItems.find(item => item.id === id);
        console.log("🔍 수정하려는 아이템:", targetItem);

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

    // // 에러 발생 롤백
    // onError: (error, variables, context) => {
    //   console.error("좋아요 토글 에러 ", error);

    //   if (context?.previousHeadhuntingsData) {
    //     queryClient.setQueryData(["headhuntings"], context.previousHeadhuntingsData);
    //   }

    //   // 인증 에러 아닐 때만 에러메세지 표시
    //   if (!error.message.includes("User not authenticated")) {
    //     console.error("좋아요 처리 중 오류가 발생했습니다.");
    //   }
    // },

    // 에러 발생 롤백
    onError: (error, variables, context) => {
      console.error("좋아요 토글 에러 ", error);

      if (context?.previousHeadhuntingsData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousHeadhuntingsData);
      }

      // 인증 에러 아닐 때만 에러메세지 표시
      if (!error.message.includes("User not authenticated")) {
        console.error("좋아요 처리 중 오류가 발생했습니다.");
      }
    },

    // 성공시 쿼리 무효화
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
      console.log("온석세스 안 조아요 토글 성공");
    },
  });

  const handleToggleLike = () => {
    console.log("좋아요 토글 시작");
    likeMutation.mutate();
  };

  return <LikePart isLike={initialIsLike} likeCount={initialLikeCount} onToggle={handleToggleLike} isPending={likeMutation.isPending} />;
};

export default LikeContainer;
