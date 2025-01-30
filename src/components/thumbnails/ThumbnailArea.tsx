"use client";

import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ThumbnailItem from "./ThumbnailItem";
import { getHeadhuntingsApi } from "@/services/thumbnails.service";

const ThumbnailArea = () => {
  //headhuntings 탠스택쿼리
  const {
    data: headhuntingsData,
    isPending,
    isError,
  } = useQuery({
    queryKey: ["headhuntings"],
    queryFn: getHeadhuntingsApi,
    retry: 0,
  });

  console.log("쿼리 상태:", {
    isPending,
    isError,
    headhuntingsData,
  });

  if (isPending) return <div>로딩중</div>;
  if (isError) return <div>에러 발생</div>;

  const thumbnailIds = headhuntingsData.result.map(item => item.id);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {thumbnailIds.map(thumbnailId => (
          <ThumbnailItem key={thumbnailId} thumbnailId={thumbnailId} />
        ))}
      </div>
    </>
  );
};
export default ThumbnailArea;
