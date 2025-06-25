import React from "react";
import { FilterType } from "@/types/meetupType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { resetFilter, setFilterType } from "@/stores/filterSlice";
import PlaceButtons from "./PlaceButtons";
import CategoryButtons from "./CategoryButtons";

const FilterArea = () => {
  const dispatch = useDispatch();
  const { isPlaceMenuOpen, isCategoryMenuOpen } = useSelector((state: RootState) => state.filter);
  const filterButtonsArray = [
    { type: "지역별" as FilterType, label: "지역별" },
    { type: "모임 성격별" as FilterType, label: "모임 성격별" },
  ];
  const handleFilterChange = (newFilterType: FilterType) => {
    dispatch(setFilterType(newFilterType));
  };

  // const handleResetFilter = () => {
  //   dispatch(resetFilter());
  // };

  return (
    <>
      <div className="mx-auto flex w-[34rem] justify-center justify-items-center bg-gray-medium py-[0.5rem]">
        {filterButtonsArray.map(({ type, label }) => (
          <button
            key={type}
            className={`rounded-lg px-[2rem] py-[0.5rem] text-base ${(type === "지역별" && isPlaceMenuOpen) || (type === "모임 성격별" && isCategoryMenuOpen) ? "font-bold" : ""}`}
            onClick={() => handleFilterChange(type)}
          >
            {label}
          </button>
        ))}
        {/* {isFilterActive && (
        <button className="px-4 py-2 text-red-600 hover:text-red-800" onClick={handleResetFilter}>
          필터 초기화
        </button>
      )} */}
      </div>
      <div className="bg-gray-50 p-[1rem]">
        {isPlaceMenuOpen && <PlaceButtons />}
        {isCategoryMenuOpen && <CategoryButtons />}
      </div>
    </>
  );
};

export default FilterArea;
