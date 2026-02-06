
"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { useSchedules } from "@/hooks/useSchedule";
import { Schedule } from "@/types/scheduleType";
import ScheduleNumber from "@/components/schedule/ScheduleNumber";
import Spinner from "../common/Spinner";
interface KakaoMapsProps {
  meetupId: number;
}
interface LatLng {
  lat: number;
  lng: number;
}


const KakaoMapContainer: React.FC<KakaoMapsProps> = ({ meetupId }) => {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY as string,
    libraries: ["services", "clusterer", "drawing"],
  });

  if (loading) return <div className="flex h-full w-full items-center justify-center bg-gray-100">지도 로딩 중...</div>;
  if (error) return <div className="flex h-full w-full items-center justify-center bg-red-100">지도 로딩 중 에러가 발생했습니다.</div>;

  return <KakaoMaps meetupId={meetupId} />;
};


const KakaoMaps: React.FC<KakaoMapsProps> = ({ meetupId }) => {
  const router = useRouter();
  const { data: schedules, isPending, error: dataError } = useSchedules(meetupId);

  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setLocationError("위치 정보를 가져오는 데 실패했습니다.");
          setCurrentLocation({ lat: 37.5665, lng: 126.978 });
      );
    } else {
      setLocationError("Geolocation을 지원하지 않는 브라우저입니다.");
      setCurrentLocation({ lat: 37.5665, lng: 126.978 });
    }
  }, []);
  const handleMapCreate = useCallback((map: kakao.maps.Map) => {
    setMapInstance(map);
  }, []);
  useEffect(() => {
    if (!mapInstance || !schedules || schedules.length === 0) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    schedules.forEach((schedule: Schedule) => {
      bounds.extend(new window.kakao.maps.LatLng(Number(schedule.latitude), Number(schedule.longitude)));
    });

    if (!bounds.isEmpty()) {
      mapInstance.setBounds(bounds);
    }
  }, [mapInstance, schedules]);
  const handleScheduleClick = useCallback(
    (scheduleId: number) => {
      router.push(`/meetup/${meetupId}/schedule/${scheduleId}`);
    },
    [router, meetupId],
  );
  if (isPending) {
    return <Spinner isLoading={isPending} />;
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
    <Map center={mapCenter} style={{ width: "100%", height: "100%" }} level={hasSchedules ? 8 : 4} onCreate={handleMapCreate}>
      {hasSchedules &&
        schedules.map((schedule: Schedule, index: number) => (
          <ScheduleNumber
            key={schedule.id}
            number={index + 1}
            isMapMarker
            position={{ lat: Number(schedule.latitude), lng: Number(schedule.longitude) }}
            onClick={() => handleScheduleClick(schedule.id)}
            label={schedule.place}
          />
        ))}
      {!hasSchedules && currentLocation && <MapMarker position={currentLocation} />}
    </Map>
  );
};

export default KakaoMapContainer;
