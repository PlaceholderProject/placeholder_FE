"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import ThumbnailItem from "./ThumbnailItem";
import { getHeadhuntingsApi } from "@/services/thumbnails.service";
import { Meetup } from "@/types/meetupType";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { SkeletonTheme } from "react-loading-skeleton";
import ThumbnailSkeleton from "@/components/thumbnails/ThumbnailSkeleton";
import Spinner from "../common/Spinner";

const ThumbnailArea = () => {

  const sortType = useSelector((state: RootState) => state.sort.sortType);
  const place = useSelector((state: RootState) => state.filter.place);
  const category = useSelector((state: RootState) => state.filter.category);
  const isFilterActive = useSelector((state: RootState) => state.filter.isFilterActive);

  const getQueryKey = () => {
    const baseQueryKey = ["headhuntings", sortType];
    if (isFilterActive) {
      if (place) {
        baseQueryKey.push("place", place);
      }
      if (category) {
        baseQueryKey.push("category", category);
      }
    }

    return baseQueryKey;
  };
  const {
    data: headhuntingsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: getQueryKey(),
    queryFn: ({ pageParam = 1 }) => {
      return getHeadhuntingsApi(
        {
          sortType,
          ...(isFilterActive && place ? { place: place } : {}),
          ...(isFilterActive && category ? { category: category } : {}),
        },
        pageParam,
        10,
      );
    },
    initialPageParam: 1,
    getNextPageParam: lastPage => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        const nextPage = url.searchParams.get("page");
        return nextPage ? parseInt(nextPage) : undefined;
      }
      return undefined;
    },
  });
  const observerRef = useRef<HTMLDivElement>(null);
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    });

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [handleObserver]);

  const user = useSelector((state: RootState) => state.user.user);
  const userNickname = user.nickname;

  if (isPending)
    return (
      <SkeletonTheme baseColor="#E8E8E8" highlightColor="#D9D9D9">
        <div className="mx-auto w-[34rem] md:w-full md:max-w-[80rem]">
          <div className="my-[0.1rem] grid grid-cols-2 gap-x-[17%] md:grid-cols-4 md:justify-items-center md:gap-x-[1px]">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="w-[14.2rem] pb-[1rem] pt-[0.4rem] md:w-[150px]">
                <ThumbnailSkeleton />
              </div>
            ))}
          </div>
        </div>
      </SkeletonTheme>
    );

  if (isError) return <div>에러 발생</div>;
  const allThumbnails = headhuntingsData?.pages.flatMap(page => page.result) || [];
  if (allThumbnails.length === 0) return <p className="mt-[6rem] flex justify-center">해당하는 모임이 없습니다.</p>;

  return (
    <>
      <div className="mx-auto w-[34rem] md:w-full md:max-w-[80rem]">
        <div className="my-[0.1rem] grid grid-cols-2 gap-x-[17%] md:grid-cols-4 md:justify-items-center md:gap-x-[1px]">
          {allThumbnails.map((thumbnail: Meetup, index: number) => {
            return (
              <div key={`${thumbnail.id}-${index}`} className="w-[14.2rem] pb-[1rem] pt-[0.4rem] md:w-[150px]">
                <ThumbnailItem thumbnail={thumbnail} userNickname={userNickname} />
                {}
              </div>
            );
          })}
          {}
          {}

          {}

          <div ref={observerRef} className="col-span-full flex h-10 items-center justify-center">
            {isFetchingNextPage && <Spinner isLoading={isFetchingNextPage} />}
          </div>
        </div>
      </div>
    </>
  );
};
export default ThumbnailArea;
