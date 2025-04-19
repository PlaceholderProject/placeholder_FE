// import { toggleLikeApi } from "@/services/like.service";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import React from "react";
// import { Meetup } from "@/types/meetupType";
// import LikePart from "./LikePart";

// // ❗️좋아요 클릭이나 취소시 새로고침을 해야 숫자가 옳게 반영됨
// // 이미 누른거(1)이 또 클릭하면 2가 됐다가 새로고침해야 1이 되고
// // -1도 나왔었음
// // ❗️ 이미 좋아요 누른 1이, 새로고침시 숫자는 남아있는데 하트 빨간게 투명해짐

// const LikeContainer = ({ id }: { id: Meetup["id"] }) => {
//   const queryClient = useQueryClient();

//   const {
//     data: likeData,
//     isPending,
//     isError,
//   } = useQuery({
//     queryKey: ["likes", id],
//     queryFn: () => {
//       const headhuntingData = queryClient.getQueryData<Meetup>(["headhuntings", id]);
//       return {
//         isLike: headhuntingData?.isLike ?? false,
//         likeCount: headhuntingData?.likeCount ?? 0,
//       };
//     },
//   });

//   const likeMutation = useMutation({
//     mutationFn: () => toggleLikeApi(id, likeData?.isLike ?? false),

//     // 낙관적 업데이트
//     onMutate: async () => {
//       // 이전 데이터 백업
//       const previousData = queryClient.getQueryData(["likes", id]);
//       // headhuntings 쿼리 캐시도 백업
//       const previousHeadhunting = queryClient.getQueryData<Meetup>(["headhuntings", id]);

//       console.log("likeData가 뭔데? 클릭하면 클릭 이전의전 값이 찍히고있어:", likeData);
//       //  처음에 likes 쿼리키 없을 시 설정
//       if (!queryClient.getQueryData(["likes", id])) {
//         queryClient.setQueryData(["likes", id], {
//           isLike: likeData?.isLike ?? false,
//           likeCount: likeData?.likeCount ?? 0,
//         });
//       }

//       // likes 쿼리 낙관적 업데이트
//       const currentIsLike = likeData?.isLike ?? false;
//       // ❗️❗️❗️❗️❗️ 여기 왜 currentCountLike는 선언을 안 하고 직접참조함?????
//       const currentLikeCount = likeData?.likeCount;
//       const newLikeData = {
//         isLike: !currentIsLike,
//         likeCount: currentIsLike ? (likeData?.likeCount ?? 1) - 1 : (likeData?.likeCount ?? 0) + 1,
//       };

//       queryClient.setQueryData(["likes", id], newLikeData);

//       // headhuntings 쿼리도 함께 업데이트
//       if (previousHeadhunting && "likeCount" in previousHeadhunting) {
//         const meetup = previousHeadhunting as Meetup;
//         queryClient.setQueryData<Meetup>(["headhuntings", id], {
//           ...meetup,
//           isLike: !currentIsLike,
//           likeCount: currentIsLike ? (previousHeadhunting.likeCount ?? 1) - 1 : (previousHeadhunting.likeCount ?? 0) + 1,
//         });
//       }

//       // headhuntings 목록 쿼리도 함께 업데이트
//       const headhuntingsList = queryClient.getQueryData(["headhuntings"]);
//       if (headhuntingsList && Array.isArray(headhuntingsList)) {
//         queryClient.setQueryData(
//           ["headhuntings"],
//           headhuntingsList.map(item =>
//             item.id === id
//               ? {
//                   ...item,
//                   isLike: !currentIsLike,
//                   likeCount: currentIsLike ? (item.likeCount ?? 1) - 1 : (item.likeCount ?? 0) + 1,
//                 }
//               : item,
//           ),
//         );
//       }

//       return { previousData, previousHeadhunting };
//     },

//     // 에러 발생시 롤백
//     onError: (error, variables, context) => {
//       console.error("좋아요 토글 에러:", error);
//       queryClient.setQueryData(["likes", id], context?.previousData);
//       if (context?.previousHeadhunting) {
//         queryClient.setQueryData(["headhuntings", id], context.previousHeadhunting);
//       }
//     },

//     // 성공 시 관련 쿼리 무효화
//     onSuccess: data => {
//       console.log("좋아요 토글 성공시 콘솔:", data);
//       queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
//       queryClient.invalidateQueries({ queryKey: ["headhuntings", id] });
//       queryClient.invalidateQueries({ queryKey: ["likes", id] });
//     },
//   });

//   if (isPending) return <div>로딩중...</div>;
//   if (isError) return <div>에러 발생</div>;

//   const handleToggleLike = () => {
//     console.log("🔮🔮🔮🔮🔮🔮🔮좋아요 토글 시랳ㅇ됨");

//     likeMutation.mutate();
//   };

//   return (
//     <>
//       <LikePart isLike={likeData?.isLike ?? false} likeCount={likeData?.likeCount ?? 0} onToggle={handleToggleLike} isPending={likeMutation.isPending} />
//     </>
//   );
// };

// export default LikeContainer;

import React from "react";
import { toggleLikeApi } from "@/services/like.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Meetup } from "@/types/meetupType";
import LikePart from "./LikePart";
import { getLikeByIdApi } from "@/services/like.service";

const LikeContainer = ({ id }: { id: Meetup["id"] }) => {
  const queryClient = useQueryClient();

  const {
    data: likeData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["like", id],
    queryFn: () => getLikeByIdApi(id),
  });

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeApi(id, likeData?.isLike ?? false),

    //낙관적 업데이트
    onMutate: async () => {
      //이전 데이터 백업인데 직접 api통신으로 가져오기보다는 쿼리에서 가져와라
      // const previousLikeData = await getLikeByIdApi(id);

      // 이전 쿼리 요청 취소
      await queryClient.cancelQueries({ queryKey: ["like", id] });

      //이전 데이터  쿼리에서 가져와 백업
      const previousLikeData = queryClient.getQueryData(["like", id]);

      const currentIsLike = likeData?.isLike ?? false;
      const currentLikeCount = likeData?.likeCount ?? 0;
      console.log("likeData:", likeData);
      console.log("currentLikeCount:", currentLikeCount);
      // 이건 잘못된 참조여서 undefined찍히는ㄱ ㅔ 맞다
      console.log("likeData?.currentLikeCount:", likeData?.currentLikeCount);

      //headhuntings 쿼리 캐시 백업
      // const previousHeadhuntingData = await getHeadhuntingsApi();

      // like 쿼리 낙관적 업데이트
      // 새 좋아요 상태 계산

      // const newLikeData = {
      //   isLike: !currentIsLike,
      //   // likeCount: currentIsLike ? (likeData?.currentLikeCount ?? 1) - 1 : (likeData?.currentLikeCount ?? 0) + 1,
      //   likeCount: currentLikeCount ? currentLikeCount - 1 : currentLikeCount + 1,
      // };

      const newLikeData = {
        isLike: !currentIsLike,
        likeCount: currentIsLike
          ? Math.max(0, currentLikeCount - 1) // 0이하로 내려가지 못하게
          : currentLikeCount + 1,
      };

      // 낙관적 업데이트 적용
      queryClient.setQueryData(["like", id], newLikeData);

      // 롤백 위해 이전 데이터 반환
      // 이게 뭐고 롤백이 먼데
      // return { previousLikeData };
    },

    // 에러 발생 시 롤백
    // onError: (error, variables, context) => {
    //   console.error("좋아요 토글 에러:", error);
    //   if (context?.previousLikeData) {
    //     queryClient.setQueryData(["like", id], context.previousLikeData);
    //   }
    // },

    // 성공 시 쿼리 무효화

    // onSuccess: data => {
    //   queryClient.invalidateQueries({ queryKey: ["like", id] });
    // },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["like", id] });
      queryClient.invalidateQueries({ queryKey: ["headhuntings"] });
    },
  });

  if (isPending) return <div> 라잌 데이터 가져오기 로딩중</div>;
  if (isError) return <div>라잌 데이터 가져오기 오류</div>;

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

export default LikeContainer;
