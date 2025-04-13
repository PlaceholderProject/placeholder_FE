"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import ThumbnailItem from "./ThumbnailItem";
import { getHeadhuntingsApi } from "@/services/thumbnails.service";
import { Meetup } from "@/types/meetupType";
import Cookies from "js-cookie";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";

const token = Cookies.get("accessToken");

const ThumbnailArea = () => {
  // 이제 리덕스에서 정렬 타입 가져옴
  // SortArea, FilterArea, ThumbnailArea가 한 페이지에서 렌더링되면서
  // 기능은 따로, 상태나 타입은 한번에 공유

  const sortType = useSelector((state: RootState) => state.sort.sortType);

  //headhuntings 탠스택쿼리
  const {
    data: headhuntingsData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["headhuntings"],
    queryFn: getHeadhuntingsApi,
    retry: 0,
    //-- TO DO--
    // retry 수정??
  });

  if (isPending) return <div>로딩중</div>;
  if (isError) return <div>에러 발생</div>;

  console.log("소트전:", headhuntingsData.result);

  let sortedThumbnails = [];

  // --TODO--
  // sort 근데 이거 분리 어디다 못하나
  // 인기순 (기본)
  if (sortType === "popular") {
    sortedThumbnails = [...headhuntingsData.result].sort((a, b) => {
      const likeCountA = a.likeCount;
      const likeCountB = b.likeCount;
      return likeCountB - likeCountA;
    });
  } else if (sortType === "newest") {
    // 최신순
    sortedThumbnails = [...headhuntingsData.result].sort((a, b) => {
      const createdA = new Date(a.createdAt).getTime();
      const createdB = new Date(b.createdAt).getTime();
      return createdB - createdA;
    });
  } else if (sortType === "adDeadline") {
    // 마감임박순
    sortedThumbnails = [...headhuntingsData.result].sort((a, b) => {
      const deadlineA = new Date(a.adEndedAt).getTime();
      const deadlineB = new Date(b.adEndedAt).getTime();
      return deadlineA - deadlineB;
    });
  }

  const thumbnailIds = sortedThumbnails.map((headhungting: Meetup) => headhungting.id);

  console.log("썸넬아이디들", thumbnailIds);

  console.log("소트이후?", sortedThumbnails);

  // ❗️ 각각 모임 id를 엔드포인트에 붙여서 가져오는 함수에 에러가 난다
  // 왜냐면 [headhuntingsData.result]라고 쓰면, 대괄호로 다시 배열을 씌우게 되므로!
  // 스프레드 문법 써야함

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {thumbnailIds.map((thumbnailId: Meetup["id"]) => (
          <ThumbnailItem key={thumbnailId} id={thumbnailId} />
        ))}
      </div>
    </>
  );
};
export default ThumbnailArea;
