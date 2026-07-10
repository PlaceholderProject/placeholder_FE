import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProposalState {
  selectedMeetupId: number | null;
}

const initialState: ProposalState = {
  selectedMeetupId: null,
};

const proposalSlice = createSlice({
  name: "proposal",
  initialState,
  reducers: {
    setSelectedMeetupId: (state, action: PayloadAction<ProposalState["selectedMeetupId"]>) => {
      state.selectedMeetupId = action.payload;
    },
    resetSelectedMeetupId(state) {
      state.selectedMeetupId = null;
    },
  },
});

export const { setSelectedMeetupId, resetSelectedMeetupId } = proposalSlice.actions;
export default proposalSlice.reducer;
