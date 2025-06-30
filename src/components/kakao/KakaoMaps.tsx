"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSchedules } from "@/hooks/useSchedule";
import { Schedule } from "@/types/scheduleType";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import ScheduleNumber from "@/components/schedule/ScheduleNumber";
import { MapMarker, MapProps, MarkerClustererProps } from "react-kakao-maps-sdk";

interface CurrentLocation {
  lat: number;
  lng: number;
}

const DynamicMap = dynamic<MapProps>(() => import("react-kakao-maps-sdk").then(mod => mod.Map), { ssr: false });
const DynamicMarkerClusterer = dynamic<MarkerClustererProps>(() => import("react-kakao-maps-sdk").then(mod => mod.MarkerClusterer), { ssr: false });

const useKakaoMapScript = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && window.kakao?.maps) {
      setIsLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&libraries=services,clusterer&autoload=false`;
    script.async = true;
    script.onload = () => {
      if (window.kakao?.maps) {
        window.kakao.maps.load(() => setIsLoaded(true));
      }
    };
    document.head.appendChild(script);
  }, []);
  return isLoaded;
};

const MapBoundsController: React.FC<{ schedules: Schedule[]; map: kakao.maps.Map }> = ({ schedules, map }) => {
  useEffect(() => {
    if (!map || schedules.length === 0) return;
    const bounds = new window.kakao.maps.LatLngBounds();
    schedules.forEach(({ latitude, longitude }) => {
      bounds.extend(new window.kakao.maps.LatLng(Number(latitude), Number(longitude)));
    });
    if (!bounds.isEmpty()) map.setBounds(bounds);
  }, [map, schedules]);
  return null;
};

const KakaoMaps: React.FC<{ meetupId: number }> = ({ meetupId }) => {
  const router = useRouter();
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
  const isScriptLoaded = useKakaoMapScript();
  const { data: schedules, isPending, error: dataError } = useSchedules(meetupId);

  const [currentLocation, setCurrentLocation] = useState<CurrentLocation | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (isScriptLoaded && kakao.maps.services && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setLocationError("위치 정보를 가져오는 데 실패했습니다.");
          // 위치 정보 실패 시 기본 위치(서울 시청)로 설정
          setCurrentLocation({ lat: 37.5665, lng: 126.978 });
        },
      );
    }
  }, [isScriptLoaded]);

  const handleScheduleClick = useCallback(
    (scheduleId: number) => {
      router.push(`/meetup/${meetupId}/schedule/${scheduleId}`);
    },
    [router, meetupId],
  );

  const handleMapCreate = useCallback((map: kakao.maps.Map) => {
    setMapInstance(map);
  }, []);

  if (!isScriptLoaded || isPending) {
    return <div className="flex h-full w-full items-center justify-center bg-gray-100">지도 로딩 중...</div>;
  }
  if (dataError) {
    return <div className="flex h-full w-full items-center justify-center bg-red-100">스케줄 정보를 가져올 수 없습니다.</div>;
  }

  const hasSchedules = schedules && schedules.length > 0;
  const mapCenter = hasSchedules
    ? {
        lat: Number(schedules[0].latitude),
        lng: Number(schedules[0].longitude),
      }
    : currentLocation;

  if (!mapCenter) {
    return <div className="flex h-full w-full items-center justify-center bg-gray-100">{locationError || "현재 위치를 가져오는 중..."}</div>;
  }

  return (
    <DynamicMap center={mapCenter} style={{ width: "100%", height: "100%" }} level={hasSchedules ? 7 : 4} onCreate={handleMapCreate}>
      {mapInstance && hasSchedules && <MapBoundsController schedules={schedules} map={mapInstance} />}
      {hasSchedules ? (
        <DynamicMarkerClusterer averageCenter minLevel={8}>
          {schedules.map((schedule, index) => (
            <ScheduleNumber
              key={schedule.id}
              number={index + 1}
              isMapMarker
              position={{ lat: Number(schedule.latitude), lng: Number(schedule.longitude) }}
              onClick={() => handleScheduleClick(schedule.id)}
              label={schedule.place}
            />
          ))}
        </DynamicMarkerClusterer>
      ) : (
        <MapMarker position={mapCenter} />
      )}
    </DynamicMap>
  );
};

export default KakaoMaps;
