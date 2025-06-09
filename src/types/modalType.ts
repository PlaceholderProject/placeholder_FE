import { Meetup } from "./meetupType";
import { SentProposal } from "./proposalType";

// 모달 타입 정의
export type ModalType = "AD_DELETE" | "PROPOSAL_CANCELLATION" | "PROPOSAL_DELETION" | "PROPOSAL_POSTCARD" | "MEETUP_MEMBERS" | "MEETUP_INFO" | "MEMBER_DELETE" | null;

// 각 모달 데이터 타입
export interface ModalData {
  meetupId?: number;
  proposal?: SentProposal;
  meetupData?: Meetup;
  meetupName?: string;
  isOrganizer?: boolean;
  memberId?: number;
}

export interface ModalState {
  modalType: ModalType;
  modalData: ModalData;
  isOpen: boolean;
}
