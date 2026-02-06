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
const ThumbnailItem = ({ thumbnail, userNickname }: { thumbnail: Meetup; userNickname: string | null }) => {
  const [profileImageSource, setProfileImageSource] = useState("/profile.png");
  const thumbnailImageUrl = thumbnail.image?.startsWith("http") ? thumbnail.image : `${BASE_URL}/${thumbnail.image}`;

  useEffect(() => {
    fetch(thumbnailImageUrl)
      .then(response => {
      })
      .catch(error => {
        console.error("===이미지 fetch 에러:", error);
      });
  }, [thumbnailImageUrl]);

  useEffect(() => {
    if (!thumbnail?.organizer.image) {
      setProfileImageSource("/profile.png");
      return;
    }
    const profileImageUrl = thumbnail.organizer.image?.startsWith("http") ? thumbnail.organizer.image : `${BASE_URL}/${thumbnail.organizer.image}`;
    const imgElement = document.createElement("img");

    imgElement.onload = () => {
      setProfileImageSource(profileImageUrl);
    };

    imgElement.onerror = () => {
      console.error("이미지로딩 실패", profileImageUrl);
      setProfileImageSource("/profile.png");
    };
    imgElement.src = profileImageUrl;
    return () => {
      imgElement.onload = null;
      imgElement.onerror = null;
    };
  }, [thumbnail?.organizer.image]);
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
              {}
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
                    {}
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
          {}

          {renderThumbnailItem()}

          {}
          <div className="mt-[1rem] w-full space-y-[0.5rem]">
            {}
            <div className="flex items-center justify-between">
              {}
              <div className="flex items-center gap-[0.2rem]">
                <div className="relative flex h-[1.8rem] w-[1.8rem] flex-shrink-0 text-sm">
                  <Image src={profileImageSource} fill alt="작성자 프로필 이미지" className="rounded-full object-cover" />
                </div>
                <div className="text-sm font-medium">{thumbnail.organizer.nickname}</div>
              </div>

              {}
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

            {}

            <div className="text-xs">
              <div className="flex justify-start space-x-[0.1rem]">
                <FaRegCalendarAlt className="mt-[0.2rem] h-[1.05rem] w-[1.2rem]" />
                <div className="">
                  {thumbnail.startedAt === null ? "미정" : thumbnail.startedAt.substring(0, 10)} ~ {thumbnail.endedAt === null ? "미정" : thumbnail.endedAt.substring(0, 10)}
                </div>
                {}
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
