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
    <div className="mx-auto flex w-[95%] min-w-[32rem] items-start justify-between gap-[1rem] md:max-w-[100rem] md:items-center">
      <div>
        <h2 className="text-foreground text-2xl font-bold md:text-3xl">지금 모집 중인 모임</h2>
        <p className="text-muted-foreground mt-[0.2rem] text-sm md:text-base">관심사에 맞는 모임을 찾아보세요</p>
      </div>
      <div className="hidden md:block">
        <SortButtons currentSort={sortType} handleSortChange={handleSortChange} />
      </div>
    </div>
  );
};

export default SortArea;
