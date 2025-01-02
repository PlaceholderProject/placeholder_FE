"use client";

import Link from "next/link";
import React from "react";
import { BASE_URL } from "@/constants/baseURL";
import AdDeleteModal from "./AdDeleteModal";
import { BsThreeDotsVertical } from "react-icons/bs";

const AdNonModal = () => {
  const handleThreeDotsClick = () => {
    alert("점 세개 클릭됐으니 논모달 시트를 띄워주세요");
  };
  return (
    <>
      <button>
        <BsThreeDotsVertical onClick={handleThreeDotsClick} />
      </button>
      <div>
        {" "}
        <Link href={BASE_URL}>수정</Link>
        <button
          type="button"
          onClick={() => {
            alert("'클릭하면 현재 광고글이 삭제되고, 복구할 수 없습니다. 정말 삭제하시겠습니까? 라는 모달 띄우자'");
          }}
        >
          삭제
        </button>
      </div>
    </>
  );
};

export default AdNonModal;
