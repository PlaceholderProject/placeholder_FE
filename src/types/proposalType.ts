export type SentProposal = {
  id: number;
  created_at: string;
  meetup_name: string;
  meetup_ad_title: string;
  status: string;
  text: string;
};

export type ReceivedProposal = {
  id: number;
  status: string;
  text: string;
  user: { id: number; nickname: string; image: string };
  createdAt: string;
};

export type OrganizedMeetup = {
  ended_at: string;
  id: number;
  is_current: boolean;
  is_organizer: boolean;
  name: string;
};

export interface SentProposalItemProps {
  proposal: SentProposal;
  isModalOpen: boolean;
  modalType: "cancellation" | "hide" | null;
  onModalOpen: (proposalId: number, type: "cancellation" | "hide") => void;
  onModalClose: () => void;
}

export interface ProposalCancellationModalProps {
  meetupId: number;
  proposal: SentProposal;
  onClose: () => void;
}

export interface ProposalHideModalProps {
  proposal: SentProposal;
  onClose: () => void;
}

export interface ProposalPostcardProps {
  meetupId: number;
  onClose: () => void;
}
