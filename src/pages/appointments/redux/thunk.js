import { createAsyncThunk } from "@reduxjs/toolkit";
import { getFromLocalStorage } from "../../../utils/helperFunctions";

import {
  getDiseases as getDiseasesAPI,
  getAppointmentDetails as getAppointmentDetailsAPI,
  getAppointmentData as getAppointmentDataAPI,
  getVitalScan as getVitalScanAPI,
  getMedicine as getMedicineAPI,
  getInsulin as getInsulinAPI,
  getLab as getLabAPI,
  getMedicalRecord as getMedicalRecordAPI,
  getInstantMedicalRecord as getInstantMedicalRecordAPI,
  postConsult as postConsultAPI,
  getAppointmentToken as getAppointmentTokenAPI,
  getAppDetail as getAppDetailAPI
} from "./service";

export const getDiseases = createAsyncThunk("get/clinic", async () => {
  const token = getFromLocalStorage("D_APP_TOKEN");
  const user_id = getFromLocalStorage("D_USER_ID");
  const params = {
    headers: {
      "user-id": user_id,
      Authorization: token,
      platform: "web",
      locale: 1,
    },
  };
  const response = await getDiseasesAPI(params);
  return response.data;
});

export const getAppDetail = createAsyncThunk(
  "get/appDetails",
  async (id) => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const user_id = getFromLocalStorage("D_USER_ID");
    const params = {
      headers: {
        "user-id": user_id,
        Authorization: token,
      },
    };
    const response = await getAppDetailAPI(id, params);
    return response.data;
  }
);

export const getAppointmentDetails = createAsyncThunk(
  "get/appointmentDetails",
  async () => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const user_id = getFromLocalStorage("D_USER_ID");
    const params = {
      headers: {
        "user-id": user_id,
        Authorization: token,
      },
    };
    const response = await getAppointmentDetailsAPI(params);
    return response.data;
  }
);

export const getAppointmentData = createAsyncThunk(
  "get/appointmentData",
  async (id) => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const user_id = getFromLocalStorage("D_USER_ID");
    const params = {
      headers: {
        "user-id": user_id,
        Authorization: token,
      },
    };
    const response = await getAppointmentDataAPI(id, params);
    return response.data;
  }
);

export const getVitalScan = createAsyncThunk(
  "get/vitalScan",
  async (id) => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const user_id = getFromLocalStorage("D_USER_ID");
    const params = {
      headers: {
        "user-id": user_id,
        Authorization: token,
      },
    };
    const response = await getVitalScanAPI(id, params);
    return response.data;
  }
);

export const getMedicine = createAsyncThunk(
  "get/prescribeMedicine",
  async () => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const user_id = getFromLocalStorage("D_USER_ID");
    const params = {
      headers: {
        "user-id": user_id,
        Authorization: token,
      },
    };
    const response = await getMedicineAPI(params);
    return response.data;
  }
);

export const getInsulin = createAsyncThunk(
  "get/prescribeInsulin",
  async () => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const user_id = getFromLocalStorage("D_USER_ID");
    const params = {
      headers: {
        "user-id": user_id,
        Authorization: token,
      },
    };
    const response = await getInsulinAPI(params);
    return response.data;
  }
);

export const getLab = createAsyncThunk("get/prescribeLab", async () => {
  const token = getFromLocalStorage("D_APP_TOKEN");
  const user_id = getFromLocalStorage("D_USER_ID");
  const params = {
    headers: {
      "user-id": user_id,
      Authorization: token,
    },
  };
  const response = await getLabAPI(params);
  return response.data;
});

export const getMedicalRecord = createAsyncThunk(
  "get/medicalRecord",
  async (id) => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const user_id = getFromLocalStorage("D_USER_ID");
    const params = {
      headers: {
        "user-id": user_id,
        Authorization: token,
      },
    };
    const response = await getMedicalRecordAPI(id, params);
    return response.data;
  }
);

export const getInstantMedicalRecord = createAsyncThunk(
  "get/instantMedicalRecord",
  async (id) => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const user_id = getFromLocalStorage("D_USER_ID");
    const params = {
      headers: {
        "user-id": 0,
        Authorization: token,
      },
    };
    const response = await getInstantMedicalRecordAPI(id, params);
    return response.data;
  }
);

export const postConsult = createAsyncThunk("post/conslut", async (payload) => {
  const token = getFromLocalStorage("D_APP_TOKEN");
  const user_id = getFromLocalStorage("D_USER_ID");
  const params = {
    headers: {
      "user-id": user_id,
      Authorization: token,
    },
  };
  const response = await postConsultAPI(payload, params, payload.id);

  return response.data;
});

export const getAppointmentToken = createAsyncThunk(
  "appointment/token",
  async ({ id, userId }, thunkAPI) => {
    const token = getFromLocalStorage("D_APP_TOKEN");
    const user_id = getFromLocalStorage("D_USER_ID");
    const params = {
      headers: {
        "user-id": user_id,
        Authorization: token,
        platform: "web",
        locale: 1,
      },
    };
    const response = await getAppointmentTokenAPI(id, userId, params);
    return response.data;
  }
);