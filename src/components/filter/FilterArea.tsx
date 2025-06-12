"use client";
import React from "react";
import { resetFilter, toggleCategoryMenu, togglePlaceMenu } from "@/stores/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import CategoryButtons from "./CategoryButtons";
import PlaceButtons from "./PlaceButtons";

const FilterArea = () => {
  const dispatch = useDispatch();

  const { isPlaceMenuOpen, isCategoryMenuOpen, place, category, isFilterActive } = useSelector((state: RootState) => state.filter);

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
      <div>
        <button className={`rounded-lg border px-4 py-2 ${isPlaceMenuOpen ? "border-blue-300 bg-blue-100" : "border-gray-300"}`} onClick={handlePlaceButtonClick}>
          지역별
        </button>

        <button className={`rounded-lg border px-4 py-2 ${isCategoryMenuOpen ? "border-blue-300 bg-blue-100" : "border-gray-300"}`} onClick={handleCategoryButtonClick}>
          모임 성격별
        </button>

        {isFilterActive ? (
          <button className="px-4 py-2 text-red-600 hover:text-red-800" onClick={handleResetFilter}>
            필터 초기화
          </button>
        ) : (
          "선택된 필터가 없습니다."
        )}
      </div>
      {isPlaceMenuOpen && !isCategoryMenuOpen && <PlaceButtons />}
      {isCategoryMenuOpen && !isPlaceMenuOpen && <CategoryButtons />}
    </div>
  );
};

export default FilterArea;
