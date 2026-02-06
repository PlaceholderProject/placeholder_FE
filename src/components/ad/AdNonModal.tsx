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
  useEffect(() => {
    return () => {
      dispatch(closeAdNonModal());
    };
  }, [dispatch, pathname]);
  React.useEffect(() => {
  }, [isAdNonModalOpen]);

  const handleThreeDotsClick = () => {
    dispatch(toggleAdNonModal());
  };

  const handleCloseButtonClick = () => {
    openModal("AD_DELETE", { meetupId });
  };

  return (
    <>
      <button>
        <BsThreeDotsVertical onClick={handleThreeDotsClick} />
      </button>
      {isAdNonModalOpen && (
        <div className="absolute bottom-[10rem] right-[3.4rem] z-10 flex h-[6rem] w-[6rem] flex-col items-center justify-center rounded-[0.5rem] bg-white shadow-md">
          <div>
            <Link href={`/meetup/edit/${meetupId}`}>수정</Link>
          </div>

          <button type="button" onClick={handleCloseButtonClick}>
            삭제
            {}
          </button>
        </div>
      )}
    </>
  );
};

export default AdNonModal;
