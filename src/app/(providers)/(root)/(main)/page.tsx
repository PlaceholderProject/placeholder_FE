"use client";

import React from "react";

import ThumbnailArea from "@/components/thumbnails/ThumbnailArea";
import SortArea from "@/components/sort/SortArea";

const MainPage = () => {
  return (
    <>
      <div>
        <SortArea />
        <ThumbnailArea />
      </div>
    </>
  );
};

export default MainPage;
