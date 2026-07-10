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
    <div className="mx-auto flex w-[calc(100%-3.2rem)] items-end justify-between gap-[1.2rem] md:max-w-[112rem]">
      <div>
        <h2 className="text-foreground text-[2.4rem] leading-tight font-black tracking-[-0.04em] md:text-[3.4rem]">지금, 함께할 사람들</h2>
        <p className="text-muted-foreground mt-[0.45rem] text-sm md:text-base">취향이 맞는 모임을 발견하고 가볍게 시작해보세요.</p>
      </div>
      <div className="hidden md:block">
        <SortButtons currentSort={sortType} handleSortChange={handleSortChange} />
      </div>
    </div>
  );
};

export default SortArea;
