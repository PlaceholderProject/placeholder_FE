import { toggleLikeApi } from "@/services/like.service";
import { LikeContainerProps } from "@/types/likeType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import LikeArea from "./LikeArea";

const LikeContainer = ({ id }: LikeContainerProps) => {
  const queryClient = useQueryClient();

  const {
    data: likeData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["likes", id],
    queryFn:
      //현재는 headhunting 데이터에서 like 정보 가져옴
      // TODO: 추후 별도의 likes API 생성 시 변경 예정

      () => {
        const headhuntingData = queryClient.getQueryData(["headhuntings", id]);
        return {
          isLike: headhuntingData?.isLike ?? false,
          likeCount: headhuntingData?.likeCount ?? 0,
        };
      },
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeApi(id, likeData?.isLike ?? false),

    // 낙관적 업데이트
    onMutate: async () => {
      const previousData = queryClient.getQueryData(["likes", id]);

      queryClient.setQueryData(["likes", id], (old: any) => ({
        ...old,
        isLike: !(old?.islike ?? false),
        likeCount: old?.isLike ?? false ? (old?.likeCount ?? 1) - 1 : (old?.likeCount ?? 0) + 1,
      }));

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
    likeMutation.mutate();
  };

  return (
    <>
      <LikeArea isLike={likeData?.isLike ?? false} likeCount={likeData?.likeCount ?? 0} onToggle={handleToggleLike} isPending={likeMutation.isPending} />
    </>
  );
};

export default LikeContainer;
