import { SearchedType } from "@/types/searchType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchedAds: SearchedType[];
  searchField: { range: string; keyword: string };
  total: number;
}

const initialState: SearchState = {
  searchedAds: [],
  searchField: { range: "", keyword: "" },
  total: 0,
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchedAds: (state, action: PayloadAction<SearchState["searchedAds"]>) => {
      state.searchedAds = action.payload;
    },
    setSearchField: (state, action: PayloadAction<SearchState["searchField"]>) => {
      state.searchField = { range: action.payload.range, keyword: action.payload.keyword };
    },
    setTotal: (state, action: PayloadAction<SearchState["total"]>) => {
      state.total = action.payload;
    },
  },
});

export const { setSearchedAds, setSearchField, setTotal } = searchSlice.actions;
export default searchSlice.reducer;
