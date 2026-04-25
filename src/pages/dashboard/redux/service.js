import { post, get } from "../../../utils/httpService";

const SERVICE_URLS = {
  getDashboardDetails: () => `/doctor/appointment/dashboard`,
};

export const getDashboardDetails = (params) => {
  return get(SERVICE_URLS.getDashboardDetails(), params);
};
