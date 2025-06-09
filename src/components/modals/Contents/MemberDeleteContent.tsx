"use client";

import React from "react";
import MyMeetupMembers from "@/components/my-space/my-meetup/MyMeetupMembers";
import { useModal } from "@/hooks/useModal";

// const MemberDeleteModal: React.FC<{ meetupId: MyMeetupItem["id"] }> = ({ meetupId }) => {
// props 제거
// 아 아래에서 바로 구독?해서 선택된 아이디 값 알 수 있게?

const MemberDeleteContent: React.FC<{ meetupId: number }> = ({ meetupId }) => {
  const { closeModal } = useModal();

  // --TO DO--
  // ❓Portal을 사용하는 것이 이상적이지만, 여기서는 z-index를 높게 설정하고 모달을 body 바로 아래에 렌더링

  return (
    <div className="rounded-md bg-white p-6 shadow-sm">
      {/* <MemberDeleteModal meetupId={meetupId} /> */}
      {/* 무한재귀 제거 */}

      {meetupId && <MyMeetupMembers meetupId={meetupId} />}

      <div className="flex justify-end space-x-2">
        <button className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300" onClick={closeModal}>
          취소
        </button>
        {/* <OutButton /> */}
        {/* 이거 퇴장으로 뜸 */}
      </div>
    </div>
  );
};

export default MemberDeleteContent;
