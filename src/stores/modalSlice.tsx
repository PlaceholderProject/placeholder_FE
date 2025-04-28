import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isAdDeleteModalOpen: boolean;
  isMemberDeleteModalOpen: boolean;
  isProposalPostcardModalOpen: boolean;
  isProposalCancellationModalOpen: boolean;
  isProposalDeletionModalOpen: boolean;
}

const initialState: ModalState = {
  isAdDeleteModalOpen: false,
  isMemberDeleteModalOpen: false,
  isProposalPostcardModalOpen: false,
  isProposalCancellationModalOpen: false,
  isProposalDeletionModalOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleAdDeleteModal: state => {
      state.isAdDeleteModalOpen = !state.isAdDeleteModalOpen;
    },
    toggleMemberDeleteModal: state => {
      state.isMemberDeleteModalOpen = !state.isMemberDeleteModalOpen;
    },
    toggleProposalPostcardModal: state => {
      state.isProposalPostcardModalOpen = !state.isProposalPostcardModalOpen;
    },
    toggleProposalCancellationModal: state => {
      state.isProposalCancellationModalOpen = !state.isProposalCancellationModalOpen;
    },
    toggleProposalDeletionModal: state => {
      state.isProposalDeletionModalOpen = !state.isProposalDeletionModalOpen;
    },
  },
});

export const { toggleAdDeleteModal, toggleMemberDeleteModal, toggleProposalPostcardModal, toggleProposalCancellationModal, toggleProposalDeletionModal } = modalSlice.actions;
export default modalSlice.reducer;
