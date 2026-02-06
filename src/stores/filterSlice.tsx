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
      state.isPlaceMenuOpen = false;
      state.isCategoryMenuOpen = false;
      state.filterType = null;
    },
    closeAllMenus: state => {
      state.isPlaceMenuOpen = false;
      state.isCategoryMenuOpen = false;
      state.filterType = null;
    },
  },
});

export const { setFilterType, setPlace, setCatregory, resetFilter, closeAllMenus } = filterSlice.actions;
export default filterSlice.reducer;
