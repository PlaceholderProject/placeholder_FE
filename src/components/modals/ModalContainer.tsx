"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { closeModal } from "@/stores/modalSlice";
import { ModalData, ModalType } from "@/types/modalType";
import { FaTimes } from "react-icons/fa";

import AdDeleteContent from "./Contents/AdDeleteContent";
import ProposalCancellationContent from "./Contents/ProposalCancellationContent";
import ProposalPostcardContent from "./Contents/ProposalPostcardContent";
import MeetupMembersContent from "./Contents/MeetupMembersContent";
import MeetupInfoContent from "./Contents/MeetupInfoContent";
import MemberDeleteContent from "./Contents/MemberDeleteContent";
import ProposalHideContent from "./Contents/ProposalHideContent";
import PostcodeContent from "./Contents/PostcodeContent";

const getModalContainerStyles = (modalType: ModalType): string => {
  const baseStyles = "w-full rounded-2xl p-6";

  switch (modalType) {
    case "POSTCODE":
      return `${baseStyles} max-w-lg`;
    case "MEETUP_INFO":
      // 모바일에서는 rounded-2xl, PC(lg)에서는 rounded-[2.7rem]으로 반응형 radius 적용
      return `w-full max-w-lg rounded-2xl lg:rounded-[2.7rem] p-6 lg:px-12 lg:py-10`;
    case "MEETUP_MEMBERS":
    case "MEMBER_DELETE":
      return `${baseStyles} max-w-md`;
    default:
      return `${baseStyles} max-w-sm`;
  }
};

const renderModalContent = (modalType: ModalType, modalData: ModalData): JSX.Element | null => {
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
    case "POSTCODE":
      if (!modalData.onCompletePostcode) return null;
      return <PostcodeContent onComplete={modalData.onCompletePostcode} />;
    default:
      return null;
  }
};

const ModalContainer = () => {
  const dispatch = useDispatch();
  const { modalType, modalData, isOpen } = useSelector((state: RootState) => state.modal);

  useEffect(() => {
    const originalHtmlStyle = window.getComputedStyle(document.documentElement).overflow;
    const originalBodyStyle = window.getComputedStyle(document.body).overflow;

    if (isOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    }

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        dispatch(closeModal());
      }
    };
    document.addEventListener("keydown", handleEscKey);

    return () => {
      document.documentElement.style.overflow = originalHtmlStyle;
      document.body.style.overflow = originalBodyStyle;
      document.removeEventListener("keydown", handleEscKey);
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
        <button onClick={() => dispatch(closeModal())} className="absolute right-6 top-6 z-10 text-gray-400 hover:text-gray-800" aria-label="Close modal">
          <FaTimes size={24} />
        </button>

        {renderModalContent(modalType, modalData)}
      </div>
    </div>
  );
};

export default ModalContainer;
