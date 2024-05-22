import { configureStore } from "@reduxjs/toolkit";
import notesReducer, { loadNotes } from "../reducers/notesReducer";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
  },
});

// load notes when app starts
store.dispatch(loadNotes());

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
