import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents, useEventTypes } from "../hooks/api-hooks";
import EventTypeSelect from "./EventTypeSelect";

export default function CreateEvent() {
  const navigate = useNavigate();
  const { createEvent } = useEvents();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const handleDateTimeChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === "date") {
        newData.end_date = value;
      }
      if (name === "time") {
        const [hours, minutes] = value.split(":");
        const newTime = new Date();
        newTime.setHours(parseInt(hours) + 2);
        newTime.setMinutes(parseInt(minutes));

        newData.end_time = `${String(newTime.getHours()).padStart(
          2,
          "0"
        )}:${String(newTime.getMinutes()).padStart(2, "0")}`;
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
        capacity: parseInt(formData.capacity),
        event_type_id: parseInt(formData.event_type_id),
      };

      await createEvent(eventData);
      navigate("/events");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form-title">Create Event</h2>

        <div className="form-row">
          <div className="input-group">
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
        </div>

        <div className="form-row">
          <div className="input-group">
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
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
            className="input"
            required
          />
        </div>

        <div className="form-row">
          <label className="label">End Time</label>
          <input
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={(e) =>
              setFormData({ ...formData, end_time: e.target.value })
            }
            className="input"
            required
            step="900"
          />
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
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              className="input"
              required
            />
          </div>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-blue" disabled={loading}>
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>

        {error && (
          <div className="error-box">
            <p className="error-text">{error}</p>
          </div>
        )}
      </form>
    </div>
  );
}
