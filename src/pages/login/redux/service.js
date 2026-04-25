import { post } from "../../../utils/httpService";

const SERVICE_URLS = {
  postLoginDetails: () => `/doctor/login-via-phone-otp`,
  postForgotPassword: (qs) => `/doctor/forgot/password?=${qs}`,
  postForgotPasswordOTP: () => `/doctor/forgot/password/otp`,
  postPasswordReset: () => '/doctor/password/reset',
};

export const postLoginDetails = (body, params) => {
  return post(SERVICE_URLS.postLoginDetails(), body, params);
};

export const postForgotPassword = (data, params, qs) => {
  return post(SERVICE_URLS.postForgotPassword(qs), data, params);
};

export const postForgotPasswordOTP = (data, params) => {
  return post(SERVICE_URLS.postForgotPasswordOTP(), data, params);
};

export const postPasswordReset = (data, params) => {
  return post(SERVICE_URLS.postPasswordReset(), data, params);
};