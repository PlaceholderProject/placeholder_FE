"use client";

import React, { useState } from "react";
import OutButton from "./OutButton";
import { FaRegUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toggleMemberDeleteModal } from "@/stores/modalSlice";
import { RootState } from "@/stores/store";
import MemberDeleteModal from "./MemberDeleteModal";

const MemberOutContainer = () => {
  const [isOrganizer, setIsOrganizer] = useState(false);
  const dispatch = useDispatch();
  const isMemberDeleteModalOpen = useSelector((state: RootState) => state.modal.isMemberDeleteModalOpen);

  // 아이콘 클릭했는데 Link 이동까지 되는 이벤트 버블링 발생,
  // 이벤트 버블링 방지용

  const handleMemberButtonClick = (event: { stopPropagation: () => void; preventDefault: () => void }) => {
    // 이벤트 버블링과 기본 동작 모두 방지
    event.stopPropagation();
    event.preventDefault();

    //모달 토글
    dispatch(toggleMemberDeleteModal());
    console.log("멤버모달 열렸니?", isMemberDeleteModalOpen);
  };
  return (
    <>
      {/* 스탑프로퍼게이션 왜 ㄷ르어감? */}
      <div onClick={e => e.stopPropagation()}>
        {isOrganizer ? (
          <OutButton isOrganizer={isOrganizer} />
        ) : (
          <button onClick={handleMemberButtonClick} className="p-2">
            <FaRegUserCircle size={20} />
          </button>
        )}
        <MemberDeleteModal />
      </div>
    </>
  );
};

export default MemberOutContainer;
