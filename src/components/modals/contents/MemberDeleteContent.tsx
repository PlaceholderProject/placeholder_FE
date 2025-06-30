"use client";

import React from "react";
import MyMeetupMembers from "@/components/my-space/my-meetup/MyMeetupMembers";
import { useModal } from "@/hooks/useModal";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { clearChosenMeetupId } from "@/stores/memberOutSlice";

// const MemberDeleteModal: React.FC<{ meetupId: MyMeetupItem["id"] }> = ({ meetupId }) => {
// props 제거
// 아 아래에서 바로 구독?해서 선택된 아이디 값 알 수 있게?

const MemberDeleteContent: React.FC = () => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const chosenMeetupId = useSelector((state: RootState) => state.memberOut.chosenMeetupId);

  const handleClose = () => {
    dispatch(clearChosenMeetupId());
    closeModal();
  };

  if (!chosenMeetupId) {
    return <div>모임을 선택해주세요.</div>;
  }
  // --TO DO--
  // ❓Portal을 사용하는 것이 이상적이지만, 여기서는 z-index를 높게 설정하고 모달을 body 바로 아래에 렌더링

  return (
    <div className="w-full max-w-md">
      {/* <MemberDeleteModal meetupId={meetupId} /> */}
      {/* 무한재귀 제거 */}
      <h2 className="mb-[3rem] text-lg font-bold">모임 멤버</h2>

      {/* {meetupId && <MyMeetupMembers meetupId={meetupId} />} */}
      <MyMeetupMembers meetupId={chosenMeetupId} />

      <div className="flex justify-end space-x-2">
        <button className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300" onClick={handleClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default MemberDeleteContent;
