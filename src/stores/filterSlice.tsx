import { PurposeType, RegionType } from "@/types/meetupType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FilterState {
  region: RegionType;
  purpose: PurposeType;
  isFilterActive: boolean;
  isRegionMenuOpen: boolean;
  isPurposeMenuOpen: boolean;
}

// 아예 첫 상태에 서울, 운동을 넣어놨었는데
// 이러면 닫혓을 때 서울 필터가 적용될 것 같기도 하고
// 논리의 흐름이 시맨틱하지 않다고 느낌
// 열리는 순간 서울, 운동으로 초기값 지정.
// 그래서 null => 서울 => 다른거 순으로 가게 함

// ❗️아니 근데 열리는 순간 서울 되는 거면 닫히면 서울 어케됨????

const initialState: FilterState = {
  region: null,
  purpose: null,
  isFilterActive: false,
  isRegionMenuOpen: false,
  isPurposeMenuOpen: false,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    setRegion: (state, action: PayloadAction<RegionType>) => {
      state.region = action.payload;
      //지역 필터 눌렸는지는 null 아니거나 모임성격이 null 아니면 true라고?
      state.isFilterActive = state.region !== null || state.purpose !== null;
    },

    setPurpose: (state, action: PayloadAction<PurposeType>) => {
      state.purpose = action.payload;
      state.isFilterActive = state.region !== null || state.purpose !== null;
    },

    // -- TODO-- 이게 왜 리셋인지, 초기화 어떻게 구혀낳ㄹ지, 토글로 할지 생각해봐야됨
    resetFilter: state => {
      state.region = null;
      state.purpose = null;
      state.isFilterActive = false;
    },

    // isFilterActive랑 isPureposeMenuOpen, isRegionMenuOpen 각 목적 확실히 해야되겟는데
    // 지금 좀 상태가 많아보임
    // 왜냐면 나는 뭐라도 menuOpen이 true면 active도 자동으로 true된다 생각했거든

    toggleRegionMenu: state => {
      state.isRegionMenuOpen = !state.isRegionMenuOpen;

      if (state.isRegionMenuOpen) {
        state.region = "서울";
        state.isFilterActive = true;
      }
      if (state.isRegionMenuOpen) {
        state.isPurposeMenuOpen = false;
      }
    },

    togglePurposeMenu: state => {
      state.isPurposeMenuOpen = !state.isPurposeMenuOpen;

      if (state.isPurposeMenuOpen) {
        state.purpose = "운동";
        state.isFilterActive = true;
      }

      if (state.isRegionMenuOpen && state.region === null)
        if (state.isPurposeMenuOpen) {
          state.isRegionMenuOpen = false;
        }
    },

    // 이게 필요함?
    closeAllMenus: state => {
      state.isRegionMenuOpen = false;
      state.isPurposeMenuOpen = false;
    },
  },
});

export const { setRegion, setPurpose, resetFilter, toggleRegionMenu, togglePurposeMenu, closeAllMenus } = filterSlice.actions;
export default filterSlice.reducer;
