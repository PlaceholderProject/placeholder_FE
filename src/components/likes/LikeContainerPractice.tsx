import { toggleLikeApi } from "@/services/like.service";
import { LikeContainerProps } from "@/types/likeType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LikeArea from "./LikeArea";

const LikeContainerPractice = ({ id }: LikeContainerProps) => {
  const queryClient = useQueryClient();

  const {
    data: likeData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["likes", id],
    queryFn: () => {
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
        isLike: !(old?.isLike ?? false),
        likeCount: old?.isLike ?? false ? (old?.likeCount ?? 1) - 1 : (old?.likeCount ?? 0) + 1,
      }));

      return { previousData };
    },

    // 에러 발생시 콜백

    onError: (error, variables, context) => {
      queryClient.setQueryData(["likes", id], context?.previousData);
    },

    // 성공시 관련쿼리 무효화

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

export default LikeContainerPractice;
