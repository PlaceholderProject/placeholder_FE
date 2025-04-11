"use client";
import React from "react";
import { toggleRegionMenu, togglePurposeMenu, setRegion, setPurpose, resetFilter } from "@/stores/filterSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import RegionButtons from "./RegionButtons";
import PurposeButtons from "./PurposeButtons";

const FilterArea = () => {
  const dispatch = useDispatch();

  const { isRegionMenuOpen, isPurposeMenuOpen, region, purpose, isFilterActive } = useSelector((state: RootState) => state.filter);

  const handleRegionButtonClick = () => {
    dispatch(toggleRegionMenu());
  };

  const handlePurposeButtonClick = () => {
    dispatch(togglePurposeMenu());
  };

  const handleResetFilter = () => {
    dispatch(resetFilter());
  };

  return (
    <div>
      <div>
        <button className={`px-4 py-2 rounded-lg border ${isRegionMenuOpen ? "bg-blue-100 border-blue-300" : "border-gray-300"}`} onClick={handleRegionButtonClick}>
          지역별
        </button>

        <button className={`px-4 py-2 rounded-lg border ${isPurposeMenuOpen ? "bg-blue-100 border-blue-300" : "border-gray-300"}`} onClick={handlePurposeButtonClick}>
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
      {isRegionMenuOpen && !isPurposeMenuOpen && <RegionButtons />}
      {isPurposeMenuOpen && !isRegionMenuOpen && <PurposeButtons />}
    </div>
  );
};

export default FilterArea;
