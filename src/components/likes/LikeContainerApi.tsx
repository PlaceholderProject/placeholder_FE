import React from "react";
import { toggleLikeApi } from "@/services/like.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Meetup } from "@/types/meetupType";
import LikePart from "./LikePart";
import { getLikeByIdApi } from "@/services/like.service";
import { getHeadhuntingsApi } from "@/services/thumbnails.service";

const LikeContainerApi = ({ id }: { id: Meetup["id"] }) => {
  const queryClient = useQueryClient();

  const {
    data: likeData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["like", id],
    queryFn: () => getLikeByIdApi(id),
  });

  if (isPending) return <div> 라잌 데이터 가져오기 로딩중</div>;
  if (isError) return <div>라잌 데이터 가져오기 오류</div>;

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeApi(id, likeData?.isLike ?? false),

    //낙관적 업데이트
    onMutate: async () => {
      //이전 데이터 백업
      const previousLikeData = getLikeByIdApi(id);

      //headhuntings 쿼리 캐시 백업
      const previousHeadhuntingData = getHeadhuntingsApi();

      // like 쿼리 낙관적 업데이트

      const currentIsLike = likeData?.isLike ?? false;

      const newLikeData = {
        isLike: !currentIsLike,
        likeCount: currentIsLike ? (likeData?.likeCount ?? 1) - 1 : (likeData?.likeCount ?? 0) + 1,
      };

      queryClient.setQueryData(["like", id], newLikeData);
    },

    // 성공 시 쿼리 무효화

    onSuccess: data => {
      queryClient.invalidateQueries({ queryKey: ["like", id] });
    },
  });

  const handleToggleLike = () => {
    console.log("🔮🔮🔮🔮🔮🔮🔮좋아요 토글 시랳ㅇ됨");

    likeMutation.mutate();
  };

  return (
    <>
      <div>
        <LikePart isLike={likeData?.isLike ?? false} likeCount={likeData?.likeCount ?? 0} onToggle={handleToggleLike} isPending={likeMutation.isPending} />
      </div>
    </>
  );
};

export default LikeContainerApi;
