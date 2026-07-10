import { SentProposal } from "./proposalType";
import type { Address } from "react-daum-postcode";

export type ModalType = "AD_DELETE" | "PROPOSAL_HIDE" | "PROPOSAL_CANCELLATION" | "PROPOSAL_POSTCARD" | "MEETUP_MEMBERS" | "MEETUP_LEAVE" | "MEMBER_DELETE" | "POSTCODE" | null;

export interface ModalData {
  meetupId?: number;
  adTitle?: string;
  proposal?: SentProposal;
  meetupName?: string;
  memberId?: number;
  onCompletePostcode?: (data: Address) => void;
}

export interface ModalState {
  modalType: ModalType;
  modalData: ModalData;
  isOpen: boolean;
}
