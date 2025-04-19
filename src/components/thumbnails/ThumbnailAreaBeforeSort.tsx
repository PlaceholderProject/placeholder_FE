// "use client";

// import React from "react";
// import { useQuery } from "@tanstack/react-query";
// import ThumbnailItem from "./ThumbnailItem";
// import { getHeadhuntingsApi } from "@/services/thumbnails.service";
// import { Meetup, SortType } from "@/types/meetupType";
// import Cookies from "js-cookie";

// const token = Cookies.get("accessToken");

// const ThumbnailArea = () => {
//   //headhuntings 탠스택쿼리
//   const {
//     data: headhuntingsData,
//     isPending,
//     isError,
//   } = useQuery({
//     queryKey: ["headhuntings"],
//     queryFn: getHeadhuntingsApi,
//     retry: 0,
//   });

//   if (isPending) return <div>로딩중</div>;
//   if (isError) return <div>에러 발생</div>;

//   const thumbnailIds = headhuntingsData.result.map((headhungting: Meetup) => headhungting.id);

//   return (
//     <>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
//         {thumbnailIds.map((thumbnailId: Meetup["id"]) => (
//           <ThumbnailItem key={thumbnailId} id={thumbnailId} />
//         ))}
//       </div>
//     </>
//   );
// };
// export default ThumbnailArea;

"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import ThumbnailItem from "./ThumbnailItem";
import { getHeadhuntingItemApi, getHeadhuntingsApi } from "@/services/thumbnails.service";
import { Meetup } from "@/types/meetupType";
import Cookies from "js-cookie";
import { useSelector, UseSelector } from "react-redux";
import { RootState } from "@/stores/store";

const token = Cookies.get("accessToken");

const ThumbnailArea = () => {
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
  });

  if (isPending) return <div>로딩중</div>;
  if (isError) return <div>에러 발생</div>;

  let sortedThumbnails = [];

  if (sortType === "popular") {
    [...headhuntingsData.result].sort((a, b) => {
      const likeCountA = a.likeCount;
      const likeCountB = b.likeCount;
      return likeCountB - likeCountA;
    });
  } else if (sortType === "newest") {
    [...headhuntingsData.result].sort((a, b) => {
      const createdA = new Date(a.createdAt).getTime();
      const createdB = new Date(b.createdAt).getTime();
      return createdB - createdA;
    });
  } else if (sortType === "adDeadline") {
    sortedThumbnails = [...headhuntingsData.result].sort((a, b) => {
      const deadlineA = new Date(a.adEndedAt).getTime();
      const deadlineB = new Date(b.adEndedAt).getTime();
      return deadlineA - deadlineB;
    });
  }

  const thumbnailIds = sortedThumbnails.map((headhunting: Meetup) => headhunting.id);

  return (
    <>
      <div>
        {thumbnailIds.map((thumbnailId: Meetup["id"]) => (
          <ThumbnailItem key={thumbnailId} id={thumbnailId} />
        ))}
      </div>
    </>
  );
};
