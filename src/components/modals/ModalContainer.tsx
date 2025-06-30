"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { closeModal } from "@/stores/modalSlice";
import { ModalData, ModalType } from "@/types/modalType";
import MeetupInfoContent from "@/components/modals/Contents/MeetupInfoContent";
// ... (다른 콘텐츠 import)
import AdDeleteContent from "./Contents/AdDeleteContent";
import ProposalCancellationContent from "./Contents/ProposalCancellationContent";
import ProposalPostcardContent from "./Contents/ProposalPostcardContent";
import MeetupMembersContent from "./Contents/MeetupMembersContent";
import MemberDeleteContent from "./Contents/MemberDeleteContent";
import ProposalHideContent from "./Contents/ProposalHideContent";
import { FaTimes } from "react-icons/fa";

// [수정] PC에서 적용될 구체적인 패딩 값을 포함하도록 함수를 수정합니다.
const getModalContainerStyles = (modalType: ModalType): string => {
  // 기본적으로 적용될 모바일 스타일
  const mobileStyles = "rounded-2xl p-6";

  switch (modalType) {
    case "MEETUP_INFO":
      // PC(lg)일 때만 특별한 radius와 패딩을 적용합니다.
      // 88px -> 8.8rem, 71px -> 7.1rem
      return `w-full max-w-lg rounded-[2.7rem] p-6 lg:px-[8.8rem] lg:py-[7.1rem]`;

    case "MEETUP_MEMBERS":
    case "MEMBER_DELETE":
      return `w-full max-w-md ${mobileStyles}`;

    default:
      return `w-full max-w-sm ${mobileStyles}`;
  }
};

const renderModalContent = (modalType: ModalType, modalData: ModalData): JSX.Element | null => {
  // ... renderModalContent 내용은 이전과 동일합니다.
  switch (modalType) {
    case "AD_DELETE":
      return <AdDeleteContent meetupId={modalData.meetupId!} />;
    case "PROPOSAL_CANCELLATION":
      return <ProposalCancellationContent proposal={modalData.proposal!} />;
    case "PROPOSAL_HIDE":
      return <ProposalHideContent proposal={modalData.proposal!} />;
    case "PROPOSAL_POSTCARD":
      return <ProposalPostcardContent meetupId={modalData.meetupId!} />;
    case "MEETUP_MEMBERS":
      return <MeetupMembersContent meetupId={modalData.meetupId!} meetupName={modalData.meetupName!} />;
    case "MEETUP_INFO":
      return <MeetupInfoContent meetupData={modalData.meetupData!} isOrganizer={modalData.isOrganizer!} meetupId={modalData.meetupId!} />;
    case "MEMBER_DELETE":
      return <MemberDeleteContent />;
    default:
      return null;
  }
};

const ModalContainer = () => {
  const dispatch = useDispatch();
  const { modalType, modalData, isOpen } = useSelector((state: RootState) => state.modal);

  // ... useEffect, handleOverlayClick 함수는 이전과 동일합니다.
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        dispatch(closeModal());
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, dispatch]);

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      dispatch(closeModal());
    }
  };

  if (!isOpen || !modalType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 p-4 backdrop-blur-sm backdrop-filter" onClick={handleOverlayClick}>
      <div className={`relative max-h-[90vh] overflow-y-auto bg-white shadow-xl ${getModalContainerStyles(modalType)}`} onClick={e => e.stopPropagation()}>
        <button onClick={() => dispatch(closeModal())} className="absolute right-6 top-6 text-gray-400 hover:text-gray-800" aria-label="Close modal">
          <FaTimes size={24} />
        </button>

        {renderModalContent(modalType, modalData)}
      </div>
    </div>
  );
};

export default ModalContainer;
