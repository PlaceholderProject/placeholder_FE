import { createSlice } from "@reduxjs/toolkit";

interface ModalState {
  isAdDeleteModalOpen: boolean;
}

const initialState: ModalState = {
  isAdDeleteModalOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    toggelAdDeleteModal: state => {
      state.isAdDeleteModalOpen = !state.isAdDeleteModalOpen;
    },
    // 제이든선생님 여기다가 다른 모달 toggle 하는 리듀서들 쭉쭉 추가하면 됩니다!
  },
});

export const { toggelAdDeleteModal } = modalSlice.actions;
export default modalSlice.reducer;
