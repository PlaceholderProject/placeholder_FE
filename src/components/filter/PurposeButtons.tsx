import React from "react";
import { PurposeType } from "@/types/meetupType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { setPurpose } from "@/stores/filterSlice";

const PurposeButtons = () => {
  const dispatch = useDispatch();
  const { purpose } = useSelector((state: RootState) => state.filter);
  const purposes: PurposeType[] = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];

  const handlePurposeSelect = (newPurpose: PurposeType) => {
    dispatch(setPurpose(newPurpose));
  };

  {
    purposes;
  }
  return (
    <>
      <div>
        {purposes.map(purposeItem => (
          <button
            key={purposeItem}
            onClick={() => handlePurposeSelect(purposeItem)}
            className={`px-3 py-1 text-sm rounded-lg border ${purpose === purposeItem ? "bg-blue-200 border-blue-300 text-blue-900" : "bg-gray-200 border-gray-400 text-gray-800"}`}
          >
            {purposeItem}
          </button>
        ))}
      </div>
    </>
  );
};

export default PurposeButtons;
