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
      <div className="mx-auto grid w-full max-w-[34rem] grid-cols-4">
        {categories.map(categoryItem => (
          <button
            key={categoryItem}
            onClick={() => handleCategorySelect(categoryItem)}
            className={`m-[0.3rem] rounded-[5rem] border-[0.1rem] border-primary px-[2rem] py-[0.5rem] text-base ${category === categoryItem ? "text-bold bg-primary text-gray-light" : ""}`}
          >
            {categoryItem}
          </button>
        ))}
      </div>
    </>
  );
};

export default CategoryButtons;
