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
    // 제이든선생님 여기다가 다른 모달 toggle 하는 리듀서들 쭉쭉 추가하면 됩니다!
  },
});

export const { toggleAdDeleteModal, toggleMemberDeleteModal } = modalSlice.actions;
export default modalSlice.reducer;
