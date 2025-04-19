import React, { useState } from "react";

// 이거 isOrganizer냐에 따라서 강퇴, 퇴장으로 빨간 버튼 재사용하게 분리?

const OutButton = ({ isOrganizer }: { isOrganizer: boolean }) => {
  return (
    <div>
      <button className="bg-red-500 rounded-md text-whitem px-2 py-1"> {isOrganizer ? `강퇴` : `퇴장`}</button>
    </div>
  );
};

export default OutButton;
