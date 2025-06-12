"use client";

import React from "react";

const RoleIcon = ({ isOrganizer }: { isOrganizer: boolean }) => {
  // console.log("롤아이콘:", isOrganizer);
  return (
    <>
      <div>
        {/* 방장이니?{`${isOrganizer}`} */}
        {isOrganizer ? "👑" : "🤝"}
      </div>
    </>
  );
};

export default RoleIcon;
