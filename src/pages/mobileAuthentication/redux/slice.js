import {
    createSlice,
    current,
    isFulfilled,
    isPending,
    isRejected,
  } from "@reduxjs/toolkit";
  
  import { getUserDetails } from "./thunk";
  
  const thunks = [getUserDetails];
  
  const initialState = {
    status: "idle",
    Dashboard: {},
  };
  
  export const slice = createSlice({
    name: "userDetail",
    initialState,
    reducers: {
   
    },
    extraReducers: (builder) => {
      builder
        .addCase(getUserDetails.fulfilled, (state, action) => {
          state.status = "idle";
          state.user = action.payload;
        })
        .addMatcher(isPending(...thunks), (state) => {})
        .addMatcher(isFulfilled(getUserDetails), (state) => {})
        .addMatcher(isRejected(...thunks), (state, action) => {});
    },
  });
  
  
  
  export const selectUser = (state) => state.user;
  
  
  export default slice.reducer;
  