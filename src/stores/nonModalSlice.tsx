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
  },
});

export const { toggleAdNonModal } = nonModalSlice.actions;
export default nonModalSlice.reducer;
