import axios from "axios";
import { toast } from "react-toastify";
import { interceptor } from "./interceptor";
import Cookies from "js-cookie";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const instance = axios.create({
  baseURL: `${BASE_URL}`,
  timeout: 60000,
  headers: {},
  // withCredentials: true
});


//call axios interceptor
interceptor(instance);

// axios.defaults.headers.common = { Authorization: `bearer ${token}` };
const request = async ({ method, url, data, headers, skipAuth }) => {

  const token = Cookies.get("token");

  const params = {
    headers: { Authorization: token },
  };


  if (method === "delete") {
    data = params;
  }

  if (method === "get") {
    data = params
  }

  const promise = instance[method](url, data, params);

  try {
    const response = await promise;
    const payload = response.data;
    if (headers) {
      return {
        data: payload,
        headers: response.headers,
      };
    }
    return payload;
  } catch (err) {
    // toast.error(err?.response?.data?.message, err?.response?.code)
    // console.log(err, "err");
  }
};

// Response interceptor for API calls
// instance.interceptors.response.use((response) => {
//   return response
// }, async function (error) {
//   const originalRequest = error.config;
//   if (error.response.status === 401 && !originalRequest._retry) {
//     await asynchronouslyRemoveFromLocal("D_APP_TOKEN");
//     await asynchronouslyRemoveFromLocal("D_USER_ID");
//     const dispatch = useAppDispatch();
//     dispatch(SelectAuth(null));
//   }
//   return Promise.reject(error);
// });

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;

    if (error?.response?.status === 403 || error?.response?.status === 401) {
      const Authorization = Cookies.get('token');
      toast.error('Login expired, redirecting...');
      if (Authorization) {
        Cookies.remove('token');
      }
      setTimeout(() => {
        window.location.href = "/login";
      }, 5000);
    }

    if (response?.message === 'Network Error') {
      // toast.error(response?.data?.message);
    }

    const apiResponse = response ? response : Promise.reject(error);

    return apiResponse;
  }
);

export const get = (url, params) => request({ method: "get", url, ...params });
export const post = (url, data, params) =>
  request({ method: "post", url, data, ...params });
export const put = (url, data, params) =>
  request({ method: "put", url, data, ...params });
export const del = (url, params) => request({ method: "delete", url, ...params });
export const patch = (url, data, params) =>
  request({ method: "patch", url, data, ...params });


export default instance;