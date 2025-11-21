import axios from "axios";
import { checkTokenIsExpired } from "../lib/utils"; 

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─────────────── REQUEST INTERCEPTOR ───────────────
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      if (checkTokenIsExpired(token)) {
        console.warn("Access token expired");
        // later: dispatch logout / refresh token here
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────── RESPONSE INTERCEPTOR ───────────────
api.interceptors.response.use(
  (response) => {
    // console.log(response.data); // keep if you like
    return response;
  },
  (error) => {
    const status =
      error?.response?.status ??
      error?.status ??
      500;

    const message =
      error?.response?.data?.message ??
      error?.message ??
      "Unexpected error";

    // we always reject the same shape
    return Promise.reject({ status, message, raw: error });
  }
);

// ─────────────── SIMPLE HELPERS ───────────────
const get = (url, params, config = {}) => api.get(url, { params, ...config });
const post = (url, data, config = {}) => api.post(url, data, config);
const put = (url, data, config = {}) => api.put(url, data, config);
const del = (url, config = {}) => api.delete(url, config);

export default { get, post, put, del };
export { api }; // if you ever need direct access
