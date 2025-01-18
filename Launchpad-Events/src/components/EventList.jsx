import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useEvents } from "../hooks/api-hooks";
import EventCard from "./EventCard";
import { useAuth } from "../context/AuthContext";
import EventCalendar from "./EventCalendar";

const MOCK_EVENT_TYPES = [
  { id: 1, name: "Workshop" },
  { id: 2, name: "Social" },
  { id: 3, name: "Tech Talk" },
  { id: 4, name: "Conference" },
];

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

  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentSort = searchParams.get("sort") || "date";
  const currentOrder = searchParams.get("order") || "asc";
  const currentType = searchParams.get("type") || "all";

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents({
          page: currentPage,
          limit: pageSize,
          sort: currentSort,
          order: currentOrder,
        });

        const firstPage = await getAllEvents({
          page: 1,
          limit: 100,
          sort: "date",
          order: "asc",
          status: "upcoming",
        });

        const totalPages = Math.ceil(firstPage.pagination.totalCount / 100);
        let allEvents = [...firstPage.events];

        for (let page = 2; page <= totalPages; page++) {
          const nextPage = await getAllEvents({
            page,
            limit: 100,
            sort: "date",
            order: "asc",
            status: "upcoming",
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
  }, [currentPage, currentSort, currentOrder, pageSize]);

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

  const handleDateSelect = (events) => {
    if (events.length > 0) {
      setSelectedDate(new Date(events[0].date));
    }
  };

  const clearDateSelection = () => {
    setSelectedDate(null);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="wrapper">
      <div className="container">
        <div className="events-layout">
          <div className="events-list">
            <div className="sort-controls">
              <select
                value={currentType}
                onChange={(e) =>
                  setSearchParams({
                    page: "1",
                    sort: currentSort,
                    order: currentOrder,
                    type: e.target.value,
                  })
                }
                className="type-filter"
              >
                <option value="all">All Types</option>
                {MOCK_EVENT_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
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
                className={`sort-btn ${
                  currentSort === "title" ? "active" : ""
                }`}
              >
                Title{" "}
                {currentSort === "title" &&
                  (currentOrder === "asc" ? "↑" : "↓")}
              </button>
              {selectedDate && (
                <button onClick={clearDateSelection} className="sort-btn">
                  Show All Events
                </button>
              )}
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
            <EventCalendar events={allEvents} onDateSelect={handleDateSelect} />
          </div>
        </div>
      </div>
    </div>
  );
}
