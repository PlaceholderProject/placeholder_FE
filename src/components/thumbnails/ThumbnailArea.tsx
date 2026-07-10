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
import { FaExclamationTriangle } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";

const ThumbnailArea = () => {
  // 이제 리덕스에서 정렬 타입 가져옴
  // SortArea, FilterArea, ThumbnailArea가 한 페이지에서 렌더링되면서
  // 기능은 따로, 상태나 타입은 한번에 공유

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

  // 무한스크롤 탠스택쿼리
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

  // 요청 두번 보내므로 주석처리
  // const queryClient = useQueryClient();
  // useEffect(() => {
  //   // 쿼리키 변경시 자동으로 데이터 다시 가져오지만 명시적으로 캐시 초기화할 수도 잇다
  //   queryClient.resetQueries({ queryKey: getQueryKey() });
  // }, [sortType, place, category, isFilterActive, queryClient]);

  // 관찰 대상 요소ref
  const observerRef = useRef<HTMLDivElement>(null);

  // 무한 스크롤 콜백
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  // IntersectionObserver 설정
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    });

    const observerTarget = observerRef.current;

    if (observerTarget) {
      observer.observe(observerTarget);
    }

    return () => {
      if (observerTarget) {
        observer.unobserve(observerTarget);
      }
    };
  }, [handleObserver]);

  const user = useSelector((state: RootState) => state.user.user);
  const userNickname = user.nickname;
  const activeFilterLabel = category ?? place ?? "전체";

  if (isPending)
    return (
      <SkeletonTheme baseColor="#E8E8E8" highlightColor="#D9D9D9">
        <div className="mx-auto w-[calc(100%-3.2rem)] md:max-w-[112rem]">
          <div className="grid grid-cols-1 gap-[1.6rem] py-[0.4rem] min-[520px]:grid-cols-2 md:gap-[2rem] lg:grid-cols-3">
            {Array.from({ length: 8 }).map((_, index) => (
              <ThumbnailSkeleton key={index} />
            ))}
          </div>
        </div>
      </SkeletonTheme>
    );

  if (isError) {
    return (
      <div className="mx-auto w-[calc(100%-3.2rem)] md:max-w-[112rem]">
        <div className="border-border bg-card flex min-h-[20rem] flex-col items-center justify-center rounded-[1.6rem] border border-dashed px-[2rem] text-center">
          <span className="bg-destructive/10 text-destructive mb-[1rem] grid h-[4.2rem] w-[4.2rem] place-items-center rounded-full">
            <FaExclamationTriangle className="h-[1.8rem] w-[1.8rem]" />
          </span>
          <h3 className="text-foreground text-base font-bold">모임을 불러오지 못했어요</h3>
          <p className="text-muted-foreground mt-[0.4rem] text-sm">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  // 가져올 때 이미 소트한 뒤로 서버에서 보내주니까 sortedThumbnails로 네이밍
  // 여기서 result로 광고글 데이터에 접근
  // const sortedThumbnails = headhuntingsData.result;

  // 모든 페이지 데이터를 하나의 배열로 합침
  const allThumbnails = headhuntingsData?.pages.flatMap(page => page.result) || [];

  if (allThumbnails.length === 0) {
    return (
      <div className="mx-auto w-[calc(100%-3.2rem)] md:max-w-[112rem]">
        <div className="border-border bg-card flex min-h-[22rem] flex-col items-center justify-center rounded-[1.6rem] border border-dashed px-[2rem] text-center">
          <span className="bg-primary-soft text-primary mb-[1rem] grid h-[4.4rem] w-[4.4rem] place-items-center rounded-full">
            <LuSearch className="h-[2rem] w-[2rem] stroke-[1.8]" />
          </span>
          <h3 className="text-foreground text-base font-bold">조건에 맞는 모임이 없어요</h3>
          <p className="text-muted-foreground mt-[0.4rem] text-sm">{activeFilterLabel === "전체" ? "새 모임이 올라오면 이곳에 표시됩니다." : `${activeFilterLabel} 조건을 바꿔서 다시 찾아보세요.`}</p>
        </div>
      </div>
    );
  }

  // sort 이거 얻다 불니하고 싶었는데 이 로직을 백엔드에서 처리해줬다
  // 인기순 (기본)
  // if (sortType === "like") {
  //   sortedThumbnails = [...headhuntingsData.result].sort((a, b) => {
  //     const likeCountA = a.likeCount;
  //     const likeCountB = b.likeCount;
  //     return likeCountB - likeCountA;
  //   });
  // } else if (sortType === "latest") {
  //   // 최신순
  //   sortedThumbnails = [...headhuntingsData.result].sort((a, b) => {
  //     const createdA = new Date(a.createdAt).getTime();
  //     const createdB = new Date(b.createdAt).getTime();
  //     return createdB - createdA;
  //   });
  // } else if (sortType === "deadline") {
  //   // 마감임박순
  //   sortedThumbnails = [...headhuntingsData.result].sort((a, b) => {
  //     const deadlineA = new Date(a.adEndedAt).getTime();
  //     const deadlineB = new Date(b.adEndedAt).getTime();
  //     return deadlineA - deadlineB;
  //   });
  // }

  return (
    <>
      <div className="mx-auto w-[calc(100%-3.2rem)] md:max-w-[112rem]">
        <div className="grid grid-cols-1 gap-[1.6rem] py-[0.4rem] min-[520px]:grid-cols-2 md:gap-[2rem] lg:grid-cols-3">
          {allThumbnails.map((thumbnail: Meetup, index: number) => {
            return <ThumbnailItem key={`${thumbnail.id}-${index}`} thumbnail={thumbnail} userNickname={userNickname} priority={index === 0} />;
          })}
          <div ref={observerRef} className="col-span-full flex h-10 items-center justify-center">
            {isFetchingNextPage && <Spinner isLoading={isFetchingNextPage} compact message="모임을 더 불러오는 중" />}
          </div>
        </div>
      </div>
    </>
  );
};
export default ThumbnailArea;
