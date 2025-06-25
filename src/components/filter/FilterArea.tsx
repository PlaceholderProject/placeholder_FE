import React from "react";
import { FilterType } from "@/types/meetupType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { resetFilter, setFilterType } from "@/stores/filterSlice";
import PlaceButtons from "./PlaceButtons";
import CategoryButtons from "./CategoryButtons";

const FilterArea = () => {
  const dispatch = useDispatch();
  const { filterType, isPlaceMenuOpen, isCategoryMenuOpen, isFilterActive } = useSelector((state: RootState) => state.filter);
  const filterButtonsArray = [
    { type: "지역별" as FilterType, label: "지역별" },
    { type: "모임 성격별" as FilterType, label: "모임 성격별" },
  ];
  const handleFilterChange = (newFilterType: FilterType) => {
    dispatch(setFilterType(newFilterType));
  };

  const handleResetFilter = () => {
    dispatch(resetFilter());
  };

  return (
    <div>
      {filterButtonsArray.map(({ type, label }) => (
        <button
          key={type}
          className={`rounded-lg border px-4 py-2 text-base ${
            (type === "지역별" && isPlaceMenuOpen) || (type === "모임 성격별" && isCategoryMenuOpen) ? "border-blue-300 bg-blue-100 text-blue-800" : "border-gray-300 bg-white text-gray-700"
          }`}
          onClick={() => handleFilterChange(type)}
        >
          {label}
        </button>
      ))}
      {isFilterActive && (
        <button className="px-4 py-2 text-red-600 hover:text-red-800" onClick={handleResetFilter}>
          필터 초기화
        </button>
      )}
      <div className="bg-gray-50 p-4">
        {isPlaceMenuOpen && <PlaceButtons />}
        {isCategoryMenuOpen && <CategoryButtons />}
      </div>
    </div>
  );
};

export default FilterArea;
