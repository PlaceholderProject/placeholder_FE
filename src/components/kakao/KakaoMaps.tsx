"use client";

import React, { useEffect, useState } from "react";
import { useSchedules } from "@/hooks/useSchedule";
import { Schedule } from "@/types/scheduleType";
import dynamic from "next/dynamic";

// 서버 사이드 렌더링 방지를 위한 dynamic import
const DynamicMap = dynamic(
  () => import("react-kakao-maps-sdk").then((mod) => mod.Map),
  { ssr: false },
);

const DynamicMapMarker = dynamic(
  () => import("react-kakao-maps-sdk").then((mod) => mod.MapMarker),
  { ssr: false },
);

const DynamicMarkerCluster = dynamic(
  () => import("react-kakao-maps-sdk").then((mod) => mod.MarkerClusterer),
  { ssr: false },
);

// 카카오맵 스크립트 로딩 상태 추적
const useKakaoMapScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 이미 로드된 경우 처리
    if (window.kakao && window.kakao.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&libraries=services,clusterer&autoload=false`;
    script.async = true;

    script.onload = () => {
      window.kakao.maps.load(() => {
        setIsLoaded(true);
      });
    };

    script.onerror = (e) => {
      setError(new Error("Failed to load Kakao Maps SDK"));
      console.error("카카오맵 SDK 로드 실패:", e);
    };

    document.head.appendChild(script);

    return () => {
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return { isLoaded, error };
};

// bounds 설정을 위한 컴포넌트
const MapBoundsController = ({ schedules, map }: { schedules: Schedule[]; map: any }) => {
  useEffect(() => {
    if (!map || !schedules || schedules.length === 0) return;

    try {
      // 모든 마커 계산하여 bounds 설정
      const bounds = new window.kakao.maps.LatLngBounds();
      schedules.forEach(schedule => {
        const lat = Number(schedule.latitude);
        const lng = Number(schedule.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend(new window.kakao.maps.LatLng(lat, lng));
        }
      });

      // 지도 범위 설정
      map.setBounds(bounds, 50);
    } catch (error) {
      console.error("맵 바운드 설정 오류:", error);
    }
  }, [map, schedules]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

const KakaoMaps = ({ meetupId }: { meetupId: number }) => {
  const [mapInstance, setMapInstance] = useState<any>(null);
  const { isLoaded, error: scriptError } = useKakaoMapScript();
  const { data: schedules, isPending, error: dataError } = useSchedules(meetupId);

  // 로딩 상태 표시
  if (!isLoaded) return <div className="h-[400px] flex items-center justify-center bg-gray-100">카카오맵 SDK 로딩 중...</div>;
  if (scriptError) return <div className="h-[400px] flex items-center justify-center bg-red-100">카카오맵 SDK 로드
    오류: {scriptError.message}</div>;
  if (isPending) return <div className="h-[400px] flex items-center justify-center bg-gray-100">일정 데이터 로딩 중...</div>;
  if (dataError) return <div className="h-[400px] flex items-center justify-center bg-red-100">데이터
    오류: {dataError.message}</div>;

  // 스케줄이 없는 경우
  if (!schedules || schedules.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center bg-gray-100">
        표시할 일정이 없습니다
      </div>
    );
  }

  // 기본 위치 설정 (첫 번째 일정 위치 또는 기본값)
  const center = {
    lat: Number(schedules[0]?.latitude) || 37.5665,
    lng: Number(schedules[0]?.longitude) || 126.978,
  };

  return (
    <DynamicMap
      center={center}
      style={{ width: "100%", height: "400px" }}
      level={5}
      onCreate={setMapInstance}
    >
      {mapInstance && <MapBoundsController schedules={schedules} map={mapInstance} />}

      <DynamicMarkerCluster averageCenter minLevel={8}>
        {schedules.map(schedule => (
          <DynamicMapMarker
            key={schedule.id}
            position={{
              lat: Number(schedule.latitude),
              lng: Number(schedule.longitude),
            }}
          >
            <div style={{ padding: "5px", whiteSpace: "nowrap" }}>
              {schedule.place}
            </div>
          </DynamicMapMarker>
        ))}
      </DynamicMarkerCluster>
    </DynamicMap>
  );
};

export default KakaoMaps;