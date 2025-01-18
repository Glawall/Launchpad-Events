import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../hooks/api-hooks";
import { useState, useEffect } from "react";
import { formatDate, formatTimeRange } from "../utils/date-utils";
import useEventAttendance from "../hooks/useEventAttendance";

export default function Event() {
  const { id } = useParams();
  const { getEventById } = useEvents();
  const [event, setEvent] = useState(null);
  const { attending, loading, handleAttendance, removeAttendee } =
    useEventAttendance(event, setEvent);

  const { user, isAdmin } = useAuth();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id);
        setEvent(data);
      } catch (error) {
        setEvent(null);
      }
    };

    if (id) {
      fetchEvent();
    }
  }, [id, getEventById]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className="event-page">
      <div className="event-details">
        <h1>{event.title}</h1>

        <div className="info-item">
          <h3>Description</h3>
          <p className="description">{event.description}</p>
        </div>

        <div className="info-section">
          <div className="info-item">
            <h3>Date & Time</h3>
            <p>{formatDate(event.date)}</p>
            <p>{formatTimeRange(event.date, event.end_date)}</p>
          </div>

          <div className="info-item">
            <h3>Location</h3>
            <p>{event.location_name}</p>
            <p>{event.location_address}</p>
          </div>

          <div className="info-item">
            <h3>Capacity</h3>
            <p>
              {event.attendees.length} / {event.capacity} registered
            </p>
          </div>
        </div>

        {user && (
          <div className="event-actions">
            {attending ? (
              <>
                <p className="attending-status">
                  You're registered for this event!
                </p>
                <div className="action-buttons">
                  <button
                    onClick={handleAttendance}
                    className="btn-red"
                    disabled={loading}
                  >
                    {loading ? "Canceling..." : "Cancel Registration"}
                  </button>
                </div>
              </>
            ) : (
              <button
                onClick={handleAttendance}
                className="btn-blue"
                disabled={loading || event.attendees.length >= event.capacity}
              >
                {loading ? "Registering..." : "Register for Event"}
              </button>
            )}
          </div>
        )}

        <div className="attendees-section">
          <h3>Attendees ({event.attendees.length})</h3>
          <ul className="attendees-list">
            {event.attendees.map((attendee) => (
              <li key={attendee.id} className="attendee-item">
                <span>{attendee.name}</span>
                {isAdmin && attendee.id !== user.id && (
                  <div className="remove-attendee-wrapper">
                    <span className="remove-text">Remove</span>
                    <button
                      onClick={() => removeAttendee(event.id, attendee.id)}
                      className="remove-attendee"
                      title="Remove attendee"
                    >
                      ×
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
