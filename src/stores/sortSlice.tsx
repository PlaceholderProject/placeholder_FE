import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SortType } from "@/types/meetupType";

interface SortTypeState {
  sortType: SortType;
}

const initialState: SortTypeState = {
  sortType: "popular",
};

const sortSlice = createSlice({
  name: "sort",
  initialState,
  reducers: {
    setSortType: (state, action: PayloadAction<SortType>) => {
      state.sortType = action.payload;
    },
  },
});

export const { setSortType } = sortSlice.actions;
export default sortSlice.reducer;
