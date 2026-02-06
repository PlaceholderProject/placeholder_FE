"use client";

import React from "react";
import MyMeetupMembers from "@/components/my-space/my-meetup/MyMeetupMembers";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";

const MemberDeleteContent: React.FC = () => {
  const chosenMeetupId = useSelector((state: RootState) => state.memberOut.chosenMeetupId);

  const modalData = useSelector((state: RootState) => state.modal.modalData);
  const meetupName = modalData?.meetupName || "모임 멤버";

  if (!chosenMeetupId) {
    return <p>모임을 선택해주세요.</p>;
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <h2 className="mx-auto mb-[1.5rem] mt-[2rem] w-[22rem] truncate text-center text-lg font-bold">{meetupName}</h2>

      {}
      {}
      <MyMeetupMembers meetupId={chosenMeetupId} />
    </div>
  );
};

export default MemberDeleteContent;
