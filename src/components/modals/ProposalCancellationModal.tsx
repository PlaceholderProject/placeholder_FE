import { toggleProposalCancellationModal } from "@/stores/modalSlice";
import { useDispatch } from "react-redux";
import ModalLayout from "./ModalLayout";

const ProposalCancellationModal = () => {
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(toggleProposalCancellationModal());
  };

  return (
    <ModalLayout onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">신청 취소</h2>
        <p>정말 신청을 취소하시겠습니까?</p>
        <div className="flex justify-end gap-2">
          <button onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded">
            닫기
          </button>
          <button className="px-4 py-2 bg-red-500 text-white rounded">취소하기</button>
        </div>
      </div>
    </ModalLayout>
  );
};

export default ProposalCancellationModal;
