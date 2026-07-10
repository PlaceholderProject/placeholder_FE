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
    <div className="border-primary text-primary mr-4 flex h-10 w-10 items-center justify-center rounded-full border-4 font-bold" onClick={onClick}>
      {number}
    </div>
  );

  // 맵 마커로 사용될 때
  if (isMapMarker && position) {
    return (
      <CustomOverlayMap position={position} xAnchor={0.5} yAnchor={1}>
        <div className="flex flex-col items-center">
          {label && <div className="bg-primary mb-1 inline-block px-2 py-0.5 text-sm font-bold text-white">{label}</div>}
          <div className="border-primary text-primary flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-4 bg-white text-sm font-bold shadow-lg" onClick={onClick}>
            {number}
          </div>
          <div className="border-t-primary h-0 w-0 border-t-4 border-r-2 border-l-2 border-r-transparent border-l-transparent"></div>
        </div>
      </CustomOverlayMap>
    );
  }

  // 일반적인 용도로 사용될 때
  return NumberCircle;
};

export default ScheduleNumber;
