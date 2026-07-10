"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { LuChevronRight, LuMegaphone, LuSendHorizontal, LuSettings, LuUserCheck, LuUsers } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "@/stores/store";
import { getImageURL } from "@/utils/getImageURL";
import { getMyAdsApi, getMyMeetupsApi } from "@/services/my.space.service";
import { getSentProposal } from "@/services/proposal.service";

const tabs = [
  { href: "/my-space/my-meetup", label: "모임 공간", icon: LuUsers, match: "my-meetup" },
  { href: "/my-space/sent-proposal", label: "가입 신청", icon: LuSendHorizontal, match: "sent-proposal" },
  { href: "/my-space/my-ad", label: "모집 관리", icon: LuMegaphone, match: "my-ad" },
  { href: "/my-space/received-proposal", label: "멤버 승인", icon: LuUserCheck, match: "received-proposal" },
];

const PAGE_META = {
  "my-meetup": { title: "모임 공간", description: "참여하거나 운영 중인 모임에 바로 입장하세요." },
  "sent-proposal": { title: "보낸 가입 신청", description: "신청한 모임과 현재 처리 상태를 확인하세요." },
  "my-ad": { title: "모집 관리", description: "내가 올린 모집글과 도착한 신청을 관리하세요." },
  "received-proposal": { title: "멤버 승인", description: "함께하고 싶다는 신청을 확인하고 결정하세요." },
} as const;

const MySpaceLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user.user);

  const { data: myMeetupsData } = useQuery({
    queryKey: ["mySpaceSummary", "meetups"],
    queryFn: () => getMyMeetupsApi("ongoing", 1, 1),
    staleTime: 1000 * 60 * 5,
  });

  const { data: myAdsData } = useQuery({
    queryKey: ["mySpaceSummary", "ads"],
    queryFn: () => getMyAdsApi("ongoing", 1, 1),
    staleTime: 1000 * 60 * 5,
  });

  const { data: sentProposalData } = useQuery({
    queryKey: ["mySpaceSummary", "sentProposals"],
    queryFn: () => getSentProposal(1),
    staleTime: 1000 * 60 * 5,
  });

  const currentPageKey = tabs.find(tab => pathname.includes(tab.match))?.match ?? "my-meetup";
  const currentPage = PAGE_META[currentPageKey as keyof typeof PAGE_META];

  return (
    <div className="mx-auto w-[calc(100%-3.2rem)] max-w-[92rem] space-y-[2.4rem] py-[2.4rem] md:py-[4rem]">
      <section className="border-border bg-card surface-shadow relative flex items-center gap-[1.4rem] overflow-hidden rounded-[2.4rem] border p-[1.8rem] md:gap-[2rem] md:p-[2.4rem]">
        <div className="bg-muted relative h-[6.4rem] w-[6.4rem] shrink-0 overflow-hidden rounded-full md:h-[8rem] md:w-[8rem]">
          <Image src={getImageURL(user.profileImage)} alt={user.nickname || "프로필"} fill sizes="8rem" className="object-cover" />
        </div>
        <div className="relative min-w-0 flex-1">
          <p className="text-primary text-xs font-black">내 공간</p>
          <div className="mt-[0.2rem] flex items-center gap-[0.8rem]">
            <h1 className="text-foreground truncate text-xl font-black tracking-[-0.03em] md:text-2xl">{user.nickname || "사용자"}</h1>
            <Link
              href="/account"
              aria-label="계정 관리"
              className="text-muted-foreground hover:bg-muted hover:text-foreground grid h-[3rem] w-[3rem] shrink-0 place-items-center rounded-full transition-colors"
            >
              <LuSettings className="h-[1.6rem] w-[1.6rem] stroke-[1.9]" />
            </Link>
          </div>
          <p className="text-muted-foreground mt-[0.3rem] line-clamp-1 text-sm">{user.bio || "참여와 운영 현황을 한곳에서 확인하세요."}</p>
          <div className="mt-[0.9rem] flex flex-wrap gap-x-[1.6rem] gap-y-[0.4rem] text-sm">
            <span>
              <b className="text-foreground font-black">{myMeetupsData?.total ?? 0}</b> <span className="text-muted-foreground">모임 공간</span>
            </span>
            <span>
              <b className="text-foreground font-black">{myAdsData?.total ?? 0}</b> <span className="text-muted-foreground">모집 중</span>
            </span>
            <span>
              <b className="text-foreground font-black">{sentProposalData?.total ?? 0}</b> <span className="text-muted-foreground">가입 신청</span>
            </span>
          </div>
        </div>
      </section>

      <nav className="grid grid-cols-2 gap-[0.8rem] md:grid-cols-4" aria-label="내 공간 메뉴">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const isActive = pathname.includes(match);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[5.2rem] items-center gap-[0.8rem] rounded-[1.6rem] border px-[1.2rem] text-sm font-bold transition-all ${
                isActive ? "border-primary/20 bg-primary-soft text-primary-soft-foreground" : "border-border bg-card text-muted-foreground hover:border-primary/25 hover:text-foreground"
              }`}
            >
              <Icon className={`h-[1.8rem] w-[1.8rem] shrink-0 stroke-[1.9] ${isActive ? "text-primary" : "text-muted-foreground"}`} />
              <span className="flex-1 text-left">{label}</span>
              <LuChevronRight className="h-[1.4rem] w-[1.4rem] opacity-50 md:hidden" />
            </Link>
          );
        })}
      </nav>

      <section className="space-y-[1.4rem]">
        <header>
          <h2 className="text-foreground text-[2.2rem] font-black tracking-[-0.035em]">{currentPage.title}</h2>
          <p className="text-muted-foreground mt-[0.35rem] text-sm">{currentPage.description}</p>
        </header>
        {children}
      </section>
    </div>
  );
};

export default MySpaceLayout;
