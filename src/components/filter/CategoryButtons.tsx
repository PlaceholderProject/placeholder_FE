import React from "react";
import { TypePurposeType } from "@/types/meetupType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { resetFilter, setCatregory } from "@/stores/filterSlice";

const CategoryButtons = () => {
  const dispatch = useDispatch();
  const { category } = useSelector((state: RootState) => state.filter);
  const categories: TypePurposeType[] = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
  // --TO DO--
  // PlaceButtons.tsx CategoryButtons.tsx에서 중복 코드 간결화
  const handlePurposeSelect = (newCategory: TypePurposeType) => {
    if (category === newCategory) {
      dispatch(resetFilter());
    } else {
      dispatch(setCatregory(newCategory));
    }
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
