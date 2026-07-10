"use client";

import { useModal } from "@/hooks/useModal";
import { MyMeetupItem } from "@/types/mySpaceType";
import { LuUsers } from "react-icons/lu";
import OutButton from "./OutButton";

interface MemberOutContainerProps {
  meetupId: MyMeetupItem["id"];
  meetupName: MyMeetupItem["name"];
  isOrganizer: MyMeetupItem["is_organizer"];
}

const MemberOutContainer = ({ meetupId, meetupName, isOrganizer }: MemberOutContainerProps) => {
  const { openModal } = useModal();

  if (isOrganizer) {
    return (
      <button
        type="button"
        onClick={() => openModal("MEMBER_DELETE", { meetupId, meetupName })}
        className="border-border text-muted-foreground hover:text-foreground hover:bg-muted inline-flex h-[3.2rem] items-center gap-[0.5rem] rounded-full border px-[1rem] text-xs font-semibold transition-colors"
      >
        <LuUsers className="h-[1.4rem] w-[1.4rem] stroke-[1.9]" />
        멤버 관리
      </button>
    );
  }

  return <OutButton text="퇴장" onClick={() => openModal("MEETUP_LEAVE", { meetupId, meetupName })} />;
};

export default MemberOutContainer;
