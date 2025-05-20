"use client";

import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/constants/baseURL";
import { useAdItem } from "@/hooks/useAdItem";
import Image from "next/image";

const AdOrganizerTmp = ({ meetupId }: { meetupId: number }) => {
  const { adData, error, isPending } = useAdItem(meetupId);
  const [imageSource, setImageSource] = useState("/profile.png");

  // useEffect(() => {
  //   if (adData && adData.organizer && adData.organizer.profileImage) {
  //     const profileImageUrl = adData?.organizer.profileImage.startsWith("http") ? adData.organizer.profileImage : `${BASE_URL}${adData.organizer.profileImage}`;
  //     console.log("실제 프사 URL", profileImageUrl);

  //     //이미지 존재하늦지 확인
  //     // const image = new Image();
  //     // image.onload = () => setImageSource(profileImageUrl);
  //     // image.onerror = () => {
  //     //   console.error("이미지로딩 실패", profileImageUrl);
  //     //   setImageSource("/profile.png");
  //     // };
  //     // image.src = profileImageUrl;

  //     // HTMLImageElement를 사용하여 이미지 존재 여부 확인
  //     const imgElement = document.createElement("img");
  //     imgElement.onload = () => setImageSource(profileImageUrl);
  //     imgElement.onerror = () => {
  //       console.error("이미지로딩 실패", profileImageUrl);
  //       setImageSource("/profile.png");
  //     };
  //   } else {
  //     console.log("방장 프사 이미지 정보 없음:", adData?.organizer);
  //   }
  // }, [adData]);

  //25.05.19 디버깅 로그 추가한 이미지 경로 설정

  useEffect(() => {
    console.log("1. adData 상태:", adData);
    console.log("2. organizer 상태:", adData?.organizer);
    console.log("3. profileImage 상태:", adData?.organizer?.profileImage);

    if (adData && adData.organizer && adData.organizer.profileImage) {
      console.log("4. if문 진입 성공");
      const profileImageUrl = adData?.organizer.profileImage.startsWith("http") ? adData.organizer.profileImage : `${BASE_URL}${adData.organizer.profileImage}`;
      console.log("5. 생성된 이미지 URL:", profileImageUrl);

      const imgElement = document.createElement("img");
      imgElement.onload = () => {
        console.log("6. 이미지 로딩 성공");
        setImageSource(profileImageUrl);
      };
      imgElement.onerror = () => {
        console.log("6. 이미지 로딩 실패");
        setImageSource("/profile.png");
      };
      imgElement.src = profileImageUrl; // 이 부분이 누락되어 있었음
    } else {
      console.log("4. if문 진입 실패, 이유 확인:", {
        adData: !!adData,
        organizer: !!adData?.organizer,
        profileImage: !!adData?.organizer?.profileImage,
      });
    }
  }, [adData]);

  if (error) return <div>에러 발생: {error.message}</div>;
  if (isPending) return <div>로딩중..</div>;
  if (!adData) return null;

  // const profileImageUrl = `${BASE_URL}${adData.organizer.profileImage}`;

  return (
    <>
      <div>
        <h4>작성자: </h4>
        <div>{adData.organizer.nickname}</div>
        <div className="relative w-[50px] h-[50px] rounded-full overflow-hidden">
          <Image src={imageSource} alt="방장 프사" width={20} height={20} style={{ width: "auto", height: "auto" }} unoptimized={true} />
        </div>
      </div>
    </>
  );
};

export default AdOrganizerTmp;
