"use client";

import React from "react";

const RoleIcon = ({ isOrganizer }: { isOrganizer: boolean }) => {
  return (
    <>
      <div className="mr-[0.5rem]">
        {}
        {isOrganizer ? "👑" : "🤝"}
      </div>
    </>
  );
};

export default RoleIcon;
