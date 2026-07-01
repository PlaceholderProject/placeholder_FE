import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ScheduleDetailSkeleton = () => {
  return (
    <div className="py-[2.4rem] md:py-[3.2rem]">
      <div className="mx-auto max-w-[82rem] space-y-[1.8rem]">
        <Skeleton height="2rem" width="8rem" borderRadius="999px" />

        <article className="border-border bg-card overflow-hidden rounded-[2rem] border">
          <header className="p-[1.8rem] pb-[1.3rem] md:p-[2rem] md:pb-[1.5rem]">
            <div className="mb-[1rem] flex items-center gap-[0.8rem]">
              <Skeleton circle height="3.4rem" width="3.4rem" />
              <Skeleton height="2.6rem" width="22rem" borderRadius="999px" />
            </div>
            <Skeleton height="3rem" width="48%" borderRadius="1rem" />
            <Skeleton height="1.6rem" width="68%" borderRadius="1rem" className="mt-[0.8rem]" />
          </header>

          <div className="px-[1.2rem] md:px-[1.6rem]">
            <Skeleton height="46rem" borderRadius="1.8rem" />
          </div>

          <div className="p-[1.8rem] md:p-[2rem]">
            <Skeleton height="1.7rem" width="100%" borderRadius="999px" />
            <Skeleton height="1.7rem" width="74%" borderRadius="999px" className="mt-[0.8rem]" />
          </div>
        </article>

        <section className="border-border bg-card overflow-hidden rounded-[2rem] border">
          <div className="flex items-center justify-between gap-[1rem] p-[1.5rem] pb-[1rem]">
            <div>
              <Skeleton height="1.7rem" width="8rem" borderRadius="999px" />
              <Skeleton height="1.3rem" width="24rem" borderRadius="999px" className="mt-[0.5rem]" />
            </div>
            <Skeleton height="4rem" width="4rem" borderRadius="1.2rem" />
          </div>
          <Skeleton height="26rem" borderRadius="0" />
        </section>
      </div>
    </div>
  );
};

export default ScheduleDetailSkeleton;
