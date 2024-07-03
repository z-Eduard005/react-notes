import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type Search = {
  searchInput: string;
};

const initialState: Search = {
  searchInput: "",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchInput(state, { payload }: PayloadAction<string>) {
      state.searchInput = payload;
    },
  },
});

export const { setSearchInput } = searchSlice.actions;
export default searchSlice.reducer;
