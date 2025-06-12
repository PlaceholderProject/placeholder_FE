"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSchedules } from "@/hooks/useSchedule";
import { Schedule } from "@/types/scheduleType";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ScheduleNumber from "@/components/schedule/ScheduleNumber";
import { MapProps, MarkerClustererProps } from "react-kakao-maps-sdk";

// 서버 사이드 렌더링 방지를 위한 dynamic import
const DynamicMap = dynamic<MapProps>(() => import("react-kakao-maps-sdk").then(mod => mod.Map), { ssr: false });

const DynamicMarkerClusterer = dynamic<MarkerClustererProps>(() => import("react-kakao-maps-sdk").then(mod => mod.MarkerClusterer), { ssr: false });

// 카카오맵 스크립트 로딩 훅
const useKakaoMapScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // 이미 로드된 경우 처리
    if (typeof window !== "undefined" && window.kakao?.maps) {
      setIsLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&libraries=services,clusterer&autoload=false`;
    script.async = true;

    script.onload = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => {
          setIsLoaded(true);
        });
      }
    };

    script.onerror = e => {
      setError(new Error("Failed to load Kakao Maps SDK"));
      console.error("카카오맵 SDK 로드 실패:", e);
    };

    document.head.appendChild(script);

    return () => {
      if (script?.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return { isLoaded, error };
};

// bounds 설정을 위한 컴포넌트
interface MapBoundsControllerProps {
  schedules: Schedule[];
  map: kakao.maps.Map;
}

const MapBoundsController: React.FC<MapBoundsControllerProps> = ({ schedules, map }) => {
  useEffect(() => {
    if (!map || schedules.length === 0) return;

    try {
      const bounds = new window.kakao.maps.LatLngBounds();

      schedules.forEach(({ latitude, longitude }) => {
        const lat = Number(latitude);
        const lng = Number(longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend(new window.kakao.maps.LatLng(lat, lng));
        }
      });

      map.setBounds(bounds, 50);
    } catch (error) {
      console.error("맵 바운드 설정 오류:", error);
    }
  }, [map, schedules]);

  return null;
};

// 컴포넌트 Props 타입 정의
interface KakaoMapsProps {
  meetupId: number;
}

const KakaoMaps: React.FC<KakaoMapsProps> = ({ meetupId }) => {
  const router = useRouter();
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
  const { isLoaded, error: scriptError } = useKakaoMapScript();
  const { data: schedules, isPending, error: dataError } = useSchedules(meetupId);

  // 스케줄 클릭 핸들러 최적화
  const handleScheduleClick = useCallback(
    (scheduleId: number) => {
      router.push(`/meetup/${meetupId}/schedule/${scheduleId}`);
    },
    [router, meetupId],
  );

  // 맵 인스턴스 생성 핸들러
  const handleMapCreate = useCallback((map: kakao.maps.Map) => {
    setMapInstance(map);
  }, []);

  // 로딩 상태 표시
  if (!isLoaded) {
    return <div className="flex h-[400px] items-center justify-center bg-gray-100">카카오맵 SDK 로딩 중...</div>;
  }

  if (scriptError) {
    return <div className="flex h-[400px] items-center justify-center bg-red-100">카카오맵 SDK 로드 오류: {scriptError.message}</div>;
  }

  if (isPending) {
    return <div className="flex h-[400px] items-center justify-center bg-gray-100">일정 데이터 로딩 중...</div>;
  }

  if (dataError) {
    return <div className="flex h-[400px] items-center justify-center bg-red-100">데이터 오류: {dataError.message}</div>;
  }

  // 스케줄이 없는 경우
  if (!schedules?.length) {
    return <div className="flex h-[400px] items-center justify-center bg-gray-100">표시할 일정이 없습니다</div>;
  }

  // 기본 위치 설정 (첫 번째 일정 위치 또는 기본값)
  const center = {
    lat: Number(schedules[0]?.latitude) || 37.5665,
    lng: Number(schedules[0]?.longitude) || 126.978,
  };

  const CLUSTER_THRESHOLD = 5;

  return (
    <DynamicMap center={center} style={{ width: "100%", height: "400px" }} level={5} onCreate={handleMapCreate}>
      {mapInstance && <MapBoundsController schedules={schedules} map={mapInstance} />}

      {/* 스케줄 수에 따른 조건부 렌더링 */}
      {schedules.length <= CLUSTER_THRESHOLD ? (
        // 적은 수의 스케줄일 때는 클러스터링 없이 개별 마커 표시
        schedules.map((schedule, index) => (
          <ScheduleNumber
            key={schedule.id}
            number={index + 1}
            isMapMarker={true}
            position={{
              lat: Number(schedule.latitude),
              lng: Number(schedule.longitude),
            }}
            onClick={() => handleScheduleClick(schedule.id)}
            label={schedule.place}
          />
        ))
      ) : (
        // 많은 수의 스케줄일 때는 클러스터링 적용
        <DynamicMarkerClusterer averageCenter minLevel={8}>
          {schedules.map((schedule, index) => (
            <ScheduleNumber
              key={schedule.id}
              number={index + 1}
              isMapMarker={true}
              position={{
                lat: Number(schedule.latitude),
                lng: Number(schedule.longitude),
              }}
              onClick={() => handleScheduleClick(schedule.id)}
            />
          ))}
        </DynamicMarkerClusterer>
      )}
    </DynamicMap>
  );
};

export default KakaoMaps;
