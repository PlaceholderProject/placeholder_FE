"use client";

import React, { useEffect, useState } from "react";
import { FilterType, SortType, TypePurposeType, TypeRegionType } from "@/types/meetupType";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import { setFilterType, setPlace, setCatregory } from "@/stores/filterSlice";
import { setSortType } from "@/stores/sortSlice";
import FilterPill from "../common/FilterPill";
import SortButtons from "../sort/SortButtons";
import { LuChevronDown, LuChevronUp, LuMapPin } from "react-icons/lu";
import SegmentedIndicator from "../common/SegmentedIndicator";

const FILTER_TABS: FilterType[] = ["모임 성격별", "지역별"];
const CATEGORIES: { value: Exclude<TypePurposeType, null>; emoji: string }[] = [
  { value: "운동", emoji: "🏃" },
  { value: "공부", emoji: "📚" },
  { value: "취준", emoji: "💼" },
  { value: "취미", emoji: "🎨" },
  { value: "친목", emoji: "🥂" },
  { value: "맛집", emoji: "🍜" },
  { value: "여행", emoji: "✈️" },
  { value: "기타", emoji: "✨" },
];
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

  const selectedRegionIsQuick = place ? QUICK_REGIONS.includes(place) : true;
  const activeFilterTabIndex = FILTER_TABS.findIndex(tab => tab === filterType);

  return (
    <div className="mx-auto w-[calc(100%-3.2rem)] space-y-[1rem] md:max-w-[112rem]">
      {/* 필터 탭 (세그먼트) */}
      <div className="flex items-center justify-between gap-[0.8rem]">
        <div className="border-border bg-card relative grid grid-cols-2 rounded-[1.3rem] border p-[0.3rem] shadow-[0_1rem_3rem_-2.4rem_rgba(24,23,29,0.4)]">
          <SegmentedIndicator count={FILTER_TABS.length} index={activeFilterTabIndex} className="bg-foreground rounded-[1rem] shadow-sm" />
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              onClick={() => dispatch(setFilterType(tab))}
              className={`relative z-10 rounded-[1rem] px-[1.4rem] py-[0.7rem] text-sm font-bold transition-colors duration-200 ${filterType === tab ? "text-background" : "text-muted-foreground hover:text-foreground"}`}
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
            {CATEGORIES.map(({ value, emoji }) => (
              <FilterPill key={value} active={category === value} onClick={() => dispatch(setCatregory(value))}>
                <span aria-hidden>{emoji}</span> {value}
              </FilterPill>
            ))}
          </>
        </div>
      ) : (
        <>
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
              aria-expanded={isRegionPickerOpen}
              aria-controls="all-region-options"
              onClick={() => setIsRegionPickerOpen(prev => !prev)}
              className="border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-primary inline-flex shrink-0 items-center gap-[0.5rem] rounded-full border px-[1.3rem] py-[0.75rem] text-sm font-bold transition-colors"
            >
              <LuMapPin className="h-[1.4rem] w-[1.4rem] stroke-[2]" />
              {isRegionPickerOpen ? "지역 접기" : "전체 지역"}
              {isRegionPickerOpen ? <LuChevronUp className="h-[1.3rem] w-[1.3rem]" /> : <LuChevronDown className="h-[1.3rem] w-[1.3rem]" />}
            </button>
          </div>

          {isRegionPickerOpen && (
            <section id="all-region-options" className="border-border bg-card mt-[0.2rem] rounded-[1.8rem] border p-[1.4rem] shadow-[0_1.4rem_3.4rem_-2.6rem_rgba(24,23,29,0.35)] md:p-[1.6rem]">
              <div className="mb-[1.1rem] flex items-center justify-between gap-[1rem]">
                <div>
                  <h3 className="text-foreground text-sm font-black">전체 지역</h3>
                  <p className="text-muted-foreground mt-[0.2rem] text-xs">활동하고 싶은 지역을 하나 선택하세요.</p>
                </div>
                {place && (
                  <button type="button" onClick={() => handleRegionChange(null)} className="text-primary hover:bg-primary-soft rounded-full px-[1rem] py-[0.55rem] text-xs font-bold transition-colors">
                    선택 초기화
                  </button>
                )}
              </div>

              <div className="grid grid-cols-4 gap-[0.7rem] sm:grid-cols-5 md:grid-cols-7">
                {REGIONS.map(region => (
                  <RegionButton key={region} active={place === region} onClick={() => handleRegionChange(region)}>
                    {region}
                  </RegionButton>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

const RegionButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={`h-[3.4rem] rounded-full border px-[0.8rem] text-sm font-semibold transition-colors ${
      active ? "bg-primary-soft text-primary-soft-foreground border-primary/15" : "border-border bg-background text-muted-foreground hover:border-primary/25 hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

export default FilterArea;
