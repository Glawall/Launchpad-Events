import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEvents, useAdmin, useAttendees } from "../hooks/api-hooks";
import { useState, useEffect } from "react";
import { formatDate, formatTimeRange } from "../utils/date-utils";
import useEventAttendance from "../hooks/useEventAttendance";
import EditEvent from "./EditEvent";
import GoogleCalendarButton from "./GoogleCalendarButton";
import Button from "./common/Button";
import InfoGroup from "./common/InfoGroup";
import ConfirmBox from "./common/ConfirmBox";
import { useConfirmStatus } from "../hooks/useConfirmStatus";

export default function Event() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { getEventById, deleteEvent } = useEvents();
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { attending, loading, handleAttendance, removeAttendee } =
    useEventAttendance(event, setEvent);
  const { status, openStatus, closeStatus } = useConfirmStatus();
  const [attendeeToRemove, setAttendeeToRemove] = useState(null);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchEvent = async () => {
    try {
      const data = await getEventById(id);
      setEvent(data);
    } catch (error) {
      console.error("Failed to fetch event:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchEvent();
    }
  }, [id, getEventById]);

  const handleEventUpdate = async (updatedEvent) => {
    try {
      setIsEditing(false);
      await fetchEvent();
      setError(null);
      setShowSuccess(true);
      window.scrollTo(0, 0);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err) {
      setError(err.message);
      setShowSuccess(false);
    }
  };

  const handleRemoveAttendee = (attendeeId) => {
    setAttendeeToRemove(attendeeId);
    openStatus("remove");
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(event.id);
      navigate("/events");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveClick = () => openStatus("remove");
  const handleDeleteClick = () => openStatus("delete");
  const handleCancelClick = () => openStatus("cancel");

  if (!id) return <div>No event ID provided</div>;
  if (!event) return <div>Loading...</div>;

  if (isEditing) {
    return (
      <EditEvent
        event={event}
        onUpdate={handleEventUpdate}
        onCancel={() => setIsEditing(false)}
        showSuccess={showSuccess}
      />
    );
  }

  return (
    <div className="event-page">
      {error && (
        <div className="error-box">
          <p className="error-text">{error}</p>
        </div>
      )}
      {showSuccess && (
        <div className="success-box">
          <p className="success-text">Event updated successfully!</p>
        </div>
      )}
      <div className="event-details">
        <div className="event-header">
          <h1>{event.title}</h1>
          {isAdmin && (
            <div className="admin-actions">
              <Button variant="blue" onClick={() => setIsEditing(true)}>
                Edit Event
              </Button>
              <Button variant="red" onClick={handleDeleteClick}>
                Delete Event
              </Button>
            </div>
          )}
        </div>

        <div className="info-section">
          <div className="event-details-group">
            <div className="info-item">
              <InfoGroup label="Description">
                <p>{event.description}</p>
              </InfoGroup>
            </div>

            <div className="info-item">
              <InfoGroup label="Date & Time">
                <p>{formatDate(event.date)}</p>
                <p>{formatTimeRange(event.date, event.end_date)}</p>
              </InfoGroup>
            </div>

            <div className="info-item">
              <InfoGroup label="Location">
                <p>{event.location_name}</p>
                <p>{event.location_address}</p>
              </InfoGroup>
            </div>

            <div className="info-item">
              <InfoGroup label="Capacity">
                <p>
                  {event.attendees.length} / {event.capacity} registered
                </p>
              </InfoGroup>
            </div>
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
                  <Button
                    variant="red"
                    onClick={handleCancelClick}
                    disabled={loading}
                  >
                    {loading ? "Canceling..." : "Cancel Registration"}
                  </Button>
                  <GoogleCalendarButton event={event} />
                </div>
              </>
            ) : (
              <Button
                variant="btn-default"
                onClick={handleAttendance}
                disabled={loading || event.attendees.length >= event.capacity}
              >
                {loading ? "Registering..." : "Register for Event"}
              </Button>
            )}
          </div>
        )}

        {isAdmin && (
          <div className="attendees-section">
            <h3>Attendees ({event.attendees.length})</h3>
            <ul className="attendees-list">
              {event.attendees.map((attendee) => (
                <li key={attendee.id} className="attendee-item">
                  <span>{attendee.name}</span>
                  {attendee.id !== user.id && (
                    <div className="remove-attendee-wrapper">
                      <span className="remove-text">Remove</span>
                      <button
                        onClick={() => handleRemoveAttendee(attendee.id)}
                        className="btn-red"
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
        )}
      </div>
      <ConfirmBox
        isOpen={status.remove}
        onClose={() => closeStatus("remove")}
        onConfirm={() => {
          removeAttendee(event.id, attendeeToRemove);
          closeStatus("remove");
        }}
        title="Remove Attendee"
        message="Are you sure you want to remove this attendee from the event?"
      />
      <ConfirmBox
        isOpen={status.delete}
        onClose={() => closeStatus("delete")}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
      />
      <ConfirmBox
        isOpen={status.cancel}
        onClose={() => closeStatus("cancel")}
        onConfirm={() => {
          handleAttendance();
          closeStatus("cancel");
        }}
        title="Cancel Registration"
        message="Are you sure you want to cancel your registration for this event?"
      />
    </div>
  );
}
