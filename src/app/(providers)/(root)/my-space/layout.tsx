"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

const MySpaceLayout = ({ children }: { children: React.ReactNode }) => {
  // --NOTE--
  // 메인 탭 기본값이 myMeetup이어서 my-space/my-meetup으로 url 엔드 포인트 타이핑 해서 들어가도
  // 내 광고가 아닌 내 모임이 기본으로 뜬다
  // 그런데 유저가 내 공간(모임, 광고 모두 포함) 버튼 - 내 모임 - 내광고 순서로 접근하는 것 외에
  // 기획상 내광고로 한 번에 접근할 경로는 아직 없으므로 그냥 둠

  const pathname = usePathname();
  const getInitailTab = (path: string): "myMeetup" | "myAd" | "receivedProposals" | "sentProposals" => {
    if (path.includes("my-space/my-ad")) return "myAd";
    if (path.includes("my-space/received-proposal")) return "receivedProposals";
    if (path.includes("my-space/sent-proposal")) return "sentProposals";
    return "myMeetup";
  };

  const [activeMainTab, setActiveMainTab] = useState<"myMeetup" | "myAd" | "receivedProposals" | "sentProposals">(getInitailTab(pathname));

  useEffect(() => {
    setActiveMainTab(getInitailTab(pathname));
  }, [pathname]);
  return (
    <>
      <div className="flex-col items-center justify-center">
        <div className="mx-auto flex w-full min-w-[32rem] flex-col items-center justify-center">
          <div className="mx-auto w-[30.1rem] flex-col items-center justify-center bg-purple-300 text-center md:max-w-[80rem]">
            <h1 className="m-[3rem] text-3xl font-bold">내 공간</h1>
            <div className="mb-[2rem]">
              <Link
                className={`rounded-[0.5rem] px-[1rem] py-[0.5rem] text-base font-semibold ${activeMainTab === "myMeetup" ? "active bg-secondary-dark" : ""}`}
                onClick={() => setActiveMainTab("myMeetup")}
                href="/my-space/my-meetup"
              >
                내 모임
              </Link>
              <Link
                className={`rounded-[0.5rem] px-[1rem] py-[0.5rem] text-base font-semibold ${activeMainTab === "myAd" ? "active bg-secondary-dark" : ""}`}
                onClick={() => setActiveMainTab("myAd")}
                href="/my-space/my-ad"
              >
                내 광고
              </Link>
              <Link
                className={`rounded-[0.5rem] px-[1rem] py-[0.5rem] text-base font-semibold ${activeMainTab === "receivedProposals" ? "active bg-secondary-dark" : ""}`}
                onClick={() => setActiveMainTab("receivedProposals")}
                href="/my-space/received-proposal"
              >
                받은 신청서
              </Link>
              <Link
                className={`rounded-[0.5rem] px-[1rem] py-[0.5rem] text-base font-semibold ${activeMainTab === "sentProposals" ? "active bg-secondary-dark" : ""}`}
                onClick={() => setActiveMainTab("sentProposals")}
                href="/my-space/sent-proposal"
              >
                보낸 신청서
              </Link>
            </div>
          </div>
          <div className="flex w-full min-w-[32rem] flex-col border-t-[1rem] border-gray-medium bg-pink-200">
            <div className="mx-auto w-[56%] bg-white md:max-w-[80rem]">{children}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MySpaceLayout;
