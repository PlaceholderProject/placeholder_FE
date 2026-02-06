"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { SortType } from "@/types/meetupType";
import { setSortType } from "@/stores/sortSlice";
import SortButtons from "./SortButtons";

const SortArea = () => {
  const dispatch = useDispatch();
  const sortType = useSelector((state: RootState) => state.sort.sortType);

  const handleSortChange = (newSortType: SortType) => {

    dispatch(setSortType(newSortType));
  };

  return (
    <>
      <div className="mx-auto mb-[1rem] mt-[1rem] flex w-[34rem] min-w-[32rem] justify-start md:mb-[1.2rem] md:mt-[0.1rem] md:w-[95%] md:max-w-[80rem]">
        <SortButtons currentSort={sortType} handleSortChange={handleSortChange} />
      </div>
    </>
  );
};

export default SortArea;
