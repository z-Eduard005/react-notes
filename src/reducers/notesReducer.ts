import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getFromDB } from "../firebase";

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

type UpdateAction = {
  id: string;
  value: string;
};

const initialState: Notes = {
  notesArray: [],
  loading: false,
  error: null,
};

export const loadNotes = createAsyncThunk<NoteState[]>(
  "notes/loadNotes",
  async () => {
    let notesArray: NoteState[] = [];

    const objFromDB: object = await getFromDB("notes");
    if (objFromDB === null) return notesArray;

    const keys = Object.keys(objFromDB);
    const values = Object.values(objFromDB);

    for (let i = 0; i < keys.length; i++) {
      const newObj = { ...values[i], id: keys[i] };
      notesArray.push(newObj);
    }

    return notesArray;
  }
);

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    removeNote(state, { payload }: PayloadAction<string>) {
      state.notesArray = state.notesArray.filter((note) => note.id !== payload);
    },
    removeEmptyNotes(state) {
      state.notesArray = state.notesArray.filter(
        (note) => note.title || note.content
      );
    },
    updateTitle(state, { payload }: PayloadAction<UpdateAction>) {
      const note = state.notesArray.find((note) => note.id === payload.id);
      note && (note.title = payload.value);
    },
    updateContent(state, { payload }: PayloadAction<UpdateAction>) {
      const note = state.notesArray.find((note) => note.id === payload.id);
      note && (note.content = payload.value);
    },
    updateTime(state, { payload }: PayloadAction<UpdateAction>) {
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

export const {
  removeNote,
  removeEmptyNotes,
  updateTitle,
  updateContent,
  updateTime,
} = notesSlice.actions;
export default notesSlice.reducer;
