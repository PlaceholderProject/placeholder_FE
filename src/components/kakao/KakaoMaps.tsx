"use client";

import React from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

const KakaoMaps = () => {
  return (
    <Map center={{ lat: 37.4882, lng: 127.0648 }} style={{ width: "100%", height: "367px" }}>
      <MapMarker position={{ lat: 37.4882, lng: 127.0648 }} />
    </Map>
  );
};

export default KakaoMaps;
