import {
  createSlice,
  current,
  isFulfilled,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";
import { asynchronouslyGetFromLocal } from "../../utils/helperFunctions";

import { getAuthToken } from "./thunk";

const thunks = [getAuthToken];

const initialState = {
  status: "idle",
  isLogin: false,
  isLoading: true,
  token: null,
  loading: false,
  getAuthTokenSuccess: true,
};


export const slice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    SelectAuth: (state, action) => {
      const { payload } = action;

      if (payload) {
        state.isLogin = true;
        state.isLoading = false;

      } else {
        state.isLogin = false;
        state.isLoading = false;
      }
// console.log(state.isLogin);

    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAuthToken.fulfilled, (state, action) => {
        state.status = "idle";
        state.token = action.payload;
      })
      .addMatcher(isPending(...thunks), (state) => {})
      .addMatcher(isFulfilled(getAuthToken), (state) => {
        state.getAuthTokenSuccess = false;
      })
      .addMatcher(isRejected(...thunks), (state, action) => {
        state.status = "error";
        state.getAuthTokenSuccess = false;
      });
  },
});


// export action from slice
export const { SelectAuth } = slice.actions;

export const selectAuthToken = (state) => state.layout.token;
export const selectIsLogin = (state) => state.layout.isLogin;
export const selectIsLoading = (state) => state.layout.isLoading;

export default slice.reducer;
