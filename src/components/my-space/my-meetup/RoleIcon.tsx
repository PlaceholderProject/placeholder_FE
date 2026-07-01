"use client";

import React from "react";
import { LuCrown, LuUsers } from "react-icons/lu";

const RoleIcon = ({ isOrganizer }: { isOrganizer: boolean }) => {
  return (
    <span className={`grid h-[4.4rem] w-[4.4rem] shrink-0 place-items-center rounded-[1.2rem] ${isOrganizer ? "bg-accent text-accent-foreground" : "bg-primary-soft text-primary"}`}>
      {isOrganizer ? <LuCrown className="h-[2rem] w-[2rem] stroke-[1.9]" /> : <LuUsers className="h-[2rem] w-[2rem] stroke-[1.9]" />}
    </span>
  );
};

export default RoleIcon;
