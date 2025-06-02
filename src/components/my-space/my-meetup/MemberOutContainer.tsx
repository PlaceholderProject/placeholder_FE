"use client";

import React from "react";
import OutButton from "./OutButton";
import { FaRegUserCircle } from "react-icons/fa";
import { MyMeetupItem } from "@/types/mySpaceType";
import { useModal } from "@/hooks/useModal";

const MemberOutContainer: React.FC<{
  meetupId: MyMeetupItem["id"];
  isOrganizer: MyMeetupItem["is_organizer"];
}> = ({ meetupId, isOrganizer }) => {
  const { openModal } = useModal();

  const handleMemberButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();

    // 멤버 삭제(강퇴) 모달 열기
    openModal("MEMBER_DELETE", { meetupId });
  };

  const handleOutButtonClick = () => {
    // 모임 퇴장 (isOrganizer = false)
    if (!isOrganizer) {
      const confirmed = window.confirm("정말 이 모임에서 퇴장하시겠습니까?");
      if (confirmed) {
        // TODO: 퇴장 API 로직 구현
        alert("내 발로 내가 퇴장한다");
      }
    }
  };

  return (
    <div>
      {isOrganizer ? (
        <button onClick={handleMemberButtonClick} className="rounded-full p-2 transition-colors hover:bg-gray-100" aria-label="멤버 관리">
          <FaRegUserCircle size={20} />
        </button>
      ) : (
        <OutButton isOrganizer={isOrganizer} isInMemberDeleteModal={false} onClick={handleOutButtonClick} />
      )}
    </div>
  );
};

export default MemberOutContainer;
