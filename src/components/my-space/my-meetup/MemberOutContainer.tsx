"use client";

import React, { useState } from "react";
import OutButton from "./OutButton";
import { FaRegUserCircle } from "react-icons/fa";

const MemberOutContainer = () => {
  const [isOrganizer, setIsOrganizer] = useState(false);

  // 아이콘 클릭했는데 Link 이동까지 되는 이벤트 버블링 발생,
  // 이벤트 버블링 방지용

  const handleIconClick = (event: { stopPropagation: () => void; preventDefault: () => void }) => {
    event.stopPropagation();
    event.preventDefault();

    alert("멤버 관리 클릭됨 모달떠야돼");
  };
  return (
    <>
      <div>
        {isOrganizer ? (
          <OutButton isOrganizer={isOrganizer} />
        ) : (
          <button onClick={handleIconClick} className="p-2">
            <FaRegUserCircle />
          </button>
        )}
      </div>
    </>
  );
};

export default MemberOutContainer;
