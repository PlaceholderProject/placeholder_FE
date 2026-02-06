import React from "react";
import { TypeRegionType } from "@/types/meetupType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { resetFilter, setPlace } from "@/stores/filterSlice";

const PlaceButtons = () => {
  const dispatch = useDispatch();
  const { place } = useSelector((state: RootState) => state.filter);
  const places: TypeRegionType[] = ["서울", "경기", "인천", "강원", "대전", "세종", "충남", "충북", "부산", "울산", "경남", "경북", "대구", "광주", "전남", "전북", "제주", "미정", "전국"];
  const handlePlaceSelect = (newPlace: TypeRegionType) => {
    if (place === newPlace) {
      dispatch(resetFilter());
    } else {
      dispatch(setPlace(newPlace));
    }
  };

  return (
    <>
      <div className="mx-auto grid w-full max-w-[34rem] grid-cols-4">
        {places.map(placeItem => (
          <button
            key={placeItem}
            onClick={
              () => handlePlaceSelect(placeItem)
            }
            className={`m-[0.3rem] rounded-[5rem] border-[0.1rem] border-primary px-[2rem] py-[0.5rem] text-base ${place === placeItem ? "text-bold bg-primary text-gray-light" : ""}`}
          >
            {placeItem}
          </button>
        ))}
      </div>
    </>
  );
};

export default PlaceButtons;
