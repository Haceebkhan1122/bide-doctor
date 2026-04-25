import { get, post } from "../../../utils/httpService";

const SERVICE_URLS = {
  getDiseases: () => `/disease?all=true`,
  getAppointmentDetails: () => `/doctor/appointment/dashboard`,
  getAppointmentData: (id) => `/appointment/${id}`,
  getVitalScan: (id) => `/health-scan?user_id=${id}`,
  getMedicine: () => `/prescription/medicine-tab-info`,
  getInsulin: () => `/prescription/insulin-tab-info`,
  getLab: () => `/prescription/lab-list`,
  getMedicalRecord: (id) => `/medical-record?user_id=${id}`,
  postConsult: (id) => `/appointment/complete`,
  getAppointmentToken: (id, userId) => `/consultation/generate-agora-link?appointment_id=${id}&user_id=${userId}`,
  getAppDetail: (id) => `/appointment/${id}`,
  getInstantMedicalRecord: (id) => `/instant-medical-record?user_id=${id}`
};


export const getDiseases = (params) => {
  return get(SERVICE_URLS.getDiseases(), params);
};

export const getAppDetail = (id, params) => {
  return get(SERVICE_URLS.getAppDetail(id), params);
};

export const getAppointmentDetails = (params) => {
  return get(SERVICE_URLS.getAppointmentDetails(), params);
};

export const getAppointmentData = (id, params) => {
  return get(SERVICE_URLS.getAppointmentData(id), params);
};

export const getVitalScan = (id, params) => {
  return get(SERVICE_URLS.getVitalScan(id), params);
};

export const getMedicine = (params) => {
  return get(SERVICE_URLS.getMedicine(), params);
};

export const getInsulin = (params) => {
  return get(SERVICE_URLS.getInsulin(), params);
};

export const getLab = (params) => {
  return get(SERVICE_URLS.getLab(), params);
};

export const getMedicalRecord = (id, params) => {
  return get(SERVICE_URLS.getMedicalRecord(id), params);
};

export const getInstantMedicalRecord = (id, params) => {
  return get(SERVICE_URLS.getInstantMedicalRecord(id), params);
};

export const postConsult = (data, params, id) => {
  // console.log( data, params, id)
  return post(SERVICE_URLS.postConsult(id), data, params);
};

export const getAppointmentToken = (id, userId, params) => {
  return get(SERVICE_URLS.getAppointmentToken(id, userId), params);
};