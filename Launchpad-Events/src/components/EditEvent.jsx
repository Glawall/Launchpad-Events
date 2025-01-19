import { useState } from "react";
import { useEvents } from "../hooks/api-hooks";
import EventTypeSelect from "./EventTypeSelect";
import Button from "./common/Button";
import FormField from "./common/FormField";

export default function EditEvent({ event, onUpdate, onCancel }) {
  const { updateEvent } = useEvents();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    date: new Date(event.date).toISOString().split("T")[0],
    time: new Date(event.date).toTimeString().slice(0, 5),
    end_date: new Date(event.end_date).toISOString().split("T")[0],
    end_time: new Date(event.end_date).toTimeString().slice(0, 5),
    location_name: event.location_name,
    location_address: event.location_address,
    capacity: event.capacity,
    event_type_id: event.event_type_id.toString(),
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

      const updatedEvent = await updateEvent(event.id, eventData);
      onUpdate(updatedEvent);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wrapper">
      <form onSubmit={handleSubmit} className="form">
        <h2 className="form-title">Edit Event</h2>

        <div className="form-row">
          <FormField
            label="Title"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div className="form-row">
          <FormField
            label="Description"
            type="textarea"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows="4"
            required
          />
        </div>

        <div className="form-row">
          <FormField
            label="Date"
            type="date"
            name="date"
            value={formData.date}
            onChange={handleDateTimeChange}
            required
          />
        </div>

        <div className="form-row">
          <FormField
            label="Time"
            type="time"
            name="time"
            value={formData.time}
            onChange={handleDateTimeChange}
            required
          />
        </div>

        <div className="form-row">
          <FormField
            label="End Date"
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={(e) =>
              setFormData({ ...formData, end_date: e.target.value })
            }
            required
          />
        </div>

        <div className="form-row">
          <FormField
            label="End Time"
            type="time"
            name="end_time"
            value={formData.end_time}
            onChange={(e) =>
              setFormData({ ...formData, end_time: e.target.value })
            }
            required
          />
        </div>

        <div className="form-row">
          <div className="input-group">
            <label className="label">Event Type</label>
            <EventTypeSelect
              value={formData.event_type_id}
              onChange={(value) =>
                setFormData({ ...formData, event_type_id: value })
              }
              className="input"
              isEditing={true}
            />
          </div>
        </div>

        <div className="form-row">
          <FormField
            label="Location Name"
            name="location_name"
            value={formData.location_name}
            onChange={(e) =>
              setFormData({ ...formData, location_name: e.target.value })
            }
            required
          />
        </div>

        <div className="form-row">
          <FormField
            label="Location Address"
            name="location_address"
            value={formData.location_address}
            onChange={(e) =>
              setFormData({ ...formData, location_address: e.target.value })
            }
            required
          />
        </div>

        <div className="form-row">
          <FormField
            label="Capacity"
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={(e) =>
              setFormData({ ...formData, capacity: e.target.value })
            }
            required
          />
        </div>

        {error && (
          <div className="error-box">
            <p className="error-text">{error}</p>
          </div>
        )}

        <div className="btn-group">
          <Button variant="red" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="blue" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Event"}
          </Button>
        </div>
      </form>
    </div>
  );
}
