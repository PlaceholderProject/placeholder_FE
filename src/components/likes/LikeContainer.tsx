import React from "react";
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

  // ThumbnailArea와 동일한 상태값들 가져오기
  const sortType = useSelector((state: RootState) => state.sort.sortType);
  const place = useSelector((state: RootState) => state.filter.place);
  const category = useSelector((state: RootState) => state.filter.category);
  const isFilterActive = useSelector((state: RootState) => state.filter.isFilterActive);

  // ThumbnailArea와 동일한 쿼리 키 생성 함수
  // 여기서 oldData가 있으려면 부모와 같은 ㅝ리키를 사용하고 업뎃하고 무효화하고 해야되는데
  // 부모 쿼리키가 동적으로 생성되는거지..?

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

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeApi(id, initialIsLike ?? false),

    // 낙관적 업데이트
    onMutate: async () => {
      const currentQueryKey = getQueryKey();

      // // 이전 쿼리요청 취소 수정ver
      // await queryClient.cancelQueries({ queryKey: ["headhuntings"] });
      await queryClient.cancelQueries({ queryKey: currentQueryKey });
      await queryClient.cancelQueries({ queryKey: ["like", id] });

      // 이전 데이터 백업 수정 ver
      const previousHeadhuntingsData = queryClient.getQueryData<InfiniteData<PageData>>(currentQueryKey);

      // headhuntings 쿼리 데이터 업데이트 - 정확한 타입 지정
      queryClient.setQueryData<InfiniteData<PageData>>(currentQueryKey, oldData => {
        if (!oldData) {
          return oldData;
        }

        //탠스택 내장 타입인 InfiniteDatas는 pages랑 pageParams를 가지고 있는디
        // 나의 데이터인 PAgeData의 요소가 객체 하나하나로 pges에 담긴다
        // pageParams는 페이지 숫자

        return {
          ...oldData,
          // 실행전
          // oldData = {
          //   pages: [...],
          //   pageParams: [1, 2, 3]
          // } 이렇게 생긴애라고
          pages: oldData.pages.map(page => ({
            //[ 실행전
            //   { result: [meetup1, meetup2, ...], total: 10, next: "..." },  // page 0
            //   { result: [meetup11, meetup12, ...], total: 10, next: null }   // page 1
            // ]
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

      // 오직 에러 롤백을위한 리턴 값 - 백업 데이터
      return { previousHeadhuntingsData, queryKey: currentQueryKey };
    },

    //---on mutate---

    // 에러 발생 롤백
    onError: (error, variables, context) => {
      console.error("좋아요 토글 에러 ", error);

      if (context?.previousHeadhuntingsData && context?.queryKey) {
        queryClient.setQueryData(context.queryKey, context.previousHeadhuntingsData);
      }

      // 401 제외 에러메시지는 임시 처리했음!
      const isAuthError = error.message.includes("User not authenticated") || error.message.includes("401") || error.message.includes("Unauthorized");

      if (!isAuthError) {
        console.error("좋아요 처리 중 오류가 발생했습니다", error.message);
      }
    },

    // 성공시 쿼리 무효화
    onSuccess: () => {
      const currentQueryKey = getQueryKey();

      if (sortType === "like") {
        queryClient.refetchQueries({ queryKey: currentQueryKey });
      } else {
        queryClient.invalidateQueries({ queryKey: currentQueryKey });
      }
      // queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
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
