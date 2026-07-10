"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ThumbnailItemSkeleton = () => (
  <article className="border-border bg-card flex flex-col overflow-hidden rounded-[2.2rem] border">
    <Skeleton className="aspect-[16/10] w-full" borderRadius={0} style={{ display: "block" }} />
    <div className="flex flex-1 flex-col gap-[0.8rem] p-[1.6rem]">
      <Skeleton count={2} height={14} style={{ marginBottom: "0.2rem" }} />
      <Skeleton height={12} width="70%" />
      <Skeleton height={12} width="90%" />
      <div className="border-border mt-[0.4rem] flex items-center justify-between border-t pt-[0.8rem]">
        <div className="flex items-center gap-[0.4rem]">
          <Skeleton circle height={20} width={20} />
          <Skeleton height={12} width={50} />
        </div>
        <Skeleton height={15} width={30} />
      </div>
    </div>
  </article>
);

export default ThumbnailItemSkeleton;
