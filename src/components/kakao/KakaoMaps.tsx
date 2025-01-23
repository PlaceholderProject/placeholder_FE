"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const KakaoMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      setIsLoaded(true);
    } else {
      window.kakao?.maps?.load(() => {
        setIsLoaded(true);
      });
    }
  }, []);

  return (
    <>
      <Script
        type="text/javascript"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_APP_JS_KEY}&libraries=services,clusterer&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => window.kakao.maps.load(() => setIsLoaded(true))}
      />

      {isLoaded && (
        <Map center={{ lat: 37.4882, lng: 127.0648 }} style={{ width: "100%", height: "367px" }}>
          <MapMarker position={{ lat: 37.4882, lng: 127.0648 }} />
        </Map>
      )}
    </>
  );
};

export default KakaoMaps;
