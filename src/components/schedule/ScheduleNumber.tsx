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
}

const ScheduleNumber: React.FC<ScheduleNumberProps> = ({
                                                         number,
                                                         isMapMarker = false,
                                                         position,
                                                         onClick,
                                                       }) => {
  // 기본 스타일의 숫자 원형 컴포넌트
  const NumberCircle = (
    <div
      className="mr-4 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer"
      onClick={onClick}
    >
      {number}
    </div>
  );

  // 맵 마커로 사용될 때
  if (isMapMarker && position) {
    return (
      <CustomOverlayMap
        position={position}
        xAnchor={0.5}
        yAnchor={0.5}
      >
      
        <div
          className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center cursor-pointer"
          onClick={onClick}
        >
          {number}
        </div>
      </CustomOverlayMap>
    );
  }

  // 일반적인 용도로 사용될 때
  return NumberCircle;
};

export default ScheduleNumber;