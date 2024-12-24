import { useState, useEffect } from "react";
import { useAttendees } from "../hooks/api-hooks";
import { useAuth } from "../context/AuthContext";

export default function EventCard({ event }) {
  const [attending, setAttending] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { addAttendee, checkAttendance } = useAttendees();

  useEffect(() => {
    if (user && event.id) {
      const isAttending = checkAttendance(event.id, user.id);
      setAttending(isAttending);
    }
  }, [user, event.id, checkAttendance]);

  const handleAttend = async () => {
    setLoading(true);
    try {
      await addAttendee(event.id, user.id);
      setAttending(true);
    } catch (error) {
      console.error("Failed to attend event:", error);
    } finally {
      setLoading(false);
    }
  };

  const createGoogleCalendarLink = () => {
    const startDate = new Date(event.date);
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    const params = {
      action: "TEMPLATE",
      text: event.title,
      details: event.description,
      location: event.location_name,
      dates: `${startDate.toISOString().replace(/-|:|\.\d+/g, "")}/${endDate
        .toISOString()
        .replace(/-|:|\.\d+/g, "")}`,
    };

    const url = `https://calendar.google.com/calendar/render?${new URLSearchParams(
      params
    )}`;
    return url;
  };

  return (
    <div className="card">
      <h3 className="card-title">{event.title}</h3>
      <p className="card-text">{event.description}</p>
      <div className="card-info">
        <p>Location: {event.location_name}</p>
        <p>Date: {new Date(event.date).toLocaleDateString()}</p>
        <p>Time: {new Date(event.date).toLocaleTimeString()}</p>
        <p>Spots: {event.capacity}</p>
      </div>
      <div className="card-actions">
        {!attending ? (
          <button
            onClick={handleAttend}
            className="btn-blue"
            disabled={loading}
          >
            {loading ? "Joining..." : "Attend Event"}
          </button>
        ) : (
          <div className="attend-success">
            <p className="success-text">You're attending!</p>
            <a
              href={createGoogleCalendarLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gray"
            >
              Add to Google Calendar
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
