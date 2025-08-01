import { FilterType, TypePurposeType, TypeRegionType } from "@/types/meetupType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  filterType: FilterType;
  place: TypeRegionType;
  category: TypePurposeType;
  isFilterActive: boolean;
  isPlaceMenuOpen: boolean;
  isCategoryMenuOpen: boolean;
}

// 아예 첫 상태에 서울, 운동을 넣어놨었는데
// 이러면 닫혓을 때 서울 필터가 적용될 것 같기도 하고
// 논리의 흐름이 시맨틱하지 않다고 느낌
// 열리는 순간 서울, 운동으로 초기값 지정.
// 그래서 null => 서울 => 다른거 순으로 가게 함

// ❗️아니 근데 열리는 순간 서울 되는 거면 닫히면 서울 어케됨????

const initialState: FilterState = {
  filterType: null,
  place: null,
  category: null,
  isFilterActive: false,
  isPlaceMenuOpen: false,
  isCategoryMenuOpen: false,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setFilterType: (state, action: PayloadAction<FilterType>) => {
      state.filterType = action.payload;
      if (action.payload === "지역별") {
        state.isPlaceMenuOpen = !state.isPlaceMenuOpen;
        state.isCategoryMenuOpen = false;
        if (state.isPlaceMenuOpen) {
          state.place = "서울";
          state.category = null;
          state.isFilterActive = true;
        } else {
          state.place = null;
          state.isFilterActive = state.category !== null;
        }
      } else if (action.payload === "모임 성격별") {
        state.isCategoryMenuOpen = !state.isCategoryMenuOpen;
        state.isPlaceMenuOpen = false;
        if (state.isCategoryMenuOpen) {
          state.category = "운동";
          state.place = null;
          state.isFilterActive = true;
        } else {
          state.category = null;
          state.isFilterActive = state.place !== null;
        }
      }
    },

    setPlace: (state, action: PayloadAction<TypeRegionType>) => {
      state.place = action.payload;
      //지역 필터 눌렸는지는 null 아니거나 모임성격이 null 아니면 true라고?
      state.isFilterActive = state.place !== null || state.category !== null;
    },

    setCatregory: (state, action: PayloadAction<TypePurposeType>) => {
      state.category = action.payload;
      state.isFilterActive = state.place !== null || state.category !== null;
    },

    // -- TODO-- 이게 왜 리셋인지, 초기화 어떻게 구혀낳ㄹ지, 토글로 할지 생각해봐야됨
    resetFilter: state => {
      state.place = null;
      state.category = null;
      state.isFilterActive = false;
      state.isPlaceMenuOpen = false;
      state.isCategoryMenuOpen = false;
      state.filterType = null;
    },

    // isFilterActive랑 isPureposeMenuOpen, isRegionMenuOpen 각 목적 확실히 해야되겟는데
    // 지금 좀 상태가 많아보임
    // 왜냐면 나는 뭐라도 menuOpen이 true면 active도 자동으로 true된다 생각했거든

    // 이게 필요함?
    closeAllMenus: state => {
      state.isPlaceMenuOpen = false;
      state.isCategoryMenuOpen = false;
      state.filterType = null;
    },
  },
});

export const { setFilterType, setPlace, setCatregory, resetFilter, closeAllMenus } = filterSlice.actions;
export default filterSlice.reducer;
