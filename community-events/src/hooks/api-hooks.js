import { useCallback } from "react";
import api from "../utils/api-client";

const MOCK_USERS = [
  {
    id: 1,
    email: "sarah.johnson@techevents.com",
    password: "password123",
    name: "Sarah Johnson",
    role: "admin",
  },
  {
    id: 3,
    email: "emma.w@gmail.com",
    password: "password123",
    name: "Emma W",
    role: "user",
  },
];

export function useAuth() {
  const validateCredentials = useCallback(async (credentials) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const matchedUser = MOCK_USERS.find(
      (u) =>
        u.email === credentials.email && u.password === credentials.password
    );

    if (!matchedUser) {
      throw new Error("Invalid email or password");
    }

    const { password, ...userWithoutPassword } = matchedUser;
    return userWithoutPassword;
  }, []);

  return { validateCredentials };
}

export function useEvents() {
  const getAllEvents = useCallback(
    async ({ page = 1, limit = 10, sort = "date", order = "asc" }) => {
      console.log("API call params:", { page, limit, sort, order }); // Debug log
      const response = await api.get("/api/events", {
        params: {
          page: parseInt(page),
          limit: parseInt(limit),
          sort,
          order,
        },
      });
      console.log("API response:", response.data);
      return response.data;
    },
    []
  );

  const getEventById = useCallback(async (id) => {
    const response = await api.get(`/api/events/${id}`);
    return response.data;
  }, []);

  const createEvent = useCallback(async (eventData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      throw new Error("Unauthorized: Admin access required");
    }

    const eventPayload = {
      ...eventData,
      creator_id: parseInt(user.id),
      event_type_id: parseInt(eventData.event_type_id),
      capacity: parseInt(eventData.capacity),
      date: eventData.date,
      end_date: eventData.end_date,
    };

    try {
      const response = await api.post("/api/admin/events", eventPayload, {
        headers: {
          "user-role": "admin",
          "user-id": user.id,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data); // Debug log
      throw error;
    }
  }, []);

  return { getAllEvents, getEventById, createEvent };
}

export function useAttendees() {
  const addAttendee = useCallback(async (eventId, userId) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const attendances = JSON.parse(
        localStorage.getItem("attendances") || "{}"
      );
      if (!attendances[eventId]) {
        attendances[eventId] = [];
      }
      attendances[eventId].push(userId);
      localStorage.setItem("attendances", JSON.stringify(attendances));

      return { success: true };
    } catch (error) {
      throw new Error("Failed to register for event");
    }
  }, []);

  const checkAttendance = useCallback((eventId, userId) => {
    const attendances = JSON.parse(localStorage.getItem("attendances") || "{}");
    return attendances[eventId]?.includes(userId) || false;
  }, []);

  return { addAttendee, checkAttendance };
}

export function useAdmin() {
  const getAllUsers = useCallback(async () => {
    const response = await api.get("/api/admin/users");
    return response.data;
  }, []);

  const updateEvent = useCallback(async (id, eventData) => {
    const response = await api.put(`/api/admin/events/${id}`, eventData);
    return response.data;
  }, []);

  const deleteEvent = useCallback(async (id) => {
    const response = await api.delete(`/api/admin/events/${id}`);
    return response.data;
  }, []);

  const updateUser = useCallback(async (id, userData) => {
    const response = await api.patch(`/api/admin/users/${id}`, userData);
    return response.data;
  }, []);

  return {
    getAllUsers,
    updateEvent,
    deleteEvent,
    updateUser,
  };
}

export function useUser() {
  const getUserById = useCallback(async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  }, []);

  const deleteUser = useCallback(async (id) => {
    const response = await api.delete(`/api/users/${id}`);
    return response.data;
  }, []);

  return { getUserById, deleteUser };
}

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  if (user?.role) {
    config.headers["user-role"] = user.role;
    config.headers["user-id"] = user.id;
  }
  return config;
});
