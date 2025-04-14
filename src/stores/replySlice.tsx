import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ReplyState {
  reply: {
    id: number;
    root: number | null;
    recipient: string | null;
    user: { nickname: string; image: string };
    text: string;
    createdAt: string;
  };
}

const initialState: ReplyState = {
  reply: {
    id: 0,
    root: 0,
    recipient: null,
    user: { nickname: "", image: "" },
    text: "",
    createdAt: "",
  },
};

const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    setReply(state, action: PayloadAction<ReplyState["reply"]>) {
      state.reply = action.payload;
    },
  },
});

export const { setReply } = replySlice.actions;
export default replySlice.reducer;
