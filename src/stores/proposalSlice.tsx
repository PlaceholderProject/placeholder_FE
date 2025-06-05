import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProposalState {
  selectedMeeupId: number | null;
}

const initialState: ProposalState = {
  selectedMeeupId: null,
};

const proposalSlice = createSlice({
  name: "proposal",
  initialState,
  reducers: {
    setSelectedMeetupId: (state, action: PayloadAction<ProposalState["selectedMeeupId"]>) => {
      state.selectedMeeupId = action.payload;
    },
    resetSelectedMeetupId(state) {
      state.selectedMeeupId = null;
    },
  },
});

export const { setSelectedMeetupId, resetSelectedMeetupId } = proposalSlice.actions;
export default proposalSlice.reducer;
