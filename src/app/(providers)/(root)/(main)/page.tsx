import React from "react";
import ThumbnailArea from "@/components/thumbnails/ThumbnailArea";
import ThumbnailCarousel from "@/components/thumbnails/ThumbnailCarousel";
import SortArea from "@/components/sort/SortArea";
import FilterArea from "@/components/filter/FilterArea";

const MainPage = () => {
  return (
    <div className="space-y-[3.2rem] pt-[1.6rem] pb-[4rem] md:space-y-[4.4rem] md:pt-[2.4rem] md:pb-[7rem]">
      <ThumbnailCarousel />
      <div className="space-y-[1.6rem] md:space-y-[2.2rem]">
        <SortArea />
        <FilterArea />
      </div>
      <ThumbnailArea />
    </div>
  );
};

export default MainPage;
