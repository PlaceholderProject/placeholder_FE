"use client";

import React, { useState } from "react";
import { BASE_URL } from "@/constants/baseURL";
import { ThumbnailItemProps } from "@/types/thumbnailType";
import calculateDays from "@/utils/calculateDays";
import LikeArea from "../ad/LikeArea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const token = process.env.NEXT_PUBLIC_MY_TOKEN;

const ThumbnailItem = ({ thumbnail }: ThumbnailItemProps) => {
  const [isHeadhuntingLike, setIsHeadhuntingLike] = useState(false);
  const queryClient = useQueryClient();
  const thumbnailImageUrl = `${BASE_URL}${thumbnail.image}`;
  const thumbnailId = thumbnail.id;

  // 광고글 하나 데이터 가져오기
  const getHeadhuntingItem = async () => {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${thumbnailId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("해당 id 광고아이템 가져오기 실패");
    }

    const headhuntingItemData = await response.json();

    console.log("아이템 하나 데이터:", headhuntingItemData);

    return await headhuntingItemData;
  };

  // 광고글 하나 탠스택
  // 🟨이게 왜 필요허지???????🟨
  const {
    data: headhuntingAsThumbnailItem,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["meetup", thumbnailId],
    queryFn: getHeadhuntingItem,
  });

  // 💿💿💿광고글 하나의 해당 유저 좋아요 누르기, 취소하기 => 💿💿클릭햇을 때 달아주고 수정로직 잇어야돼!!!!!!!!💿💿💿💿💿
  const handleToggleLike = (meetupId: number, userNickname: string, isHeadhuntingLike: boolean) => {
    setIsHeadhuntingLike(!isHeadhuntingLike);
    const toggledLike = isHeadhuntingLike;
    return toggledLike;
  };

  const toggleLikeApi = async () => {
    const response = await fetch(`${BASE_URL}/api/v1/meetup/${thumbnailId}/like`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        isLike: !thumbnail.isLike,
      }),
    });
    if (!response.ok) throw new Error("좋아요 토글 통신 실패");
    return response.json();
  };

  // 광고글 유저 좋아요 누르기, 취소 탠스택

  const toggleLikeMutation = useMutation({
    mutationFn: toggleLikeApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetup", thumbnailId] });
    },
    onError: error => {
      console.error("좋아요 토글 실패:", error);
    },
  });

  // const handleLikeClick = () => {
  //   toggleLikeMutation.mutate();
  // }
  // 🟨🟨🟨 이거를 온클릭에 바로 달아줘야 논리 구분이 명확하다는 소리지?

  if (isPending) return <div>로딩중</div>;
  if (isError) return <div>에러발생</div>;

  return (
    <>
      <div className="border rounded-lg p-4">
        {thumbnail.image && (
          <div className="relative h-48 b-4">
            {/* <Image src={thumbnailImageUrl} alt={`${thumbnail.id}번 광고 이미지 안뜸`} fill className="object-cover rounded" loading="lazy" /> */}
            {/* 🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩Imageㅅ 써야될거같은데!!!!!11🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩🐩 */}
            <img src={thumbnailImageUrl} alt="테스트용 이미지 잘뜨나" className="object-cover rounded" loading="lazy" />
          </div>
        )}
        <div className="space-y-2">
          <p className="font-semibold">작성자: {thumbnail.organizer.nickname}</p>
          <div>
            <LikeArea isLike={thumbnail.isLike} likeCount={thumbnail.likeCount} handleToggleLike={() => toggleLikeMutation.mutate()} />
          </div>

          <p className="text-gray-600">[{thumbnail.place}]</p>
          <p className="text-lg font-bold">{thumbnail.adTitle}</p>
          <div>
            모임 날짜 : {thumbnail.startedAt === null ? "미정" : thumbnail.startedAt.substring(0, 10)} ~ {thumbnail.endedAt === null ? "미정" : thumbnail.endedAt.substring(0, 10)}{" "}
            <p>
              {thumbnail.startedAt && thumbnail.endedAt
                ? calculateDays({
                    startedAt: thumbnail.startedAt,
                    endedAt: thumbnail.endedAt,
                  })
                : ""}
            </p>
          </div>
          <p className="text-sm text-gray-500">{thumbnail.adEndedAt?.substring(0, 10)}까지 모집</p>
          <p className="text-sm">공개여부 : {thumbnail.isPublic.toString()}</p>
        </div>
      </div>
    </>
  );
};

export default ThumbnailItem;
