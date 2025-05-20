import { createSlice } from "@reduxjs/toolkit";

interface NonModalState {
  isAdNonModalOpen: boolean;
}

const initialState: NonModalState = {
  isAdNonModalOpen: false,
};

const nonModalSlice = createSlice({
  name: "nonModal",
  initialState,
  reducers: {
    toggleAdNonModal: state => {
      state.isAdNonModalOpen = !state.isAdNonModalOpen;
    },
    closeAdNonModal: state => {
      state.isAdNonModalOpen = false;
    },
  },
});

export const { toggleAdNonModal, closeAdNonModal } = nonModalSlice.actions;
export default nonModalSlice.reducer;
