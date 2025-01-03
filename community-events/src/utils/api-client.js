import axios from "axios";

const api = axios.create({
  baseURL: "https://launchpad-events.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user?.role) {
    config.headers["user-role"] = user.role;
    config.headers["user-id"] = user.id;
  }
  console.log("Request:", {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log("Response success:", {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error("Response error:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

export default api;
