"use client";

import React from "react";

const AdButton = ({ meetupId }: { meetupId: number }) => {
  const handleAdNonModalInteraction = () => alert("광고 수정삭제 논모달 외부영역 상호작용 테스트");
  return (
    <>
      <button type="button" onClick={handleAdNonModalInteraction}>
        {" "}
        <h3>여기는 이제 전역상태 변화에 따라 무지막지하게 변화할 버튼이 들어갑니당..</h3>
        <div>AdButton</div>
      </button>
    </>
  );
};

export default AdButton;
