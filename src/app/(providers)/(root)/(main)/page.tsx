import React from "react";
import ThumbnailArea from "@/components/thumbnails/ThumbnailArea";
import ThumbnailCarousel from "@/components/thumbnails/ThumbnailCarousel";
import SortArea from "@/components/sort/SortArea";
import FilterArea from "@/components/filter/FilterArea";

const MainPage = () => {
  return (
    <div className="space-y-[2rem] py-[1rem]">
      <ThumbnailCarousel />
      <div className="space-y-[1.2rem] md:space-y-[2rem]">
        <SortArea />
        <FilterArea />
      </div>
      <ThumbnailArea />
    </div>
  );
};

export default MainPage;
