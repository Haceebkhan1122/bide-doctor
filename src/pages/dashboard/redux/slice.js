import {
    createSlice,
    current,
    isFulfilled,
    isPending,
    isRejected,
  } from "@reduxjs/toolkit";
  
  import { getDashboardDetails } from "./thunk";
  
  const thunks = [getDashboardDetails];
  
  const initialState = {
    status: "idle",
    Dashboard: {},
  };
  
  export const slice = createSlice({
    name: "dashboardDetail",
    initialState,
    reducers: {
   
    },
    extraReducers: (builder) => {
      builder
        .addCase(getDashboardDetails.fulfilled, (state, action) => {
          state.status = "idle";
          state.Dashboard = action.payload;
        })
        .addMatcher(isPending(...thunks), (state) => {})
        .addMatcher(isFulfilled(getDashboardDetails), (state) => {})
        .addMatcher(isRejected(...thunks), (state, action) => {});
    },
  });
  
  
  
  export const selectDashboard = (state) => state.dashboard.Dashboard;
  
  
  export default slice.reducer;
  