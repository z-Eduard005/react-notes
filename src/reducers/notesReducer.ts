import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getDataDB } from "../firebase";

export type NoteState = {
  title: string;
  content: string;
  time: string;
  id: string;
};

type Notes = {
  notesArray: NoteState[];
  loading: boolean;
  error: string | null;
};

const initialState: Notes = {
  notesArray: [],
  loading: false,
  error: null,
};

export const loadNotes = createAsyncThunk<NoteState[]>(
  "notes/loadNotes",
  async () => {
    const objDB: object = await getDataDB("notes");
    const notesArray: NoteState[] = [];

    const keys = Object.keys(objDB);
    const values = Object.values(objDB);

    for (let i = 0; i < keys.length; i++) {
      const newObject = { ...values[i], id: keys[i] };
      notesArray.push(newObject);
    }

    return notesArray;
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    addNote(state, { payload }: PayloadAction<NoteState>) {
      state.notesArray.push(payload);
    },
    updateTitle(
      state,
      { payload }: PayloadAction<{ id: string; value: string }>
    ) {
      const note = state.notesArray.find((note) => note.id === payload.id);
      note && (note.title = payload.value);
    },
    updateContent(
      state,
      { payload }: PayloadAction<{ id: string; value: string }>
    ) {
      const note = state.notesArray.find((note) => note.id === payload.id);
      note && (note.content = payload.value);
    },
    updateTime(
      state,
      { payload }: PayloadAction<{ id: string; value: string }>
    ) {
      const note = state.notesArray.find((note) => note.id === payload.id);
      note && (note.time = payload.value);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadNotes.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        loadNotes.fulfilled,
        (state, { payload }: PayloadAction<NoteState[]>) => {
          state.loading = false;
          state.notesArray = payload;
        }
      )
      .addCase(loadNotes.rejected, (state, { error }) => {
        state.loading = false;
        state.error = error.message || "Failed to load notes";
      });
  },
});

export const { addNote, updateTitle, updateContent, updateTime } =
  notesSlice.actions;
export default notesSlice.reducer;
