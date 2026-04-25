import { createAsyncThunk } from "@reduxjs/toolkit";

import { getAuthToken as getAuthTokenAPI } from "./service";

export const getAuthToken = createAsyncThunk("auth/token", async () => {
  const body = {
    device_id: `${Math.random()}`,
    fcm_token: "fcm-token-123",
    platform: "web",
  };
  const params = {
    headers: {
      platform: "web",
      locale: 1,
    },
  };
  const response = await getAuthTokenAPI(body, params);
  return response.data;
});
