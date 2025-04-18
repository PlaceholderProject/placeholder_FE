import React from "react";
import { TypePurposeType } from "@/types/meetupType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { setCatregory } from "@/stores/filterSlice";

const CategoryButtons = () => {
  const dispatch = useDispatch();
  const { category } = useSelector((state: RootState) => state.filter);
  const categories: TypePurposeType[] = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];

  const handlePurposeSelect = (newPurpose: TypePurposeType) => {
    dispatch(setCatregory(newPurpose));
  };

  return (
    <>
      <div>
        {categories.map(categoryItem => (
          <button
            key={categoryItem}
            onClick={() => handlePurposeSelect(categoryItem)}
            className={`px-3 py-1 text-sm rounded-lg border ${category === categoryItem ? "bg-blue-200 border-blue-300 text-blue-900" : "bg-gray-200 border-gray-400 text-gray-800"}`}
          >
            {categoryItem}
          </button>
        ))}
      </div>
    </>
  );
};

export default CategoryButtons;
