"use client";

import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/constants/baseURL";
import { useAdItem } from "@/hooks/useAdItem";
import Image from "next/image";

const AdOrganizer = ({ meetupId }: { meetupId: number }) => {
  const { adData, error, isPending } = useAdItem(meetupId);
  const [imageSource, setImageSource] = useState("/profile.png");

  useEffect(() => {
    if (adData && adData.organizer && adData.organizer.image) {
      const profileImageUrl = adData?.organizer.image.startsWith("http") ? adData.organizer.image : `${BASE_URL}/${adData.organizer.image}`;

      const imgElement = document.createElement("img");
      imgElement.onload = () => {
        setImageSource(profileImageUrl);
      };
      imgElement.onerror = () => {
        setImageSource("/profile.png");
      };
      imgElement.src = profileImageUrl; // 이 부분이 누락되어 있었음
    }

    // --TO DO--
    // 클린업 함수 및 let imgElement상단 선언 필요
    // return () => {
    //   if (imgElement) {
    //     imgElement.onload = null;
    //     imgElement.onerror = null;
    //     imgElement.src = "";
    //     imgElement = null;
    //   }
    // };

    // --TO DO--
    // 이미지 경로 validate 함수 따로 만들어서 빼기!!!!
  }, [adData]);

  if (error) return <div>에러 발생: {error.message}</div>;
  if (isPending) return <div>로딩중..</div>;
  if (!adData) return null;

  return (
    <>
      <div className="grid grid-cols-2">
        <div className="relative h-[50px] w-[50px] overflow-hidden rounded-full">
          <Image src={imageSource} alt="방장 프사" width={20} height={20} style={{ width: "auto", height: "auto" }} unoptimized={true} />
        </div>
        <div className="text-base">{adData.organizer.nickname}</div>
      </div>
    </>
  );
};

export default AdOrganizer;
