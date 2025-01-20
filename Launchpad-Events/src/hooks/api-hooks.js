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
      type_id,
    } = {}) => {
      try {
        const response = await api.get("/api/events", {
          params: {
            page: parseInt(page),
            limit: parseInt(limit),
            sort,
            order,
            status,
            type_id: type_id ? parseInt(type_id) : undefined,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error(message);
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
      throw new Error(message);
    }
  }, []);

  const updateEvent = useCallback(async (id, eventData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const eventWithCreator = {
        ...eventData,
        creator_id: parseInt(user.id),
      };

      const response = await api.patch(
        `/api/admin/events/${id}`,
        eventWithCreator,
        {
          headers: {
            "user-role": user.role,
            "user-id": user.id,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(message);
    }
  }, []);

  const deleteEvent = useCallback(async (eventId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await api.delete(`/api/admin/events/${eventId}`, {
        headers: {
          "user-role": user.role,
          "user-id": user.id,
        },
      });
      return true;
    } catch (error) {
      throw new Error(message);
    }
  }, []);

  return { getAllEvents, getEventById, createEvent, updateEvent, deleteEvent };
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
      throw new Error(message);
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
  const getUserById = useCallback(async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  }, []);

  const getAllUsers = useCallback(async () => {
    try {
      const response = await api.get("/api/users");
      return response.data;
    } catch (error) {
      throw new Error(message);
    }
  }, []);

  const updateUser = useCallback(async (userId, userData) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const response = await api.patch(`/api/admin/users/${userId}`, userData, {
        headers: {
          "user-role": user.role,
          "user-id": user.id,
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(message);
    }
  }, []);

  const deleteUser = useCallback(async (userId) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      await api.delete(`/api/users/${userId}`, {
        headers: {
          "user-role": user.role,
          "user-id": user.id,
        },
      });
      return true;
    } catch (error) {
      throw new Error(message);
    }
  }, []);

  return {
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
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

export function useEventTypes() {
  const getAllEventTypes = useCallback(async () => {
    try {
      const response = await api.get("/api/event-types");
      return response.data;
    } catch (error) {
      throw new Error(message);
    }
  }, []);

  const getEventTypeById = useCallback(async (id) => {
    const response = await api.get(`/api/event-types/${id}`);
    return response.data;
  }, []);

  const createEventType = useCallback(async (typeData) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await api.post("/api/admin/event-types", typeData, {
        headers: {
          "user-role": user.role,
          "user-id": user.id,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(message);
    }
  }, []);

  const deleteEventType = useCallback(async (typeId) => {
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const response = await api.delete(`/api/admin/event-types/${typeId}`, {
        headers: {
          "user-role": user.role,
          "user-id": user.id,
          "Content-Type": "application/json",
        },
      });
      return true;
    } catch (error) {
      throw new Error(message);
    }
  }, []);

  return {
    getAllEventTypes,
    getEventTypeById,
    createEventType,
    deleteEventType,
  };
}
