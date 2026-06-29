"use client";

import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { getHeadhuntingsApi } from "@/services/thumbnails.service";
import { getImageURL } from "@/utils/getImageURL";
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

  // 자동 전환
  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, AUTO_INTERVAL);
    return () => clearInterval(timer);
  }, [slides.length]);

  // 슬라이드 수 변동 시 인덱스 보정
  useEffect(() => {
    setIndex(0);
  }, [slides.length]);

  // 로딩 중엔 아무것도 안 띄움 (히어로 깜빡임 방지)
  if (isLoading) return null;

  if (slides.length === 0) {
    // 띄울 광고가 없으면 브랜드 히어로로 폴백
    return (
      <section className="mx-auto mt-[1rem] w-[95%] md:max-w-[80rem]">
        <Link
          href="/meetup/create"
          className="from-primary to-primary/70 group relative flex aspect-[16/9] w-full flex-col justify-center overflow-hidden rounded-[1.6rem] bg-gradient-to-br p-[2rem] md:aspect-[21/9] md:p-[3rem]"
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
    <section className="mx-auto mt-[1rem] w-[95%] md:max-w-[80rem]">
      <div className="bg-muted relative aspect-[16/9] w-full overflow-hidden rounded-[1.6rem] md:aspect-[21/9]">
        {slides.map((slide, i) => (
          <Link
            key={slide.id}
            href={`/ad/${slide.id}`}
            aria-hidden={i !== index}
            className={`absolute inset-0 transition-opacity duration-700 ${i === index ? "opacity-100" : "pointer-events-none opacity-0"}`}
          >
            <Image src={getImageURL(slide.image ?? null)} alt={slide.adTitle} fill priority={i === 0} sizes="(max-width: 768px) 95vw, 80rem" className="object-cover" />
            <div className="from-foreground/80 via-foreground/30 absolute inset-0 bg-gradient-to-t to-transparent" />
            <div className="text-background absolute right-5 bottom-5 left-5">
              <span className="bg-accent text-accent-foreground inline-block rounded-full px-[0.9rem] py-[0.3rem] text-xs font-semibold">광고</span>
              <h2 className="mt-2 line-clamp-2 text-xl leading-tight font-bold md:text-3xl">{slide.adTitle}</h2>
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
                onClick={() => setIndex(i)}
                className={`h-[0.6rem] rounded-full transition-all ${i === index ? "bg-background w-[1.8rem]" : "bg-background/50 w-[0.6rem]"}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ThumbnailCarousel;
