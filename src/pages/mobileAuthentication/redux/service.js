import { post, get } from "../../../utils/httpService";

const SERVICE_URLS = {
  getUserDetails: () => `/user`,
};

export const getUserDetails = (params) => {
  return get(SERVICE_URLS.getUserDetails(), params);
};
