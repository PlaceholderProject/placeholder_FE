"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ThumbnailItemSkeleton = () => (
  <article className="border-border flex flex-col overflow-hidden rounded-[1.6rem] border">
    <Skeleton className="aspect-square w-full" borderRadius={0} style={{ display: "block" }} />
    <div className="flex flex-1 flex-col gap-[0.6rem] p-[1.1rem]">
      <Skeleton count={2} height={14} style={{ marginBottom: "0.2rem" }} />
      <Skeleton height={12} width="70%" />
      <div className="border-border mt-[0.4rem] flex items-center justify-between border-t pt-[0.7rem]">
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
