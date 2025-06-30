import { Meetup } from "./meetupType";
import { SentProposal } from "./proposalType";
import type { Address } from "react-daum-postcode";

export type ModalType = "AD_DELETE" | "PROPOSAL_HIDE" | "PROPOSAL_CANCELLATION" | "PROPOSAL_DELETION" | "PROPOSAL_POSTCARD" | "MEETUP_MEMBERS" | "MEETUP_INFO" | "MEMBER_DELETE" | "POSTCODE" | null;

export interface ModalData {
  meetupId?: number;
  proposal?: SentProposal;
  meetupData?: Meetup;
  meetupName?: string;
  isOrganizer?: boolean;
  memberId?: number;
  onCompletePostcode?: (data: Address) => void;
}

export interface ModalState {
  modalType: ModalType;
  modalData: ModalData;
  isOpen: boolean;
}
