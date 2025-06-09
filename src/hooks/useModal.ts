import { useDispatch } from "react-redux";
import { closeModal, openModal } from "@/stores/modalSlice";
import { ModalData, ModalType } from "@/types/modalType";

export const useModal = () => {
  const dispatch = useDispatch();

  const openModalHandler = (type: ModalType, data?: ModalData) => {
    dispatch(openModal({ type, data }));
  };

  const closeModalHandler = () => {
    dispatch(closeModal());
  };

  return {
    openModal: openModalHandler,
    closeModal: closeModalHandler,
  };
};
