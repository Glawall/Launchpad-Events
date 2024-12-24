import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/api-hooks";
import { useAuth } from "../context/AuthContext";

const MOCK_EVENT_TYPES = [
  { id: 1, name: "Conference" },
  { id: 2, name: "Workshop" },
  { id: 3, name: "Meetup" },
  { id: 4, name: "Social" },
  { id: 5, name: "Training" },
];

export default function CreateEvent() {
  const navigate = useNavigate();
  const { createEvent } = useEvents();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    capacity: "",
    location_name: "",
    location_address: "",
    date: "",
    event_type_id: "",
    status: "upcoming",
    timezone: "Europe/London",
    role: "admin",
    created_by: "sarah.johnson@example.com",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const eventDate = new Date(formData.date);
    const endDate = new Date(eventDate.getTime() + 2 * 60 * 60 * 1000);

    const eventData = {
      title: formData.title,
      description: formData.description,
      date: eventDate.toISOString(),
      end_date: endDate.toISOString(),
      capacity: parseInt(formData.capacity),
      location_name: formData.location_name,
      location_address: formData.location_address,
      event_type_id: parseInt(formData.event_type_id),
      status: "upcoming",
      timezone: "Europe/London",
    };

    try {
      console.log("Submitting event data:", eventData);
      await createEvent(eventData);
      navigate("/events", { replace: true });
    } catch (err) {
      console.error("Create event error:", err.response?.data || err);
      setError(
        err.response?.data?.message || err.message || "Failed to create event"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <h2 className="title">Create Event</h2>
      <form onSubmit={handleSubmit} className="form">
        {error && (
          <div className="error-box">
            <div className="error-text">{error}</div>
          </div>
        )}
        <div className="form-row">
          <label className="label">Event Type</label>
          <select
            name="event_type_id"
            required
            className="input"
            value={formData.event_type_id}
            onChange={handleChange}
          >
            <option value="">Select an event type</option>
            {MOCK_EVENT_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-row">
          <label className="label">Event Title</label>
          <input
            type="text"
            name="title"
            required
            className="input"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label className="label">Description</label>
          <textarea
            name="description"
            required
            rows={4}
            className="input"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label className="label">Date and Time</label>
          <input
            type="datetime-local"
            name="date"
            required
            className="input"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <label className="label">Venue Name</label>
          <input
            type="text"
            name="location_name"
            required
            className="input"
            value={formData.location_name}
            onChange={handleChange}
            placeholder="e.g., Town Hall, Conference Center"
          />
        </div>
        <div className="form-row">
          <label className="label">Venue Address</label>
          <input
            type="text"
            name="location_address"
            required
            className="input"
            value={formData.location_address}
            onChange={handleChange}
            placeholder="Full address"
          />
        </div>
        <div className="form-row">
          <label className="label">Capacity</label>
          <input
            type="number"
            name="capacity"
            required
            min="1"
            className="input"
            value={formData.capacity}
            onChange={handleChange}
          />
        </div>
        <div className="btn-group">
          <button
            type="button"
            onClick={() => navigate("/events")}
            className="btn-gray"
          >
            Cancel
          </button>
          <button type="submit" className="btn-blue" disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
