"use client";

import React, { useEffect, useState } from "react";
import { FilterType, SortType, TypePurposeType, TypeRegionType } from "@/types/meetupType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { setFilterType, setPlace, setCatregory } from "@/stores/filterSlice";
import { setSortType } from "@/stores/sortSlice";
import FilterPill from "../common/FilterPill";
import SortButtons from "../sort/SortButtons";
import { LuPlus, LuX } from "react-icons/lu";

const FILTER_TABS: FilterType[] = ["모임 성격별", "지역별"];
const CATEGORIES: Exclude<TypePurposeType, null>[] = ["운동", "공부", "취준", "취미", "친목", "맛집", "여행", "기타"];
const REGIONS: Exclude<TypeRegionType, null>[] = [
  "전국",
  "서울",
  "경기",
  "인천",
  "강원",
  "대전",
  "세종",
  "충남",
  "충북",
  "부산",
  "울산",
  "경남",
  "경북",
  "대구",
  "광주",
  "전남",
  "전북",
  "제주",
  "미정",
];
const QUICK_REGIONS: Exclude<TypeRegionType, null>[] = ["서울", "경기", "인천", "부산", "제주"];

const FilterArea = () => {
  const dispatch = useDispatch();
  const { filterType, place, category } = useSelector((state: RootState) => state.filter);
  const sortType = useSelector((state: RootState) => state.sort.sortType);
  const [isRegionPickerOpen, setIsRegionPickerOpen] = useState(false);

  const handleSortChange = (newSortType: SortType) => {
    dispatch(setSortType(newSortType));
  };

  const handleRegionChange = (nextPlace: TypeRegionType) => {
    dispatch(setPlace(nextPlace));
    setIsRegionPickerOpen(false);
  };

  useEffect(() => {
    if (filterType !== "지역별") {
      setIsRegionPickerOpen(false);
    }
  }, [filterType]);

  useEffect(() => {
    if (!isRegionPickerOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsRegionPickerOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isRegionPickerOpen]);

  const selectedRegionIsQuick = place ? QUICK_REGIONS.includes(place) : true;

  return (
    <div className="mx-auto w-[95%] min-w-[32rem] space-y-[0.8rem] md:max-w-[100rem]">
      {/* 필터 탭 (세그먼트) */}
      <div className="flex items-center justify-between gap-[0.8rem]">
        <div className="border-border bg-card inline-flex rounded-full border p-[0.3rem]">
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => dispatch(setFilterType(tab))}
              className={`rounded-full px-[1.6rem] py-[0.6rem] text-sm transition ${filterType === tab ? "bg-foreground text-background" : "text-muted-foreground"}`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="md:hidden">
          <SortButtons currentSort={sortType} handleSortChange={handleSortChange} />
        </div>
      </div>

      {filterType === "모임 성격별" ? (
        <div className="scroll-container flex gap-[0.6rem] overflow-x-auto pb-[0.4rem]">
          <>
            <FilterPill active={category === null} onClick={() => dispatch(setCatregory(null))}>
              전체
            </FilterPill>
            {CATEGORIES.map(c => (
              <FilterPill key={c} active={category === c} onClick={() => dispatch(setCatregory(c))}>
                {c}
              </FilterPill>
            ))}
          </>
        </div>
      ) : (
        <div className="scroll-container flex gap-[0.6rem] overflow-x-auto pb-[0.4rem]">
          <FilterPill active={place === null} onClick={() => handleRegionChange(null)}>
            전체
          </FilterPill>
          {QUICK_REGIONS.map(region => (
            <FilterPill key={region} active={place === region} onClick={() => handleRegionChange(region)}>
              {region}
            </FilterPill>
          ))}
          {place && !selectedRegionIsQuick && (
            <FilterPill active onClick={() => setIsRegionPickerOpen(true)}>
              {place}
            </FilterPill>
          )}
          <button
            type="button"
            onClick={() => setIsRegionPickerOpen(true)}
            className="border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary inline-flex shrink-0 items-center gap-[0.45rem] rounded-full border border-dashed px-[1.3rem] py-[0.6rem] text-sm font-semibold transition-colors"
          >
            <LuPlus className="h-[1.4rem] w-[1.4rem] stroke-[2]" />
            더보기
          </button>
        </div>
      )}

      {isRegionPickerOpen && (
        <div className="bg-background/75 fixed inset-0 z-[60] flex items-end backdrop-blur-sm md:items-center md:justify-center" onClick={() => setIsRegionPickerOpen(false)}>
          <section
            className="border-border bg-card w-full rounded-t-[2rem] border p-[1.4rem] shadow-[0_-1.2rem_3.5rem_rgba(22,21,15,0.12)] md:max-w-[48rem] md:rounded-[2rem] md:shadow-[0_1.6rem_4rem_rgba(22,21,15,0.14)]"
            onClick={event => event.stopPropagation()}
          >
            <div className="mb-[1.2rem] flex items-center justify-between gap-[1rem]">
              <h2 className="text-foreground text-base font-bold">지역 선택</h2>
              <button
                type="button"
                onClick={() => setIsRegionPickerOpen(false)}
                className="text-muted-foreground hover:bg-muted hover:text-foreground grid h-[3.4rem] w-[3.4rem] place-items-center rounded-full transition-colors"
                aria-label="지역 선택 닫기"
              >
                <LuX className="h-[1.8rem] w-[1.8rem] stroke-[1.9]" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-[0.7rem] sm:grid-cols-5">
              <RegionButton active={place === null} onClick={() => handleRegionChange(null)}>
                전체
              </RegionButton>
              {REGIONS.map(region => (
                <RegionButton key={region} active={place === region} onClick={() => handleRegionChange(region)}>
                  {region}
                </RegionButton>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

const RegionButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-[3.4rem] rounded-full border px-[0.8rem] text-sm font-semibold transition-colors ${
      active ? "bg-foreground text-background border-transparent shadow-sm" : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

export default FilterArea;
