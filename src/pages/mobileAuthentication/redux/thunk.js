import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFromLocalStorage } from "../../../utils/helperFunctions";

import { getUserDetails as  getUserDetailsAPI } from "./service";


export const getUserDetails = (url) => createAsyncThunk(
  "/user",
  async () => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const user_id = getFromLocalStorage("D_USER_ID");
    const params = {
      headers: {
        "user-id": user_id,
        Authorization: token,
      },
    };
    const response = await getUserDetailsAPI(params);
    return response.data;
  }
);
