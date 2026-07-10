import { FilterType, TypePurposeType, TypeRegionType } from "@/types/meetupType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  filterType: FilterType;
  place: TypeRegionType;
  category: TypePurposeType;
  isFilterActive: boolean;
}

// 모임 성격별 / 지역별 탭 중 하나만 활성화되며, 각 탭의 알약(+전체)을 항상 노출한다.
// 외부(ThumbnailArea, LikeContainer)는 place / category / isFilterActive / filterType 만 소비한다.
const initialState: FilterState = {
  filterType: "모임 성격별",
  place: null,
  category: null,
  isFilterActive: false,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    // 탭 전환: 한 번에 한 차원만 필터하므로 반대편 선택은 초기화한다.
    setFilterType: (state, action: PayloadAction<FilterType>) => {
      state.filterType = action.payload;
      state.place = null;
      state.category = null;
      state.isFilterActive = false;
    },

    setPlace: (state, action: PayloadAction<TypeRegionType>) => {
      state.place = action.payload;
      state.isFilterActive = state.place !== null || state.category !== null;
    },

    setCatregory: (state, action: PayloadAction<TypePurposeType>) => {
      state.category = action.payload;
      state.isFilterActive = state.place !== null || state.category !== null;
    },

    resetFilter: state => {
      state.place = null;
      state.category = null;
      state.isFilterActive = false;
    },
  },
});

export const { setFilterType, setPlace, setCatregory, resetFilter } = filterSlice.actions;
export default filterSlice.reducer;
