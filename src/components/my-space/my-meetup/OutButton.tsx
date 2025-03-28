import React, { useState } from "react";

// 이거 isOrganizer냐에 따라서 재활용할거예요

const OutButton = () => {
  const [isOrganizer, setIsOrganizer] = useState(false);
  return (
    // --TO DO--
    // 이거 나중에 고민해서 모임 각각 렌더링되면서 동적 적용되게끔?
    <div>
      <button className="bg-red-500 rounded-md text-white"> {isOrganizer ? `강퇴` : `퇴장`}</button>
    </div>
  );
};

export default OutButton;
