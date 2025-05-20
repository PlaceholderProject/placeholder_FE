"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import AdDeleteModal from "./AdDeleteModal";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { closeAdNonModal, toggleAdNonModal } from "@/stores/nonModalSlice";
import { closeAdDeleteModal, toggleAdDeleteModal } from "@/stores/modalSlice";
import { usePathname } from "next/navigation";

const AdNonModal = ({ meetupId }: { meetupId: number }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const isAdNonModalOpen = useSelector((state: RootState) => state.nonModal.isAdNonModalOpen);
  const isAdDeleteModalOpen = useSelector((state: RootState) => state.modal.isAdDeleteModalOpen);

  // 페이지 이동 감지하고 모달 상태 초기회ㅏ
  useEffect(() => {
    return () => {
      dispatch(closeAdNonModal());
      dispatch(closeAdDeleteModal());
    };
  }, [dispatch, pathname]);

  // 논모달 토글 상태변화 감지용
  React.useEffect(() => {
    // console.log("논모달 상태 업데이트됨:", isAdNonModalOpen);
  }, [isAdNonModalOpen]);

  const handleThreeDotsClick = () => {
    dispatch(toggleAdNonModal());
    // console.log(isAdNonModalOpen);
  };

  // 논모달 토글 상태변화 감지용
  React.useEffect(() => {
    // console.log("모달 상태 업데이트됨:", isAdDeleteModalOpen);
  }, [isAdDeleteModalOpen]);

  const handleCloseButtonClick = () => {
    dispatch(toggleAdDeleteModal());
    // console.log(isAdDeleteModalOpen);
  };
  return (
    <>
      {/* 🏁 🏁 🏁 🏁 🏁  TODO: 이 threedots 자체가 organizer 여부에 따라 조건부 렌더링되어야 함 🏁 🏁 🏁 🏁 🏁   */}
      <button>
        <BsThreeDotsVertical onClick={handleThreeDotsClick} />
      </button>
      {isAdNonModalOpen && (
        <div className="absolute right-3 m-2 bg-white shadow-lg rounded-lg p-6">
          <div>
            <Link href={`http://localhost:3000/meetup-edit/${meetupId}`}>수정</Link>
          </div>
          <button type="button" onClick={handleCloseButtonClick}>
            삭제
            {/* 이걸 클릭하면 isAdDeleModalOpen 상태가 토글되어야 함 */}
          </button>
        </div>
      )}
      {isAdDeleteModalOpen && <AdDeleteModal meetupId={meetupId} />}
    </>
  );
};

export default AdNonModal;
