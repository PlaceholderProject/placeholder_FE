"use client";

import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ThumbnailItemSkeleton = () => (
  <div className="w-full pb-[1rem] pt-[0.4rem]">
    <Skeleton className="h-[14.2rem] w-full md:h-[150px]" borderRadius="2rem" />
    <div className="mt-[1rem] w-full space-y-[0.5rem]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-[0.4rem]">
          <Skeleton circle height={18} width={18} />
          <Skeleton height={12} width={60} />
        </div>
        <Skeleton height={15} width={30} />
      </div>

      <Skeleton count={2} height={16} style={{ marginBottom: "0.4rem" }} />

      <Skeleton height={14} width="80%" />
    </div>
  </div>
);

export default ThumbnailItemSkeleton;
