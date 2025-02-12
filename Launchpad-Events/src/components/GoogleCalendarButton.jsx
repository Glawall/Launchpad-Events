import { useState, useEffect } from "react";
import { initGoogleApi, addEventToCalendar } from "../utils/google-calendar";

export default function GoogleCalendarButton({ event }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    initGoogleApi("https://www.googleapis.com/auth/calendar.events").catch(
      (err) => {
        console.error("Failed to initialize Google API:", err);
        setError("Failed to load Google Calendar");
      }
    );
  }, []);

  const handleAddToCalendar = async () => {
    setLoading(true);
    setError(null);
    try {
      await addEventToCalendar(event);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      return;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (error) return <div className="error">{error}</div>;

  return (
    <button
      onClick={handleAddToCalendar}
      disabled={loading}
      className="btn-default"
    >
      {loading ? "Adding to Calendar..." : "Add to Google Calendar"}
    </button>
  );
}
