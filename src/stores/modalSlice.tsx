import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ModalData, ModalState, ModalType } from "@/types/modalType";

const initialState: ModalState = {
  modalType: null,
  modalData: {},
  isOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    openModal: (state, action: PayloadAction<{ type: ModalType; data?: ModalData }>) => {
      state.modalType = action.payload.type;
      state.modalData = action.payload.data || {};
      state.isOpen = true;
    },
    closeModal: state => {
      state.modalType = null;
      state.modalData = {};
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export default modalSlice.reducer;