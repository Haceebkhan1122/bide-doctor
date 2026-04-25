import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFromLocalStorage } from "../../../utils/helperFunctions";

import { postLoginDetails as postLoginDetailsAPI, postForgotPassword as postForgotPasswordAPI, postForgotPasswordOTP as postForgotPasswordOTPAPI,
postPasswordReset as postPasswordResetAPI } from "./service";

export const postLoginDetails = createAsyncThunk(
  "login/loginDetails",
  async (payload) => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const params = {
      headers: {
        "user-id": 0,
        Authorization: token,
      },
    };
    const response = await postLoginDetailsAPI(payload, params);
    return response.data;
  }
);

export const postForgotPassword = createAsyncThunk(
  "forgot/password",
  async (body,qs) => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const params = {
      headers: {
        "user-id": 0,
        Authorization: token,
      },
    };
    const response = await postForgotPasswordAPI(body, params);
    return response.data;
  }
);

export const postForgotPasswordOTP = createAsyncThunk(
  "otp/forgotPassword",
  async (payload) => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const params = {
      headers: {
        "user-id": 0,
        Authorization: token,
      },
    };
    const response = await postForgotPasswordOTPAPI(payload, params);
    return response.data;
  }
);


export const postPasswordReset = createAsyncThunk(
  "reset/password",
  async (payload) => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const params = {
      headers: {
        "user-id": 0,
        Authorization: token,
      },
    };
    const response = await postPasswordResetAPI(payload, params);
    return response.data;
  }
);