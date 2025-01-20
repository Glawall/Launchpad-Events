import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEventTypes } from "../hooks/api-hooks";
import { getEventTypeColor } from "../utils/event-type-colors";

export default function EventCalendar({ events, onSelectDate, selectedDate }) {
  const [eventTypes, setEventTypes] = useState([]);
  const { getAllEventTypes } = useEventTypes();

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const types = await getAllEventTypes();
        setEventTypes(types);
      } catch (error) {
        console.error("Failed to fetch event types:", error);
      }
    };
    fetchEventTypes();
  }, [getAllEventTypes]);

  const eventDates = events.reduce((acc, event) => {
    const eventDate = new Date(event.date).toDateString();
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(event);
    return acc;
  }, {});

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateStr = date.toDateString();
      const dayEvents = eventDates[dateStr] || [];

      return dayEvents.length > 0 ? (
        <div className="calendar-events">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className="calendar-event-title"
              style={{
                backgroundColor: getEventTypeColor(event.event_type_name),
              }}
            >
              {event.title}
            </div>
          ))}
        </div>
      ) : null;
    }
  };

  const handleDateClick = (date) => {
    const dateStr = date.toDateString();
    const dateEvents = eventDates[dateStr] || [];
    onSelectDate(date, dateEvents);
  };

  return (
    <div className="calendar-wrapper">
      <Calendar
        onChange={handleDateClick}
        value={selectedDate}
        tileContent={tileContent}
        tileClassName={({ date }) => {
          const dateStr = date.toDateString();
          return eventDates[dateStr]?.length ? "has-events" : null;
        }}
      />
      <div className="calendar-legend">
        {eventTypes.map((type) => (
          <div key={type.id} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: getEventTypeColor(type.name) }}
            />
            <span>{type.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
