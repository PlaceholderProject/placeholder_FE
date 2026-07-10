"use client";

import ScheduleNumber from "@/components/schedule/ScheduleNumber";
import { useSchedules } from "@/hooks/useSchedule";
import { Schedule } from "@/types/scheduleType";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Map, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { LuMapPinned } from "react-icons/lu";

interface KakaoMapsProps {
  meetupId: number;
}

interface LatLng {
  lat: number;
  lng: number;
}

const DEFAULT_CENTER: LatLng = { lat: 37.5665, lng: 126.978 };

const toLatLng = (schedule: Schedule): LatLng | null => {
  const lat = Number(schedule.latitude);
  const lng = Number(schedule.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
};

const MapStatus = ({ title, description }: { title: string; description?: string }) => (
  <div className="bg-muted/70 flex h-full min-h-[18rem] w-full items-center justify-center p-[1.6rem] text-center">
    <div>
      <span className="bg-primary-soft text-primary mx-auto mb-[1rem] grid h-[4.4rem] w-[4.4rem] place-items-center rounded-full">
        <LuMapPinned className="h-[2rem] w-[2rem] stroke-[1.9]" />
      </span>
      <p className="text-foreground text-sm font-bold">{title}</p>
      {description && <p className="text-muted-foreground mt-[0.4rem] text-xs leading-relaxed break-keep">{description}</p>}
    </div>
  </div>
);

const KakaoMapLoader = ({ meetupId, appKey }: KakaoMapsProps & { appKey: string }) => {
  const [loading, error] = useKakaoLoader({
    appkey: appKey,
    libraries: ["services", "clusterer", "drawing"],
  });

  if (loading) return <MapStatus title="지도를 불러오는 중" />;
  if (error) return <MapStatus title="지도를 불러오지 못했어요" description="카카오 JavaScript 키와 등록 도메인을 확인해주세요." />;

  return <KakaoMaps meetupId={meetupId} />;
};

const KakaoMaps = ({ meetupId }: KakaoMapsProps) => {
  const router = useRouter();
  const { data: schedules, isPending, error: dataError } = useSchedules(meetupId);
  const [currentLocation, setCurrentLocation] = useState<LatLng | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);

  const schedulePositions = useMemo(() => {
    return (schedules ?? []).map(schedule => ({ schedule, position: toLatLng(schedule) })).filter((item): item is { schedule: Schedule; position: LatLng } => Boolean(item.position));
  }, [schedules]);

  const hasSchedulePositions = schedulePositions.length > 0;

  useEffect(() => {
    if (isPending || dataError || hasSchedulePositions) return;

    if (!navigator.geolocation) {
      setLocationError("현재 위치를 사용할 수 없어 기본 위치를 표시합니다.");
      setCurrentLocation(DEFAULT_CENTER);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      position => {
        setCurrentLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setLocationError("현재 위치를 사용할 수 없어 기본 위치를 표시합니다.");
        setCurrentLocation(DEFAULT_CENTER);
      },
      { timeout: 5000 },
    );
  }, [dataError, hasSchedulePositions, isPending]);

  const handleMapCreate = useCallback((map: kakao.maps.Map) => {
    setMapInstance(map);
  }, []);

  useEffect(() => {
    if (!mapInstance || !hasSchedulePositions) return;

    const bounds = new window.kakao.maps.LatLngBounds();
    schedulePositions.forEach(({ position }) => {
      bounds.extend(new window.kakao.maps.LatLng(position.lat, position.lng));
    });

    if (!bounds.isEmpty()) {
      mapInstance.setBounds(bounds);
    }
  }, [hasSchedulePositions, mapInstance, schedulePositions]);

  const handleScheduleClick = useCallback(
    (scheduleId: number) => {
      router.push(`/meetup/${meetupId}/schedule/${scheduleId}`);
    },
    [meetupId, router],
  );

  if (isPending) return <MapStatus title="일정 위치를 불러오는 중" />;
  if (dataError) return <MapStatus title="일정 위치를 불러오지 못했어요" description={dataError.message} />;

  const mapCenter = hasSchedulePositions ? schedulePositions[0].position : currentLocation || DEFAULT_CENTER;

  return (
    <div className="relative h-full w-full">
      <Map center={mapCenter} style={{ width: "100%", height: "100%" }} level={hasSchedulePositions ? 5 : 6} onCreate={handleMapCreate}>
        {schedulePositions.map(({ schedule, position }, index) => (
          <ScheduleNumber key={schedule.id} number={index + 1} isMapMarker position={position} onClick={() => handleScheduleClick(schedule.id)} label={schedule.place} />
        ))}
        {!hasSchedulePositions && <MapMarker position={mapCenter} />}
      </Map>
      {!hasSchedulePositions && locationError && (
        <div className="bg-background/90 text-muted-foreground pointer-events-none absolute right-[1rem] bottom-[1rem] left-[1rem] rounded-[1.2rem] px-[1rem] py-[0.8rem] text-center text-xs font-semibold shadow-sm backdrop-blur">
          {locationError}
        </div>
      )}
    </div>
  );
};

const KakaoMapContainer = ({ meetupId }: KakaoMapsProps) => {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY;

  if (!appKey) {
    return <MapStatus title="카카오 지도 키가 필요해요" description=".env.local에 NEXT_PUBLIC_KAKAO_APP_JS_KEY를 설정해주세요." />;
  }

  return <KakaoMapLoader meetupId={meetupId} appKey={appKey} />;
};

export default KakaoMapContainer;
