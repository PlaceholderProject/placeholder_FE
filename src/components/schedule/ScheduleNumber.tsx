"use client";

import React from "react";
import { CustomOverlayMap } from "react-kakao-maps-sdk";

interface ScheduleNumberProps {
  number: number;
  isMapMarker?: boolean;
  position?: {
    lat: number;
    lng: number;
  };
  onClick?: () => void;
  label?: string;
}

const ScheduleNumber: React.FC<ScheduleNumberProps> = ({ number, isMapMarker = false, position, onClick, label }) => {
  const NumberCircle = (
    <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#006B8B] text-sm font-bold text-[#006B8B]" onClick={onClick}>
      {number}
    </div>
  );

  // 맵 마커로 사용될 때
  if (isMapMarker && position) {
    return (
      <CustomOverlayMap position={position} xAnchor={0.5} yAnchor={1}>
        <div className="flex flex-col items-center">
          {label && <div className="mb-1 max-w-[120px] truncate whitespace-nowrap rounded-md border bg-white px-2 py-1 text-xs font-medium text-gray-800 shadow-md">{label}</div>}
          <div className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 border-[#006B8B] bg-white text-sm font-bold text-[#006B8B] shadow-lg" onClick={onClick}>
            {number}
          </div>
          <div className="h-0 w-0 border-l-2 border-r-2 border-t-4 border-l-transparent border-r-transparent border-t-[#006B8B]"></div>
        </div>
      </CustomOverlayMap>
    );
  }

  // 일반적인 용도로 사용될 때
  return NumberCircle;
};

export default ScheduleNumber;
