import axios from "axios";

const api = axios.create({
  baseURL: "https://launchpad-events.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      return Promise.reject(
        new Error("Unable to connect. Please check your internet connection.")
      );
    }
    return Promise.reject(error);
  }
);

export default api;
