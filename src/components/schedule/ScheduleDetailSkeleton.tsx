import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ScheduleDetailSkeleton = () => {
  return (
    <div className="flex flex-col items-center space-y-[1.6rem] p-[1.6rem]">
      <div className="w-full rounded-md p-[1.6rem]">
        {/* Header */}
        <div className="mb-[1.6rem] flex items-center justify-between">
          <div className="flex items-center">
            {/* Schedule Number */}
            <div className="mr-[1.2rem]">
              <Skeleton circle height="4rem" width="4rem" />
            </div>
            <div>
              <Skeleton height="1.4rem" width="12rem" style={{ marginBottom: "0.4rem" }} />
              <Skeleton height="2rem" width="8rem" style={{ marginBottom: "0.4rem" }} />
              <Skeleton height="1.4rem" width="16rem" />
            </div>
          </div>
        </div>

        {/* Image Area */}
        <div className="flex w-full flex-col items-center justify-center">
          <div className="w-full max-w-[40rem]">
            <div className="aspect-square overflow-hidden rounded-md">
              <Skeleton height="100%" width="100%" style={{ borderRadius: "0.375rem" }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-[1.6rem] flex w-full items-center justify-between">
          {/* Attendee */}
          <div className="flex items-center gap-[0.8rem]">
            <Skeleton circle height="3.2rem" width="3.2rem" />
            <Skeleton height="1.6rem" width="6rem" />
          </div>

          {/* Button */}
          <Skeleton height="3.2rem" width="8rem" style={{ borderRadius: "0.375rem" }} />
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailSkeleton;
