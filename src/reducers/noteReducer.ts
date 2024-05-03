import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type NoteState = {
  title: string;
  content: string;
  timestamp: string;
};

const initialState: NoteState = {
  title: "",
  content: "",
  timestamp: "",
};
const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    updateTitle(state, { payload }: PayloadAction<string>) {
      state.title = payload;
    },
    updateContent(state, { payload }: PayloadAction<string>) {
      state.content = payload;
    },
    updateTimestamp(state, { payload }: PayloadAction<string>) {
      state.timestamp = payload;
    },
  },
});

export const { updateTitle, updateContent, updateTimestamp } =
  noteSlice.actions;
export default noteSlice.reducer;
