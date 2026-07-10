import React from "react";

interface MySpaceListItemProps {
  children: React.ReactNode;
}
const MySpaceListItem = ({ children }: MySpaceListItemProps) => {
  return (
    <div className="grid grid-cols-1">
      <div className="border-border bg-card hover:border-primary/35 flex min-h-[8.2rem] w-full items-center justify-between gap-[1rem] rounded-[1.8rem] border p-[1.2rem] text-sm transition-colors">
        {children}
      </div>
    </div>
  );
};

export default MySpaceListItem;
