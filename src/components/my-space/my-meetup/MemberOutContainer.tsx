"use client";

import React from "react";
import OutButton from "./OutButton";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { MyMeetupItem } from "@/types/mySpaceType";
import { useModal } from "@/hooks/useModal";
import { setChosenMeetupId } from "@/stores/memberOutSlice";
import { getMeetupByIdApi } from "@/services/meetup.service";

interface MemberOutContainerProps {
  meetupId: MyMeetupItem["id"];
  isOrganizer: MyMeetupItem["is_organizer"];
  onSelfLeave: (meetupId: number) => void;
  isPending: boolean;
}

const MemberOutContainer: React.FC<MemberOutContainerProps> = ({ meetupId, isOrganizer, onSelfLeave, isPending }) => {
  const dispatch = useDispatch();
  const { openModal } = useModal();
  const handleMemberListButtonClick = async () => {
    try {
      dispatch(setChosenMeetupId(meetupId));
      const meetupData = await getMeetupByIdApi(meetupId);
      openModal("MEMBER_DELETE", {
        meetupId: meetupId,
        meetupName: meetupData.name,
      });
    } catch (error) {
      console.error("모임 정보 로딩 실패:", error);
      openModal("MEMBER_DELETE", {
        meetupId: meetupId,
        meetupName: "모임 멤버",
      });
    }
  };

  const handleSelfLeaveClick = () => {
    onSelfLeave(meetupId);
  };
  return (
    <>
      <div>
        {isOrganizer ? (
          <button onClick={handleMemberListButtonClick} className="p-[0.5rem]">
            <FaRegUserCircle size={20} />
          </button>
        ) : (
          <OutButton text="퇴장" onClick={handleSelfLeaveClick} isPending={isPending} />
        )}
      </div>
    </>
  );
};

export default MemberOutContainer;
