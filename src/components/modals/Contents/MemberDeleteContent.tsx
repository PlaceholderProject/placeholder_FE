"use client";

import React from "react";
import { useModal } from "@/hooks/useModal";

const MemberDeleteContent = ({ memberId }: { memberId: number }) => {
  const { closeModal } = useModal();

  const handleMemberDelete = () => {
    // 멤버 삭제 로직 구현
    console.log("멤버 삭제:", memberId);
    closeModal();
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <h2 className="text-xl font-bold">멤버 강퇴</h2>
      <p className="text-center">이 멤버를 모임에서 강퇴하시겠습니까?</p>

      <div className="flex w-full justify-end space-x-2">
        <button className="rounded bg-gray-200 px-4 py-2 hover:bg-gray-300" onClick={closeModal}>
          취소
        </button>
        <button className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600" onClick={handleMemberDelete}>
          강퇴하기
        </button>
      </div>
    </div>
  );
};

export default MemberDeleteContent;
