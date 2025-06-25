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
  const handleCategorySelect = (newCategory: TypePurposeType) => {
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
            onClick={() => handleCategorySelect(categoryItem)}
            className={`rounded-lg border px-3 py-1 text-sm ${category === categoryItem ? "border-blue-300 bg-blue-200 text-blue-900" : "border-gray-400 bg-gray-200 text-gray-800"}`}
          >
            {categoryItem}
          </button>
        ))}
      </div>
    </>
  );
};

export default CategoryButtons;
