import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type User = {
  userUID: string | null;
  userName: string;
  isSigningUp: boolean;
  authChecked: boolean;
};

const initialState: User = {
  userUID: null,
  userName: "",
  isSigningUp: false,
  authChecked: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserUID(state, { payload }: PayloadAction<string | null>) {
      state.userUID = payload;
    },
    setUserName(state, { payload }: PayloadAction<string>) {
      state.userName = payload;
    },
    toogleIsSigningUp(state) {
      state.isSigningUp = !state.isSigningUp;
    },
    removeUserData() {
      return { ...initialState, authChecked: true };
    },
    setAuthChecked(state, { payload }: PayloadAction<boolean>) {
      state.authChecked = payload;
    },
  },
});

export const {
  setUserUID,
  setUserName,
  toogleIsSigningUp,
  removeUserData,
  setAuthChecked,
} = userSlice.actions;
export default userSlice.reducer;
