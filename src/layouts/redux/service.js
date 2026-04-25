import { post } from "../../utils/httpService";

const SERVICE_URLS = {
  getAuthToken: () => `/get/token`,
};

export const getAuthToken = (body, params) => {
  return post(SERVICE_URLS.getAuthToken(), body, params);
};
