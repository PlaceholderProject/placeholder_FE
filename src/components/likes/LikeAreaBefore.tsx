"use client";

import { LikePartProps } from "@/types/likeType";
import React from "react";
import LikeItem from "./LikeItem";
import { BASE_URL } from "@/constants/baseURL";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleLikeApi } from "@/services/like.service";
const token = process.env.NEXT_PUBLIC_MY_TOKEN;

const LikeAreaBefore = ({ isLike, likeCount, thumbnailId }: LikePartProps) => {
  // 💿💿💿광고글 하나의 해당 유저 좋아요 누르기, 취소하기 => 💿💿클릭햇을 때 달아주고 수정로직 잇어야돼!!!!!!!!💿💿💿
  // 없어도돼.. 서버에서 다 구현해주심..🥹🥹🥹🥹🥹

  const queryClient = useQueryClient();

  const handleToggleLike = () => {
    likeMutation.mutate();
  };

  // 좋아요 토글 api 수정전
  // const toggleLikeApi = async () => {
  //   const response = await fetch(`${BASE_URL}/api/v1/meetup/${thumbnailId}/like`, {
  //     method: "POST",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       "Content-type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       isLike: !isLike,
  //     }),
  //   });
  //   // if (!response.ok) throw new Error(`좋아요 토글 실패: ${response.status}`);
  //   // const contentType = response.headers.get("content-type");
  //   // if (contentType && contentType.includes("application/json")) {
  //   //   return response.json();
  //   // }
  //   console.log("좋아요 토글 응답값:", response);
  //   return true;
  // };

  const likeMutation = useMutation({
    mutationFn: () => toggleLikeApi(thumbnailId, isLike),
    // 🔮🔮🔮 낙관적 업데이트 추가 코드🔮🔮🔮
    onMutate: async () => {
      // 이전 데이터 백업
      const previousLikeData = queryClient.getQueryData(["headhuntings", "thumbnail", thumbnailId]);
      // console.log("기존 데이터:", previousLikeData);

      // 낙관적 UI 업데이트
      queryClient.setQueryData(["headhuntings", "thumbnail", thumbnailId], (oldLikeData: any) => {
        // console.log("업뎃되는 옛날 데이터:", oldLikeData);
        return {
          ...oldLikeData,
          isLike: !isLike,
          likeCount: isLike ? (likeCount ?? 0) - 1 : (likeCount ?? 0) + 1,
        };
      });

      //업뎃 이후 업뎃된데이터 확인
      const updatedData = queryClient.getQueryData(["headhuntings", "thumbnail", thumbnailId]);
      // console.log("업뎃 이후 데이터:", updatedData);

      return { previousLikeData };
    },

    // 에러 발생하면 이전 데이터로 롤백
    onError: (error, variables, context) => {
      console.error("좋아요 토글 실패:", error);
      if (context?.previousLikeData) {
        queryClient.setQueryData(["headhuntings", "thumbnail"], context.previousLikeData);
      }
      // if (context?.previousLikeData) {
      //   queryClient.setQueryData(["headhuntings", "thumbnail", thumbnailId], context.previousLikeData);
      // }
    },

    //🥹🥹🥹 성공 시 리페치, 얘만 전체 리페치
    onSuccess: () => {
      // console.log("Success - invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["headhuntings", "thumbnail"] });
    },

    // 성공 실패 상관없이 완료되면 무조건 데이터 리프레시
    // onSettled: () => {
    //   queryClient.invalidateQueries({ queryKey: ["thumbnail", thumbnailId] });
    // },

    // 쿼리키에 thumbnailId랑 "like" 없이도 되긴 되는데..
  });

  // const handleLikeClick = () => {
  //   toggleLikeMutation.mutate();
  // }
  // 🟨 이거를 온클릭에 바로 달아줘야 논리 구분이 명확하다는 소리지?

  return (
    <>
      <LikeItem isLike={isLike} likeCount={likeCount} handleToggleLike={handleToggleLike} />

      {/* 👇👇👇👇👇👇👇👇아래 thumbnail.isLike로 접근한 건 잘못된 코드인데 기억하라고 남겨둠 */}
      {/* <p>좋아요 눌렀니? {thumbnail.isLike.toString()}</p>
          <button onClick={() => setIsHeadhuntingLike(!isHeadhuntingLike)}>좋아요 눌렀니? {isHeadhuntingLike ? <IoMdHeart /> : <IoMdHeartEmpty />}</button>

          <p>좋아요 숫자 : {thumbnail.likeCount}</p> */}
    </>
  );
};

export default LikeAreaBefore;
