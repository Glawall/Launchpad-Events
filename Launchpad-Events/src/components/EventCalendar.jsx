import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const MOCK_EVENT_TYPE_COLORS = {
  workshop: "#93c5fd",
  seminar: "#86efac",
  networking: "#fcd34d",
  conference: "#f9a8d4",
  default: "#e5e7eb",
};

const MOCK_EVENT_TYPES = {
  workshop: { color: "#93c5fd", label: "Workshop" },
  seminar: { color: "#86efac", label: "Seminar" },
  networking: { color: "#fcd34d", label: "Networking" },
  conference: { color: "#f9a8d4", label: "Conference" },
  default: { color: "#e5e7eb", label: "Other" },
};

export default function EventCalendar({ events, onDateSelect }) {
  const [date, setDate] = useState(new Date());

  const eventDates = events.reduce((acc, event) => {
    const eventDate = new Date(event.date).toDateString();
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(event);
    return acc;
  }, {});

  const tileContent = ({ date }) => {
    const dateStr = date.toDateString();
    const dayEvents = eventDates[dateStr] || [];
    if (dayEvents.length === 0) return null;

    return (
      <div className="calendar-events">
        {dayEvents.map((event, index) => (
          <div
            key={event.id}
            className="calendar-event-title"
            style={{
              backgroundColor:
                MOCK_EVENT_TYPE_COLORS[event.event_type_name?.toLowerCase()] ||
                MOCK_EVENT_TYPE_COLORS.default,
            }}
          >
            {event.title}
          </div>
        ))}
      </div>
    );
  };

  const handleDateChange = (value) => {
    setDate(value);
    const dateStr = value.toDateString();
    const dateEvents = eventDates[dateStr] || [];
    onDateSelect(dateEvents);
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        onChange={handleDateChange}
        value={date}
        tileContent={tileContent}
        tileClassName={({ date }) => {
          const dateStr = date.toDateString();
          return eventDates[dateStr]?.length ? "has-events" : null;
        }}
      />
      <div className="calendar-legend">
        {Object.entries(MOCK_EVENT_TYPES).map(([type, { color, label }]) => (
          <div key={type} className="legend-item">
            <div className="legend-color" style={{ backgroundColor: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
