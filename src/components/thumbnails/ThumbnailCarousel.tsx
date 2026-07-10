"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { getHeadhuntingsApi } from "@/services/thumbnails.service";
import { getImageURL } from "@/utils/getImageURL";
import { getDday } from "@/utils/getDday";
import CategoryBadge from "@/components/common/CategoryBadge";
import { LuArrowUpRight, LuChevronLeft, LuChevronRight, LuSparkles } from "react-icons/lu";
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
      <section className="mx-auto w-[calc(100%-3.2rem)] md:max-w-[112rem]">
        <div className="bg-muted relative h-[28rem] w-full animate-pulse overflow-hidden rounded-[2.4rem] md:h-[42rem]" />
      </section>
    );
  }

  if (slides.length === 0) {
    // 띄울 광고가 없으면 브랜드 히어로로 폴백
    return (
      <section className="mx-auto w-[calc(100%-3.2rem)] md:max-w-[112rem]">
        <Link
          href="/meetup/create"
          className="from-primary via-primary group surface-shadow relative flex h-[28rem] w-full flex-col justify-center overflow-hidden rounded-[2.4rem] bg-gradient-to-br to-[#8C6FFF] p-[2.4rem] md:h-[42rem] md:p-[4rem]"
        >
          <div className="bg-accent/80 absolute -top-[24%] -right-[5%] h-[80%] w-[38%] rotate-12 rounded-[6rem] blur-[0.2rem]" />
          <div className="absolute right-[8%] -bottom-[38%] h-[78%] w-[34%] rounded-full border-[2.4rem] border-white/10" />
          <span className="bg-accent text-accent-foreground relative inline-flex w-fit items-center gap-[0.5rem] rounded-full px-[1rem] py-[0.45rem] text-xs font-black">
            <LuSparkles /> THIS WEEK
          </span>
          <h2 className="text-primary-foreground relative mt-[1.6rem] text-[2.8rem] leading-[1.08] font-black tracking-[-0.055em] md:text-[5rem]">
            취향은 달라도,
            <br />
            함께라서 더 재밌게.
          </h2>
          <span className="text-primary-foreground relative mt-[2rem] inline-flex w-fit items-center gap-[0.6rem] text-sm font-bold">
            첫 모임 만들기
            <LuArrowUpRight className="transition-transform group-hover:translate-x-[0.2rem] group-hover:-translate-y-[0.2rem]" />
          </span>
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-[calc(100%-3.2rem)] md:max-w-[112rem]">
      <div className="surface-shadow bg-muted relative h-[28rem] w-full overflow-hidden rounded-[2.4rem] md:h-[42rem] md:rounded-[3rem]">
        {slides.map((slide, i) => (
          <Link
            key={slide.id}
            href={`/ad/${slide.id}`}
            aria-hidden={i !== index}
            className={`group absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Image
              src={getImageURL(slide.image ?? null)}
              alt={slide.adTitle}
              fill
              priority={i === 0}
              sizes="(max-width: 768px) calc(100vw - 3.2rem), 112rem"
              className="object-cover transition-transform duration-[1.2s] group-hover:scale-[1.025]"
            />
            <div className="from-foreground/90 via-foreground/35 absolute inset-0 bg-gradient-to-t to-transparent" />
            <div className="from-foreground/55 absolute inset-0 bg-gradient-to-r to-transparent" />
            <div className="absolute top-[1.6rem] left-[1.6rem] md:top-[2.6rem] md:left-[2.8rem]">
              <span className="bg-accent text-accent-foreground inline-flex items-center gap-[0.5rem] rounded-full px-[1rem] py-[0.45rem] text-xs font-black tracking-[0.08em]">
                <LuSparkles className="h-[1.3rem] w-[1.3rem]" />
                WEEKLY PICK
              </span>
            </div>
            <div className="text-background absolute right-[1.8rem] bottom-[2.2rem] left-[1.8rem] md:right-[4rem] md:bottom-[4rem] md:left-[4rem]">
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
              <h2 className="mt-[1.2rem] line-clamp-2 max-w-[72rem] text-[2.7rem] leading-[1.08] font-black tracking-[-0.05em] break-keep md:mt-[1.6rem] md:text-[5rem]">{slide.adTitle}</h2>
              {slide.description && <p className="text-background/78 mt-[1rem] line-clamp-2 max-w-[60rem] text-sm leading-relaxed break-keep md:mt-[1.2rem] md:text-base">{slide.description}</p>}
              <span className="mt-[1.6rem] inline-flex items-center gap-[0.5rem] text-sm font-bold md:mt-[2rem]">
                모임 둘러보기
                <LuArrowUpRight className="h-[1.6rem] w-[1.6rem] transition-transform group-hover:translate-x-[0.2rem] group-hover:-translate-y-[0.2rem]" />
              </span>
            </div>
          </Link>
        ))}

        {/* 인디케이터 */}
        {slides.length > 1 && (
          <div className="absolute right-[1.8rem] bottom-[1.8rem] z-10 flex gap-[0.5rem] md:right-[3rem] md:bottom-[3rem]">
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
        {slides.length > 1 && (
          <div className="absolute top-[1.6rem] right-[1.6rem] z-20 hidden gap-[0.6rem] md:top-[2.6rem] md:right-[2.8rem] md:flex">
            <button
              type="button"
              aria-label="이전 광고"
              onClick={goPrev}
              className="bg-background/16 text-background hover:bg-background/28 grid h-[4rem] w-[4rem] place-items-center rounded-full border border-white/25 backdrop-blur-md transition-colors"
            >
              <LuChevronLeft className="h-[2rem] w-[2rem]" />
            </button>
            <button
              type="button"
              aria-label="다음 광고"
              onClick={goNext}
              className="bg-background/16 text-background hover:bg-background/28 grid h-[4rem] w-[4rem] place-items-center rounded-full border border-white/25 backdrop-blur-md transition-colors"
            >
              <LuChevronRight className="h-[2rem] w-[2rem]" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ThumbnailCarousel;
