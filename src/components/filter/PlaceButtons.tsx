import React from "react";
import { TypeRegionType } from "@/types/meetupType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { setPlace } from "@/stores/filterSlice";

const PlaceButtons = () => {
  const dispatch = useDispatch();
  const { place } = useSelector((state: RootState) => state.filter);
  const places: TypeRegionType[] = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "미정", "전국"];
  const handlePlaceSelect = (newRegion: TypeRegionType) => {
    dispatch(setPlace(newRegion));
  };

  return (
    <>
      <div>
        <div>
          {places.map(placeItem => (
            <button
              key={placeItem}
              onClick={() => handlePlaceSelect(placeItem)}
              className={`px-3 py-1 text-sm rounded-lg border ${place === placeItem ? "bg-blue-200 border-blue-400 text-blue-950" : "bg-gray-100 border-gray-400 text-gray-800"}`}
            >
              {placeItem}
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default PlaceButtons;
