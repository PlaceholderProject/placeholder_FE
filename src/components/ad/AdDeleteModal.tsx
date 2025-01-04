"use client";

import { toggleAdDeleteModal } from "@/stores/modalSlice";
import { RootState } from "@/stores/store";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

const AdDeleteModal = ({ meetupId }: { meetupId: number }) => {
  const dispatch = useDispatch();
  const isAdDeleteModalOpen = useSelector((state: RootState) => state.modal.isAdDeleteModalOpen);

  // 토글 상태 변화 감지
  React.useEffect(() => {
    console.log("삭제모달 상태업데이트됨:", isAdDeleteModalOpen);
  }, [isAdDeleteModalOpen]);

  const handleCloseButtonClick = () => {
    dispatch(toggleAdDeleteModal());
    console.log(isAdDeleteModalOpen);
  };

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      handleCloseButtonClick();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={handleOverlayClick}>
      <div className="bg-white rounded-lg p-6">
        <div className="w-50 h-50 bt-white rounded-lg p-6">
          '삭제하기' 버튼을 클릭하면 광고글이 영구적으로 지워집니다.
          <button type="button" onClick={handleCloseButtonClick}>
            닫기
          </button>
          <button type="button" className="m-2 w-50 h-10 bg-red-400">
            ⚠️삭제하기⚠️
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdDeleteModal;
