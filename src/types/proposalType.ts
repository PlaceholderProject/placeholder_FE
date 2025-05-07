export type SentProposal = {
  id: number;
  created_at: string;
  meetup_name: string;
  status: string;
  text: string;
};

export type ReceivedProposal = {
  id: number;
  status: string;
  text: string;
  user: { id: number; nickname: string; image: string };
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
  modalType: "cancellation" | "deletion" | null;
  onModalOpen: (proposalId: number, type: "cancellation" | "deletion") => void;
  onModalClose: () => void;
}

export interface ProposalCancellationModalProps {
  proposal: SentProposal;
  onClose: () => void;
}

export interface ProposalDeletionModalProps {
  proposal: SentProposal;
  onClose: () => void;
}

export interface ProposalPostcardProps {
  meetupId: number;
  onClose: () => void;
}
