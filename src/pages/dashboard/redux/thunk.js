import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFromLocalStorage } from "../../../utils/helperFunctions";

import { getDashboardDetails as getDashboardDetailsAPI } from "./service";


export const getDashboardDetails = createAsyncThunk(
  "dashboard/dashboardDetails",
  async () => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const user_id = getFromLocalStorage("D_USER_ID");
    const params = {
      headers: {
        "user-id": user_id,
        Authorization: token,
      },
    };
    const response = await getDashboardDetailsAPI(params);
    return response.data;
  }
);
