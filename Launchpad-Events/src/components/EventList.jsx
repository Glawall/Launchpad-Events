import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useEvents } from "../hooks/api-hooks";
import EventCard from "./EventCard";
import { useAuth } from "../context/AuthContext";
import EventCalendar from "./EventCalendar";
import { useEventTypesContext } from "../context/EventTypesContext";
import Button from "./common/Button";

export default function EventList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [eventsList, setEventsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [pageSize] = useState(10);
  const { getAllEvents } = useEvents();
  const { isAdmin } = useAuth();
  const [selectedDate, setSelectedDate] = useState(null);
  const [allEvents, setAllEvents] = useState([]);
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
        const typeId = currentType !== "all" ? currentType : undefined;
        const data = await getAllEvents({
          page: currentPage,
          limit: pageSize,
          sort: currentSort,
          order: currentOrder,
          type_id: typeId,
        });

        const firstPage = await getAllEvents({
          page: 1,
          limit: 100,
          sort: "date",
          order: "asc",
        });

        let allEvents = [...firstPage.events];
        const totalPages = Math.ceil(firstPage.pagination.totalCount / 100);

        for (let page = 2; page <= totalPages; page++) {
          const nextPage = await getAllEvents({
            page,
            limit: 100,
            sort: "date",
            order: "asc",
          });
          allEvents = [...allEvents, ...nextPage.events];
        }

        setEventsList(data.events);
        setAllEvents(allEvents);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [
    currentPage,
    currentSort,
    currentOrder,
    currentType,
    pageSize,
    getAllEvents,
  ]);

  const handleEventUpdate = (updatedEvent) => {
    setEventsList((currentEvents) =>
      currentEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    setAllEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
  };

  const handleDateSelect = (date, events) => {
    if (events && events.length > 0) {
      navigate(`/events/${events[0].id}`);
    }
    setSelectedDate(date);
  };

  const handleShowAllEvents = () => {
    setSelectedDate(null);
    setEventsList(allEvents);
  };

  const handleTypeFilter = (typeId) => {
    setSearchParams((prev) => {
      if (typeId === "all") {
        prev.delete("type_id");
      } else {
        prev.set("type_id", typeId);
      }
      return prev;
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="events-layout">
      <div className="events-list">
        <div className="filter-controls">
          <Button
            variant={currentType === "all" ? "blue" : "default"}
            onClick={() => {
              handleTypeFilter("all");
              handleShowAllEvents();
            }}
          >
            All Events
          </Button>
          {eventTypes.map((type) => (
            <Button
              key={type.id}
              variant={currentType === type.id.toString() ? "blue" : "default"}
              onClick={() => handleTypeFilter(type.id.toString())}
            >
              {type.name}
            </Button>
          ))}
        </div>

        {selectedDate
          ? eventsList
              .filter(
                (event) =>
                  new Date(event.date).toDateString() ===
                  selectedDate.toDateString()
              )
              .map((event) => (
                <div
                  key={event.id}
                  id={`event-${event.id}`}
                  className="event-wrapper highlighted"
                >
                  <EventCard
                    event={event}
                    onEventUpdate={handleEventUpdate}
                    isAdmin={isAdmin}
                  />
                </div>
              ))
          : eventsList.map((event) => (
              <div
                key={event.id}
                id={`event-${event.id}`}
                className="event-wrapper"
              >
                <EventCard
                  event={event}
                  onEventUpdate={handleEventUpdate}
                  isAdmin={isAdmin}
                />
              </div>
            ))}

        {!selectedDate && (
          <div className="pagination">
            <button
              onClick={() =>
                setSearchParams({
                  page: (currentPage - 1).toString(),
                  sort: currentSort,
                  order: currentOrder,
                })
              }
              disabled={currentPage === 1}
              className="page-btn"
            >
              Previous
            </button>
            <span className="page-info">
              Page {currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setSearchParams({
                  page: (currentPage + 1).toString(),
                  sort: currentSort,
                  order: currentOrder,
                })
              }
              disabled={!pagination.hasNextPage}
              className="page-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div className="calendar-section">
        <div className="sort-controls">
          <button
            onClick={() =>
              setSearchParams({
                page: "1",
                sort: "date",
                order:
                  currentSort === "date" && currentOrder === "asc"
                    ? "desc"
                    : "asc",
              })
            }
            className={`sort-btn ${currentSort === "date" ? "active" : ""}`}
          >
            Date{" "}
            {currentSort === "date" && (currentOrder === "asc" ? "↑" : "↓")}
          </button>
          <button
            onClick={() =>
              setSearchParams({
                page: "1",
                sort: "title",
                order:
                  currentSort === "title" && currentOrder === "asc"
                    ? "desc"
                    : "asc",
              })
            }
            className={`sort-btn ${currentSort === "title" ? "active" : ""}`}
          >
            Title{" "}
            {currentSort === "title" && (currentOrder === "asc" ? "↑" : "↓")}
          </button>
        </div>
        <div className="calendar-wrapper">
          <EventCalendar
            events={allEvents}
            onSelectDate={handleDateSelect}
            selectedDate={selectedDate}
          />
        </div>
      </div>
    </div>
  );
}
