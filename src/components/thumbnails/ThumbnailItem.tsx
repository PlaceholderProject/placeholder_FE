"use client";

import React, { useEffect, useState } from "react";
import { BASE_URL } from "@/constants/baseURL";
import LikeContainer from "../likes/LikeContainer";
import { Meetup } from "@/types/meetupType";
import Link from "next/link";
import Image from "next/image";
import { FaLock } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import { FaCrown } from "react-icons/fa6";

// id 였는데 썸네일 객체를 직접 전달하도록 수정
// 구조분해할당, 타입지정
const ThumbnailItem = ({ thumbnail, userNickname }: { thumbnail: Meetup; userNickname: string | null }) => {
  const [profileImageSource, setProfileImageSource] = useState("/profile.png");
  const thumbnailImageUrl = thumbnail.image?.startsWith("http") ? thumbnail.image : `${BASE_URL}/${thumbnail.image}`;

  useEffect(() => {
    // console.log("==베이스유알엘:", BASE_URL);
    // console.log("===thumbnail.image:", thumbnail.image);
    // console.log("====최종 URL:", thumbnailImageUrl);

    // 직접 fetch로 테스트
    fetch(thumbnailImageUrl)
      .then(response => {
        console.log("==페치로 테스트 이미지 응답:", response.status);
      })
      .catch(error => {
        console.error("===이미지 fetch 에러:", error);
      });
  }, [thumbnailImageUrl]);

  useEffect(() => {
    // 프로필 이미지가 없으면 기본 이미지 사용
    if (!thumbnail?.organizer.image) {
      setProfileImageSource("/profile.png");
      console.log("프로필 이미지 없다고 유즈이펙트???:", profileImageSource);
      return;
    }

    // 메인 작성자 프사 이미지
    const profileImageUrl = thumbnail.organizer.image?.startsWith("http") ? thumbnail.organizer.image : `${BASE_URL}/${thumbnail.organizer.image}`;
    // console.log("작성자 프사 URL", profileImageUrl);

    // HTMLImageElement를 사용하여 이미지 존재 여부 확인
    const imgElement = document.createElement("img");

    imgElement.onload = () => {
      setProfileImageSource(profileImageUrl);
    };

    imgElement.onerror = () => {
      console.error("이미지로딩 실패", profileImageUrl);
      setProfileImageSource("/profile.png");
    };

    // 이미지 로드 시작
    imgElement.src = profileImageUrl;

    // 컴포넌트 언마운트 시 정리
    return () => {
      imgElement.onload = null;
      imgElement.onerror = null;
    };
  }, [thumbnail?.organizer.image]);

  // if (isPending) return <div>로딩중</div>;
  // if (isError) return <div>에러발생</div>;
  if (!thumbnail) return null;

  const renderThumbnailItem = () => {
    if (!thumbnail.image) return null;

    if (thumbnail.isPublic === true) {
      return (
        <Link href={`/ad/${thumbnail.id}`} className="relative mx-auto block h-[14.2rem] w-[14.2rem] items-center justify-center md:h-[150px] md:w-[150px]">
          <Image src={thumbnailImageUrl} alt="thumbnailImage" fill sizes="width=14.2rem, height=14.2rem" className="rounded-[2rem] object-cover" loading="lazy" />

          {userNickname === thumbnail.organizer.nickname && (
            <div className="absolute left-3 top-3 flex h-[2.2rem] w-[2.2rem] place-content-center items-center rounded-full bg-primary bg-opacity-70 text-[1.6rem] text-secondary-dark text-opacity-70">
              <FaCrown />
              {/* <LuCrown /> */}
            </div>
          )}
        </Link>
      );
    } else {
      return (
        <>
          {userNickname === thumbnail.organizer.nickname ? (
            <div>
              <Link href={`/ad/${thumbnail.id}`} className="relative mx-auto block h-[14.2rem] w-[14.2rem] items-center justify-center md:h-[150px] md:w-[150px]">
                <div className="mx-auto flex h-[14.2rem] w-[14.2rem] items-center justify-center rounded-[2rem] bg-gray-medium text-opacity-20 md:h-[150px] md:w-[150px]">
                  <FaLock className="h-[4rem] w-[4rem] text-gray-dark" />
                </div>
                {userNickname === thumbnail.organizer.nickname && (
                  <div className="absolute left-3 top-3 flex h-[2.2rem] w-[2.2rem] place-content-center items-center rounded-full bg-primary bg-opacity-70 text-[1.6rem] text-secondary-dark text-opacity-70">
                    <FaCrown />
                    {/* <LuCrown /> */}
                  </div>
                )}
              </Link>
            </div>
          ) : (
            <div>
              <div className="mx-auto flex h-[14.2rem] w-[14.2rem] items-center justify-center rounded-[2rem] bg-gray-medium text-opacity-20 md:h-[150px] md:w-[150px]">
                <FaLock className="h-[4rem] w-[4rem] text-gray-dark" />
              </div>
            </div>
          )}
        </>
      );
    }
  };

  return (
    <>
      <div className="my-[1rem] rounded-lg">
        <div className={thumbnail.isPublic === false ? "text-gray-dark opacity-90" : ""}>
          {/* {thumbnail.image &&
            (thumbnail.isPublic === true ? (
              <Link href={`/ad/${thumbnail.id}`} className="relative mx-auto block h-[14.2rem] w-[14.2rem] items-center justify-center md:h-[150px] md:w-[150px]">
                <Image src={thumbnailImageUrl} alt="thumbnailImage" fill sizes="width=14.2rem, height=14.2rem" className="rounded-[2rem] object-cover" loading="lazy" />

                {userNickname === thumbnail.organizer.nickname && (
                  <div className="absolute left-3 top-3 flex h-[2.2rem] w-[2.2rem] place-content-center items-center rounded-full bg-primary bg-opacity-70 text-[1.6rem] text-secondary-dark text-opacity-70">
                    <FaCrown />
                  </div>
                )}
              </Link>
            ) : (
              <div className="mx-auto flex h-[14.2rem] w-[14.2rem] items-center justify-center rounded-[2rem] bg-gray-medium text-opacity-20 md:h-[150px] md:w-[150px]">
                <FaLock className="h-[4rem] w-[4rem] text-gray-dark" />
              </div>
            ))} */}

          {renderThumbnailItem()}

          {/* 콘텐츠 */}
          <div className="mt-[1rem] w-full space-y-[0.5rem]">
            {/* 프로필 & 좋아요 */}
            <div className="flex items-center justify-between">
              {/* 작성자 */}
              <div className="flex items-center gap-[0.2rem]">
                <div className="relative flex h-[1.8rem] w-[1.8rem] flex-shrink-0 text-sm">
                  <Image src={profileImageSource} fill alt="작성자 프로필 이미지" className="rounded-full object-cover" />
                </div>
                <div className="text-sm font-medium">{thumbnail.organizer.nickname}</div>
              </div>

              {/* 좋아요 */}
              <div className="pointer-events-auto flex-shrink-0">
                <LikeContainer id={thumbnail.id} initialIsLike={thumbnail.isLike} initialLikeCount={thumbnail.likeCount} />
              </div>
            </div>

            <div className="w-[14.2rem] text-sm font-semibold">
              <h3 className="line-clamp-2 break-words leading-tight">
                <span className="whitespace-nowrap">[{thumbnail.place}]</span>
                {thumbnail.adTitle}
              </h3>
            </div>

            {/* <div className="flex-warp flex w-[14.2rem] gap-1 text-sm font-semibold">
              <div
                style={{
                  textIndent: "-3rem", // 첫 줄을 왼쪽으로 3rem 당김
                  paddingLeft: "3rem", // 전체를 오른쪽으로 3rem 밀어서 상쇄
                }}
                className="line-clamp-2 min-w-0 flex-shrink-0 leading-tight"
              >
                <span>[{thumbnail.place}]</span> <span>{thumbnail.adTitle}</span>
              </div>
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-1">
              <span>[{thumbnail.place}]</span>
              <span className="line-clamp-2 min-w-0 break-words leading-tight">{thumbnail.adTitle}</span>
            </div> */}

            <div className="text-xs">
              <div className="flex justify-start space-x-[0.1rem]">
                <FaRegCalendarAlt className="mt-[0.2rem] h-[1.05rem] w-[1.2rem]" />
                <div className="">
                  {thumbnail.startedAt === null ? "미정" : thumbnail.startedAt.substring(0, 10)} ~ {thumbnail.endedAt === null ? "미정" : thumbnail.endedAt.substring(0, 10)}
                </div>
                {/* <span>
                {thumbnail.startedAt && thumbnail.endedAt
                  ? calculateDays({
                      startedAt: thumbnail.startedAt,
                      endedAt: thumbnail.endedAt,
                    })
                  : ""}
              </span> */}
              </div>
              <span className="">{thumbnail.adEndedAt?.substring(0, 10)}까지 모집</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ThumbnailItem;
