import axios from "axios";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_BASE_URL}`,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor
API.interceptors.request.use(
  config => {
    const token = Cookies.get("token");
    // const userId = localStorage.getItem("D_USER_ID");

    if (token) {
      config.headers['Authorization'] = token;
    }
    // config.headers['Content-Type'] = 'application/json';
    return config
  },
  error => {
    Promise.reject(error)
  }
)

API.interceptors.response.use(
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

export default API;