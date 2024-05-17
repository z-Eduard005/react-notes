import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type NoteState = {
  title: string;
  content: string;
  time: string;
};

export const getcurrentTime = (): string => {
  const date = new Date();
  return (
    date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    }) +
    ", " +
    date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    })
  );
};

const initialState: NoteState = {
  title: "",
  content: "",
  time: getcurrentTime(),
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
    updateTime(state, { payload }: PayloadAction<string>) {
      state.time = payload;
    },
  },
});

export const { updateTitle, updateContent, updateTime } = noteSlice.actions;
export default noteSlice.reducer;
