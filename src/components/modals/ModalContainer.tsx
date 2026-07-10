"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { closeModal } from "@/stores/modalSlice";
import { ModalData, ModalType } from "@/types/modalType";

import AdDeleteContent from "./contents/AdDeleteContent";
import ProposalCancellationContent from "./contents/ProposalCancellationContent";
import ProposalPostcardContent from "./contents/ProposalPostcardContent";
import MeetupMembersContent from "./contents/MeetupMembersContent";
import MemberDeleteContent from "./contents/MemberDeleteContent";
import ProposalHideContent from "./contents/ProposalHideContent";
import PostcodeContent from "./contents/PostcodeContent";
import { LuX } from "react-icons/lu";
import MeetupLeaveContent from "./contents/MeetupLeaveContent";

const getModalContainerStyles = (modalType: ModalType): string => {
  const baseStyles = "w-full rounded-[2rem] p-[1.8rem]";

  switch (modalType) {
    case "POSTCODE":
      return `${baseStyles} max-w-lg`;
    case "PROPOSAL_POSTCARD":
      return `${baseStyles} max-w-[42rem] md:p-[2.2rem]`;
    case "AD_DELETE":
    case "PROPOSAL_CANCELLATION":
    case "PROPOSAL_HIDE":
    case "MEETUP_LEAVE":
      return `${baseStyles} max-w-[40rem] md:p-[2rem]`;
    case "MEETUP_MEMBERS":
    case "MEMBER_DELETE":
      return `${baseStyles} max-w-[44rem] md:p-[2rem]`;
    default:
      return `${baseStyles} max-w-sm`;
  }
};

const renderModalContent = (modalType: ModalType, modalData: ModalData): JSX.Element | null => {
  switch (modalType) {
    case "AD_DELETE":
      return <AdDeleteContent meetupId={modalData.meetupId!} adTitle={modalData.adTitle} />;
    case "PROPOSAL_CANCELLATION":
      return <ProposalCancellationContent proposal={modalData.proposal!} />;
    case "PROPOSAL_HIDE":
      return <ProposalHideContent proposal={modalData.proposal!} />;
    case "PROPOSAL_POSTCARD":
      return <ProposalPostcardContent meetupId={modalData.meetupId!} />;
    case "MEETUP_MEMBERS":
      return <MeetupMembersContent meetupId={modalData.meetupId!} meetupName={modalData.meetupName!} />;
    case "MEETUP_LEAVE":
      return <MeetupLeaveContent meetupId={modalData.meetupId!} meetupName={modalData.meetupName!} />;
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
    <div className="bg-background/75 fixed inset-0 z-50 flex items-center justify-center p-[1.2rem] backdrop-blur-md" onClick={handleOverlayClick}>
      <div
        className={`border-border bg-card relative max-h-[90vh] overflow-y-auto border shadow-[0_2rem_5rem_rgba(22,21,15,0.14)] ${getModalContainerStyles(modalType)}`}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={() => dispatch(closeModal())}
          className="text-muted-foreground hover:bg-muted hover:text-foreground absolute top-[1.4rem] right-[1.4rem] z-10 grid h-[3.4rem] w-[3.4rem] place-items-center rounded-full transition-colors"
          aria-label="모달 닫기"
        >
          <LuX className="h-[1.9rem] w-[1.9rem] stroke-[1.9]" />
        </button>

        {renderModalContent(modalType, modalData)}
      </div>
    </div>
  );
};

export default ModalContainer;
