import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents, useEventTypes } from "../hooks/api-hooks";
import EventTypeSelect from "./EventTypeSelect";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { createEvent } = useEvents();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [dateError, setDateError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "09:00",
    end_date: "",
    end_time: "11:00",
    location_name: "",
    location_address: "",
    capacity: "",
    event_type_id: "1",
  });

  const validateDates = (startDate, startTime, endDate, endTime) => {
    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);
    const now = new Date();

    if (start < now) {
      return "Event start date and time must be in the future";
    }

    if (end < start) {
      return "End date and time must be after start date and time";
    }
    return "";
  };

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "date") {
        newData.end_date = value;
        const error = validateDates(value, prev.time, value, prev.end_time);
        setDateError(error);
      }

      if (name === "end_date" || name === "time" || name === "end_time") {
        const error = validateDates(
          prev.date,
          name === "time" ? value : prev.time,
          name === "end_date" ? value : prev.end_date,
          name === "end_time" ? value : prev.end_time
        );
        setDateError(error);
      }

      return newData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const eventData = {
        ...formData,
        date: new Date(`${formData.date}T${formData.time}`).toISOString(),
        end_date: new Date(
          `${formData.end_date}T${formData.end_time}`
        ).toISOString(),
        event_type_id: parseInt(formData.event_type_id, 10),
      };

      const createdEvent = await createEvent(eventData);
      setSuccess(true);
      setTimeout(() => {
        navigate(`/events/${createdEvent.id}`);
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create event");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} className="form create-event-form">
        <h2 className="form-title">Create Event</h2>

        <div className="form-row">
          <label className="label">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="input"
            required
          />
        </div>

        <div className="form-row">
          <label className="label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="input"
            required
          />
        </div>

        <div className="form-row">
          <label className="label">Start Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleDateTimeChange}
            className="input"
            required
          />
        </div>

        <div className="form-row">
          <label className="label">Start Time</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleDateTimeChange}
            className="input"
            required
            step="900"
          />
        </div>

        <div className="form-row">
          <label className="label">End Date</label>
          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleDateTimeChange}
            className="input"
            required
          />
          {dateError && <div className="error-message">{dateError}</div>}
        </div>

        <div className="form-row">
          <label className="label">End Time</label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={handleDateTimeChange}
            className="input"
            required
            step="900"
          />
          {dateError && <div className="error-message">{dateError}</div>}
        </div>

        <div className="form-row">
          <EventTypeSelect
            value={formData.event_type_id}
            onChange={(value) =>
              setFormData({ ...formData, event_type_id: value })
            }
          />
        </div>

        <div className="form-row">
          <div className="input-group">
            <label className="label">Location Name</label>
            <input
              type="text"
              name="location_name"
              value={formData.location_name}
              onChange={(e) =>
                setFormData({ ...formData, location_name: e.target.value })
              }
              className="input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label className="label">Location Address</label>
            <input
              type="text"
              name="location_address"
              value={formData.location_address}
              onChange={(e) =>
                setFormData({ ...formData, location_address: e.target.value })
              }
              className="input"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="input-group">
            <label className="label">Capacity</label>
            <input
              type="number"
              name="capacity"
              min="1"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  capacity: parseInt(e.target.value, 10) || "",
                })
              }
              className="input"
              required
            />
          </div>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-default" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>

        {error && (
          <div className="error-box">
            <p className="error-text">{error}</p>
          </div>
        )}

        {success && (
          <div className="success-box">
            <p className="success-text">Event created successfully!</p>
          </div>
        )}
      </form>
    </div>
  );
}
