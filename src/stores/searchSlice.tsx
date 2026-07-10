import { SearchedType } from "@/types/searchType";
import { TypePurposeType } from "@/types/meetupType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchedAds: SearchedType[];
  searchField: { range: string; keyword: string; category: TypePurposeType };
  total: number;
}

const initialState: SearchState = {
  searchedAds: [],
  searchField: { range: "ad_title", keyword: "", category: null },
  total: 0,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchedAds: (state, action: PayloadAction<SearchState["searchedAds"]>) => {
      state.searchedAds = action.payload;
    },
    setSearchField: (state, action: PayloadAction<Partial<SearchState["searchField"]>>) => {
      const currentCategory = state.searchField.category ?? null;
      state.searchField = {
        range: action.payload.range ?? state.searchField.range,
        keyword: action.payload.keyword ?? state.searchField.keyword,
        category: action.payload.category !== undefined ? action.payload.category : currentCategory,
      };
    },
    setTotal: (state, action: PayloadAction<SearchState["total"]>) => {
      state.total = action.payload;
    },
  },
});

export const { setSearchedAds, setSearchField, setTotal } = searchSlice.actions;
export default searchSlice.reducer;
