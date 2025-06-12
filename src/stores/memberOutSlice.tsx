import { createSlice } from "@reduxjs/toolkit";

const memberOutSlice = createSlice({
  name: "memberOut",
  initialState: {
    chosenMeetupId: null,
  },
  reducers: {
    setChosenMeetupId: (state, action) => {
      state.chosenMeetupId = action.payload;
    },
    clearChosenMeetupId: state => {
      state.chosenMeetupId = null;
    },
  },
});

export const { setChosenMeetupId, clearChosenMeetupId } = memberOutSlice.actions;
export default memberOutSlice.reducer;
