"use client";

import Link from "next/link";
import React from "react";
import AdDeleteModal from "./AdDeleteModal";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { toggleAdNonModal } from "@/stores/nonModalSlice";

const AdNonModal = ({ meetupId }: { meetupId: number }) => {
  const dispatch = useDispatch();
  const isAdNonModalOpen = useSelector((state: RootState) => state.nonModal.isAdNonModalOpen);

  // 토글 상태변화 감지용
  React.useEffect(() => {
    console.log("상태 업데이트됨:", isAdNonModalOpen);
  }, [isAdNonModalOpen]);

  const handleThreeDotsClick = () => {
    // alert("점 세개 클릭됐으니 논모달 시트를 띄워주세요");
    dispatch(toggleAdNonModal());
    console.log(isAdNonModalOpen);
  };
  return (
    <>
      <button>
        <BsThreeDotsVertical onClick={handleThreeDotsClick} />
      </button>
      {isAdNonModalOpen && (
        <div className="absolute right-3 m-2 bg-white shadow-lg rounded-lg p-6">
          <div>
            <Link href={`http://localhost:3000/meetup-edit/${meetupId}`}>수정</Link>
          </div>
          <button
            type="button"
            onClick={() => {
              alert("'클릭하면 현재 광고글이 삭제되고, 복구할 수 없습니다. 정말 삭제하시겠습니까? 라는 모달 띄우자'");
            }}
          >
            삭제
          </button>
        </div>
      )}
    </>
  );
};

export default AdNonModal;
