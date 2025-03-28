import React, { useState } from "react";
import OutButton from "./OutButton";

const MemberOutContainer = () => {
  const [isOrganizer, setIsOrganizer] = useState<boolean>(true);

  // --TO DO--
  // 이거 나중에 고민해서 모임 각각 렌더링되면서 동적 적용되게끔?
  return (
    <div>
      <OutButton />
    </div>
  );
};

export default MemberOutContainer;
