import React from "react";
import SortArea from "@/components/sort/SortArea";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div>
        <SortArea />

        <div>{children}</div>
      </div>
    </>
  );
};

export default MainLayout;
