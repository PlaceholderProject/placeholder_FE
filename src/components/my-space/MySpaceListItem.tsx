import React from "react";

interface MySpaceListItemProps {
  children: React.ReactNode;
  isOngoing: boolean;
}
const MySpaceListItem = ({ children, isOngoing }: MySpaceListItemProps) => {
  return (
    <div className="grid grid-cols-1">
      <div
        className={`border-border bg-card hover:border-primary/35 flex min-h-[7.2rem] w-full items-center justify-between gap-[1rem] rounded-[1.6rem] border p-[1.2rem] text-sm transition-colors ${
          isOngoing ? "" : "opacity-65"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default MySpaceListItem;
