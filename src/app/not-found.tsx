import Link from "next/link";
import { LuCompass, LuMapPinOff, LuSearch } from "react-icons/lu";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-16rem)] w-[calc(100%-3.2rem)] max-w-[72rem] items-center justify-center py-[5rem]">
      <section className="border-border bg-card surface-shadow relative w-full overflow-hidden rounded-[2.8rem] border px-[2rem] py-[5rem] text-center md:px-[4rem] md:py-[6rem]">
        <span className="text-primary/5 pointer-events-none absolute -top-[4rem] left-1/2 -translate-x-1/2 text-[18rem] leading-none font-black tracking-[-0.08em] select-none">404</span>

        <div className="relative">
          <span className="bg-primary-soft text-primary mx-auto grid h-[6rem] w-[6rem] place-items-center rounded-[2rem]">
            <LuMapPinOff className="h-[2.8rem] w-[2.8rem] stroke-[1.8]" />
          </span>
          <p className="text-primary mt-[1.5rem] text-xs font-black">PAGE NOT FOUND</p>
          <h1 className="text-foreground mt-[0.45rem] text-[2.8rem] leading-tight font-black tracking-[-0.04em] md:text-[3.6rem]">이 페이지는 찾을 수 없어요</h1>
          <p className="text-muted-foreground mx-auto mt-[1rem] max-w-[38rem] text-sm leading-relaxed break-keep md:text-base">
            주소가 변경되었거나 페이지가 사라졌을 수 있어요. 다른 모임을 둘러보거나 원하는 모임을 검색해보세요.
          </p>

          <div className="mx-auto mt-[2.2rem] grid max-w-[34rem] grid-cols-2 gap-[0.8rem]">
            <Link
              href="/"
              className="bg-primary text-primary-foreground hover:bg-primary-hover inline-flex h-[4.6rem] items-center justify-center gap-[0.55rem] rounded-[1.4rem] text-sm font-black transition-colors"
            >
              <LuCompass className="h-[1.7rem] w-[1.7rem]" />
              둘러보기
            </Link>
            <Link
              href="/search"
              className="border-border text-muted-foreground hover:border-primary/30 hover:text-primary inline-flex h-[4.6rem] items-center justify-center gap-[0.55rem] rounded-[1.4rem] border text-sm font-bold transition-colors"
            >
              <LuSearch className="h-[1.7rem] w-[1.7rem]" />
              검색하기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
