"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { closeModal } from "@/stores/modalSlice";
import { ModalData, ModalType } from "@/types/modalType";
import AdDeleteContent from "@/components/modals/Contents/AdDeleteContent";
import ProposalCancellationContent from "@/components/modals/Contents/ProposalCancellationContent";
import ProposalDeletionContent from "@/components/modals/Contents/ProposalDeletionContent";
import ProposalPostcardContent from "@/components/modals/Contents/ProposalPostcardContent";
import MeetupMembersContent from "@/components/modals/Contents/MeetupMembersContent";
import MeetupInfoContent from "@/components/modals/Contents/MeetupInfoContent";
import MemberDeleteContent from "@/components/modals/Contents/MemberDeleteContent";

// 모달 컨텐츠 컴포넌트들 import

// 모달 크기 설정 (반응형)
const getModalSize = (modalType: ModalType): string => {
  switch (modalType) {
    case "MEETUP_MEMBERS":
    case "MEETUP_INFO":
      return "w-full max-w-md max-h-[90vh] overflow-y-auto";
    case "PROPOSAL_POSTCARD":
      return "w-[280px] max-w-[90vw]";
    default:
      return "w-[280px] h-[287px] max-w-[90vw] max-h-[90vh]";
  }
};

// 모달 컨텐츠 렌더링
const renderModalContent = (modalType: ModalType, modalData: ModalData): JSX.Element | null => {
  switch (modalType) {
    case "AD_DELETE":
      return <AdDeleteContent meetupId={modalData.meetupId!} />;
    case "PROPOSAL_CANCELLATION":
      return <ProposalCancellationContent proposal={modalData.proposal!} />;
    case "PROPOSAL_DELETION":
      return <ProposalDeletionContent proposal={modalData.proposal!} />;
    case "PROPOSAL_POSTCARD":
      return <ProposalPostcardContent meetupId={modalData.meetupId!} />;
    case "MEETUP_MEMBERS":
      return <MeetupMembersContent meetupId={modalData.meetupId!} meetupName={modalData.meetupName!} />;
    case "MEETUP_INFO":
      return <MeetupInfoContent meetupData={modalData.meetupData!} isOrganizer={modalData.isOrganizer!} meetupId={modalData.meetupId!} />;
    case "MEMBER_DELETE":
      return <MemberDeleteContent memberId={modalData.memberId!} />;
    default:
      return null;
  }
};

const ModalContainer = () => {
  const dispatch = useDispatch();
  const { modalType, modalData, isOpen } = useSelector((state: RootState) => state.modal);

  // ESC 키로 모달 닫기 + 바디 스크롤 방지
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

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      dispatch(closeModal());
    }
  };

  // 모달이 열려있지 않으면 렌더링 안함
  if (!isOpen || !modalType) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={handleOverlayClick}>
      <div className={`rounded-lg bg-white p-6 shadow-lg ${getModalSize(modalType)} flex items-center justify-center`} onClick={e => e.stopPropagation()}>
        {renderModalContent(modalType, modalData)}
      </div>
    </div>
  );
};

export default ModalContainer;
