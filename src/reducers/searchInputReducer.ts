import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: { serchInput: string } = {
  serchInput: "",
};

const serchInputSlice = createSlice({
  name: "serchInput",
  initialState,
  reducers: {
    setSerchInput(state, { payload }: PayloadAction<string>) {
      state.serchInput = payload;
    },
  },
});

export const { setSerchInput } = serchInputSlice.actions;
export default serchInputSlice.reducer;
