"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { getHeadhuntingsApi } from "@/services/thumbnails.service";
import { getImageURL } from "@/utils/getImageURL";
import { getDday } from "@/utils/getDday";
import CategoryBadge from "@/components/common/CategoryBadge";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { Meetup } from "@/types/meetupType";

const AUTO_INTERVAL = 4000;
const MAX_SLIDES = 5;

const ThumbnailCarousel = () => {
  // 기존 광고 목록 API 재사용 (서버 추가 없음)
  const { data, isLoading } = useQuery({
    queryKey: ["headhuntings", "carousel"],
    queryFn: () => getHeadhuntingsApi({ sortType: "like" }, 1, 20),
    staleTime: 1000 * 60,
  });

  // 이미지 있는 공개 광고만 골라 랜덤 셔플 후 상위 N개
  const slides = useMemo<Meetup[]>(() => {
    const list: Meetup[] = (data?.result ?? []).filter((m: Meetup) => m.isPublic && m.image);
    const shuffled = [...list].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, MAX_SLIDES);
  }, [data]);

  const [index, setIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [progressCycle, setProgressCycle] = useState(0);

  const restartProgress = () => setProgressCycle(prev => prev + 1);

  const goPrev = () => {
    restartProgress();
    setIndex(prev => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    restartProgress();
    setIndex(prev => (prev + 1) % slides.length);
  };

  useEffect(() => {
    if (slides.length <= 1) {
      setProgress(0);
      return;
    }

    let animationFrameId = 0;
    const startedAt = performance.now();

    const updateProgress = (now: number) => {
      const nextProgress = Math.min(((now - startedAt) / AUTO_INTERVAL) * 100, 100);
      setProgress(nextProgress);

      if (nextProgress >= 100) {
        setIndex(prev => (prev + 1) % slides.length);
        return;
      }

      animationFrameId = requestAnimationFrame(updateProgress);
    };

    setProgress(0);
    animationFrameId = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrameId);
  }, [index, progressCycle, slides.length]);

  // 슬라이드 수 변동 시 인덱스 보정
  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  if (isLoading) {
    return (
      <section className="mx-auto w-[95%] md:max-w-[100rem]">
        <div className="bg-muted relative h-[22rem] w-full animate-pulse overflow-hidden rounded-[1.6rem] md:h-[32rem] lg:h-[34rem]" />
      </section>
    );
  }

  if (slides.length === 0) {
    // 띄울 광고가 없으면 브랜드 히어로로 폴백
    return (
      <section className="mx-auto w-[95%] md:max-w-[100rem]">
        <Link
          href="/meetup/create"
          className="from-primary to-primary/70 group relative flex h-[22rem] w-full flex-col justify-center overflow-hidden rounded-[1.6rem] bg-gradient-to-br p-[2rem] md:h-[32rem] md:p-[3rem] lg:h-[34rem]"
        >
          <div className="bg-accent/30 absolute -top-[20%] -right-[10%] h-[60%] w-[40%] rounded-full blur-3xl" />
          <span className="bg-accent text-accent-foreground relative inline-block w-fit rounded-full px-[0.9rem] py-[0.3rem] text-xs font-semibold">Placeholder</span>
          <h2 className="text-primary-foreground relative mt-3 text-xl leading-tight font-bold md:text-3xl">
            함께할 사람을 찾고 있나요?
            <br />
            지금 모임을 만들어보세요
          </h2>
          <span className="text-primary-foreground/90 relative mt-3 inline-flex items-center gap-1 text-sm font-medium">
            모임 만들기
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </span>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto flex w-[95%] items-center gap-[1.2rem] md:max-w-[106rem]">
      {slides.length > 1 && (
        <button
          type="button"
          aria-label="이전 광고"
          onClick={goPrev}
          className="bg-card text-foreground hover:bg-muted border-border hidden h-[4rem] w-[4rem] shrink-0 items-center justify-center rounded-full border shadow-sm transition-colors md:flex"
        >
          <LuChevronLeft className="h-[2rem] w-[2rem]" />
        </button>
      )}
      <div className="bg-muted relative h-[22rem] w-full flex-1 overflow-hidden rounded-[1.6rem] md:h-[32rem] lg:h-[34rem]">
        {slides.map((slide, i) => (
          <Link
            key={slide.id}
            href={`/ad/${slide.id}`}
            aria-hidden={i !== index}
            className={`group absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Image src={getImageURL(slide.image ?? null)} alt={slide.adTitle} fill priority={i === 0} sizes="(max-width: 768px) 95vw, 100rem" className="object-cover" />
            <div className="from-foreground/85 via-foreground/35 absolute inset-0 bg-gradient-to-t to-transparent" />
            <div className="from-foreground/55 absolute inset-0 bg-gradient-to-r to-transparent" />
            <div className="text-background absolute right-[1.6rem] bottom-[1.6rem] left-[1.6rem] md:right-[2.8rem] md:bottom-[2.6rem] md:left-[2.8rem]">
              <div className="flex flex-wrap items-center gap-[0.5rem]">
                {slide.category && <CategoryBadge category={slide.category} variant="solid" className="shadow-sm" />}
                {(() => {
                  const dday = getDday(slide.adEndedAt);
                  if (!dday || dday === "마감") return null;
                  // D-DAY ~ D-3 임박: 빨간색 강조
                  const isUrgent = dday === "D-DAY" || /^D-[0-3]$/.test(dday);
                  return (
                    <span
                      className={`inline-block rounded-full px-[0.7rem] py-[0.2rem] text-xs font-semibold backdrop-blur ${isUrgent ? "bg-red-500/90 text-white" : "bg-background/20 text-background"}`}
                    >
                      {dday}
                    </span>
                  );
                })()}
              </div>
              <h2 className="mt-[1.1rem] line-clamp-2 text-2xl leading-tight font-bold break-keep md:mt-[1.4rem] md:text-4xl">{slide.adTitle}</h2>
              {slide.description && <p className="text-background/80 mt-[0.9rem] line-clamp-2 max-w-2xl text-sm break-keep md:text-base">{slide.description}</p>}
              <span className="mt-[1.4rem] inline-flex items-center gap-[0.4rem] text-sm font-semibold md:mt-[1.6rem]">
                자세히 보기
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </div>
          </Link>
        ))}

        {/* 인디케이터 */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-[0.5rem]">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`${i + 1}번째 광고 보기`}
                onClick={() => {
                  restartProgress();
                  setIndex(i);
                }}
                className={`relative h-[0.6rem] overflow-hidden rounded-full transition-all ${i === index ? "bg-background/35 w-[1.8rem]" : "bg-background/50 w-[0.6rem]"}`}
              >
                {i === index && <span className="bg-background absolute inset-y-0 left-0 rounded-full" style={{ width: `${progress}%` }} />}
              </button>
            ))}
          </div>
        )}
      </div>
      {slides.length > 1 && (
        <button
          type="button"
          aria-label="다음 광고"
          onClick={goNext}
          className="bg-card text-foreground hover:bg-muted border-border hidden h-[4rem] w-[4rem] shrink-0 items-center justify-center rounded-full border shadow-sm transition-colors md:flex"
        >
          <LuChevronRight className="h-[2rem] w-[2rem]" />
        </button>
      )}
    </section>
  );
};

export default ThumbnailCarousel;
