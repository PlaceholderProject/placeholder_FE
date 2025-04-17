import React from "react";
import { RegionType } from "@/types/meetupType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { setRegion } from "@/stores/filterSlice";

const RegionButtons = () => {
  const dispatch = useDispatch();
  const { regionType } = useSelector((state: RootState) => state.filter);
  const regions: RegionType[] = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "미정", "전국"];
  const handleRegionSelect = (newRegion: RegionType) => {
    dispatch(setRegion(newRegion));
  };

  return (
    <>
      <div>
        <div>
          {regions.map(regionItem => (
            <button
              key={regionItem}
              onClick={() => handleRegionSelect(regionItem)}
              className={`px-3 py-1 text-sm rounded-lg border ${regionType === regionItem ? "bg-blue-200 border-blue-400 text-blue-950" : "bg-gray-100 border-gray-400 text-gray-800"}`}
            >
              {regionItem}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default RegionButtons;
