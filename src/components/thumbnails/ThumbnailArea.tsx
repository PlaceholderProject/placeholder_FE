"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Meetup } from "@/types/meetupType";
import ThumbnailItem from "./ThumbnailItem";
import { getHeadhuntingsApi } from "@/services/thumbnails.service";

const token = process.env.NEXT_PUBLIC_MY_TOKEN;

const ThumbnailArea = () => {
  // // meetups(headhuntings) 가져오는 api
  // const getHeadhuntingsApi = async () => {
  //   const response = await fetch(`${BASE_URL}/api/v1/meetup`, {
  //     method: "GET",
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });

  //   if (!response.ok) {
  //     throw new Error("광고글 목록 가져오기 실패");
  //   }
  //   const headhuntingsData = await response.json();
  //   console.log("가져온 광고글 목록: ", headhuntingsData);
  //   return headhuntingsData;
  // };

  //headhuntings 탠스택쿼리
  const {
    data: headhuntingsAsThumbnails,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["headhuntings", "thumbnail"],
    queryFn: getHeadhuntingsApi,
    retry: 0,
  });

  console.log("쿼리 상태:", {
    isPending,
    isError,
    headhuntingsAsThumbnails,
  });

  useEffect(() => {
    if (headhuntingsAsThumbnails) {
      console.log("받아온 데이터 구조:", headhuntingsAsThumbnails);
    }
  }, [headhuntingsAsThumbnails]);

  if (isPending) return <div>로딩중...</div>;
  if (isError) return <div>에러 발생</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {headhuntingsAsThumbnails.result.map((thumbnail: Meetup) => (
          <ThumbnailItem key={thumbnail.id} thumbnail={thumbnail} />
        ))}
      </div>
    </>
  );
};
export default ThumbnailArea;
