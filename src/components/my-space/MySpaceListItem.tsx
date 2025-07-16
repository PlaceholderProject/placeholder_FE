import React from "react";

interface MySpaceListItemProps {
  children: React.ReactNode;
  isOngoing: boolean;
}
const MySpaceListItem = ({ children, isOngoing }: MySpaceListItemProps) => {
  const baseClasses = "my-[0.7rem] md:my-[1.2rem] flex h-[4rem] md:h-[5rem] w-full items-center justify-between rounded-[1rem] bg-gray-medium px-[1rem] text-base md:text-lg shadow-md";
  const bgClass = isOngoing ? "bg-secondary-dark" : "bg-gray-medium";
  return (
    <div className="grid grid-cols-1">
      <li className={`${baseClasses} ${bgClass}`}>{children}</li>
    </div>
  );
};

export default MySpaceListItem;
