import { createContext, useContext, useState, useEffect } from "react";
import { useEventTypes } from "../hooks/api-hooks";

const EventTypesContext = createContext();

export function EventTypesProvider({ children }) {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAllEventTypes } = useEventTypes();

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const types = await getAllEventTypes();
        console.log("Fetched event types:", types); // Debug log
        setEventTypes(types);
      } catch (err) {
        setError("Failed to load event types");
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypes();
  }, [getAllEventTypes]);

  const refreshEventTypes = async () => {
    try {
      const types = await getAllEventTypes();
      setEventTypes(types);
    } catch (err) {
      setError("Failed to refresh event types");
    }
  };

  return (
    <EventTypesContext.Provider
      value={{
        eventTypes,
        loading,
        error,
        refreshEventTypes,
      }}
    >
      {children}
    </EventTypesContext.Provider>
  );
}

export function useEventTypesContext() {
  const context = useContext(EventTypesContext);
  if (!context) {
    throw new Error(
      "useEventTypesContext must be used within an EventTypesProvider"
    );
  }
  return context;
}
