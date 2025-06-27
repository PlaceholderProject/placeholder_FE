import React from "react";

import ThumbnailArea from "@/components/thumbnails/ThumbnailArea";
import SortArea from "@/components/sort/SortArea";
import FilterArea from "@/components/filter/FilterArea";
import SearchArea from "@/components/search/SearchForm";

const MainPage = () => {
  return (
    <>
      <div>
        <SearchArea />
        <SortArea />
        <FilterArea />
        <ThumbnailArea />
      </div>
    </>
  );
};

export default MainPage;
