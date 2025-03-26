import { toggleLikeApi } from "@/services/like.service";
import { LikeContainerProps } from "@/types/likeType";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LikePart from "./LikePart";
import { Meetup } from "@/types/meetupType";

const LikeContainerPractice = ({ id }: LikeContainerProps) => {
  const queryClient = useQueryClient();

  const {
    data: likeData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["likes", id],
    queryFn: () => {
      //Meetup 타입이라고 명시적으로 추가
      const headhuntingData = queryClient.getQueryData<Meetup>(["headhuntings", id]);
      // 부모인 ThumbnailArea와 ThumbnailItem에서 "headhuntings" 쿼리키를 사용하고 있다.
      // like API가 따로 있는 게 아니고 headhuntings를 가져오고, 개별 광고글에서 like 관련 데이터 가져옴

      //현재는 headhunting 데이터에서 like 정보 가져옴
      // TODO: 추후 별도의 likes API 생성 시 변경 예정

      return {
        isLike: headhuntingData?.isLike ?? false,
        likeCount: headhuntingData?.likeCount ?? 0,
      };
    },
    // queryFn: fetch 함수. 여기선 서버 호출 없이,
    // 캐시에 있는 ["headhuntings", id] 데이터에서 isLike, likeCount만 꺼내는 로직
    // 왜? 이미 ["headhuntings", id] 데이터가 있으면
    // 굳이 다시 API 호출하지 않고 파생 데이터만 사용하려는 전략
    // 근데 맨 처음 진입시에도 데이터가 있어야 하는데
    // 왜 최초 클릭시에 오류가 남?
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
      // 이전 데이터 백업
      const previousData = queryClient.getQueryData(["likes", id]);

      // 초기 데이터 설정 (이전 데이터 없으면 headhuntings 데이터에서 가져옴)

      if (!previousData) {
        const headhuntingData = queryClient.getQueryData<Meetup>(["headhuntings", id]);
        queryClient.setQueryData(["likes", id], {
          isLike: headhuntingData?.isLike ?? false,
          liekCount: headhuntingData?.likeCount ?? 0,
        });
      }

      // 이전 버전
      // queryClient.setQueryData(["likes", id], (old: any) => ({
      //   ...old,
      //   isLike: !(old?.isLike ?? false),
      //   likeCount: old?.isLike ?? false ? (old?.likeCount ?? 1) - 1 : (old?.likeCount ?? 0) + 1,
      // }));

      // return { previousData };

      // 새 버전 데이터 업데이트

      queryClient.setQueryData(["likes, id"], (old: any) => {
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
      <LikePart isLike={likeData?.isLike ?? false} likeCount={likeData?.likeCount ?? 0} onToggle={handleToggleLike} isPending={likeMutation.isPending} />
    </>
  );
};

export default LikeContainerPractice;
