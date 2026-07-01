"use client";

import React, { useEffect, useState } from "react";
import { RootState } from "@/stores/store";
import { useDispatch, useSelector } from "react-redux";
import { SearchedType } from "@/types/searchType";
import { Meetup } from "@/types/meetupType";
import { getSearchedAd } from "@/services/search.service";
import { getHeadhuntingsApi } from "@/services/thumbnails.service";
import { setSearchedAds, setTotal } from "@/stores/searchSlice";
import { FaExclamationTriangle, FaLock, FaMapMarkerAlt } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { getImageURL } from "@/utils/getImageURL";
import { getDday } from "@/utils/getDday";
import ThumbnailItem from "../thumbnails/ThumbnailItem";
import ThumbnailSkeleton from "../thumbnails/ThumbnailSkeleton";
import { SkeletonTheme } from "react-loading-skeleton";

type SearchResultForThumbnail = SearchedType &
  Partial<Omit<Meetup, "organizer">> & {
    organizer: SearchedType["organizer"] & Partial<Meetup["organizer"]>;
    description?: string;
    category?: string;
  };

const toThumbnailMeetup = (ad: SearchedType): Meetup => {
  const searchResult = ad as SearchResultForThumbnail;

  return {
    id: ad.id,
    organizer: {
      nickname: ad.organizer.nickname,
      image: searchResult.organizer.image ?? ad.organizer.profileImage ?? "",
    },
    isLike: ad.isLike,
    likeCount: ad.likeCount,
    name: searchResult.name ?? ad.meetup ?? ad.adTitle,
    description: searchResult.description ?? ad.meetup ?? "",
    place: ad.place,
    placeDescription: searchResult.placeDescription ?? "",
    startedAt: ad.startedAt ?? null,
    endedAt: ad.endedAt ?? null,
    adTitle: ad.adTitle,
    adEndedAt: ad.adEndedAt,
    isPublic: ad.isPublic,
    image: ad.image,
    category: searchResult.category ?? "",
    createdAt: ad.createdAt,
    commentCount: ad.commentCount,
    pages: searchResult.pages ?? [],
  };
};

const SearchedResultArea = () => {
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const { searchedAds, searchField, total } = useSelector((state: RootState) => state.search);
  const userNickname = useSelector((state: RootState) => state.user.user.nickname);
  const dispatch = useDispatch();
  const keyword = searchField.keyword.trim();
  const range = searchField.range || "ad_title";
  const category = searchField.category ?? null;
  const hasKeyword = keyword.length > 0;
  const { data: recommendedData, isLoading: isRecommendedLoading } = useQuery({
    queryKey: ["headhuntings", "search-popular-ads", category],
    queryFn: () => getHeadhuntingsApi({ sortType: "like", ...(category ? { category } : {}) }, 1, 5),
    enabled: !hasKeyword,
    staleTime: 1000 * 60,
  });
  const recommendedAds: Meetup[] = (recommendedData?.result ?? []).slice(0, 5);

  const size = 10;
  const groupSize = 5;
  const totalPages = Math.ceil(total / size);
  const currentGroup = Math.floor((page - 1) / groupSize);
  const startPage = currentGroup * groupSize + 1;
  const endPage = Math.min(startPage + groupSize - 1, totalPages);

  useEffect(() => {
    setPage(1);
  }, [category, searchField.keyword, range]);

  useEffect(() => {
    if (!hasKeyword || !range) {
      dispatch(setSearchedAds([]));
      dispatch(setTotal(0));
      setIsLoading(false);
      setIsError(false);
      return;
    }

    let isMounted = true;

    const fetchPage = async () => {
      const result = await getSearchedAd(range, keyword, page, category);
      if (!isMounted) return;

      if (!result) {
        dispatch(setSearchedAds([]));
        dispatch(setTotal(0));
        setIsError(true);
      } else {
        dispatch(setSearchedAds(result.proposals ?? []));
        dispatch(setTotal(result.total ?? 0));
      }

      setIsLoading(false);
    };

    setIsLoading(true);
    setIsError(false);

    const searchTimer = window.setTimeout(() => {
      fetchPage();
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(searchTimer);
    };
  }, [page, category, dispatch, hasKeyword, keyword, range]);

  if (!hasKeyword) {
    return (
      <div className="mx-auto mt-[2.2rem] w-[95%] md:max-w-[100rem]">
        <section>
          <h2 className="text-muted-foreground mb-[1.2rem] text-sm font-medium">인기 광고 🔥</h2>

          {isRecommendedLoading ? (
            <div className="scroll-container flex gap-[0.9rem] pb-[0.3rem]">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="border-border bg-card flex w-[22rem] shrink-0 gap-[0.7rem] rounded-[1.2rem] border p-[0.7rem]">
                  <div className="bg-muted h-[6.4rem] w-[6.4rem] shrink-0 animate-pulse rounded-[0.9rem]" />
                  <div className="flex flex-1 flex-col justify-center gap-[0.6rem]">
                    <div className="bg-muted h-[1.2rem] w-[80%] animate-pulse rounded-full" />
                    <div className="bg-muted h-[1rem] w-[55%] animate-pulse rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : recommendedAds.length > 0 ? (
            <div className="scroll-container flex gap-[0.9rem] pb-[0.3rem]">
              {recommendedAds.map((ad, index) => {
                const adDday = getDday(ad.adEndedAt);
                const isUrgent = adDday === "D-DAY" || /^D-[0-3]$/.test(adDday);

                return (
                  <Link
                    key={ad.id}
                    href={`/ad/${ad.id}`}
                    className="group border-border bg-card hover:border-primary/30 flex w-[22rem] shrink-0 gap-[0.7rem] rounded-[1.2rem] border p-[0.7rem] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-24px_rgba(22,21,15,0.45)]"
                  >
                    <div className="bg-muted relative h-[6.4rem] w-[6.4rem] shrink-0 overflow-hidden rounded-[0.9rem]">
                      {ad.isPublic && ad.image ? (
                        <Image src={getImageURL(ad.image ?? null)} alt={ad.adTitle} fill sizes="6.4rem" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="bg-muted text-muted-foreground grid h-full w-full place-items-center">
                          <FaLock className="h-[1.5rem] w-[1.5rem]" />
                        </div>
                      )}
                      <span className="bg-primary text-primary-foreground absolute top-[0.45rem] left-[0.45rem] grid h-[1.8rem] min-w-[1.8rem] place-items-center rounded-full px-[0.45rem] font-mono text-[0.95rem] font-semibold">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col justify-between py-[0.1rem]">
                      <div className="min-w-0">
                        <h3 className="text-foreground line-clamp-2 text-sm leading-snug font-semibold break-words">{ad.adTitle}</h3>
                        <p className="text-muted-foreground mt-[0.25rem] flex min-w-0 items-center gap-[0.3rem] text-xs">
                          <FaMapMarkerAlt className="shrink-0" />
                          <span className="truncate">{ad.place}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-[0.45rem] text-[1rem]">
                        {adDday && (
                          <span
                            className={`rounded-full px-[0.55rem] py-[0.15rem] font-mono font-semibold ${isUrgent ? "bg-destructive text-destructive-foreground" : "bg-muted text-muted-foreground"}`}
                          >
                            {adDday}
                          </span>
                        )}
                        <span className="text-muted-foreground truncate">좋아요 {ad.likeCount}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : null}
        </section>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto mt-[2.2rem] w-[95%] md:max-w-[100rem]">
        <SkeletonTheme baseColor="#E8E8E8" highlightColor="#D9D9D9">
          <div className="grid grid-cols-2 gap-[1.2rem] py-[0.4rem] md:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <ThumbnailSkeleton key={index} />
            ))}
          </div>
        </SkeletonTheme>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto mt-[2.2rem] w-[95%] md:max-w-[100rem]">
        <div className="border-border flex min-h-[20rem] flex-col items-center justify-center rounded-[1.6rem] border border-dashed px-[2rem] text-center">
          <span className="bg-destructive/10 text-destructive mb-[1rem] grid h-[4.2rem] w-[4.2rem] place-items-center rounded-full">
            <FaExclamationTriangle className="h-[1.8rem] w-[1.8rem]" />
          </span>
          <h2 className="text-foreground text-base font-bold">검색 결과를 불러오지 못했어요</h2>
          <p className="text-muted-foreground mt-[0.4rem] text-sm">잠시 후 다시 시도해주세요.</p>
        </div>
      </div>
    );
  }

  if (!searchedAds || searchedAds.length === 0) {
    return (
      <div className="mx-auto mt-[2.2rem] w-[95%] md:max-w-[100rem]">
        <div className="border-border flex min-h-[20rem] flex-col items-center justify-center rounded-[1.6rem] border border-dashed px-[2rem] text-center">
          <span className="bg-primary-soft text-primary mb-[1rem] grid h-[4.4rem] w-[4.4rem] place-items-center rounded-full">
            <LuSearch className="h-[2rem] w-[2rem] stroke-[1.8]" />
          </span>
          <h2 className="text-foreground text-base font-bold">검색 결과가 없어요</h2>
          <p className="text-muted-foreground mt-[0.4rem] text-sm">
            <span className="text-foreground font-medium">{keyword}</span>와 다른 키워드로 다시 찾아보세요.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-[2.2rem] w-[95%] md:max-w-[100rem]">
      <p className="text-muted-foreground mb-[1.2rem] text-sm">
        검색 결과 <span className="text-foreground font-semibold">{total}</span>건
      </p>

      <ul className="grid grid-cols-2 gap-[1.2rem] py-[0.4rem] md:grid-cols-3">
        {searchedAds.map((ad: SearchedType, index: number) => (
          <li key={ad.id}>
            <ThumbnailItem thumbnail={toThumbnailMeetup(ad)} userNickname={userNickname} priority={index === 0} highlight={{ range, keyword }} />
          </li>
        ))}
      </ul>

      {totalPages > 1 && (
        <div className="mt-[3rem] flex items-center justify-center gap-[0.6rem]">
          {/* 이전 그룹 버튼 */}
          {startPage > 1 && (
            <button onClick={() => setPage(startPage - 1)} className="bg-muted text-muted-foreground hover:bg-muted/70 rounded-full px-[1rem] py-[0.5rem] text-sm transition">
              이전
            </button>
          )}

          {/* 페이지 번호 버튼들 */}
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map(p => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-full px-[1.2rem] py-[0.5rem] text-sm font-medium transition ${page === p ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/70"}`}
            >
              {p}
            </button>
          ))}

          {/* 다음 그룹 버튼 */}
          {endPage < totalPages && (
            <button onClick={() => setPage(endPage + 1)} className="bg-muted text-muted-foreground hover:bg-muted/70 rounded-full px-[1rem] py-[0.5rem] text-sm transition">
              다음
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchedResultArea;
