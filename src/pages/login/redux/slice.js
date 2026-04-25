import {
  createSlice,
  current,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";

import { postLoginDetails } from "./thunk";

const thunks = [postLoginDetails];

const initialState = {
  status: "idle",
  Login: {},
  userEmail: "",
};

export const slice = createSlice({
  name: "login",
  initialState,
  reducers: {
 
    setEmail: (state, email) => {
      state.userEmail = email.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postLoginDetails.fulfilled, (state, action) => {
        state.status = "idle";
        state.Login = action.payload;
      })
      .addMatcher(isPending(...thunks), (state) => {})
      .addMatcher(isFulfilled(postLoginDetails), (state) => {})
      .addMatcher(isRejected(...thunks), (state, action) => {});
  },
});

export const { setEmail } = slice.actions;


export const selectUser = (state) => state.login.Login;
export const selectEmail = (state) => state.login.userEmail;


export default slice.reducer;
