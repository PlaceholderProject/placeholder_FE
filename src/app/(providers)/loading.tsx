"use client";

import { MoonLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-15rem)] flex-col items-center justify-center gap-[1rem]" role="status" aria-live="polite">
      <span className="bg-primary-soft grid h-[5.6rem] w-[5.6rem] place-items-center rounded-[1.8rem]">
        <MoonLoader color="#6C4DFF" size={26} speedMultiplier={0.85} />
      </span>
      <p className="text-muted-foreground text-sm font-semibold">페이지를 불러오고 있어요</p>
    </div>
  );
}
