import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/api-hooks";
import { useAuth } from "../context/AuthContext";
import { useEventTypesContext } from "../context/EventTypesContext";
import EventCard from "./EventCard";
import EventCalendar from "./EventCalendar";
import Button from "./common/Button";

export default function EventList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [pageSize] = useState(10);
  const [selectedDate, setSelectedDate] = useState(null);

  const { getAllEvents } = useEvents();
  const { isAdmin } = useAuth();
  const { eventTypes } = useEventTypesContext();
  const navigate = useNavigate();

  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSort = searchParams.get("sort") || "date";
  const currentOrder = searchParams.get("order") || "asc";
  const currentType = searchParams.get("type_id");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const data = await getAllEvents({
          page: currentPage,
          limit: pageSize,
          type_id: currentType !== "all" ? currentType : undefined,
        });
        setEvents(data.events);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [currentPage, pageSize, currentType]);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        const allData = await getAllEvents({ limit: 100, page: 1 });
        if (allData.pagination.totalPages > 1) {
          const additionalPromises = Array.from(
            { length: allData.pagination.totalPages - 1 },
            (_, i) => getAllEvents({ limit: 100, page: i + 2 })
          );
          const additionalData = await Promise.all(additionalPromises);
          setCalendarEvents([
            ...allData.events,
            ...additionalData.flatMap((data) => data.events),
          ]);
        } else {
          setCalendarEvents(allData.events);
        }
      } catch (err) {
        console.error("Failed to fetch calendar events:", err);
      }
    };

    fetchCalendarEvents();
  }, []);

  const displayedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      if (currentSort === "date") {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return currentOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
      if (currentSort === "title") {
        return currentOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
      return 0;
    });
  }, [events, currentSort, currentOrder]);

  const handleEventUpdate = (updatedEvent) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    setCalendarEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  const handleDateSelect = (date, events) => {
    if (events?.length > 0) {
      navigate(`/events/${events[0].id}`);
    }
    setSelectedDate(date);
  };

  const handleFilterChange = (type) => {
    setSearchParams((prev) => {
      type === "all" ? prev.delete("type_id") : prev.set("type_id", type);
      prev.set("page", "1");
      return prev;
    });
  };

  const handleSort = (sortField) => {
    setSearchParams((prev) => {
      if (prev.get("sort") === sortField) {
        prev.set("order", prev.get("order") === "asc" ? "desc" : "asc");
      } else {
        prev.set("sort", sortField);
        prev.set("order", "asc");
      }
      return prev;
    });
  };

  const handleHideEvent = (eventId) => {
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    setCalendarEvents((prev) => prev.filter((event) => event.id !== eventId));
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="events-layout">
      <div className="events-list">
        <div className="filter-controls">
          <Button
            variant={
              !currentType || currentType === "all" ? "active" : "default"
            }
            onClick={() => handleFilterChange("all")}
            data-type="all"
          >
            All Events
          </Button>
          {eventTypes.map((type) => (
            <Button
              key={type.id}
              variant={
                currentType === type.id.toString() ? "active" : "default"
              }
              onClick={() => handleFilterChange(type.id.toString())}
              data-type={type.id}
            >
              {type.name}
            </Button>
          ))}
        </div>

        {/* Event list rendering */}
        {selectedDate ? (
          displayedEvents.filter(
            (event) =>
              new Date(event.date).toDateString() ===
              selectedDate.toDateString()
          ).length > 0 ? (
            displayedEvents
              .filter(
                (event) =>
                  new Date(event.date).toDateString() ===
                  selectedDate.toDateString()
              )
              .map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onEventUpdate={handleEventUpdate}
                  onHideEvent={handleHideEvent}
                  isAdmin={isAdmin}
                />
              ))
          ) : (
            <div className="no-events">No events available for this date</div>
          )
        ) : displayedEvents.length > 0 ? (
          displayedEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onEventUpdate={handleEventUpdate}
              onHideEvent={handleHideEvent}
              isAdmin={isAdmin}
            />
          ))
        ) : (
          <div className="no-events">No events of this type available</div>
        )}

        {pagination && pagination.totalPages > 1 && (
          <div className="pagination">
            <Button
              onClick={() =>
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  page: (currentPage - 1).toString(),
                })
              }
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span>
              Page {currentPage} of {pagination.totalPages}
            </span>
            <Button
              onClick={() =>
                setSearchParams({
                  ...Object.fromEntries(searchParams),
                  page: (currentPage + 1).toString(),
                })
              }
              disabled={currentPage >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>

      <div className="calendar-section">
        <div className="sort-controls">
          <Button
            onClick={() => handleSort("date")}
            variant={currentSort === "date" ? "active" : "default"}
          >
            Date{" "}
            {currentSort === "date" && (currentOrder === "asc" ? "↑" : "↓")}
          </Button>
          <Button
            onClick={() => handleSort("title")}
            variant={currentSort === "title" ? "active" : "default"}
          >
            Title{" "}
            {currentSort === "title" && (currentOrder === "asc" ? "↑" : "↓")}
          </Button>
        </div>
        <div className="calendar-wrapper">
          <EventCalendar
            events={calendarEvents}
            onSelectDate={handleDateSelect}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}
