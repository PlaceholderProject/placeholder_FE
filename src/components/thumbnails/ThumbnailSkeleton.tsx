import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ThumbnailSkeleton = () => {
  return (
    <div className="my-[1rem] w-full">
      <Skeleton height="14.2rem" width="100%" style={{ borderRadius: "2rem" }} />

      <div className="mt-[1rem]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[0.4rem]">
            <Skeleton circle height="1.8rem" width="1.8rem" />
            <Skeleton height="1.2rem" width="6rem" />
          </div>
          <Skeleton height="1.5rem" width="3rem" />
        </div>

        <div className="mt-[0.8rem]">
          <Skeleton count={2} height="1.6rem" style={{ marginBottom: "0.4rem" }} />
        </div>

        <div className="mt-[0.8rem]">
          <Skeleton height="1.4rem" width="80%" />
        </div>
      </div>
    </div>
  );
};

export default ThumbnailSkeleton;
