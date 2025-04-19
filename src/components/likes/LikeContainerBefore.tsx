import { toggleLikeApi } from "@/services/like.service";
import { LikeContainerProps } from "@/types/likeType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Meetup } from "@/types/meetupType";
import LikePart from "./LikePart";

const LikeContainer = ({ id }: LikeContainerProps) => {
  const queryClient = useQueryClient();

  const {
    data: likeData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["likes", id],
    queryFn: () => {
      const headhuntingData = queryClient.getQueryData<Meetup>(["headhuntings", id]);
      return {
        isLike: headhuntingData?.isLike ?? false,
        likeCount: headhuntingData?.likeCount ?? 0,
      };
    },
  });

  // console.log(
  //   "캐시된 모든 쿼리:",
  //   queryClient
  //     .getQueryCache()
  //     .getAll()
  //     .map(q => q.queryKey),
  // );
  // console.log("headhuntings 데이터:", queryClient.getQueryData(["headhuntings", id]));
  // console.log("headhuntings 전체:", queryClient.getQueryData(["headhuntings"]));

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeApi(id, likeData?.isLike ?? false),

    // 낙관적 업데이트
    onMutate: async () => {
      //이전 데이터 백업
      const previousData = queryClient.getQueryData(["likes", id]);

      // headhuntings 쿼리 캐시도 백업
      const previousHeadhunting = queryClient.getQueryData(["headhuntings", id]);

      // 처음에 likes 쿼리키 없을 시 설정
      if (!queryClient.getQueryData(["likes", id])) {
        queryClient.setQueryData(["likes", id], {
          isLike: likeData?.isLike ?? false,
          likeCount: likeData?.likeCount ?? 0,
        });
      }

      // 새 버전 데이터 업데이트
      queryClient.setQueryData(["likes", id], (old: any) => {
        const currentIsLike = old?.isLike ?? false;
        return {
          ...old,
          isLike: !currentIsLike,
          likeCount: currentIsLike ? (old?.likeCount ?? 1) - 1 : (old?.likeCount ?? 0) + 1,
        };
      });

      return { previousData };
    },

    // 에러 발생시 롤백
    onError: (error, variables, context) => {
      queryClient.setQueryData(["likes", id], context?.previousData);
    },

    // 성공 시 관련 쿼리 무효화

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
      queryClient.invalidateQueries({ queryKey: ["likes", id] });
    },
  });

  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러 발생</div>;

  const handleToggleLike = () => {
    console.log("🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮🔮좋아요 토글 시랳ㅇ됨");

    likeMutation.mutate();
  };

  return (
    <>
      <LikePart isLike={likeData?.isLike ?? false} likeCount={likeData?.likeCount ?? 0} onToggle={handleToggleLike} isPending={likeMutation.isPending} />
    </>
  );
};

export default LikeContainer;
