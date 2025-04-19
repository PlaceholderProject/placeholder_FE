"use client";

import React from "react";
import SortArea from "@/components/sort/SortArea";
import SortButtons from "@/components/sort/SortButtons";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div style={{ border: "5px solid red", padding: "20px", margin: "10px" }}>
        <div>메인 레이아웃 이거 나중에 분리해야되는데 지금은 구조를 맘대로 만질 수 없읍니다</div>

        <SortArea />

        <div>{children}</div>
      </div>
    </>
  );
};

export default MainLayout;
