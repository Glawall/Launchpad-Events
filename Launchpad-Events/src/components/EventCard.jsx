import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { formatDate, formatTimeRange } from "../utils/date-utils";
import useEventAttendance from "../hooks/useEventAttendance";
import GoogleCalendarButton from "./GoogleCalendarButton";
import Button from "./common/Button";
import InfoGroup from "./common/InfoGroup";
import { useState } from "react";
import ConfirmBox from "./common/ConfirmBox";

export default function EventCard({ event, onEventUpdate }) {
  const { user } = useAuth();
  const { attending, loading, handleAttendance } = useEventAttendance(
    event,
    onEventUpdate
  );
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);

  return (
    <>
      <div className="card">
        <Link to={`/events/${event.id}`} className="card-title">
          {event.title}
        </Link>
        <div className="card-info">
          <InfoGroup label="Location">
            <p>{event.location_name}</p>
            <p>{event.location_address}</p>
          </InfoGroup>
          <InfoGroup label="Date">
            <p>{formatDate(event.date)}</p>
          </InfoGroup>
          <InfoGroup label="Time">
            <p>{formatTimeRange(event.date, event.end_date)}</p>
          </InfoGroup>
          <InfoGroup label="Capacity">
            <p>
              {event.attendees.length} / {event.capacity} registered
            </p>
          </InfoGroup>
        </div>
        <div className="card-actions">
          <div className="card-buttons">
            {user && (
              <>
                {attending ? (
                  <Button
                    variant="red"
                    onClick={() => setShowConfirmCancel(true)}
                    disabled={loading}
                  >
                    {loading ? "Canceling..." : "Cancel Registration"}
                  </Button>
                ) : (
                  <Button
                    variant="btn"
                    onClick={handleAttendance}
                    disabled={
                      loading ||
                      (!attending && event.attendees.length >= event.capacity)
                    }
                  >
                    {loading ? "Registering..." : "Register"}
                  </Button>
                )}
                {attending && <GoogleCalendarButton event={event} />}
              </>
            )}
            <Link to={`/events/${event.id}`} className="btn-link">
              View Details →
            </Link>
          </div>
        </div>
      </div>
      <ConfirmBox
        isOpen={showConfirmCancel}
        onClose={() => setShowConfirmCancel(false)}
        onConfirm={() => {
          handleAttendance();
          setShowConfirmCancel(false);
        }}
        title="Cancel Registration"
        message="Are you sure you want to cancel your registration for this event?"
      />
    </>
  );
}
