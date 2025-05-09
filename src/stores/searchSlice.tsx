import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchedAds: [];
  searchField: { range: string; keyword: string };
}

const initialState: SearchState = {
  searchedAds: [],
  searchField: { range: "", keyword: "" },
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
  },
});

export const { setSearchedAds, setSearchField } = searchSlice.actions;
export default searchSlice.reducer;
