import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Gắn token từ localStorage cho mọi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    config.headers.token = token;
  }
  return config;
});

// Nuốt 401 cho các trang public như /auth/check khi chưa có token
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url || "";
    if (status === 401 && url.includes("/api/auth/check")) {
      return Promise.reject({ silent: true }); 
    }
    return Promise.reject(err);
  }
);

export default api;
