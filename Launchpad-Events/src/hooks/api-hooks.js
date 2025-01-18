import { useCallback } from "react";
import api from "../utils/api-client";

export function useAuth() {
  const validateCredentials = useCallback(async (credentials) => {
    try {
      const response = await api.post("/api/auth/login", {
        email: credentials.email,
        password: credentials.password,
      });
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      throw new Error(message);
    }
  }, []);

  return { validateCredentials };
}

export async function signup(email, name, password) {
  try {
    const response = await api.post("/api/users", {
      email,
      name,
      password,
      role: "user",
    });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || "Signup failed";
    throw new Error(message);
  }
}

export function useEvents() {
  const getAllEvents = useCallback(
    async ({
      page = 1,
      limit = 10,
      sort = "date",
      order = "asc",
      status,
    } = {}) => {
      try {
        const response = await api.get("/api/events", {
          params: {
            page: parseInt(page),
            limit: parseInt(limit),
            sort,
            order,
            status,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(
          error.response?.data?.message || "Failed to fetch events"
        );
      }
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

    const eventInformation = {
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      end_date: eventData.end_date,
      location_name: eventData.location_name,
      location_address: eventData.location_address,
      capacity: parseInt(eventData.capacity),
      creator_id: parseInt(user.id),
      event_type_id: 1,
    };

    try {
      const response = await api.post("/api/admin/events", eventInformation, {
        headers: {
          "user-role": "admin",
          "user-id": user.id,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to create event"
      );
    }
  }, []);

  return { getAllEvents, getEventById, createEvent };
}

export function useAttendees() {
  const addAttendee = useCallback(async (eventId, userId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.role || !user.id) {
      throw new Error("User information is missing");
    }

    try {
      const response = await api.post(
        `/api/events/${eventId}/users/${userId}/attendees`,
        { eventId, userId },
        {
          headers: {
            "user-role": user.role,
            "user-id": user.id,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to add to event"
      );
    }
  }, []);

  const deleteAttendee = useCallback(async (eventId, userId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      await api.delete(`/api/events/${eventId}/users/${userId}/attendees`, {
        headers: {
          "user-role": user.role,
          "user-id": user.id,
        },
      });
      return true;
    } catch (error) {
      throw new Error("Failed to remove from event");
    }
  }, []);

  return { addAttendee, deleteAttendee };
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
