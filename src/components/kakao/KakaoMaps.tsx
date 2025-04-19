"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { Map, MarkerClusterer, useMap } from "react-kakao-maps-sdk";
import { useSchedules } from "@/hooks/useSchedule";
import { Schedule } from "@/types/scheduleType";
import { useRouter } from "next/navigation";
import ScheduleNumber from "@/components/schedule/ScheduleNumber";

// bounds 설정을 위한 컴포넌트
const MapBoundsController = ({ schedules }: { schedules: Schedule[] }) => {
  const map = useMap();

  useEffect(() => {
    if (!map || !schedules || schedules.length === 0) return;

    // 모든 마커 계산하여 bounds 설정
    const bounds = new kakao.maps.LatLngBounds();
    schedules.forEach(schedule => {
      const lat = Number(schedule.latitude);
      const lng = Number(schedule.longitude);
      if (!isNaN(lat) && !isNaN(lng)) {
        bounds.extend(new kakao.maps.LatLng(lat, lng));
      }
    });

    // 지도 범위 설정
    map.setBounds(bounds, 50);
  }, [map, schedules]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

const KakaoMaps = ({ meetupId }: { meetupId: number }) => {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const { data: schedules, isPending, error } = useSchedules(meetupId);

  useEffect(() => {
    setIsClient(true);

    if (window.kakao && window.kakao.maps) {
      setIsLoaded(true);
    } else {
      window.kakao?.maps?.load(() => {
        setIsLoaded(true);
      });
    }
  }, []);

  if (!isClient) return <div className="h-[400px] flex items-center justify-center bg-gray-100">지도 로딩 중...</div>;
  if (isPending) return <div>지도 데이터를 불러오는 중...</div>;
  if (error) return <div>지도 에러: {error.message}</div>;

  return (
    <>
      <Script
        type="text/javascript"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&libraries=services,clusterer&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => window.kakao.maps.load(() => setIsLoaded(true))}
      />

      {isClient && isLoaded && schedules && schedules.length > 0 ? (
        <Map
          style={{ width: "100%", height: "400px" }}
          center={{
            lat: Number(schedules[0]?.latitude) || 37.5665,
            lng: Number(schedules[0]?.longitude) || 126.978,
          }}
          level={5}
        >
          {/* 마커 설정 - ScheduleNumber 컴포넌트 사용 */}
          <MarkerClusterer averageCenter minLevel={8}>
            {schedules.map((schedule, index) => (
              <ScheduleNumber
                key={schedule.id}
                number={index + 1}
                isMapMarker={true}
                position={{
                  lat: Number(schedule.latitude),
                  lng: Number(schedule.longitude),
                }}
                onClick={() => router.push(`/meetup/${meetupId}/schedule/${schedule.id}`)}
              />
            ))}
          </MarkerClusterer>

          {/* 경계 설정 컴포넌트 */}
          <MapBoundsController schedules={schedules} />
        </Map>
      ) : (
        <div style={{
          height: "400px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f8f9fa",
        }}>
          {isClient && isLoaded ? "표시할 스케줄이 없습니다" : "지도를 불러오는 중..."}
        </div>
      )}
    </>
  );
};

export default KakaoMaps;