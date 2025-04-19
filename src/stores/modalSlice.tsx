import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isAdDeleteModalOpen: boolean;
  isMemberDeleteModalOpen: boolean;
}

const initialState: ModalState = {
  isAdDeleteModalOpen: false,
  isMemberDeleteModalOpen: false,
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
  },
});

export const { toggleAdDeleteModal, toggleMemberDeleteModal } = modalSlice.actions;
export default modalSlice.reducer;
