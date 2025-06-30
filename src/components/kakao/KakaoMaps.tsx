"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSchedules } from "@/hooks/useSchedule";
import { Schedule } from "@/types/scheduleType";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ScheduleNumber from "@/components/schedule/ScheduleNumber";
import { MapProps, MarkerClustererProps } from "react-kakao-maps-sdk";

// ... (dynamic import, useKakaoMapScript, MapBoundsController 등 다른 코드는 동일)
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

interface KakaoMapsProps {
  meetupId: number;
}

const KakaoMaps: React.FC<KakaoMapsProps> = ({ meetupId }) => {
  const router = useRouter();
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
  const { isLoaded, error: scriptError } = useKakaoMapScript();
  const { data: schedules, isPending, error: dataError } = useSchedules(meetupId);

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

  if (!isLoaded || isPending) {
    return <div className="flex h-full w-full items-center justify-center bg-gray-100">로딩 중...</div>;
  }

  if (scriptError || dataError) {
    return <div className="flex h-full w-full items-center justify-center bg-red-100">오류 발생</div>;
  }

  if (!schedules?.length) {
    return <div className="flex h-full w-full items-center justify-center bg-gray-100">표시할 일정이 없습니다</div>;
  }

  const center = {
    lat: Number(schedules[0]?.latitude) || 37.5665,
    lng: Number(schedules[0]?.longitude) || 126.978,
  };

  const CLUSTER_THRESHOLD = 5;

  return (
    <DynamicMap center={center} style={{ width: "100%", height: "100%" }} level={5} onCreate={handleMapCreate}>
      {mapInstance && <MapBoundsController schedules={schedules} map={mapInstance} />}

      {schedules.length <= CLUSTER_THRESHOLD ? (
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
