"use client";

import Link from "next/link";
import React, { useEffect } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { closeAdNonModal, toggleAdNonModal } from "@/stores/nonModalSlice";
import { usePathname } from "next/navigation";
import { useModal } from "@/hooks/useModal";

const AdNonModal = ({ meetupId }: { meetupId: number }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { openModal } = useModal();
  const isAdNonModalOpen = useSelector((state: RootState) => state.nonModal.isAdNonModalOpen);

  // 페이지 이동 감지하고 모달 상태 초기회ㅏ
  useEffect(() => {
    return () => {
      dispatch(closeAdNonModal());
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

  const handleCloseButtonClick = () => {
    openModal("AD_DELETE", { meetupId });
    // console.log(isAdDeleteModalOpen);
  };

  return (
    <>
      <button>
        <BsThreeDotsVertical onClick={handleThreeDotsClick} />
      </button>
      {isAdNonModalOpen && (
        <div className="absolute bottom-[10rem] right-[3.4rem] z-10 flex h-[6rem] w-[6rem] flex-col items-center justify-center rounded-[0.5rem] bg-white shadow-md">
          <div>
            <Link href={`/meetup-edit/${meetupId}`}>수정</Link>
          </div>

          <button type="button" onClick={handleCloseButtonClick}>
            삭제
            {/* 이걸 클릭하면 isAdDeleModalOpen 상태가 토글되어야 함 */}
          </button>
        </div>
      )}
    </>
  );
};

export default AdNonModal;
