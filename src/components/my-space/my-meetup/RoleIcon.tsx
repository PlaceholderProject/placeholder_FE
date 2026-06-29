"use client";

import React from "react";

const RoleIcon = ({ isOrganizer }: { isOrganizer: boolean }) => {
  return (
    <>
      <div className="mr-[0.5rem]">
        {/* 방장이니?{`${isOrganizer}`} */}
        {isOrganizer ? "👑" : "🤝"}
      </div>
    </>
  );
};

export default RoleIcon;
