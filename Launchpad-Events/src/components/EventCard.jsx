import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatTimeRange } from "../utils/date-utils";
import useEventAttendance from "../hooks/useEventAttendance";

export default function EventCard({ event, onEventUpdate }) {
  const { user } = useAuth();
  const { attending, loading, handleAttendance } = useEventAttendance(
    event,
    onEventUpdate
  );

  return (
    <div className="card">
      <h3 className="card-title">{event.title}</h3>
      <div className="card-info">
        <div className="info-group">
          <span className="info-label">Location</span>
          <p>{event.location_name}</p>
        </div>
        <div className="info-group">
          <span className="info-label">Date</span>
          <p>{formatDate(event.date)}</p>
        </div>
        <div className="info-group">
          <span className="info-label">Time</span>
          <p>{formatTimeRange(event.date, event.end_date)}</p>
        </div>
      </div>
      <div className="card-actions">
        <div className="card-buttons">
          {user && (
            <button
              onClick={handleAttendance}
              disabled={loading || event.attendees.length >= event.capacity}
              className={`btn ${attending ? "btn-red" : "btn-blue"}`}
            >
              {loading
                ? attending
                  ? "Canceling..."
                  : "Registering..."
                : attending
                ? "Cancel Registration"
                : "Register"}
            </button>
          )}
          <Link to={`/events/${event.id}`} className="btn-link">
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
