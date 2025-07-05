import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const AdAreaSkeleton = () => {
  return (
    <div className="mx-auto w-[34rem]">
      <div className="space-y-[1rem]">
        {/* AdSignboard Skeleton */}
        <div className="mx-auto mt-[2rem] w-[32.1rem] space-y-[0.5rem]">
          <Skeleton height="2.8rem" width="75%" />
          <div className="flex justify-end">
            <Skeleton height="1.4rem" width="10rem" />
          </div>
        </div>

        {/* AdOrganizer Skeleton */}
        <div className="mx-auto flex w-[32.1rem] items-center justify-between border-t-[0.1rem] border-gray-300 py-[0.8rem]">
          <div className="flex items-center gap-[0.8rem]">
            <Skeleton circle height="3rem" width="3rem" />
            <Skeleton height="1.8rem" width="6rem" />
          </div>
          <div className="flex items-center gap-[0.4rem]">
            <Skeleton height="2rem" width="2rem" />
            <Skeleton height="1.6rem" width="2rem" />
          </div>
        </div>

        {/* AdDetail Skeleton */}
        <div className="space-y-[0.8rem]">
          {/* Image */}
          <div className="mx-auto w-[32.1rem]">
            <Skeleton height="28rem" style={{ borderRadius: "0.5rem" }} />
          </div>

          {/* Content */}
          <div className="mx-auto w-[32.1rem] px-[1.5rem] py-[2rem]">
            <div className="grid grid-cols-[25%_75%] gap-y-[1.2rem]">
              {/* 모임이름 */}
              <Skeleton height="1.8rem" width="5rem" />
              <div className="flex items-center justify-between">
                <Skeleton height="1.8rem" width="12rem" />
                <Skeleton height="1.6rem" width="1.6rem" />
              </div>

              {/* 모임장소 */}
              <Skeleton height="1.8rem" width="5rem" />
              <Skeleton height="1.8rem" width="16rem" />

              {/* 모임날짜 */}
              <Skeleton height="1.8rem" width="5rem" />
              <div className="flex items-center gap-[0.8rem]">
                <Skeleton height="3.2rem" width="6.4rem" style={{ borderRadius: "0.5rem" }} />
                <span className="text-gray-400">~</span>
                <Skeleton height="3.2rem" width="9.6rem" style={{ borderRadius: "0.5rem" }} />
                <Skeleton height="1.8rem" width="3rem" />
              </div>
            </div>

            {/* Description */}
            <div className="pt-[2rem]">
              <Skeleton count={3} height="1.8rem" style={{ marginBottom: "0.5rem" }} />
              <Skeleton height="1.8rem" width="60%" />
            </div>
          </div>
        </div>

        {/* AdButton Skeleton */}
        <div className="mx-auto w-[32.1rem] pb-[2rem]">
          <Skeleton height="5.6rem" style={{ borderRadius: "0.5rem" }} />
        </div>
      </div>
    </div>
  );
};

export default AdAreaSkeleton;
