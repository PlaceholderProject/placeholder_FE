import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isAdDeleteModalOpen: boolean;
  isMemberDeleteModalOpen: boolean;
  isMeetupInfoModalOpen: boolean;
  isMeetupMembersModalOpen: boolean;
  selectedMeetupId?: number;
}

const initialState: ModalState = {
  isAdDeleteModalOpen: false,
  isMemberDeleteModalOpen: false,
  isMeetupInfoModalOpen: false,
  isMeetupMembersModalOpen: false,
  selectedMeetupId: undefined,
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
      // 모달 닫을 때 선택된 아이디도 초기화해야지
      if (!state.isMemberDeleteModalOpen) {
        state.selectedMeetupId = undefined;
      }
    },
    toggleMeetupInfoModal: state => {
      state.isMeetupInfoModalOpen = !state.isMeetupInfoModalOpen;
    },
    toggleMeetupMembersModal: state => {
      state.isMeetupMembersModalOpen = !state.isMeetupMembersModalOpen;
    },
    setSelectedMeetupId: (state, action) => {
      state.selectedMeetupId = action.payload;
    },
  },
});

export const { toggleAdDeleteModal, closeAdDeleteModal, setSelectedMeetupId, toggleMemberDeleteModal, toggleMeetupInfoModal, toggleMeetupMembersModal } = modalSlice.actions;

export default modalSlice.reducer;
