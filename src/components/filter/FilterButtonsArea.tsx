import { FilterType } from "@/types/meetupType";
import React from "react";
import PlaceButtons from "./PlaceButtons";
import CategoryButtons from "./CategoryButtons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { resetFilter } from "@/stores/filterSlice";

const FilterButtonsArea = ({ currentFilter, handleFilterChange }: { currentFilter: FilterType; handleFilterChange: (NewFilterType: FilterType) => void }) => {
  const filterButtonsArray = [
    { type: "지역별" as FilterType, label: "지역별" },
    { type: "모임 성격별" as FilterType, label: "모임 성격별" },
  ];
  const { isPlaceMenuOpen, isCategoryMenuOpen, isFilterActive } = useSelector((state: RootState) => state.filter);
  const dispatch = useDispatch();

  const handleResetFilter = () => {
    dispatch(resetFilter());
  };

  return (
    <div>
      <div className="flex justify-center justify-items-center bg-gray-medium">
        {filterButtonsArray.map(({ type, label }) => (
          <button key={type} className={`mt-[1rem] text-base`} onClick={() => handleFilterChange(type)}>
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
