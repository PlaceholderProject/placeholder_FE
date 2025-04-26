import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isAdDeleteModalOpen: boolean;
  isMemberDeleteModalOpen: boolean;
  isProposalPostcardModalOpen: boolean;
}

const initialState: ModalState = {
  isAdDeleteModalOpen: false,
  isMemberDeleteModalOpen: false,
  isProposalPostcardModalOpen: false,
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
  },
});

export const { toggleAdDeleteModal, toggleMemberDeleteModal, toggleProposalPostcardModal } = modalSlice.actions;
export default modalSlice.reducer;
