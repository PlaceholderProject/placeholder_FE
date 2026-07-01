"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { LuInbox, LuMegaphone, LuSendHorizontal, LuUsers } from "react-icons/lu";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { RootState } from "@/stores/store";
import { getImageURL } from "@/utils/getImageURL";
import { getMyAdsApi, getMyMeetupsApi } from "@/services/my.space.service";
import { getSentProposal } from "@/services/proposal.service";

const tabs = [
  { href: "/my-space/my-meetup", label: "내 모임", icon: LuUsers, match: "my-meetup" },
  { href: "/my-space/my-ad", label: "내 광고", icon: LuMegaphone, match: "my-ad" },
  { href: "/my-space/received-proposal", label: "받은 신청", icon: LuInbox, match: "received-proposal" },
  { href: "/my-space/sent-proposal", label: "보낸 신청", icon: LuSendHorizontal, match: "sent-proposal" },
];

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

  return (
    <div className="mx-auto w-[95%] max-w-[76rem] space-y-[2rem] py-[2.4rem] md:py-[3.2rem]">
      <section className="border-border bg-card flex items-center gap-[1.4rem] rounded-[2rem] border p-[1.6rem] md:p-[2rem]">
        <div className="relative h-[6.4rem] w-[6.4rem] shrink-0 overflow-hidden rounded-full md:h-[8rem] md:w-[8rem]">
          <Image src={getImageURL(user.profileImage)} alt={user.nickname || "프로필"} fill sizes="8rem" className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-foreground truncate text-xl font-bold md:text-2xl">{user.nickname || "내 공간"}</h1>
          <p className="text-muted-foreground mt-[0.3rem] truncate text-sm">{user.bio || "내 모임과 신청서를 한곳에서 확인해요."}</p>
          <div className="mt-[0.9rem] flex flex-wrap gap-x-[1.6rem] gap-y-[0.4rem] text-sm">
            <span>
              <b className="text-foreground font-bold">{myMeetupsData?.total ?? 0}</b> <span className="text-muted-foreground">모임</span>
            </span>
            <span>
              <b className="text-foreground font-bold">{myAdsData?.total ?? 0}</b> <span className="text-muted-foreground">광고</span>
            </span>
            <span>
              <b className="text-foreground font-bold">{sentProposalData?.total ?? 0}</b> <span className="text-muted-foreground">신청</span>
            </span>
          </div>
        </div>
      </section>

      <nav className="border-border bg-card grid grid-cols-2 gap-[0.4rem] rounded-[1.6rem] border p-[0.4rem] md:grid-cols-4" aria-label="내 공간 메뉴">
        {tabs.map(({ href, label, icon: Icon, match }) => {
          const isActive = pathname.includes(match);
          return (
            <Link
              key={href}
              href={href}
              className={`flex min-h-[4rem] items-center justify-center gap-[0.6rem] rounded-[1.2rem] px-[0.8rem] text-sm font-semibold transition-colors ${
                isActive ? "bg-foreground text-background" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-[1.6rem] w-[1.6rem] stroke-[1.9]" />
              {label}
            </Link>
          );
        })}
      </nav>

      <section>{children}</section>
    </div>
  );
};

export default MySpaceLayout;
