"use client";

import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/constants/baseURL";
import Image from "next/image";
import AdLike from "./AdLike";
import { Meetup } from "@/types/meetupType";

const AdOrganizer = ({ adData }: { adData: Meetup }) => {
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

  return (
    <>
      <div className="mx-auto flex w-[95%] justify-between space-y-[0.5rem] py-[0.8rem] md:max-w-[80rem] md:py-[1rem]">
        <div className="flex items-center justify-center space-x-[0.4rem] md:space-x-[1rem]">
          <div className="relative h-[30px] w-[30px] overflow-hidden rounded-full md:h-[60px] md:w-[60px]">
            <Image src={imageSource} alt="방장 프사" width={30} height={30} style={{ width: "100%", height: "100%", objectFit: "cover" }} unoptimized={true} />
          </div>
          <div className="text-base md:text-xl">{adData.organizer.nickname}</div>
        </div>

        <div className="flex items-center justify-center">
          <AdLike />
        </div>
      </div>
    </>
  );
};

export default AdOrganizer;
