import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SearchState {
  searchedAds: [];
}

const initialState: SearchState = {
  searchedAds: [],
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchedAds: (state, action: PayloadAction<SearchState["searchedAds"]>) => {
      state.searchedAds = action.payload;
    },
  },
});

export const { setSearchedAds } = searchSlice.actions;
export default searchSlice.reducer;
