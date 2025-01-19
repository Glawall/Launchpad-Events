import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEvents, useAdmin } from "../hooks/api-hooks";
import { useState, useEffect } from "react";
import { formatDate, formatTimeRange } from "../utils/date-utils";
import useEventAttendance from "../hooks/useEventAttendance";
import EditEvent from "./EditEvent";
import GoogleCalendarButton from "./GoogleCalendarButton";
import Button from "./common/Button";
import InfoGroup from "./common/InfoGroup";
import ConfirmBox from "./common/ConfirmBox";

export default function Event() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { getEventById } = useEvents();
  const { deleteEvent } = useAdmin();
  const [event, setEvent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { attending, loading, handleAttendance, removeAttendee } =
    useEventAttendance(event, setEvent);
  const [showConfirmRemove, setShowConfirmRemove] = useState(false);
  const [attendeeToRemove, setAttendeeToRemove] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

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
    setIsEditing(false);
    await fetchEvent();
  };

  const handleRemoveAttendee = (attendeeId) => {
    setAttendeeToRemove(attendeeId);
    setShowConfirmRemove(true);
  };

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(event.id);
      navigate("/events");
    } catch (error) {
      console.error("Failed to delete event:", error);
    }
  };

  if (!id) return <div>No event ID provided</div>;
  if (!event) return <div>Loading...</div>;

  if (isEditing) {
    return (
      <EditEvent
        event={event}
        onUpdate={handleEventUpdate}
        onCancel={() => setIsEditing(false)}
      />
    );
  }

  return (
    <>
      <div className="event-page">
        <div className="event-details">
          <div className="event-header">
            <h1>{event.title}</h1>
            <div className="admin-actions">
              <Button variant="blue" onClick={() => setIsEditing(true)}>
                Edit Event
              </Button>
              <Button variant="red" onClick={() => setShowConfirmDelete(true)}>
                Delete Event
              </Button>
            </div>
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
                      onClick={handleAttendance}
                      disabled={loading}
                    >
                      {loading ? "Canceling..." : "Cancel Registration"}
                    </Button>
                    <GoogleCalendarButton event={event} />
                  </div>
                </>
              ) : (
                <Button
                  variant="blue"
                  onClick={handleAttendance}
                  disabled={loading || event.attendees.length >= event.capacity}
                >
                  {loading ? "Registering..." : "Register for Event"}
                </Button>
              )}
            </div>
          )}

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
      <ConfirmBox
        isOpen={showConfirmRemove}
        onClose={() => setShowConfirmRemove(false)}
        onConfirm={() => {
          removeAttendee(event.id, attendeeToRemove);
          setShowConfirmRemove(false);
        }}
        title="Remove Attendee"
        message="Are you sure you want to remove this attendee from the event?"
      />
      <ConfirmBox
        isOpen={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteEvent}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
      />
    </>
  );
}
