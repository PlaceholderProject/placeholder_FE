import { FilterAreaType } from "@/types/meetupType";
import React from "react";
import PlaceButtons from "./PlaceButtons";
import CategoryButtons from "./CategoryButtons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { resetFilter, toggleCategoryMenu, togglePlaceMenu } from "@/stores/filterSlice";

const FilterButtonsArea = () => {
  const filterButtonsArray = [
    { type: "place" as FilterAreaType, label: "지역별" },
    { type: "category" as FilterAreaType, label: "성격별" },
  ];
  const { isPlaceMenuOpen, isCategoryMenuOpen, isFilterActive } = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch();

  const handlePlaceButtonClick = () => {
    dispatch(togglePlaceMenu());
  };

  const handleCategoryButtonClick = () => {
    dispatch(toggleCategoryMenu());
  };

  const handleResetFilter = () => {
    dispatch(resetFilter());
  };

  return (
    <div>
      <div className="flex justify-center justify-items-center bg-gray-medium">
        {filterButtonsArray.map(({ type, label }) => (
          <button key={type} className={`mt-[1rem] text-base`} onClick={handleCategoryButtonClick}>
            {label}
          </button>
        ))}

        <div>
          {isPlaceMenuOpen && !isCategoryMenuOpen && <PlaceButtons />}
          {isCategoryMenuOpen && !isPlaceMenuOpen && <CategoryButtons />}
        </div>
      </div>
    </div>
  );
};

export default FilterButtonsArea;
