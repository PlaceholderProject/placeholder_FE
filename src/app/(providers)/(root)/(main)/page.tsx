import React from "react";
import ThumbnailArea from "@/components/thumbnails/ThumbnailArea";
import ThumbnailCarousel from "@/components/thumbnails/ThumbnailCarousel";
import SortArea from "@/components/sort/SortArea";
import FilterArea from "@/components/filter/FilterArea";
import SearchArea from "@/components/search/SearchForm";

const MainPage = () => {
  return (
    <>
      <div>
        <ThumbnailCarousel />
        <SearchArea />
        <SortArea />
        <FilterArea />
        <ThumbnailArea />
      </div>
    </>
  );
};

export default MainPage;
