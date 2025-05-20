import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isAdDeleteModalOpen: boolean;
  isMemberDeleteModalOpen: boolean;
  isMeetupInfoModalOpen: boolean;
  isMeetupMembersModalOpen: boolean;
}

const initialState: ModalState = {
  isAdDeleteModalOpen: false,
  isMemberDeleteModalOpen: false,
  isMeetupInfoModalOpen: false,
  isMeetupMembersModalOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggleAdDeleteModal: state => {
      state.isAdDeleteModalOpen = !state.isAdDeleteModalOpen;
    },
    closeAdDeleteModal: state => {
      state.isAdDeleteModalOpen = false;
    },
    toggleMemberDeleteModal: state => {
      state.isMemberDeleteModalOpen = !state.isMemberDeleteModalOpen;
    },
    toggleMeetupInfoModal: state => {
      state.isMeetupInfoModalOpen = !state.isMeetupInfoModalOpen;
    },
    toggleMeetupMembersModal: state => {
      state.isMeetupMembersModalOpen = !state.isMeetupMembersModalOpen;
    },
  },
});

export const {
  toggleAdDeleteModal,
  closeAdDeleteModal, toggleMemberDeleteModal,
  toggleMeetupInfoModal,
  toggleMeetupMembersModal,
} = modalSlice.actions;

export default modalSlice.reducer;