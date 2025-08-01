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
      console.log("ThumbnailArea에서 데이터 fetch 시작, 쿼리 키는 이것이다:", getQueryKey());
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
        <div className="mx-auto flex w-[34rem]">
          <div className="mx-[1rem] my-[0.1rem] grid grid-cols-2 gap-[3.5rem]">
            {Array.from({ length: 10 }).map((_, index) => (
              <ThumbnailSkeleton key={index} />
            ))}
          </div>
        </div>
      </SkeletonTheme>
    );
  if (isError) return <div>에러 발생</div>;

  // 가져올 때 이미 소트한 뒤로 서버에서 보내주니까 sortedThumbnails로 네이밍
  // 여기서 result로 광고글 데이터에 접근
  // const sortedThumbnails = headhuntingsData.result;

  // 모든 페이지 데이터를 하나의 배열로 합침
  const allThumbnails = headhuntingsData?.pages.flatMap(page => page.result) || [];
  console.log("필터 적용 전 모든 데이터:", allThumbnails);
  console.log("화면에 표시할 데이터:", allThumbnails);

  if (allThumbnails.length === 0) return <p className="mt-[6rem] flex justify-center">해당하는 모임이 없습니다.</p>;

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

  // --NOTE--
  // 25.04.25 아이디만 넘겨주고 다시 썸네일아이템에서 또 데이터 페치하는 게 중복이라 수정함
  // const thumbnailIds = sortedThumbnails.map((headhungting: Meetup) => headhungting.id);

  // ❗️ 각각 모임 id를 엔드포인트에 붙여서 가져오는 함수에 에러가 난다
  // 왜냐면 [headhuntingsData.result]라고 쓰면, 대괄호로 다시 배열을 씌우게 되므로!
  // 스프레드 문법 써야함

  return (
    <>
      <div className="mx-auto w-[34rem] md:w-full md:max-w-[80rem]">
        <div className="my-[0.1rem] grid grid-cols-2 gap-x-[17%] md:grid-cols-4 md:justify-items-center md:gap-x-[1px]">
          {allThumbnails.map((thumbnail: Meetup, index: number) => {
            return (
              <div key={`${thumbnail.id}-${index}`} className="w-[14.2rem] pb-[1rem] pt-[0.4rem] md:w-[150px]">
                <ThumbnailItem thumbnail={thumbnail} userNickname={userNickname} />
                {/* <ThumbnailItem thumbnail={thumbnail} /> */}
              </div>
            );
          })}
          {/* 더 불러오기 */}
          {/* {hasNextPage && (
          <div className="col-span-full flex justify-center p-4">
            <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300">
              {isFetchingNextPage ? "불러오는 중..." : "더 보기"}
            </button>
          </div>
        )} */}

          {/* 관찰대상요소 */}

          <div ref={observerRef} className="col-span-full flex h-10 items-center justify-center">
            {isFetchingNextPage && <Spinner isLoading={isFetchingNextPage} />}
          </div>
        </div>
      </div>
    </>
  );
};
export default ThumbnailArea;
