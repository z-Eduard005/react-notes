import { configureStore } from "@reduxjs/toolkit";
import notesReducer from "../reducers/notesReducer";
import searchReducer from "../reducers/searchReducer";
import userReducer from "../reducers/userReducer";

export const store = configureStore({
  reducer: {
    notes: notesReducer,
    search: searchReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
