"use client";

import React from "react";

import ThumbnailArea from "@/components/thumbnails/ThumbnailArea";
import SortArea from "@/components/sort/SortArea";
import FilterArea from "@/components/filter/FilterArea";

const MainPage = () => {
  return (
    <>
      <div>
        <SortArea />
        <FilterArea />
        <ThumbnailArea />
      </div>
    </>
  );
};

export default MainPage;
