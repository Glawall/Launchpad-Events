import axios from "axios";

const isDevelopment = import.meta.env.MODE === "development";

const api = axios.create({
  baseURL: "https://launchpad-events.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user?.role) {
    config.headers["user-role"] = user.role;
    config.headers["user-id"] = user.id;
  }
  if (isDevelopment) {
    console.log("Request:", {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data,
    });
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log("Response success:", {
        url: response.config.url,
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  (error) => {
    if (isDevelopment) {
      console.error("Response error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
    }
    return Promise.reject(error);
  }
);

export default api;
